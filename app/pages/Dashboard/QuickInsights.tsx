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
  const hasSpending = (spendingData && spendingData.length > 0);
  const hasService = (serviceUsageData && serviceUsageData.length > 0);
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Insights (Mock UI)</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 border-blue-600">
          <div className="text-sm font-medium text-white mb-2"> Spending Trend</div>
          <p className="text-sm text-[#a1a1a1] mb-3">
            {hasSpending ? 'Recent spending activity' : 'No spending data yet'}
          </p>
          <div className="h-16 mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendingData || []}>
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm font-medium text-white mb-2"> Usage Pattern</div>
          <p className="text-sm text-[#a1a1a1] mb-3">
            {hasService ? 'Most used services' : 'No service usage yet'}
          </p>
          <div className="h-16 mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceUsageData || []}>
                <Bar dataKey="percentage" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 border-amber-600">
          <div className="text-sm font-medium text-white mb-2"> Balance</div>
          <p className="text-sm text-[#a1a1a1] mb-3">
            Manage your escrow balance and deposits.
          </p>
          <Button variant="outline" size="sm" className="w-full mt-2">Manage Balance</Button>
        </Card>
      </div>
    </Card>
  );
};

export default QuickInsights;

