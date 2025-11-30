import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Transaction } from './types';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

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

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterService, setFilterService] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter(tx => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (filterService !== 'all' && tx.service !== filterService) return false;
    if (searchQuery && !tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !tx.service?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleViewExplorer = (txHash: string) => {
    window.open(`https://testnet.snowtrace.io/tx/${txHash}`, '_blank');
  };

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Transaction History</h2>
        <Button variant="outline" size="sm">Export CSV</Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-[#141414] border border-[#262626] text-white text-sm rounded-lg px-3 py-2"
        >
          <option value="all">All Types</option>
          <option value="deposit">Deposits</option>
          <option value="payment">Payments</option>
          <option value="withdraw">Withdrawals</option>
          <option value="refund">Refunds</option>
        </select>
        <select
          value={filterService}
          onChange={(e) => setFilterService(e.target.value)}
          className="bg-[#141414] border border-[#262626] text-white text-sm rounded-lg px-3 py-2"
        >
          <option value="all">All Services</option>
          <option value="Video Streaming">Video</option>
          <option value="AI Assistant">AI</option>
          <option value="Cloud Storage">Storage</option>
        </select>
        <select className="bg-[#141414] border border-[#262626] text-white text-sm rounded-lg px-3 py-2">
          <option>Last 30 Days</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#141414] border border-[#262626] text-white text-sm rounded-lg px-3 py-2 flex-1 min-w-[200px]"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#262626]">
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Type</th>
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Service</th>
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Date/Time</th>
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Amount</th>
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Status</th>
              <th className="text-left text-xs text-[#a1a1a1] uppercase py-3 px-2">Tx</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <React.Fragment key={tx.id}>
                <tr
                  className="border-b border-[#262626] hover:bg-[#1a1a1a] cursor-pointer"
                  onClick={() => setExpandedTx(expandedTx === tx.id ? null : tx.id)}
                >
                  <td className="py-3 px-2">
                    <span className="text-lg">{getTransactionIcon(tx.type)}</span>
                  </td>
                  <td className="py-3 px-2 text-sm text-white">{tx.service || '-'}</td>
                  <td className="py-3 px-2 text-sm text-[#a1a1a1]">{tx.date}</td>
                  <td className={`py-3 px-2 text-sm font-mono ${getTransactionColor(tx.type)}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount} AVAX
                  </td>
                  <td className="py-3 px-2">
                    <Badge variant={tx.status === 'complete' ? 'success' : 'secondary'}>
                      {tx.status === 'complete' ? '✓' : '⏳'} {tx.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-2" onClick={(e) => { e.stopPropagation(); handleViewExplorer(tx.txHash); }}>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">→</Button>
                  </td>
                </tr>
                {expandedTx === tx.id && (
                  <tr>
                    <td colSpan={6} className="p-4 bg-[#0a0a0a]">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-white">
                            {getTransactionIcon(tx.type)} {tx.type === 'payment' ? 'Payment' : tx.type === 'deposit' ? 'Deposit' : tx.type === 'withdraw' ? 'Withdraw' : 'Refund'}: {tx.service || 'N/A'}
                          </div>
                          <div className="text-xs text-[#a1a1a1]">{tx.date}</div>
                        </div>

                        <div className="border-t border-[#262626] pt-4">
                          <div className="text-sm font-medium text-white mb-3">Transaction Details:</div>
                          <div className="space-y-2 text-sm text-[#a1a1a1]">
                            <div>• Type: {tx.type === 'payment' ? 'Service Payment' : tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</div>
                            {tx.service && <div>• Service: {tx.service}</div>}
                            <div>• Amount: {tx.amount} AVAX (${(Math.abs(tx.amount) * 40).toFixed(2)})</div>
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
                              {tx.gasPrice && <div>• Gas Price: {tx.gasPrice} nAVAX</div>}
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
                          <Button variant="outline" size="sm">Download Receipt</Button>
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
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </div>
        <Button variant="outline" size="sm">Load More</Button>
      </div>
    </Card>
  );
};

export default TransactionHistory;

