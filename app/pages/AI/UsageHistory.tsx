import React, { useEffect, useMemo, useRef, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { UsageHistoryItem } from './types';

interface UsageHistoryProps {
  history: UsageHistoryItem[];
}

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
        <span>{current}</span>
        <svg className={`h-4 w-4 text-[#8a8a8a] transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-lg border border-[#262626] bg-[#0f0f0f] shadow-xl overflow-hidden">
          <ul className="py-1 max-h-64 overflow-auto">
            {options.map(opt => (
              <li key={String(opt.value)}>
                <button
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm ${opt.value === value ? 'bg-[#262640] text-white' : 'text-[#e5e5e5] hover:bg-[#151515]'} `}
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

const UsageHistory: React.FC<UsageHistoryProps> = ({ history }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'single' | 'multi'>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filtered = useMemo(() => {
    let data = history;
    if (filterType !== 'all') {
      data = data.filter(i => {
        if (filterType === 'single') return i.calls === 1;
        if (filterType === 'multi') return i.calls > 1;
        return true;
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(i => 
        i.sessionNumber.toString().includes(q) || 
        (i.txHash && i.txHash.toLowerCase().includes(q))
      );
    }
    return data;
  }, [history, filterType, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageData = filtered.slice(start, start + pageSize);

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Usage History</h2>
        <Button variant="outline" size="sm">Export CSV</Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search sessions or tx hash..."
          className="bg-[#0a0a0a] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white placeholder-[#6b6b6b] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
        />
        <Dropdown
          value={filterType}
          onChange={(v) => { setFilterType(v as any); setPage(1); }}
          options={[
            { label: 'Type: All', value: 'all' },
            { label: 'Type: Single Call', value: 'single' },
            { label: 'Type: Multi Call', value: 'multi' },
          ]}
          className="w-40"
        />
        <Dropdown
          value={pageSize}
          onChange={(v) => { setPageSize(Number(v)); setPage(1); }}
          options={[
            { label: '5 rows', value: 5 },
            { label: '10 rows', value: 10 },
          ]}
          className="w-28"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#262626]">
        <table className="min-w-full text-sm">
          <thead className="bg-[#0f0f0f] text-[#a1a1a1]">
            <tr>
              <th className="text-left font-medium px-4 py-3">Session</th>
              <th className="text-left font-medium px-4 py-3">Date/Time (IST)</th>
              <th className="text-left font-medium px-4 py-3">Calls</th>
              <th className="text-center font-medium px-6 py-3 min-w-[120px]">Cost (USDC)</th>
              <th className="text-center font-medium px-6 py-3 min-w-[180px]">Tx Hash</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((item, idx) => (
              <tr key={item.id} className="border-t border-[#262626] hover:bg-[#121212]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="text-white font-medium">{start + idx + 1}</div>
                    {item.calls === 1 && (
                      <Badge variant="secondary" className="text-xs">Single</Badge>
                    )}
                    {item.calls > 1 && (
                      <Badge variant="default" className="text-xs">Multi</Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-[#a1a1a1]">{item.date}</td>
                <td className="px-4 py-3 text-[#a1a1a1]">{item.calls}</td>
                <td className="px-6 py-3 text-center text-white min-w-[120px]">{item.cost}</td>
                <td className="px-6 py-3 text-center min-w-[180px]">
                  {item.txHash ? (
                    <div className="inline-flex items-center justify-center gap-1">
                      <a
                        href={`https://testnet.snowtrace.io/tx/${item.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
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
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#a1a1a1]">No history found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-xs text-[#a1a1a1]">Page {currentPage} of {totalPages} • {filtered.length} results</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
        </div>
      </div>
    </Card>
  );
};

export default UsageHistory;

