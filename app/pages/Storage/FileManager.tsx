import React, { useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { StorageFile } from './types';
import { useAccount, useReadContract, useSignTypedData } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { STREAMPAY_ESCROW_ABI } from '@/app/shared/contracts/streampayEscrow';
import { STREAMPAY_ESCROW_ADDRESS } from '@/app/shared/contracts/config';
import { formatUnits, parseUnits, keccak256, toHex } from 'viem';
import { deleteFile as apiDeleteFile } from '@/app/shared/services/web2-services/storage';

interface FileManagerProps {
  files: StorageFile[];
  onUpload: () => void;
  onNewFolder: () => void;
  onDelete: (fileId: string) => void;
  onDownload: (fileId: string) => void;
  onViewDetails: (file: StorageFile) => void;
}

const getFileIcon = (file: StorageFile) => {
  if (file.type === 'folder') return '📁';
  switch (file.fileType) {
    case 'pdf': return '📄';
    case 'image': return '🖼️';
    case 'video': return '📹';
    case 'spreadsheet': return '📊';
    case 'archive': return '📦';
    case 'audio': return '🎵';
    case 'code': return '📝';
    default: return '📄';
  }
};

const FileManager: React.FC<FileManagerProps> = ({
  files,
  onUpload,
  onNewFolder,
  onDelete,
  onDownload,
  onViewDetails,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmFile, setConfirmFile] = useState<StorageFile | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
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
  const formattedEscrow = useMemo(() => (escrowBalanceUSDC ? escrowBalanceUSDC.toFixed(6) : '0.00') + ' USDC', [escrowBalanceUSDC]);
  const apiBase = (process as any).env?.VITE_BACKEND_URL || 'http://localhost:3001/api';
  const { signTypedDataAsync } = (useSignTypedData as any)();

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(f => f.id));
    }
  };

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleBulkDelete = () => {
    const first = filteredFiles.find(f => selectedFiles.includes(f.id));
    if (first) setConfirmFile(first);
  };

  const handleBulkDownload = () => {
    selectedFiles.forEach(id => onDownload(id));
  };

  const formatLocal = (iso: string) => {
    try { return new Date(iso).toLocaleString(); } catch { return String(iso); }
  };
  const calcElapsedMinutes = (f: StorageFile) => {
    const now = Date.now();
    const up = new Date(f.uploadedAt as any).getTime();
    if (!Number.isFinite(up)) return 0;
    const diffMs = Math.max(0, now - up);
    return Math.floor(diffMs / 60000);
  };
  const calcOwed = (f: StorageFile) => {
    const mins = calcElapsedMinutes(f);
    const perMin = (f.costPerHour || 0) / 60;
    const owed = mins * perMin;
    return Number.isFinite(owed) ? owed : 0;
  };

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Your Files ({files.length})</h2>
        <div className="flex items-center gap-3">
          <div className="text-xs text-[#a1a1a1]">Escrow:</div>
          <div className="text-sm font-mono text-white mr-2">{formattedEscrow}</div>
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}>
            {viewMode === 'table' ? 'Grid' : 'Table'}
          </Button>
          <Button variant="outline" size="sm" onClick={onNewFolder}>New Folder</Button>
          <Button variant="primary" size="sm" onClick={onUpload} disabled={escrowBalanceUSDC <= 0}>
            {escrowBalanceUSDC > 0 ? 'Upload File' : 'Deposit to Upload'}
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-2 text-sm text-white placeholder:text-[#a1a1a1] outline-none focus:border-blue-600"
        />
        <select className="bg-[#141414] border border-[#262626] text-white text-sm rounded-lg px-3 py-2">
          <option>Filter: All</option>
        </select>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mb-4 p-3 bg-blue-600/10 border border-blue-600/50 rounded-lg flex items-center justify-between">
          <span className="text-sm text-white">{selectedFiles.length} file(s) selected</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleBulkDownload}>Download Selected</Button>
            <Button variant="outline" size="sm" onClick={handleBulkDelete}>Delete Selected</Button>
          </div>
        </div>
      )}

      {filteredFiles.length === 0 && (
        <Card className="col-span-full p-12 text-center border-dashed mb-6">
          <div className="text-5xl mb-3">📂</div>
          <div className="text-white font-medium mb-1">No files found</div>
          <div className="text-sm text-[#a1a1a1] mb-4">Upload a file or create a folder to get started.</div>
          <div className="flex justify-center gap-2">
            <Button variant="primary" size="sm" onClick={onUpload} disabled={escrowBalanceUSDC <= 0}>
              {escrowBalanceUSDC > 0 ? 'Upload File' : 'Deposit to Upload'}
            </Button>
            <Button variant="outline" size="sm" onClick={onNewFolder}>New Folder</Button>
          </div>
        </Card>
      )}

      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#262626]">
                <th className="text-left py-3 px-2">
                  <input
                    type="checkbox"
                    checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-[#262626]"
                  />
                </th>
                <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Name</th>
                <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Size</th>
                <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Uploaded</th>
                <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Cost/Hour</th>
                <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Total</th>
                <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => (
                <tr
                  key={file.id}
                  className="border-b border-[#262626] hover:bg-[#1a1a1a] cursor-pointer"
                  onClick={() => onViewDetails(file)}
                >
                  <td className="py-3 px-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => handleSelectFile(file.id)}
                      className="rounded border-[#262626]"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span>{getFileIcon(file)}</span>
                      <span className="text-sm text-white">{file.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm text-[#a1a1a1]">
                    {file.type === 'folder' ? '-' : `${file.size} MB`}
                  </td>
                  <td className="py-3 px-2 text-sm text-[#a1a1a1]">{file.uploadedAt}</td>
                  <td className="py-3 px-2 text-sm font-mono text-[#a1a1a1]">
                    {file.type === 'folder' ? '-' : `${file.costPerHour} USDC`}
                  </td>
                  <td className="py-3 px-2 text-sm font-mono text-white">
                    {file.type === 'folder' ? '-' : `${file.totalCost} USDC`}
                  </td>
                  <td className="py-3 px-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                      {file.type === 'file' && (
                        <>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onDownload(file.id)}>
                            ⬇
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setConfirmFile(file)}>
                            🗑️
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredFiles.map((file) => (
            <Card
              key={file.id}
              className="p-4 hover:border-blue-600 cursor-pointer"
              onClick={() => onViewDetails(file)}
            >
              <div className="text-center mb-3">
                <div className="text-4xl mb-2">{getFileIcon(file)}</div>
                <div className="text-xs text-white font-medium truncate">{file.name}</div>
              </div>
              {file.type === 'file' && (
                <>
                  <div className="text-xs text-[#a1a1a1] mb-1">{file.size} MB</div>
                  <div className="text-xs font-mono text-white mb-3">{file.totalCost} USDC</div>
                </>
              )}
              <div className="flex gap-1 justify-center" onClick={(e) => e.stopPropagation()}>
                {file.type === 'file' && (
                  <>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onDownload(file.id)}>
                      ⬇
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setConfirmFile(file)}>
                      🗑️
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {confirmFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => !submitting && setConfirmFile(null)}>
          <div className="relative bg-[#0a0a0a] border border-[#262626] rounded-lg w-full max-w-xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-[#262626]">
              <h3 className="text-base font-semibold text-white">Delete File & Settle</h3>
              <button className="text-[#a1a1a1] hover:text-white text-xl" onClick={() => !submitting && setConfirmFile(null)}>✕</button>
            </div>
            <div className="p-5 overflow-y-auto">
              <div className="mb-4">
                <div className="text-sm text-white font-medium">{confirmFile.name}</div>
                <div className="text-xs text-[#a1a1a1]">Uploaded: {formatLocal(confirmFile.uploadedAt as any)} • Now: {new Date().toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Card className="p-3 bg-[#111111] border-[#262626]"><div className="text-xs text-[#a1a1a1] mb-1">Elapsed</div><div className="text-sm text-white">{calcElapsedMinutes(confirmFile)} min</div></Card>
                <Card className="p-3 bg-[#111111] border-[#262626]"><div className="text-xs text-[#a1a1a1] mb-1">Rate</div><div className="text-sm text-white">{confirmFile.costPerHour} USDC/hr</div></Card>
                <Card className="p-3 bg-[#111111] border-[#262626]"><div className="text-xs text-[#a1a1a1] mb-1">Size</div><div className="text-sm text-white">{confirmFile.size} MB</div></Card>
                <Card className="p-3 bg-[#111111] border-[#262626]"><div className="text-xs text-[#a1a1a1] mb-1">Owed Now</div><div className="text-sm text-white">{calcOwed(confirmFile).toFixed(6)} USDC</div></Card>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Card className="p-3 bg-[#0a0a0a] border-[#262626]"><div className="text-xs text-[#a1a1a1] mb-1">Escrow Balance</div><div className="text-sm font-mono text-white">{formattedEscrow} USDC</div></Card>
                <Card className="p-3 bg-[#0a0a0a] border-[#262626]"><div className="text-xs text-[#a1a1a1] mb-1">After Settlement</div><div className="text-sm font-mono text-white">{Math.max(0, escrowBalanceUSDC - calcOwed(confirmFile)).toFixed(6)} USDC</div></Card>
              </div>
              <Card className="p-3 mb-3 bg-[#0a0a0a] border-[#262626]"><div className="text-xs text-[#a1a1a1]">Gas is paid by the relayer. You will only pay the settlement from your escrow.</div></Card>
              {status && (<Card className="p-3 mb-3 bg-[#0a0a0a] border-[#262626]"><div className="text-xs text-[#a1a1a1]">{status}</div></Card>)}
            </div>
            <div className="p-5 border-t border-[#262626] flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" disabled={submitting} onClick={() => setConfirmFile(null)}>Cancel</Button>
              <Button
                variant="primary" size="sm" className="flex-1"
                disabled={submitting}
                onClick={async () => {
                  if (!confirmFile || !address) return;
                  try {
                    setSubmitting(true);
                    const owed = calcOwed(confirmFile);
                    const amount = (parseUnits as any)(String(owed.toFixed(6)), 6);
                    setStatus('Fetching nonce...');
                    const nonceRes = await fetch(`${apiBase}/nonce/${address}`);
                    const { nonce } = await nonceRes.json();

                    const sessionId = (keccak256 as any)((toHex as any)(confirmFile.id));
                    const deadline = BigInt(Math.floor(Date.now() / 1000) + 15 * 60);

                    const domain = {
                      name: 'StreamPay',
                      version: '1',
                      chainId: avalancheFuji.id,
                      verifyingContract: STREAMPAY_ESCROW_ADDRESS as `0x${string}`,
                    };
                    const types = {
                      PaymentIntent: [
                        { name: 'payer', type: 'address' },
                        { name: 'sessionId', type: 'bytes32' },
                        { name: 'amount', type: 'uint256' },
                        { name: 'deadline', type: 'uint256' },
                        { name: 'nonce', type: 'uint256' },
                      ],
                    } as const;
                    const message = {
                      payer: address as `0x${string}`,
                      sessionId,
                      amount,
                      deadline,
                      nonce: BigInt(nonce),
                    } as any;

                    setStatus('Please sign to confirm deletion...');
                    const signature = await (signTypedDataAsync as any)({ domain, types, primaryType: 'PaymentIntent', message });

                    setStatus('Submitting to relayer...');
                    const resp = await fetch(`${apiBase}/execute-payment`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        paymentIntent: {
                          payer: address,
                          sessionId,
                          amount: amount.toString(),
                          deadline: deadline.toString(),
                          nonce: String(nonce),
                          signature,
                        },
                        serviceType: 'storage-delete',
                        metadata: {
                          fileId: confirmFile.id,
                          name: confirmFile.name,
                          sizeMB: confirmFile.size,
                          elapsedMinutes: calcElapsedMinutes(confirmFile),
                        },
                      }),
                    });

                    if (!resp.ok) {
                      const e = await resp.json().catch(() => ({}));
                      throw new Error(e.error || 'Relayer rejected the transaction');
                    }

                    const data = await resp.json();
                    const txHash = data.txHash as string;
                    setStatus('Recording deletion...');
                    try {
                      await apiDeleteFile({
                        id: Number.isFinite(Number(confirmFile.id)) ? Number(confirmFile.id) : confirmFile.id,
                        user_address: address,
                        amount_usdc: Number(owed.toFixed(6)),
                        tx_hash: txHash,
                      });
                    } catch {}
                    setStatus('Deleting file...');
                    onDelete(confirmFile.id);
                    setToast(`Settled ${owed.toFixed(6)} USDC • Tx ${txHash?.slice(0, 10)}...`);
                    setTimeout(() => { setToast(null); }, 2000);
                    setConfirmFile(null);
                  } catch (err: any) {
                    setStatus(err?.message || 'Failed to process deletion');
                  } finally {
                    setSubmitting(false);
                    setTimeout(() => setStatus(null), 1500);
                  }
                }}
              >
                Settle & Delete
              </Button>
            </div>
            {toast && (
              <div className="absolute top-4 right-4 bg-[#0a0a0a] border border-[#262626] text-white text-sm px-4 py-2 rounded shadow-lg">{toast}</div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default FileManager;

