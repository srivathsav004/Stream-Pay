import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { UsageHistoryItem } from './types';

interface UsageHistoryProps {
  history: UsageHistoryItem[];
}

const UsageHistory: React.FC<UsageHistoryProps> = ({ history }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Storage History</h2>
        <Button variant="outline" size="sm">Export CSV</Button>
      </div>

      <div className="flex gap-2 mb-4">
        <select className="bg-[#141414] border border-[#262626] text-white text-sm rounded-lg px-3 py-2">
          <option>Filter: All</option>
        </select>
        <select className="bg-[#141414] border border-[#262626] text-white text-sm rounded-lg px-3 py-2">
          <option>Sort: Recent First</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#262626]">
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Action</th>
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">File</th>
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Date/Time</th>
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Duration</th>
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Cost</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <React.Fragment key={item.id}>
                <tr
                  className="border-b border-[#262626] hover:bg-[#1a1a1a] cursor-pointer"
                  onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                >
                  <td className="py-3 px-2">
                    <span className="text-lg">{item.action === 'upload' ? '⬆️' : '🗑️'}</span>
                  </td>
                  <td className="py-3 px-2 text-sm text-white">{item.fileName}</td>
                  <td className="py-3 px-2 text-sm text-[#a1a1a1]">{item.date}</td>
                  <td className="py-3 px-2 text-sm text-[#a1a1a1]">
                    {item.duration ? `${item.duration}h` : '-'}
                  </td>
                  <td className="py-3 px-2 text-sm font-mono text-white">{item.cost} USDC</td>
                </tr>
                {expandedItem === item.id && (
                  <tr>
                    <td colSpan={5} className="p-4 bg-[#0a0a0a]">
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-white mb-2">Storage Details:</div>
                        <div className="space-y-2 text-sm text-[#a1a1a1]">
                          <div>• File: {item.fileName} {item.fileSize && `(${item.fileSize} MB)`}</div>
                          <div>• Date: {item.date}</div>
                          <div>• Duration: {item.duration ? `${item.duration} hours` : 'N/A'}</div>
                          <div>• Total Cost: {item.cost} USDC (${(item.cost * 40).toFixed(2)})</div>
                          {item.ipfsCid && <div>• IPFS CID: {item.ipfsCid}</div>}
                          {item.txHash && (
                            <div>• Tx Hash: {item.txHash} <Button variant="ghost" size="sm" className="ml-2 h-auto p-0 text-xs">View on Explorer</Button></div>
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

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-[#a1a1a1]">
          Showing {history.length} of {history.length} events
        </div>
        <Button variant="outline" size="sm">Load More</Button>
      </div>
    </Card>
  );
};

export default UsageHistory;

