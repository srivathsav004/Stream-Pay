import React from 'react';
import Card from '@/components/ui/Card';
import { SpendingInsights as SpendingInsightsType } from './types';

interface SpendingInsightsProps {
  insights: SpendingInsightsType;
}

const SpendingInsights: React.FC<SpendingInsightsProps> = ({ insights }) => {
  return (
    <Card className="p-6 mb-8">
      <h2 className="text-lg font-semibold text-white mb-6">Spending Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 bg-[#0a0a0a] border-[#262626]">
          <div className="text-xs text-[#a1a1a1] uppercase mb-2">Average Daily Spending</div>
          <div className="text-2xl font-semibold text-white font-mono mb-1">
            {insights.avgDailySpending} AVAX
          </div>
          <div className="text-sm text-[#a1a1a1]">
            ${(insights.avgDailySpending * 40).toFixed(2)} USD
          </div>
        </Card>

        <Card className="p-4 bg-[#0a0a0a] border-[#262626]">
          <div className="text-xs text-[#a1a1a1] uppercase mb-2">Largest Transaction</div>
          <div className="text-2xl font-semibold text-white font-mono mb-1">
            {insights.largestTransaction.amount} AVAX
          </div>
          <div className="text-sm text-[#a1a1a1]">
            {insights.largestTransaction.type} • {insights.largestTransaction.date}
          </div>
        </Card>

        <Card className="p-4 bg-[#0a0a0a] border-[#262626]">
          <div className="text-xs text-[#a1a1a1] uppercase mb-2">Most Active Day</div>
          <div className="text-2xl font-semibold text-white mb-1">
            {insights.mostActiveDay}
          </div>
          <div className="text-sm text-[#a1a1a1]">
            {insights.avgOnMostActiveDay} AVAX avg
          </div>
        </Card>

        <Card className="p-4 bg-[#0a0a0a] border-[#262626]">
          <div className="text-xs text-[#a1a1a1] uppercase mb-2">Spending Trend</div>
          <div className="text-2xl font-semibold text-white mb-1">
            {insights.spendingTrend.direction === 'up' ? '↑' : '↓'} {insights.spendingTrend.percentage}%
          </div>
          <div className="text-sm text-[#a1a1a1]">
            vs last month
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default SpendingInsights;

