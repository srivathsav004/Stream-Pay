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

interface ServiceDetailsProps {
  videoStreamingTrend: Array<{ day: string; value: number }>;
  videoTotalSpent: number;
  videoSessions: number;
  videoHoursWatched: number;
  videoAvgPerSession: number;
  apiCallsData: Array<{ day: string; calls: number }>;
  apiTotalSpent: number;
  apiTotalCalls: number;
  apiCallsPerDayAvg: number;
  apiAvgPerCall: number;
  storageData: Array<{ day: string; value: number }>;
  storageTotalSpent: number;
  storageTotalGB: number;
  storageActiveFiles: number;
  storageAvgHoursPerFile: number;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  videoStreamingTrend,
  videoTotalSpent,
  videoSessions,
  videoHoursWatched,
  videoAvgPerSession,
  apiCallsData,
  apiTotalSpent,
  apiTotalCalls,
  apiCallsPerDayAvg,
  apiAvgPerCall,
  storageData,
  storageTotalSpent,
  storageTotalGB,
  storageActiveFiles,
  storageAvgHoursPerFile,
}) => {
  // Static demo data for chart shapes; textual metrics remain fully dynamic
  const videoChartData = [
    { day: 'Mon', value: 0.5 },
    { day: 'Tue', value: 0.6 },
    { day: 'Wed', value: 0.4 },
    { day: 'Thu', value: 0.7 },
    { day: 'Fri', value: 0.8 },
    { day: 'Sat', value: 0.9 },
    { day: 'Sun', value: 0.65 },
  ];

  const apiChartData = [
    { day: 'Mon', calls: 20 },
    { day: 'Tue', calls: 28 },
    { day: 'Wed', calls: 24 },
    { day: 'Thu', calls: 32 },
    { day: 'Fri', calls: 30 },
    { day: 'Sat', calls: 26 },
    { day: 'Sun', calls: 22 },
  ];

  const storageChartData = [
    { day: 'Mon', value: 0.6 },
    { day: 'Tue', value: 0.62 },
    { day: 'Wed', value: 0.64 },
    { day: 'Thu', value: 0.66 },
    { day: 'Fri', value: 0.68 },
    { day: 'Sat', value: 0.7 },
    { day: 'Sun', value: 0.71 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6" hoverEffect={true}>
        <h3 className="text-base font-semibold text-white mb-4">Video Streaming</h3>
        <div className="mb-4">
          <div className="text-xs text-[#a1a1a1] mb-1">Total Spent</div>
          <div className="text-2xl font-semibold text-white">{videoTotalSpent.toFixed(4)} USDC</div>
        </div>
        <div className="h-20 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={videoChartData}>
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
          <div>• {videoSessions} sessions</div>
          <div>• {(videoHoursWatched * 3600).toFixed(0)} seconds watched</div>
          <div>• Avg: {videoAvgPerSession.toFixed(3)} USDC/session</div>
        </div>
        <Button variant="ghost" size="sm" className="text-blue-600 w-full">View Details →</Button>
      </Card>

      <Card className="p-6" hoverEffect="purple">
        <h3 className="text-base font-semibold text-white mb-4">API Calls</h3>
        <div className="mb-4">
          <div className="text-xs text-[#a1a1a1] mb-1">Total Spent</div>
          <div className="text-2xl font-semibold text-white">{apiTotalSpent.toFixed(4)} USDC</div>
        </div>
        <div className="h-20 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={apiChartData}>
              <Bar dataKey="calls" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 text-sm text-[#a1a1a1] mb-4">
          <div>• {apiTotalCalls} total calls</div>
          <div>• {apiCallsPerDayAvg.toFixed(1)} calls/day avg</div>
          <div>• Avg: {apiAvgPerCall.toFixed(3)} USDC/call</div>
        </div>
        <Button variant="ghost" size="sm" className="text-purple-600 w-full">View Details →</Button>
      </Card>

      <Card className="p-6" hoverEffect="cyan">
        <h3 className="text-base font-semibold text-white mb-4">Cloud Storage</h3>
        <div className="mb-4">
          <div className="text-xs text-[#a1a1a1] mb-1">Total Spent</div>
          <div className="text-2xl font-semibold text-white">{storageTotalSpent.toFixed(4)} USDC</div>
        </div>
        <div className="h-20 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={storageChartData}>
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
          <div>• {(storageTotalGB * 1024).toFixed(0)} MB currently stored</div>
          <div>• {storageActiveFiles} files</div>
          <div>• Avg: {storageAvgHoursPerFile.toFixed(0)} hours/file</div>
        </div>
        <Button variant="ghost" size="sm" className="text-cyan-600 w-full">View Details →</Button>
      </Card>
    </div>
  );
};

export default ServiceDetails;

