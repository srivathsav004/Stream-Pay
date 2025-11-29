import React from 'react';
import Card from '@/components/ui/Card';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { AnalyticsData } from './types';

interface VideoAnalyticsProps {
  data: AnalyticsData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 shadow-lg">
        <p className="text-sm text-[#a1a1a1] mb-1">{payload[0].payload.date}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="text-sm font-semibold text-white">
            {item.name === 'streamingCost' ? 'Streaming' : 'Purchases'}: {item.value.toFixed(4)} AVAX
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const VideoAnalytics: React.FC<VideoAnalyticsProps> = ({ data }) => {
  const streamingTotal = data.reduce((sum, d) => sum + d.streamingCost, 0);
  const purchaseTotal = data.reduce((sum, d) => sum + d.purchaseCost, 0);
  const streamingSessions = 47;
  const purchaseVideos = 8;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Spending Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorStreaming" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPurchase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis dataKey="date" stroke="#a1a1a1" style={{ fontSize: '12px' }} />
            <YAxis stroke="#a1a1a1" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#ffffff' }} />
            <Area
              type="monotone"
              dataKey="streamingCost"
              stackId="1"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorStreaming)"
              name="Streaming"
            />
            <Area
              type="monotone"
              dataKey="purchaseCost"
              stackId="1"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#colorPurchase)"
              name="Purchases"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <h3 className="text-base font-semibold text-white mb-4">Streaming</h3>
          <div className="mb-4">
            <div className="text-2xl font-semibold text-white mb-1">
              {streamingTotal.toFixed(2)} AVAX
            </div>
            <div className="text-sm text-[#a1a1a1">Sessions: {streamingSessions}</div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={data}>
              <Bar dataKey="streamingCost" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-base font-semibold text-white mb-4">Purchases</h3>
          <div className="mb-4">
            <div className="text-2xl font-semibold text-white mb-1">
              {purchaseTotal.toFixed(2)} AVAX
            </div>
            <div className="text-sm text-[#a1a1a1">Videos: {purchaseVideos}</div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={data}>
              <Bar dataKey="purchaseCost" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default VideoAnalytics;

