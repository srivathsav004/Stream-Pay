import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import { SpendingData, ServiceUsageData } from './types';

interface QuickInsightsProps {
  spendingData: SpendingData[];
  serviceUsageData: ServiceUsageData[];
}

const QuickInsights: React.FC<QuickInsightsProps> = ({ spendingData, serviceUsageData }) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 border-blue-600">
          <div className="text-sm font-medium text-white mb-2"> Spending Trend</div>
          <p className="text-sm text-[#a1a1a1] mb-3">
            You've spent 1.23 USDC this month so far. At this rate, you'll spend ~3.47 USDC by month end.
          </p>
          <div className="h-16 mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendingData}>
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm font-medium text-white mb-2"> Usage Pattern</div>
          <p className="text-sm text-[#a1a1a1] mb-3">
            Your most active time: Weekday evenings (6-10 PM). Your most used service: Video Streaming (60%).
          </p>
          <div className="h-16 mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceUsageData}>
                <Bar dataKey="percentage" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 border-amber-600">
          <div className="text-sm font-medium text-white mb-2"> Balance Alert</div>
          <p className="text-sm text-[#a1a1a1] mb-3">
            Your current balance (2.47 USDC) will last approximately 8 days at your current usage rate.
          </p>
          <Button variant="outline" size="sm" className="w-full mt-2">Deposit USDC</Button>
        </Card>
      </div>
    </Card>
  );
};

export default QuickInsights;

