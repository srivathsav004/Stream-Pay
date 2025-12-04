import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';

const videoStreamingTrend: Array<{ day: string; value: number }> = [];
const apiCallsData: Array<{ day: string; calls: number }> = [];
const storageData: Array<{ day: string; value: number }> = [];

const ServiceDetails: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6" hoverEffect={true}>
        <h3 className="text-base font-semibold text-white mb-4">Video Streaming</h3>
        <div className="mb-4">
          <div className="text-xs text-[#a1a1a1] mb-1">Total Spent</div>
          <div className="text-2xl font-semibold text-white">0 USDC</div>
        </div>
        <div className="h-20 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={videoStreamingTrend}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 text-sm text-[#a1a1a1] mb-4">
          <div>• No sessions yet</div>
          <div>• —</div>
          <div>• —</div>
        </div>
        <Button variant="ghost" size="sm" className="text-blue-600 w-full">View Details →</Button>
      </Card>

      <Card className="p-6" hoverEffect="purple">
        <h3 className="text-base font-semibold text-white mb-4">API Calls</h3>
        <div className="mb-4">
          <div className="text-xs text-[#a1a1a1] mb-1">Total Spent</div>
          <div className="text-2xl font-semibold text-white">0 USDC</div>
        </div>
        <div className="h-20 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={apiCallsData}>
              <Bar dataKey="calls" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 text-sm text-[#a1a1a1] mb-4">
          <div>• No calls yet</div>
          <div>• —</div>
          <div>• —</div>
        </div>
        <Button variant="ghost" size="sm" className="text-purple-600 w-full">View Details →</Button>
      </Card>

      <Card className="p-6" hoverEffect="cyan">
        <h3 className="text-base font-semibold text-white mb-4">Cloud Storage</h3>
        <div className="mb-4">
          <div className="text-xs text-[#a1a1a1] mb-1">Total Spent</div>
          <div className="text-2xl font-semibold text-white">0 USDC</div>
        </div>
        <div className="h-20 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={storageData}>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 text-sm text-[#a1a1a1] mb-4">
          <div>• No files yet</div>
          <div>• —</div>
          <div>• —</div>
        </div>
        <Button variant="ghost" size="sm" className="text-cyan-600 w-full">View Details →</Button>
      </Card>
    </div>
  );
};

export default ServiceDetails;

