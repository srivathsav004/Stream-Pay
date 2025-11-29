import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface StorageOverviewProps {
  usedGB: number;
  maxGB: number;
  hourlyCost: number;
  dailyCost: number;
  monthlyCost: number;
  balance: number;
  onDeposit: () => void;
}

const StorageOverview: React.FC<StorageOverviewProps> = ({
  usedGB,
  maxGB,
  hourlyCost,
  dailyCost,
  monthlyCost,
  balance,
  onDeposit,
}) => {
  const percentage = (usedGB / maxGB) * 100;
  const daysRemaining = Math.floor(balance / dailyCost);

  const chartData = [
    { name: 'Used', value: usedGB },
    { name: 'Available', value: Math.max(0, maxGB - usedGB) },
  ];

  const getColor = () => {
    if (percentage >= 95) return '#ef4444';
    if (percentage >= 80) return '#f59e0b';
    return '#3b82f6';
  };

  const getGlowColor = () => {
    if (percentage >= 95) return 'shadow-red-500/20';
    if (percentage >= 80) return 'shadow-amber-500/20';
    return 'shadow-blue-500/20';
  };

  const COLORS = [getColor(), '#262626'];

  return (
    <Card className="p-6 mb-8 bg-gradient-to-br from-[#141414] to-[#1a1a1a] border-[#2a2a2a] shadow-xl">
      <h2 className="text-lg font-semibold text-white mb-6 bg-gradient-to-r from-white to-[#a1a1a1] bg-clip-text text-transparent">Storage Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center justify-center md:col-span-2">
          <div className="relative w-72 h-72 mb-4">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-${getColor()}/20 to-transparent blur-xl ${getGlowColor()}`}></div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={125}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-semibold text-white drop-shadow-lg">{usedGB.toFixed(2)} GB</div>
              <div className="text-sm text-[#a1a1a1]">of {maxGB.toFixed(2)} GB</div>
              <div className="text-xs text-[#a1a1a1] mt-1 font-medium">{percentage.toFixed(1)}% used</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-white mb-4 bg-gradient-to-r from-white to-[#a1a1a1] bg-clip-text text-transparent">Current Costs</h3>
          <div className="space-y-4 mb-6">
            <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors">
              <div className="text-sm text-[#a1a1a1] mb-1">Hourly</div>
              <div className="text-xl font-semibold text-white font-mono">{hourlyCost.toFixed(6)} AVAX</div>
            </div>
            <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors">
              <div className="text-sm text-[#a1a1a1] mb-1">Daily</div>
              <div className="text-xl font-semibold text-white font-mono">{dailyCost.toFixed(6)} AVAX</div>
            </div>
            <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors">
              <div className="text-sm text-[#a1a1a1] mb-1">Monthly</div>
              <div className="text-xl font-semibold text-white font-mono">~{monthlyCost.toFixed(6)} AVAX</div>
            </div>
          </div>
          {daysRemaining < 10 && (
            <div className="p-3 bg-gradient-to-r from-amber-600/20 to-amber-600/10 border border-amber-600/50 rounded-lg mb-4 backdrop-blur-sm">
              <div className="text-sm text-amber-300 mb-1 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                Balance will last
              </div>
              <div className="text-sm font-medium text-white">~{daysRemaining} days</div>
            </div>
          )}
          <Button variant="primary" size="sm" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-900/30 border-blue-400/50" onClick={onDeposit}>
            Deposit AVAX
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default StorageOverview;

