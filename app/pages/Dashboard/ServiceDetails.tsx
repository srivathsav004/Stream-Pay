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

const videoStreamingTrend = [
  { day: 'Mon', value: 0.5 },
  { day: 'Tue', value: 0.6 },
  { day: 'Wed', value: 0.4 },
  { day: 'Thu', value: 0.7 },
  { day: 'Fri', value: 0.8 },
  { day: 'Sat', value: 0.9 },
  { day: 'Sun', value: 0.65 },
];

const apiCallsData = [
  { day: 'Mon', calls: 30 },
  { day: 'Tue', calls: 35 },
  { day: 'Wed', calls: 28 },
  { day: 'Thu', calls: 40 },
  { day: 'Fri', calls: 45 },
  { day: 'Sat', calls: 35 },
  { day: 'Sun', calls: 34 },
];

const storageData = [
  { day: 'Mon', value: 0.1 },
  { day: 'Tue', value: 0.12 },
  { day: 'Wed', value: 0.11 },
  { day: 'Thu', value: 0.13 },
  { day: 'Fri', value: 0.14 },
  { day: 'Sat', value: 0.15 },
  { day: 'Sun', value: 0.14 },
];

const ServiceDetails: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6" hoverEffect={true}>
        <h3 className="text-base font-semibold text-white mb-4">Video Streaming</h3>
        <div className="mb-4">
          <div className="text-xs text-[#a1a1a1] mb-1">Total Spent</div>
          <div className="text-2xl font-semibold text-white">4.45 AVAX</div>
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
          <div>• 47 sessions</div>
          <div>• 12.5 hours watched</div>
          <div>• Avg: 0.095 AVAX/session</div>
        </div>
        <Button variant="ghost" size="sm" className="text-blue-600 w-full">View Details →</Button>
      </Card>

      <Card className="p-6" hoverEffect="purple">
        <h3 className="text-base font-semibold text-white mb-4">API Calls</h3>
        <div className="mb-4">
          <div className="text-xs text-[#a1a1a1] mb-1">Total Spent</div>
          <div className="text-2xl font-semibold text-white">2.22 AVAX</div>
        </div>
        <div className="h-20 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={apiCallsData}>
              <Bar dataKey="calls" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 text-sm text-[#a1a1a1] mb-4">
          <div>• 247 total calls</div>
          <div>• 35 calls/day avg</div>
          <div>• Avg: 0.009 AVAX/call</div>
        </div>
        <Button variant="ghost" size="sm" className="text-purple-600 w-full">View Details →</Button>
      </Card>

      <Card className="p-6" hoverEffect="cyan">
        <h3 className="text-base font-semibold text-white mb-4">Cloud Storage</h3>
        <div className="mb-4">
          <div className="text-xs text-[#a1a1a1] mb-1">Total Spent</div>
          <div className="text-2xl font-semibold text-white">0.74 AVAX</div>
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
          <div>• 1.2 GB currently stored</div>
          <div>• 47 files</div>
          <div>• Avg: 240 hours/file</div>
        </div>
        <Button variant="ghost" size="sm" className="text-cyan-600 w-full">View Details →</Button>
      </Card>
    </div>
  );
};

export default ServiceDetails;

