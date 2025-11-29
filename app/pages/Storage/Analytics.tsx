import React from 'react';
import Card from '@/components/ui/Card';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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
import { AnalyticsData, FileTypeData, CostBreakdown } from './types';

interface AnalyticsProps {
  storageData: AnalyticsData[];
  fileTypeData: FileTypeData[];
  costBreakdown: CostBreakdown;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 shadow-lg">
        <p className="text-sm text-[#a1a1a1] mb-1">{payload[0].payload.date}</p>
        <p className="text-sm font-semibold text-white">
          Storage: {payload[0].value} GB
        </p>
      </div>
    );
  }
  return null;
};

const Analytics: React.FC<AnalyticsProps> = ({ storageData, fileTypeData, costBreakdown }) => {
  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'];

  const chartData = fileTypeData.map(ft => ({
    name: ft.type,
    value: ft.storageGB,
    percentage: ft.percentage,
  }));

  const costData = fileTypeData.map(ft => ({
    name: ft.type,
    cost: ft.cost,
  }));

  return (
    <div className="space-y-6 mb-8">
      {/* Storage Usage Over Time */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Storage Usage Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={storageData}>
            <defs>
              <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis dataKey="date" stroke="#a1a1a1" style={{ fontSize: '12px' }} />
            <YAxis stroke="#a1a1a1" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="storageGB"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorStorage)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* File Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-base font-semibold text-white mb-6">Storage by File Type</h3>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ color: '#ffffff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-sm text-[#a1a1a1] text-center">Total: 1.2 GB</div>
        </Card>

        <Card className="p-6">
          <h3 className="text-base font-semibold text-white mb-6">Cost by File Type</h3>
          <div className="space-y-4">
            {costData.map((item, index) => {
              const maxCost = Math.max(...costData.map(d => d.cost));
              const percentage = (item.cost / maxCost) * 100;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white">{item.name}</span>
                    <span className="text-sm text-[#a1a1a1] font-mono">{item.cost} AVAX</span>
                  </div>
                  <div className="h-6 bg-[#262626] rounded overflow-hidden">
                    <div
                      className="h-full flex items-center justify-end pr-2"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    >
                      {percentage > 20 && (
                        <span className="text-xs text-white font-medium">{item.cost}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Cost Analysis */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Cost Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-4 bg-[#0a0a0a] border-[#262626]">
            <div className="text-xs text-[#a1a1a1] uppercase mb-2">This Week</div>
            <div className="text-2xl font-semibold text-white font-mono mb-1">
              {costBreakdown.thisWeek.cost} AVAX
            </div>
            <div className="text-sm text-[#a1a1a1] mb-3">
              ${(costBreakdown.thisWeek.cost * 40).toFixed(2)} USD
            </div>
            <div className="text-sm text-[#a1a1a1]">Avg Storage: {costBreakdown.thisWeek.avgStorage} GB</div>
            <div className="text-sm text-[#a1a1a1]">Files Added: {costBreakdown.thisWeek.filesAdded}</div>
            <div className="text-sm text-[#a1a1a1]">Files Deleted: {costBreakdown.thisWeek.filesDeleted}</div>
          </Card>

          <Card className="p-4 bg-[#0a0a0a] border-[#262626]">
            <div className="text-xs text-[#a1a1a1] uppercase mb-2">This Month</div>
            <div className="text-2xl font-semibold text-white font-mono mb-1">
              {costBreakdown.thisMonth.cost} AVAX
            </div>
            <div className="text-sm text-[#a1a1a1] mb-3">
              ${(costBreakdown.thisMonth.cost * 40).toFixed(2)} USD
            </div>
            <div className="text-sm text-[#a1a1a1]">Avg Storage: {costBreakdown.thisMonth.avgStorage} GB</div>
            <div className="text-sm text-[#a1a1a1]">Files Added: {costBreakdown.thisMonth.filesAdded}</div>
            <div className="text-sm text-[#a1a1a1]">Files Deleted: {costBreakdown.thisMonth.filesDeleted}</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 bg-[#0a0a0a] border-[#262626]">
            <div className="text-xs text-[#a1a1a1] uppercase mb-2">Most Expensive File</div>
            <div className="text-lg font-semibold text-white mb-1">
              {costBreakdown.mostExpensiveFile.name}
            </div>
            <div className="text-sm text-[#a1a1a1]">
              {costBreakdown.mostExpensiveFile.size} MB • {costBreakdown.mostExpensiveFile.cost} AVAX
            </div>
          </Card>

          <Card className="p-4 bg-[#0a0a0a] border-[#262626]">
            <div className="text-xs text-[#a1a1a1] uppercase mb-2">Longest Stored File</div>
            <div className="text-lg font-semibold text-white mb-1">
              {costBreakdown.longestStoredFile.name}
            </div>
            <div className="text-sm text-[#a1a1a1]">
              {costBreakdown.longestStoredFile.size} MB • {costBreakdown.longestStoredFile.hours} hours
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;

