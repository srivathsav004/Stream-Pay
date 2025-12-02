import React, { useEffect, useMemo, useRef, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ActivityData } from './types';

interface ActivityTimelineProps {
  activities: ActivityData[];
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

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'all' | 'stream' | 'api' | 'storage'>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const filtered = useMemo(() => {
    let data = activities;
    if (type !== 'all') data = data.filter(a => a.type === type);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(a => a.service.toLowerCase().includes(q));
    }
    return data;
  }, [activities, type, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageData = filtered.slice(start, start + pageSize);

  const getTypeBadgeColor = (t: ActivityData['type']) => {
    if (t === 'api') return '#8b5cf6';
    if (t === 'stream') return '#3b82f6';
    return '#06b6d4';
  };

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Activity</h2>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search service..."
            className="bg-[#0a0a0a] border border-[#262626] rounded-md px-3 py-2 text-sm text-white placeholder-[#6b6b6b] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
          />
          <Dropdown
            value={type}
            onChange={(val) => { setType(val as any); setPage(1); }}
            options={[
              { label: 'All Types', value: 'all' },
              { label: 'Stream', value: 'stream' },
              { label: 'API', value: 'api' },
              { label: 'Storage', value: 'storage' },
            ]}
            className="w-36"
          />
          <Dropdown
            value={pageSize}
            onChange={(val) => { setPageSize(Number(val)); setPage(1); }}
            options={[
              { label: '5 rows', value: 5 },
              { label: '6 rows', value: 6 },
              { label: '10 rows', value: 10 },
            ]}
            className="w-28"
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-[#262626]">
        <table className="min-w-full text-sm">
          <thead className="bg-[#0f0f0f] text-[#a1a1a1]">
            <tr>
              <th className="text-left font-medium px-4 py-3">Service</th>
              <th className="text-left font-medium px-4 py-3">Type</th>
              <th className="text-left font-medium px-4 py-3">Time</th>
              <th className="text-left font-medium px-4 py-3">Summary</th>
              <th className="text-right font-medium px-4 py-3">Cost (USDC)</th>
              <th className="text-right font-medium px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((activity) => (
              <React.Fragment key={activity.id}>
                <tr className="border-t border-[#262626] hover:bg-[#121212]">
                  <td className="px-4 py-3 text-white">{activity.service}</td>
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${getTypeBadgeColor(activity.type)}15`,
                          color: getTypeBadgeColor(activity.type),
                          border: `1px solid ${getTypeBadgeColor(activity.type)}40`
                        }}>
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#a1a1a1]">{activity.time}</td>
                  <td className="px-4 py-3 text-[#a1a1a1]">
                    {activity.duration && `${activity.duration} • `}
                    {activity.calls && `${activity.calls} call${activity.calls > 1 ? 's' : ''}`}
                  </td>
                  <td className="px-4 py-3 text-right text-white">{activity.cost}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
                    >
                      {expandedActivity === activity.id ? 'Hide' : 'View'}
                    </Button>
                  </td>
                </tr>
                {expandedActivity === activity.id && activity.details && (
                  <tr className="border-t border-[#262626] bg-[#0a0a0a]">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="text-sm font-medium text-white mb-3">Transaction Details:</div>
                      <div className="grid md:grid-cols-2 gap-2 text-sm text-[#a1a1a1]">
                        <div>• Stream ID: {activity.details.streamId}</div>
                        <div>• Started: {activity.details.started}</div>
                        <div>• Ended: {activity.details.ended}</div>
                        <div>• Rate: {activity.details.rate}</div>
                        <div className="md:col-span-2">• Tx Hash: {activity.details.txHash} <Button variant="ghost" size="sm" className="ml-2 h-auto p-0 text-xs">View on Explorer</Button></div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">Download Receipt</Button>
                        <Button variant="ghost" size="sm" onClick={() => setExpandedActivity(null)}>Close</Button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#a1a1a1]">No activity found.</td>
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

export default ActivityTimeline;

