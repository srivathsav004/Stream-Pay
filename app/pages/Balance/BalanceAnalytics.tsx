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
          Transactions: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const ServiceTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const p = payload[0];
    const name = p.name || p.payload?.name;
    const value = p.value;
    const percent = p.percent != null ? (p.percent * 100).toFixed(1) : undefined;
    return (
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-white mb-1">{name}</p>
        <p className="text-xs text-[#a1a1a1]">
          Transactions: <span className="text-white font-medium">{value}</span>
          {percent !== undefined && <> · {percent}%</>}
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

  const SERVICE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#f97316'];

  const pieData = serviceCounts
    .filter(s => s.count > 0)
    .map((s, idx) => ({ name: s.service, value: s.count, color: SERVICE_COLORS[idx % SERVICE_COLORS.length] }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Transaction History</h2>
        <ResponsiveContainer width="100%" height={320}>
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

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Transaction Breakdown</h2>
        <div className="h-72 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ServiceTooltip />} />
              <Legend wrapperStyle={{ color: '#ffffff', fontSize: '12px', marginTop: 16 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-sm text-[#a1a1a1] text-center">
          Total Transactions: <span className="text-white font-medium">{totalTransactions}</span>
        </div>
      </Card>
    </div>
  );
};

export default BalanceAnalytics;

