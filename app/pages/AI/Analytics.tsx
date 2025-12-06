import React, { useMemo } from 'react';
import Card from '@/components/ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { AnalyticsData, TopicData } from './types';

// Format date to display in a user-friendly way
const formatDateDisplay = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    // Format: DD MMM (e.g., 06 Dec)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateStr;
  }
};

// Format date for tooltip
const formatTooltipDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return dateStr;
  }
};

interface AnalyticsProps {
  callsData: AnalyticsData[];
  topicData: TopicData[];
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 shadow-lg text-sm">
        <p className="text-[#a1a1a1] mb-1">
          {data.date ? formatTooltipDate(data.date) : 'N/A'}
        </p>
        <p className="font-semibold text-white">
          Calls: {data.calls || 0}
        </p>
      </div>
    );
  }
  return null;
};

const Analytics: React.FC<AnalyticsProps> = ({ callsData, topicData }) => {
  // Process session data to show each session as a separate bar
  const sessionsData = useMemo(() => {
    if (!callsData?.length) return [];
    
    return callsData
      .filter(item => item?.date) // Filter out items without a date
      .map((item, index) => {
        const date = new Date(item.date);
        return {
          id: `session-${index + 1}`,
          date: item.date,
          displayDate: date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          calls: typeof item.calls === 'number' ? item.calls : 1,
          timestamp: date.getTime()
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [callsData]);
  
  // Use mock data for topics as before
  const safeTopics = [
    { topic: 'General Questions', calls: 12 },
    { topic: 'Pricing', calls: 8 },
    { topic: 'Integrations', calls: 5 },
    { topic: 'Troubleshooting', calls: 4 },
    { topic: 'Documentation', calls: 3 },
  ];
  
  const maxCalls = safeTopics.length > 0 ? Math.max(...safeTopics.map(t => t.calls)) : 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">
      <Card className="p-6 xl:col-span-3">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white">API Calls by Session</h2>
          <div className="text-sm text-[#a1a1a1]">
            {sessionsData.length} sessions
          </div>
        </div>
        {sessionsData.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-[#262626] rounded-lg">
            <div className="text-4xl mb-2">📉</div>
            <div className="text-white font-medium mb-1">No call data</div>
            <div className="text-sm text-[#a1a1a1]">Make some AI calls to see activity here.</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sessionsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis 
                dataKey="id"
                stroke="#a1a1a1" 
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={{ stroke: '#262626' }}
                tickMargin={8}
                minTickGap={20}
                interval={0} // Show all session times
                tick={{ fontSize: 11 }} // Make text smaller to fit more sessions
              />
              <YAxis 
                stroke="#a1a1a1" 
                style={{ fontSize: '12px' }}
                allowDecimals={false}
                axisLine={{ stroke: '#262626' }}
                tickLine={false}
                tickFormatter={(value) => Math.round(value).toString()}
                domain={[0, (dataMax: number) => Math.max(1, Math.ceil(dataMax * 1.1))]} // Ensure minimum height of 1
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="calls" 
                fill="#3b82f6"
                name="API Calls"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
                onMouseEnter={(e) => {
                  if (e && e.target) {
                    e.target.style.opacity = '0.8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (e && e.target) {
                    e.target.style.opacity = '1';
                  }
                }}
                style={{
                  transition: 'opacity 0.2s',
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card className="p-6 xl:col-span-2">
        <h2 className="text-lg font-semibold text-white mb-6">Most Asked Topics (Mock UI)</h2>
        {safeTopics.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-[#262626] rounded-lg text-sm text-[#a1a1a1]">No topics yet</div>
        ) : (
          <div className="space-y-4">
            {safeTopics.map((topic, index) => {
              const percentage = maxCalls > 0 ? (topic.calls / maxCalls) * 100 : 0;
              const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white">{topic.topic}</span>
                    <span className="text-sm text-[#a1a1a1] font-mono">{topic.calls} call{topic.calls !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="h-6 bg-[#262626] rounded overflow-hidden">
                    <div
                      className="h-full flex items-center justify-end pr-2"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: colors[index % colors.length],
                      }}
                    >
                      {/* {percentage > 20 && (
                        <span className="text-xs text-white font-medium">{topic.calls}</span>
                      )} */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Analytics;

