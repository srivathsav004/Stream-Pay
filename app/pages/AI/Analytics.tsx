import React from 'react';
import Card from '@/components/ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AnalyticsData, TopicData } from './types';

interface AnalyticsProps {
  callsData: AnalyticsData[];
  topicData: TopicData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 shadow-lg">
        <p className="text-sm text-[#a1a1a1] mb-1">{payload[0].payload.date}</p>
        <p className="text-sm font-semibold text-white">
          Calls: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const Analytics: React.FC<AnalyticsProps> = ({ callsData, topicData }) => {
  const safeCalls = callsData || [];
  const safeTopics = topicData || [];
  const maxCalls = safeTopics.length > 0 ? Math.max(...safeTopics.map(t => t.calls)) : 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">
      <Card className="p-6 xl:col-span-3">
        <h2 className="text-lg font-semibold text-white mb-6">API Calls Over Time</h2>
        {safeCalls.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-[#262626] rounded-lg">
            <div className="text-4xl mb-2">📉</div>
            <div className="text-white font-medium mb-1">No call data</div>
            <div className="text-sm text-[#a1a1a1]">Make some AI calls to see activity here.</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={safeCalls}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="date" stroke="#a1a1a1" style={{ fontSize: '12px' }} />
              <YAxis stroke="#a1a1a1" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="calls" fill="#3b82f6" />
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
                    <span className="text-sm text-[#a1a1a1] font-mono">{topic.calls} calls</span>
                  </div>
                  <div className="h-6 bg-[#262626] rounded overflow-hidden">
                    <div
                      className="h-full flex items-center justify-end pr-2"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: colors[index % colors.length],
                      }}
                    >
                      {percentage > 20 && (
                        <span className="text-xs text-white font-medium">{topic.calls}</span>
                      )}
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

