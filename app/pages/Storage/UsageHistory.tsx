import React, { useState, useMemo, useRef, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Search, ChevronLeft, ChevronRight, ChevronDown, ExternalLink } from 'lucide-react';
import { UsageHistoryItem } from './types';

interface UsageHistoryProps {
  history: UsageHistoryItem[];
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

// Format date to IST
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

// Format USDC amount to 6 decimal places
const formatUSDC = (amount: number): string => {
  if (isNaN(amount)) return '0.000000';
  return amount.toLocaleString('en-IN', {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6
  });
};

// Format duration in hours to minutes
const formatDuration = (hours: number | undefined): string => {
  if (hours === undefined || hours === null) return '-';
  const minutes = Math.round(hours * 60);
  return `${minutes} min`;
};

// Format duration in hours to hours and minutes
const formatDetailedDuration = (hours: number | undefined): string => {
  if (hours === undefined || hours === null) return 'N/A';
  const totalMinutes = Math.round(hours * 60);
  const hoursPart = Math.floor(totalMinutes / 60);
  const minutesPart = totalMinutes % 60;
  
  if (hoursPart === 0) return `${minutesPart} min`;
  if (minutesPart === 0) return `${hoursPart} hr`;
  return `${hoursPart} hr ${minutesPart} min`;
};

const UsageHistory: React.FC<UsageHistoryProps> = ({ history }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    action: 'all',
    sortBy: 'recent',
  });

  // Filter and sort logic
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchesSearch = item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.ipfsCid?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filters.action === 'all' || item.action === filters.action;
      return matchesSearch && matchesFilter;
    }).sort((a, b) => {
      if (filters.sortBy === 'recent') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (filters.sortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (filters.sortBy === 'cost-high') {
        return b.cost - a.cost;
      } else if (filters.sortBy === 'cost-low') {
        return a.cost - b.cost;
      }
      return 0;
    });
  }, [history, searchTerm, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredHistory.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredHistory, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedItem(null); // Close any expanded items when changing pages
  };

  return (
    <Card className="p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-white">Storage History</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#a1a1a1] pointer-events-none" />
            <input
              type="text"
              placeholder="Search files or CIDs..."
              className="w-full pl-10 pr-3 py-2 bg-[#0a0a0a] border border-[#262626] hover:border-[#2f2f2f] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40 focus:border-[#3b82f6] transition"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
          <div className="flex gap-2">
            <Dropdown
              value={filters.action}
              onChange={(val) => {
                setFilters(prev => ({ ...prev, action: val as string }));
                setCurrentPage(1);
              }}
              options={[
                { label: 'All Actions', value: 'all' },
                { label: 'Uploads', value: 'upload' },
                { label: 'Deletions', value: 'delete' }
              ]}
              className="flex-1 min-w-[140px]"
            />
            <Dropdown
              value={filters.sortBy}
              onChange={(val) => setFilters(prev => ({ ...prev, sortBy: val as string }))}
              options={[
                { label: 'Recent First', value: 'recent' },
                { label: 'Oldest First', value: 'oldest' },
                { label: 'Cost: High to Low', value: 'cost-high' },
                { label: 'Cost: Low to High', value: 'cost-low' }
              ]}
              className="flex-1 min-w-[160px]"
            />
            <Dropdown
              value={itemsPerPage}
              onChange={(val) => {
                setItemsPerPage(Number(val));
                setCurrentPage(1);
              }}
              options={ITEMS_PER_PAGE_OPTIONS.map(size => ({ label: `${size} rows`, value: size }))}
              className="w-28"
            />
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#262626]">
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Action</th>
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">File</th>
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Date/Time</th>
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Duration</th>
              <th className="text-center text-xs text-[#a1a1a1] uppercase py-3 px-6 min-w-[120px]">Cost</th>
              <th className="text-center text-xs text-[#a1a1a1] uppercase py-3 px-6 min-w-[180px]">Transaction</th>
            </tr>
          </thead>
          <tbody>
            {paginatedHistory.map((item) => (
              <React.Fragment key={item.id}>
                <tr
                  className="border-b border-[#262626] hover:bg-[#1a1a1a] cursor-pointer"
                  onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                >
                  <td className="py-3 px-2">
                    <span className="text-lg">{item.action === 'upload' ? '⬆️' : '🗑️'}</span>
                  </td>
                  <td className="py-3 px-2 text-sm text-white">{item.fileName}</td>
                  <td className="py-3 px-2 text-sm text-[#a1a1a1]">{formatDate(item.date)}</td>
                  <td className="py-3 px-2 text-sm text-[#a1a1a1]">
                    {formatDuration(item.duration)}
                  </td>
                  <td className="py-3 px-6 text-sm font-mono text-white text-center min-w-[120px]">{formatUSDC(item.cost)} USDC</td>
                  <td className="py-3 px-6 text-center min-w-[180px]">
                    {item.txHash ? (
                      <div className="inline-flex items-center justify-center gap-1">
                        <a
                          href={`https://testnet.snowtrace.io/tx/${item.txHash}`}
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
                            {`${item.txHash.slice(0, 8)}...${item.txHash.slice(-6)}`}
                          </span>
                        </a>
                      </div>
                    ) : (
                      <span className="text-[#6b6b6b] text-xs">-</span>
                    )}
                  </td>
                </tr>
                {expandedItem === item.id && (
                  <tr>
                    <td colSpan={6} className="p-4 bg-[#0a0a0a]">
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-white mb-2">Storage Details:</div>
                        <div className="space-y-2 text-sm text-[#a1a1a1]">
                          <div>• File: {item.fileName} {item.fileSize && `(${item.fileSize} MB)`}</div>
                          <div>• {item.action === 'delete' ? 'Deleted' : 'Uploaded'}: {formatDate(item.date)}</div>
                          {item.action === 'delete' && item.deletedAt && (
                            <div>• Deleted: {formatDate(item.deletedAt)}</div>
                          )}
                          <div>• Duration: {formatDetailedDuration(item.duration)}</div>
                          <div>• Total Cost: {formatUSDC(item.cost)} USDC (${(item.cost * 40).toFixed(2)})</div>
                          {item.ipfsCid && <div>• IPFS CID: {item.ipfsCid}</div>}
                          {item.txHash && (
                            <div className="flex items-center">
                              <span>• Tx Hash: {item.txHash}</span>
                              <a 
                                href={`https://testnet.snowtrace.io/tx/${item.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className="ml-2 text-xs text-blue-400 hover:text-blue-300 flex items-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <img 
                                  src="/avax-icon.svg" 
                                  alt="Avalanche" 
                                  className="w-3 h-3 mr-1"
                                />
                                View on Explorer <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-4">
                          {item.action === 'upload' && (
                            <>
                              <Button variant="outline" size="sm">View File</Button>
                              <Button variant="outline" size="sm">Download</Button>
                            </>
                          )}
                          <Button variant="outline" size="sm">Delete</Button>
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setExpandedItem(null); }}>Close</Button>
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

      {filteredHistory.length > 0 ? (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[#a1a1a1]">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredHistory.length)}-{
              Math.min(currentPage * itemsPerPage, filteredHistory.length)
            } of {filteredHistory.length} events
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show first, last, and pages around current page
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
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 text-center py-8 text-[#a1a1a1] border-t border-[#262626]">
          No history found{searchTerm ? ` for "${searchTerm}"` : ''}
        </div>
      )}
    </Card>
  );
};

export default UsageHistory;

