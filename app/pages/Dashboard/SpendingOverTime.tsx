import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SpendingData } from './types';

interface SpendingOverTimeProps {
  data: SpendingData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 shadow-lg">
        <p className="text-sm text-[#a1a1a1] mb-1">{payload[0].payload.date}</p>
        <p className="text-sm font-semibold text-white">
          {payload[0].value.toFixed(2)} USDC
        </p>
        {payload[0].payload.sessions && (
          <p className="text-xs text-[#a1a1a1] mt-1">{payload[0].payload.sessions} sessions</p>
        )}
      </div>
    );
  }
  return null;
};

const SpendingOverTime: React.FC<SpendingOverTimeProps> = ({ data }) => {
  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">Spending Over Time</h2>
        </div>
        <Button variant="outline" size="sm">Export Data</Button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
          <XAxis dataKey="date" stroke="#a1a1a1" style={{ fontSize: '12px' }} />
          <YAxis stroke="#a1a1a1" style={{ fontSize: '12px' }} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorAmount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SpendingOverTime;

