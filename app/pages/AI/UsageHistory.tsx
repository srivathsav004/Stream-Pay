import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { UsageHistoryItem } from './types';

interface UsageHistoryProps {
  history: UsageHistoryItem[];
}

const UsageHistory: React.FC<UsageHistoryProps> = ({ history }) => {
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Usage History</h2>
        <Button variant="outline" size="sm">Export CSV</Button>
      </div>
      
      <div className="flex gap-2 mb-4">
        <select className="bg-[#141414] border border-[#262626] text-white text-sm rounded-lg px-3 py-2">
          <option>Filter: All Sessions</option>
        </select>
        <select className="bg-[#141414] border border-[#262626] text-white text-sm rounded-lg px-3 py-2">
          <option>Sort: Recent First</option>
        </select>
      </div>

      <div className="space-y-2">
        {history.map((item) => (
          <Card
            key={item.id}
            className="p-4 cursor-pointer hover:border-blue-600"
            onClick={() => setExpandedSession(expandedSession === item.id ? null : item.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-white">
                  Session #{item.sessionNumber}
                </div>
                <div className="text-sm text-[#a1a1a1]">{item.date}</div>
                <div className="text-sm text-[#a1a1a1]">{item.calls} calls</div>
                <div className="text-sm font-mono text-white">{item.cost} AVAX</div>
              </div>
            </div>
            
            {expandedSession === item.id && (
              <div className="mt-4 pt-4 border-t border-[#262626]">
                <div className="text-sm font-medium text-white mb-3">Session Details:</div>
                <div className="space-y-2 text-sm text-[#a1a1a1] mb-4">
                  <div>• Total Calls: {item.calls}</div>
                  <div>• Total Cost: {item.cost} AVAX (${(item.cost * 40).toFixed(2)})</div>
                </div>
                {item.topics && item.topics.length > 0 && (
                  <>
                    <div className="text-sm font-medium text-white mb-2">Topics Discussed:</div>
                    <div className="flex flex-wrap gap-2">
                      {item.topics.map((topic, index) => (
                        <Badge key={index} variant="secondary">{topic}</Badge>
                      ))}
                    </div>
                  </>
                )}
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">View Full Conversation</Button>
                  <Button variant="outline" size="sm">Export</Button>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setExpandedSession(null); }}>Close</Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-[#a1a1a1]">
          Showing {history.length} of {history.length} sessions
        </div>
        <Button variant="outline" size="sm">Load More</Button>
      </div>
    </Card>
  );
};

export default UsageHistory;

