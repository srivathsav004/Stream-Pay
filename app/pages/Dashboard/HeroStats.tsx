import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const HeroStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Balance</div>
        <div className="text-3xl font-semibold text-white mb-1">2.47 AVAX</div>
        <div className="text-sm text-[#a1a1a1] mb-4">$98.80 USD</div>
        <Button variant="outline" size="sm" className="w-full">Deposit</Button>
      </Card>

      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Spent This Month</div>
        <div className="text-3xl font-semibold text-white mb-1">1.23 AVAX</div>
        <div className="text-sm text-[#a1a1a1] mb-4">$49.20 USD</div>
        <div className="text-sm text-[#10b981]">+12% from last month ↑</div>
      </Card>

      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Total Sessions</div>
        <div className="text-3xl font-semibold text-white mb-1">127</div>
        <div className="text-sm text-[#a1a1a1] mb-4">Across all services</div>
        <div className="text-sm text-[#a1a1a1]">Avg: 18 sessions/week</div>
      </Card>

      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Active Streams</div>
        <div className="text-3xl font-semibold text-white mb-1">2</div>
        <div className="text-sm text-[#a1a1a1] mb-4">Running now</div>
        <Button variant="ghost" size="sm" className="text-blue-600">View Details →</Button>
      </Card>
    </div>
  );
};

export default HeroStats;

