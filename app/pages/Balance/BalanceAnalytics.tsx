import React from 'react';
import Card from '@/components/ui/Card';
import Separator from '@/components/ui/Separator';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { BalanceHistoryData, TransactionBreakdown, ServiceTransactionCount } from './types';

interface BalanceAnalyticsProps {
  balanceHistory: BalanceHistoryData[];
  transactionBreakdown: TransactionBreakdown;
  serviceCounts: ServiceTransactionCount[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 shadow-lg">
        <p className="text-sm text-[#a1a1a1] mb-1">{payload[0].payload.date}</p>
        <p className="text-sm font-semibold text-white">
          Balance: {payload[0].value} USDC
        </p>
      </div>
    );
  }
  return null;
};

const BalanceAnalytics: React.FC<BalanceAnalyticsProps> = ({
  balanceHistory,
  transactionBreakdown,
  serviceCounts,
}) => {
  const totalTransactions = transactionBreakdown.deposits + transactionBreakdown.payments + 
                           transactionBreakdown.withdrawals + transactionBreakdown.refunds;

  const pieData = [
    { name: 'Deposits', value: transactionBreakdown.deposits, color: '#10b981' },
    { name: 'Payments', value: transactionBreakdown.payments, color: '#3b82f6' },
    { name: 'Withdrawals', value: transactionBreakdown.withdrawals, color: '#f59e0b' },
    { name: 'Refunds', value: transactionBreakdown.refunds, color: '#8b5cf6' },
  ].filter(item => item.value > 0);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">
      <Card className="p-6 xl:col-span-3">
        <h2 className="text-lg font-semibold text-white mb-6">Balance History</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={balanceHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis dataKey="date" stroke="#a1a1a1" style={{ fontSize: '12px' }} />
            <YAxis stroke="#a1a1a1" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 xl:col-span-2">
        <h2 className="text-lg font-semibold text-white mb-6">Transaction Breakdown</h2>
        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ color: '#ffffff', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-sm text-[#a1a1a1] text-center mb-4">
          Total Transactions: {totalTransactions}
        </div>
        <Separator className="mb-4" />
        <div>
          <div className="text-sm font-medium text-white mb-2">By Service:</div>
          <div className="space-y-1">
            {serviceCounts.map((service, index) => (
              <div key={index} className="text-sm text-[#a1a1a1]">
                • {service.service}: {service.count} txs
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BalanceAnalytics;

