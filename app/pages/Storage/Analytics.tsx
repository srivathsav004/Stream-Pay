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

// Pretty format numbers with unit MB
const formatMB = (mb: number) => {
  if (!isFinite(mb)) return '0 MB';
  return `${mb.toLocaleString('en-IN', { maximumFractionDigits: 0 })} MB`;
};

// Tooltip for Pie (Storage by File Type)
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const p = payload[0];
    const name = p?.name ?? p?.payload?.name ?? '';
    const valueGB = Number(p?.value ?? 0);
    const valueMB = Math.round(valueGB * 1024);
    const percent = p?.payload?.percentage ?? undefined;
    return (
      <div className="bg-[#0f0f0f]/95 border border-[#262626] rounded-lg px-3 py-2 shadow-xl">
        <div className="text-xs text-[#a1a1a1]">{name}</div>
        <div className="text-sm font-semibold text-white">
          {formatMB(valueMB)}{typeof percent === 'number' ? ` • ${percent}%` : ''}
        </div>
      </div>
    );
  }
  return null;
};

// Format USDC to 6 decimals
const formatUSDC6 = (n: number) => {
  const num = Number(n) || 0;
  return num.toLocaleString('en-IN', { minimumFractionDigits: 6, maximumFractionDigits: 6 });
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

  // Sort cost data in decreasing order for better visualization
  const sortedCostData = React.useMemo(() => 
    [...costData].sort((a, b) => b.cost - a.cost),
    [costData]
  );

  // Current total storage in MB (prefer latest time series point; fallback to sum of file types)
  const currentTotalMB = React.useMemo(() => {
    const latestGB = storageData && storageData.length ? Number(storageData[storageData.length - 1].storageGB) : null;
    const sumGB = chartData.reduce((acc, d) => acc + Number(d.value || 0), 0);
    const gb = isFinite(Number(latestGB)) && latestGB !== null ? Number(latestGB) : sumGB;
    return Math.round((gb || 0) * 1024);
  }, [storageData, chartData]);

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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="p-6 md:col-span-3">
          <h3 className="text-base font-semibold text-white mb-6">Storage by File Type</h3>
          <div className="h-80 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend wrapperStyle={{ color: '#ffffff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-sm text-[#a1a1a1] text-center">Total: {formatMB(currentTotalMB)}</div>
        </Card>

        <Card className="p-5 md:col-span-2">
          <h3 className="text-base font-semibold text-white mb-6">Cost by File Type</h3>
          <div className="space-y-5">
            {sortedCostData.map((item, index) => {
              const maxCost = Math.max(...sortedCostData.map(d => d.cost));
              const percentage = (item.cost / maxCost) * 100;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-white">{item.name}</span>
                    <span className="text-sm text-[#a1a1a1] font-mono">{formatUSDC6(item.cost)} USDC</span>
                  </div>
                  <div className="h-8 bg-[#262626] rounded overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    >
                      {/* Intentionally no text inside the bar */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Cost Analysis */}
      {/* <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Cost Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-4 bg-[#0a0a0a] border-[#262626]">
            <div className="text-xs text-[#a1a1a1] uppercase mb-2">This Week</div>
            <div className="text-2xl font-semibold text-white font-mono mb-1">
              {costBreakdown.thisWeek.cost} USDC
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
              {costBreakdown.thisMonth.cost} USDC
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
              {costBreakdown.mostExpensiveFile.size} MB • {costBreakdown.mostExpensiveFile.cost} USDC
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
      </Card> */}
    </div>
  );
};

export default Analytics;

