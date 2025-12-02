import React from 'react';
import Card from '@/components/ui/Card';
import Separator from '@/components/ui/Separator';
import { CostBreakdown as CostBreakdownType } from './types';

interface CostBreakdownProps {
  data: CostBreakdownType;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({ data }) => {
  return (
    <Card className="p-6 mb-8">
      <h2 className="text-lg font-semibold text-white mb-6">Cost Breakdown</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-4 bg-[#0a0a0a] border-[#262626]">
          <div className="text-xs text-[#a1a1a1] uppercase mb-2">This Week</div>
          <div className="text-2xl font-semibold text-white font-mono mb-1">
            {data.thisWeek.cost} USDC
          </div>
          <div className="text-sm text-[#a1a1a1] mb-3">
            ${(data.thisWeek.cost * 40).toFixed(2)} USD
          </div>
          <div className="text-sm text-[#a1a1a1]">{data.thisWeek.calls} calls</div>
          <div className="text-sm text-[#a1a1a1]">{data.thisWeek.sessions} sessions</div>
        </Card>

        <Card className="p-4 bg-[#0a0a0a] border-[#262626]">
          <div className="text-xs text-[#a1a1a1] uppercase mb-2">This Month</div>
          <div className="text-2xl font-semibold text-white font-mono mb-1">
            {data.thisMonth.cost} USDC
          </div>
          <div className="text-sm text-[#a1a1a1] mb-3">
            ${(data.thisMonth.cost * 40).toFixed(2)} USD
          </div>
          <div className="text-sm text-[#a1a1a1]">{data.thisMonth.calls} calls</div>
          <div className="text-sm text-[#a1a1a1]">{data.thisMonth.sessions} sessions</div>
        </Card>
      </div>

      <Separator className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 bg-[#0a0a0a] border-[#262626]">
          <div className="text-xs text-[#a1a1a1] uppercase mb-2">Average Cost/Session</div>
          <div className="text-2xl font-semibold text-white font-mono mb-1">
            {data.avgCostPerSession} USDC
          </div>
          <div className="text-sm text-[#a1a1a1]">
            ${(data.avgCostPerSession * 40).toFixed(2)} USD
          </div>
        </Card>

        <Card className="p-4 bg-[#0a0a0a] border-[#262626]">
          <div className="text-xs text-[#a1a1a1] uppercase mb-2">Average Calls/Day</div>
          <div className="text-2xl font-semibold text-white font-mono mb-1">
            {data.avgCallsPerDay} calls
          </div>
          <div className="text-sm text-[#a1a1a1]">Per day</div>
        </Card>
      </div>
    </Card>
  );
};

export default CostBreakdown;

