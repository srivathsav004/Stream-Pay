import React from 'react';
import Card from '@/components/ui/Card';
import { AccountStats } from './types';

interface AccountStatisticsProps {
  stats: AccountStats;
}

const AccountStatistics: React.FC<AccountStatisticsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Total Spent</div>
        <div className="text-3xl font-semibold text-white font-mono mb-1">{stats.totalSpent} AVAX</div>
        <div className="text-sm text-[#a1a1a1]">${(stats.totalSpent * 40).toFixed(2)}</div>
      </Card>

      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Services Used</div>
        <div className="text-3xl font-semibold text-white font-mono mb-1">{stats.servicesUsed} services</div>
        <div className="text-sm text-[#a1a1a1]">All time</div>
      </Card>

      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Active Days</div>
        <div className="text-3xl font-semibold text-white font-mono mb-1">{stats.activeDays} days</div>
        <div className="text-sm text-[#a1a1a1]">This month</div>
      </Card>

      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Transactions</div>
        <div className="text-3xl font-semibold text-white font-mono mb-1">{stats.transactions}</div>
        <div className="text-sm text-[#a1a1a1]">All time</div>
      </Card>
    </div>
  );
};

export default AccountStatistics;

