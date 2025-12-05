import React, { useState, useRef, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StorageFile } from './types';
import { useAccount, useReadContract } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { STREAMPAY_ESCROW_ABI } from '@/app/shared/contracts/streampayEscrow';
import { STREAMPAY_ESCROW_ADDRESS } from '@/app/shared/contracts/config';
import { formatUnits } from 'viem';
import { uploadFileWithProgress } from '@/app/shared/services/web2-services/storage';

interface UploadAreaProps {
  onUpload: (file: File) => void;
  balance: number;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onUpload, balance }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [customName, setCustomName] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { address } = (useAccount?.() as any) || { address: undefined };
  const { data: escBal } = (useReadContract as any)({
    address: STREAMPAY_ESCROW_ADDRESS || undefined,
    abi: STREAMPAY_ESCROW_ABI,
    functionName: 'getBalance',
    args: address ? [address] : undefined,
    chainId: avalancheFuji.id,
    query: { enabled: !!address && !!STREAMPAY_ESCROW_ADDRESS },
  });
  const escrowBalanceUSDC = useMemo(() => escBal ? Number((formatUnits as any)(escBal as bigint, 6)) : 0, [escBal]);
  const formattedEscrow = useMemo(() => (escrowBalanceUSDC ? escrowBalanceUSDC.toFixed(2) : '0.00') + ' USDC', [escrowBalanceUSDC]);

  const calculateCost = (sizeMB: number) => {
    const ratePerMBPerHour = 0.0001;
    return {
      perHour: sizeMB * ratePerMBPerHour,
      perDay: sizeMB * ratePerMBPerHour * 24,
      perWeek: sizeMB * ratePerMBPerHour * 24 * 7,
      perMonth: sizeMB * ratePerMBPerHour * 24 * 30,
    };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !address || isUploading) return;
    try {
      setIsUploading(true);
      setUploadProgress(0);
      const res = await uploadFileWithProgress({
        user_address: address,
        file: selectedFile,
        name: customName.trim() || undefined,
        onProgress: (p) => setUploadProgress(p),
      });
      setToast(`Uploaded ${res?.file?.filename || selectedFile.name}`);
      setTimeout(() => setToast(null), 2000);
      setSelectedFile(null);
      onUpload(selectedFile);
    } catch (e: any) {
      setToast(e?.message || 'Upload failed');
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const fileSizeMB = selectedFile ? selectedFile.size / (1024 * 1024) : 0;
  const costs = selectedFile ? calculateCost(fileSizeMB) : null;

  if (isUploading) {
    return (
      <Card className="p-6 mb-8">
        <div className="text-center">
          <div className="text-lg font-semibold text-white mb-4">Uploading...</div>
          <div className="text-sm text-[#a1a1a1] mb-4">
            {selectedFile?.name} ({(fileSizeMB).toFixed(2)} MB)
          </div>
          <div className="w-full bg-[#262626] rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="text-xs text-[#a1a1a1]">Uploading to IPFS...</div>
        </div>
      </Card>
    );
  }

  if (selectedFile) {
    return (
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Upload File</h3>
          <div className="flex items-center gap-3">
            <div className="text-xs text-[#a1a1a1]">Escrow</div>
            <div className="text-sm font-mono text-white">{formattedEscrow}</div>
          </div>
          <button
            onClick={() => setSelectedFile(null)}
            className="text-[#a1a1a1] hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <div className="text-sm font-medium text-white mb-2">Selected File</div>
          <div className="flex items-center gap-2 p-3 bg-[#0a0a0a] border border-[#262626] rounded-lg">
            <span className="text-2xl">📄</span>
            <div>
              <div className="text-sm text-white">{selectedFile.name}</div>
              <div className="text-xs text-[#a1a1a1]">{(fileSizeMB).toFixed(2)} MB</div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#262626] pt-6 mb-6">
          <div className="text-sm font-semibold text-white mb-2">Optional Name</div>
          <input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Enter a display name (optional)"
            className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
          />
          <div className="text-sm font-semibold text-white mb-4">Estimated Costs</div>
          {costs && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#a1a1a1]">Per Hour:</span>
                <span className="text-white font-mono">{costs.perHour.toFixed(6)} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a1a1a1]">Per Day:</span>
                <span className="text-white font-mono">{costs.perDay.toFixed(6)} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a1a1a1]">Per Week:</span>
                <span className="text-white font-mono">{costs.perWeek.toFixed(6)} USDC </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a1a1a1]">Per Month:</span>
                <span className="text-white font-mono">{costs.perMonth.toFixed(6)} USDC </span>
              </div>
            </div>
          )}
          <div className="mt-4 p-3 bg-blue-600/10 border border-blue-600/50 rounded-lg">
            <div className="text-xs text-[#a1a1a1]">
              💡 You can delete this file anytime to stop charges
            </div>
          </div>
        </div>

        <div className="border-t border-[#262626] pt-6 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-[#a1a1a1]">Your Balance:</span>
            <span className="text-sm font-semibold text-white">{formattedEscrow}</span>
          </div>
          <div className="text-xs text-[#a1a1a1]">
            Charges start immediately. Ensure sufficient escrow before uploading.
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => !isUploading && setSelectedFile(null)} disabled={isUploading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" className="flex-1" onClick={handleUpload} disabled={isUploading}>
            {isUploading ? `Uploading… ${uploadProgress}%` : 'Upload & Start Paying'}
          </Button>
        </div>
        {toast && (
          <div className="mt-3 bg-[#0a0a0a] border border-[#262626] text-white text-sm px-4 py-2 rounded">{toast}</div>
        )}
      </Card>
    );
  }

  return (
    <Card
      className={`p-6 mb-8 border-2 border-dashed transition-colors ${
        isDragging ? 'border-blue-600 bg-blue-600/10' : 'border-[#262626]'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center">
        <div className="text-6xl mb-4">📁</div>
        <div className="text-lg font-semibold text-white mb-2">Drag & Drop Files</div>
        <div className="text-sm text-[#a1a1a1] mb-4">or click to browse</div>
        <div className="text-xs text-[#a1a1a1] mb-4">
          Max file size: 100 MB • Supported: All file types
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          Browse Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </Card>
  );
};

export default UploadArea;

