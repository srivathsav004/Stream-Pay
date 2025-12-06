import React, { useMemo, useState, useRef, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Eye, Download, Trash2, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { StorageFile } from './types';
import { useAccount, useReadContract, useSignTypedData } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { STREAMPAY_ESCROW_ABI } from '@/app/shared/contracts/streampayEscrow';
import { STREAMPAY_ESCROW_ADDRESS } from '@/app/shared/contracts/config';
import { formatUnits, parseUnits, keccak256, toHex } from 'viem';
import { deleteFile as apiDeleteFile } from '@/app/shared/services/web2-services/storage';
import { useToast } from '@/components/ui/use-toast';

const ITEMS_PER_PAGE = 5;

type Option = { label: string; value: string | number };

const Dropdown: React.FC<{
  value: string | number;
  onChange: (val: string | number) => void;
  options: Option[];
  className?: string;
}> = ({ value, onChange, options, className }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const current = options.find(o => o.value === value)?.label ?? 'Select';

  return (
    <div ref={ref} className={`relative ${className ?? ''}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full inline-flex items-center justify-between bg-[#0a0a0a] border border-[#262626] hover:border-[#2f2f2f] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40 focus:border-[#3b82f6] transition"
      >
        <span className="truncate">{current}</span>
        <ChevronDown className={`h-4 w-4 ml-2 text-[#8a8a8a] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-[#262626] bg-[#0f0f0f] shadow-xl overflow-hidden">
          <ul className="py-1 max-h-64 overflow-auto">
            {options.map(opt => (
              <li key={String(opt.value)}>
                <button
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm ${opt.value === value ? 'bg-[#262640] text-white' : 'text-[#e5e5e5] hover:bg-[#151515]'}`}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Format date to IST
const formatDate = (dateString: string): string => {
  if (!dateString) return '-';

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString; // Return original if parsing fails
  }
};

interface FileManagerProps {
  files: StorageFile[];
  onUpload: () => void;
  onNewFolder: () => void;
  onDelete: (fileId: string) => void;
  onDownload: (fileId: string) => void;
  onRead: (fileId: string) => void;
  onViewDetails: (file: StorageFile) => void;
}

const FileManager: React.FC<FileManagerProps> = ({
  files,
  onUpload,
  onNewFolder,
  onDelete,
  onDownload,
  onRead,
  onViewDetails,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [confirmFile, setConfirmFile] = useState<StorageFile | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const { toast } = useToast();
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
  const apiBase = ((import.meta as any).env?.VITE_BACKEND_URL?.replace(/\/$/, '')) + '/api';
  const { signTypedDataAsync } = (useSignTypedData as any)();

  const filteredFiles = useMemo(() => {
    return files.filter(file =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
      } else if (sortBy === 'name-az') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'name-za') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });
  }, [files, searchQuery, sortBy]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredFiles.length / ITEMS_PER_PAGE);

  // Get current files for pagination
  const currentFiles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredFiles, currentPage]);

  // Reset to first page when files or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredFiles.length, sortBy]);

  // Handle page change
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

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
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to download",
        variant: "destructive",
      });
      return;
    }
    selectedFiles.forEach(id => onDownload(id));
    toast({
      title: "Download started",
      description: `Downloading ${selectedFiles.length} file(s)...`,
    });
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
          {/* <Button variant="outline" size="sm" onClick={onNewFolder}>New Folder</Button> */}
          <Button variant="primary" size="sm" onClick={onUpload} disabled={escrowBalanceUSDC <= 0}>
            {escrowBalanceUSDC > 0 ? 'Upload File' : 'Deposit to Upload'}
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-[#0a0a0a] border border-[#262626] hover:border-[#2f2f2f] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40 focus:border-[#3b82f6] transition"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#a1a1a1] pointer-events-none">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <Dropdown
          value={sortBy}
          onChange={(val) => setSortBy(val as string)}
          options={[
            { label: 'Recent First', value: 'recent' },
            { label: 'Oldest First', value: 'oldest' },
            { label: 'Name A-Z', value: 'name-az' },
            { label: 'Name Z-A', value: 'name-za' }
          ]}
          className="min-w-[160px]"
        />
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
                <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Uploaded (IST)</th>
                <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Cost/Hour</th>
                <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentFiles.length > 0 ? (
                currentFiles.map((file) => (
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
                    <td className="py-3 px-2 text-sm text-[#a1a1a1]">
                      {formatDate(file.uploadedAt)}
                    </td>
                    <td className="py-3 px-2 text-sm font-mono text-[#a1a1a1]">
                      {file.type === 'folder' ? '-' : `${file.costPerHour} USDC`}
                    </td>
                    <td className="py-3 px-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        {file.type === 'file' && (
                          <>
                            <button
                              type="button"
                              className="h-8 w-8 p-0 flex items-center justify-center text-[#e5e5e5] hover:text-white hover:bg-[#2a2a2a] rounded transition-colors"
                              title="Read"
                              onClick={() => onRead(file.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="h-8 w-8 p-0 flex items-center justify-center text-[#e5e5e5] hover:text-white hover:bg-[#2a2a2a] rounded transition-colors"
                              title="Download"
                              onClick={() => onDownload(file.id)}
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="h-8 w-8 p-0 flex items-center justify-center text-[#f97373] hover:text-red-400 hover:bg-[#2a2a2a] rounded transition-colors"
                              title="Delete"
                              onClick={() => setConfirmFile(file)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#a1a1a1] text-sm">
                    No files found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {currentFiles.map((file) => (
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
                    <button
                      type="button"
                      className="h-8 w-8 p-0 flex items-center justify-center text-[#e5e5e5] hover:text-white hover:bg-[#2a2a2a] rounded transition-colors"
                      title="Read"
                      onClick={() => onRead(file.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="h-8 w-8 p-0 flex items-center justify-center text-[#e5e5e5] hover:text-white hover:bg-[#2a2a2a] rounded transition-colors"
                      title="Download"
                      onClick={() => onDownload(file.id)}
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="h-8 w-8 p-0 flex items-center justify-center text-[#f97373] hover:text-red-400 hover:bg-[#2a2a2a] rounded transition-colors"
                      title="Delete"
                      onClick={() => setConfirmFile(file)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredFiles.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[#a1a1a1]">
            Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredFiles.length)}-
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredFiles.length)} of {filteredFiles.length} files
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  className={`w-8 h-8 p-0 ${currentPage === pageNum ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
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
                    toast({
                      title: "File deleted",
                      description: `Settled ${owed.toFixed(6)} USDC • Tx ${txHash?.slice(0, 10)}...`,
                    });
                    setConfirmFile(null);
                  } catch (err: any) {
                    const errorMsg = err?.message || 'Failed to process deletion';
                    setStatus(errorMsg);
                    toast({
                      title: "Deletion failed",
                      description: errorMsg,
                      variant: "destructive",
                    });
                  } finally {
                    setSubmitting(false);
                    setTimeout(() => setStatus(null), 1500);
                  }
                }}
              >
                Settle & Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default FileManager;

