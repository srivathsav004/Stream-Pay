import React, { useState, useMemo, useRef, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Transaction } from './types';
import { Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

import Skeleton from '@/components/ui/Skeleton';

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15];
const DEFAULT_ITEMS_PER_PAGE = 5;


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

const getTransactionIcon = (type: Transaction['type']) => {
  switch (type) {
    case 'deposit': return '💰';
    case 'payment': return '💸';
    case 'withdraw': return '💵';
    case 'refund': return '🔄';
    default: return '💸';
  }
};

const getTransactionColor = (type: Transaction['type']) => {
  switch (type) {
    case 'deposit': return 'text-[#10b981]';
    case 'payment': return 'text-blue-400';
    case 'withdraw': return 'text-[#f59e0b]';
    case 'refund': return 'text-[#8b5cf6]';
    default: return 'text-white';
  }
};

const getServiceName = (service: string) => {
  switch (service) {
    case 'video_stream': return 'Video Stream';
    case 'video_purchase': return 'Video Purchase';
    case 'api_session': return 'API Session';
    case 'storage': return 'Storage';
    case 'deposit': return 'Deposit';
    case 'withdraw': return 'Withdraw';
    default: return service || 'N/A';
  }
};

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, isLoading }) => {
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterService, setFilterService] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_ITEMS_PER_PAGE);

  const filteredTransactions = useMemo(() => {
    const list = transactions.filter(tx => {
      if (filterType !== 'all' && tx.type !== filterType) return false;
      if (filterService !== 'all' && tx.service !== filterService) return false;
      if (searchQuery && !tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !tx.service?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
    return list;
  }, [transactions, filterType, filterService, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  const handlePageChange = (delta: number) => {
    setCurrentPage(prev => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > totalPages) return totalPages;
      return next;
    });
  };

  const handleViewExplorer = (txHash: string) => {
    window.open(`https://testnet.snowtrace.io/tx/${txHash}`, '_blank');
  };

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) return;
    
    // Define CSV headers
    const headers = [
      'Date/Time',
      'Type',
      'Service',
      'Amount (USDC)',
      'Status',
      'Transaction Hash'
    ];
    
    // Convert data to CSV rows
    const csvRows = [
      headers.join(','),
      ...filteredTransactions.map(tx => {
        const row = [
          `"${new Date(tx.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}"`,
          `"${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}"`,
          `"${getServiceName(tx.service || '')}"`,
          `"${tx.amount.toFixed(6)}"`,
          `"${tx.status || 'Completed'}"`,
          `"${tx.txHash}"`
        ];
        return row.join(',');
      })
    ];
    
    // Create CSV content
    const csvContent = csvRows.join('\n');
    
    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.setAttribute('href', url);
    link.setAttribute('download', `transaction-history-${timestamp}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Transaction History</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={exportToCSV}
          disabled={filteredTransactions.length === 0}
        >
          Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#a1a1a1] pointer-events-none" />
          <input
            type="text"
            placeholder="Search hash or service..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-3 py-2 bg-[#0a0a0a] border border-[#262626] hover:border-[#2f2f2f] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40 focus:border-[#3b82f6] transition"
          />
        </div>
        <Dropdown
          value={filterService}
          onChange={(val) => { setFilterService(val as string); setCurrentPage(1); }}
          options={[
            { label: 'All Services', value: 'all' },
            { label: 'Video Stream', value: 'video_stream' },
            { label: 'Video Purchase', value: 'video_purchase' },
            { label: 'API Session', value: 'api_session' },
            { label: 'Storage', value: 'storage' },
            { label: 'Deposit', value: 'deposit' },
            { label: 'Withdraw', value: 'withdraw' }
          ]}
          className="w-40"
        />
        <Dropdown
          value={pageSize}
          onChange={(val) => { setPageSize(Number(val)); setCurrentPage(1); }}
          options={ITEMS_PER_PAGE_OPTIONS.map(size => ({ label: `${size} rows`, value: size }))}
          className="w-28"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#262626]">
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">#</th>
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Service</th>
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Date/Time</th>
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Amount</th>
              <th className="text-center text-xs text-[#a1a1a1] uppercase py-3 px-6 min-w-[180px]">Transaction</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((tx, idx) => (
              <React.Fragment key={tx.id}>
                <tr
                  className="border-b border-[#262626] hover:bg-[#1a1a1a] cursor-pointer"
                  onClick={() => setExpandedTx(expandedTx === tx.id ? null : tx.id)}
                >
                  <td className="py-3 px-2 text-white font-medium">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td className="py-3 px-2 text-sm text-white">{getServiceName(tx.service)}</td>
                  <td className="py-3 px-2 text-sm text-[#a1a1a1]">{tx.date}</td>
                  <td className={`py-3 px-2 text-sm font-mono ${getTransactionColor(tx.type)}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount} USDC
                  </td>
                  <td className="py-3 px-6 text-center min-w-[180px]">
                    <div className="inline-flex items-center justify-center gap-1">
                      <a
                        href={`https://testnet.snowtrace.io/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <img 
                          src="/avax-icon.svg" 
                          alt="Avalanche" 
                          className="w-4 h-4"
                        />
                        <span className="text-base font-mono">
                          {`${tx.txHash.slice(0, 8)}...${tx.txHash.slice(-6)}`}
                        </span>
                      </a>
                    </div>
                  </td>
                </tr>
                {expandedTx === tx.id && (
                  <tr>
                    <td colSpan={5} className="p-4 bg-[#0a0a0a]">
                      <div className="space-y-4">
                        {/* <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-white">
                            {getTransactionIcon(tx.type)} {tx.type === 'payment' ? 'Payment' : tx.type === 'deposit' ? 'Deposit' : tx.type === 'withdraw' ? 'Withdraw' : 'Refund'}: {tx.service || 'N/A'}
                          </div>
                          <div className="text-xs text-[#a1a1a1]">{tx.date}</div>
                        </div> */}

                        <div className="border-t border-[#262626] pt-4">
                          <div className="text-sm font-medium text-white mb-3">Transaction Details:</div>
                          <div className="space-y-2 text-sm text-[#a1a1a1]">
                            <div>• Type: {tx.type === 'payment' ? 'Service Payment' : tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</div>
                            {tx.service && <div>• Service: {tx.service}</div>}
                            <div>• Amount: {tx.amount} USDC (${(Math.abs(tx.amount) * 40).toFixed(2)})</div>
                            <div>• Date: {tx.date}</div>
                            <div>• Status: {tx.status === 'complete' ? '✓ Confirmed' : tx.status === 'pending' ? '⏳ Pending' : '✗ Failed'}</div>
                            {tx.confirmations && <div>• Confirmations: {tx.confirmations}</div>}
                          </div>
                        </div>

                        {tx.block && (
                          <div className="border-t border-[#262626] pt-4">
                            <div className="text-sm font-medium text-white mb-3">Blockchain Details:</div>
                            <div className="space-y-2 text-sm text-[#a1a1a1]">
                              <div>• Tx Hash: {tx.txHash.slice(0, 20)}... <Button variant="ghost" size="sm" className="ml-2 h-auto p-0 text-xs" onClick={() => handleViewExplorer(tx.txHash)}>View on Explorer</Button></div>
                              <div>• Block: {tx.block.toLocaleString()}</div>
                              {tx.gasUsed && <div>• Gas Used: {tx.gasUsed.toLocaleString()}</div>}
                              {tx.gasPrice && <div>• Gas Price: {tx.gasPrice} nUSDC</div>}
                            </div>
                          </div>
                        )}

                        {tx.streamId && (
                          <div className="border-t border-[#262626] pt-4">
                            <div className="text-sm font-medium text-white mb-3">Session Details:</div>
                            <div className="space-y-2 text-sm text-[#a1a1a1]">
                              <div>• Stream ID: {tx.streamId}</div>
                              {tx.duration && <div>• Duration: {tx.duration}</div>}
                              {tx.rate && <div>• Rate: {tx.rate}</div>}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-4 border-t border-[#262626]">
                          <Button variant="outline" size="sm" onClick={() => handleViewExplorer(tx.txHash)}>
                            View on Explorer
                          </Button>
                          {/* <Button variant="outline" size="sm">Download Receipt</Button> */}
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setExpandedTx(null); }}>Close</Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-[#a1a1a1]">
          Showing {filteredTransactions.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          {' '}–{' '}
          {Math.min(currentPage * pageSize, filteredTransactions.length)}
          {' '}of {filteredTransactions.length} filtered / {transactions.length} total
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(-1)}
          >
            Previous
          </Button>
          <span className="text-xs text-[#a1a1a1]">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(1)}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TransactionHistory;

