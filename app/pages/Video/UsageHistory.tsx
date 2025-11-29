import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { UsageHistoryItem } from './types';

interface UsageHistoryProps {
  history: UsageHistoryItem[];
}

const UsageHistory: React.FC<UsageHistoryProps> = ({ history }) => {
  const [filterType, setFilterType] = useState<'all' | 'stream' | 'purchase'>('all');

  const filteredHistory = filterType === 'all' 
    ? history 
    : history.filter(item => item.type === filterType);

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Usage History</h2>
        <Button variant="outline" size="sm">Export CSV</Button>
      </div>
      
      <div className="flex gap-2 mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as 'all' | 'stream' | 'purchase')}
          className="bg-[#141414] border border-[#262626] text-white text-sm rounded-lg px-3 py-2"
        >
          <option value="all">Type: All</option>
          <option value="stream">Type: Stream</option>
          <option value="purchase">Type: Purchase</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#262626]">
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Type</th>
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Video</th>
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Date/Time</th>
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Duration</th>
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Cost</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((item) => (
              <tr key={item.id} className="border-b border-[#262626] hover:bg-[#1a1a1a]">
                <td className="py-3 px-2">
                  <span className="text-lg">
                    {item.type === 'stream' ? '🎬' : '💎'}
                  </span>
                </td>
                <td className="py-3 px-2 text-sm text-white">{item.videoTitle}</td>
                <td className="py-3 px-2 text-sm text-[#a1a1a1]">{item.date}</td>
                <td className="py-3 px-2 text-sm text-[#a1a1a1]">
                  {item.duration || '-'}
                </td>
                <td className="py-3 px-2 text-sm font-mono text-white">
                  {item.cost} AVAX
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <Button variant="outline" size="sm">Load More</Button>
      </div>
    </Card>
  );
};

export default UsageHistory;

