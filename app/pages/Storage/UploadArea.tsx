import React, { useState, useRef } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StorageFile } from './types';

interface UploadAreaProps {
  onUpload: (file: File) => void;
  balance: number;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onUpload, balance }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateCost = (sizeMB: number) => {
    const ratePerMBPerHour = 0.00001;
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
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setSelectedFile(null);
          onUpload(selectedFile);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
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
          <div className="text-sm font-semibold text-white mb-4">Estimated Costs</div>
          {costs && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#a1a1a1]">Per Hour:</span>
                <span className="text-white font-mono">{costs.perHour.toFixed(6)} AVAX (~${(costs.perHour * 40).toFixed(3)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a1a1a1]">Per Day:</span>
                <span className="text-white font-mono">{costs.perDay.toFixed(6)} AVAX (~${(costs.perDay * 40).toFixed(3)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a1a1a1]">Per Week:</span>
                <span className="text-white font-mono">{costs.perWeek.toFixed(6)} AVAX (~${(costs.perWeek * 40).toFixed(3)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a1a1a1]">Per Month:</span>
                <span className="text-white font-mono">{costs.perMonth.toFixed(6)} AVAX (~${(costs.perMonth * 40).toFixed(2)})</span>
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
            <span className="text-sm font-semibold text-white">{balance} AVAX</span>
          </div>
          <div className="text-xs text-[#a1a1a1]">
            After Upload: {balance} AVAX (charges start immediately)
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedFile(null)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" className="flex-1" onClick={handleUpload}>
            Upload & Start Paying
          </Button>
        </div>
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

