import React from 'react';
import Card from '@/components/ui/Card';

interface AIStatsProps {
  totalSpent: number;
  totalCalls: number;
  avgPerCall: number;
  thisMonth: number;
}

const AIStats: React.FC<AIStatsProps> = ({
  totalSpent,
  totalCalls,
  avgPerCall,
  thisMonth,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Total Spent</div>
        <div className="text-3xl font-semibold text-white font-mono">{totalSpent} USDC</div>
      </Card>

      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Total Calls</div>
        <div className="text-3xl font-semibold text-white font-mono">{totalCalls} calls</div>
      </Card>

      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Avg Per Call</div>
        <div className="text-3xl font-semibold text-white font-mono">{avgPerCall} USDC</div>
      </Card>

      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">This Month</div>
        <div className="text-3xl font-semibold text-white font-mono">{thisMonth} calls</div>
      </Card>
    </div>
  );
};

export default AIStats;

