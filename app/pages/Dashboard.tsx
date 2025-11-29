import React from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/app/layout/PageHeader';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Dashboard" right={<Button variant="outline" size="sm">Last 7 Days ▾</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { title: 'Balance', value: '2.47 AVAX', sub: '$98.80', cta: 'Deposit' },
          { title: 'Spent', value: '1.23 AVAX', sub: 'This month', cta: '+12% ↑' },
          { title: 'Saved', value: '$35.77', sub: 'vs subs', cta: '68% less' },
          { title: 'Active', value: '2 Streams', sub: 'Running now', cta: 'View' },
        ].map((card) => (
          <Card key={card.title} className="p-4">
            <div className="text-sm text-zinc-400 mb-2">{card.title}</div>
            <div className="text-lg font-semibold">{card.value}</div>
            <div className="text-xs text-zinc-500">{card.sub}</div>
            <div className="mt-3"><Badge variant="secondary">{card.cta}</Badge></div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 xl:col-span-2">
          <div className="font-medium mb-2">Spending Overview</div>
          <div className="h-56 grid place-items-center text-zinc-500 text-sm">Area Chart Placeholder</div>
        </Card>
        <Card className="p-4">
          <div className="font-medium mb-2">Service Usage</div>
          <div className="h-56 grid place-items-center text-zinc-500 text-sm">Donut Chart Placeholder</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <div className="font-medium mb-2">AI Insights</div>
          <ul className="text-sm text-zinc-400 space-y-2 list-disc pl-5">
            <li>On track to spend 3.47 AVAX this month</li>
            <li>68% cheaper than traditional subscriptions</li>
            <li>Usage peaks on weekends</li>
            <li>Tip: Deposit 1 AVAX to avoid running low</li>
          </ul>
        </Card>
        <Card className="p-4">
          <div className="font-medium mb-2">Active Streams (2)</div>
          <div className="space-y-3 text-sm text-zinc-300">
            <div className="flex items-center justify-between">
              <div>🎥 Video Streaming</div>
              <div className="text-zinc-400">0.0425 AVAX</div>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full w-3/4 bg-blue-600" /></div>

            <div className="flex items-center justify-between">
              <div>🤖 AI Assistant</div>
              <div className="text-zinc-400">0.047 AVAX</div>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full w-full bg-blue-600" /></div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">Recent Activity</div>
          <Button variant="ghost" size="sm">View All →</Button>
        </div>
        <div className="mt-3 text-sm divide-y divide-zinc-800">
          {[
            ['🎥 Video Stream', '2h ago', '00:42:15', '0.0425 AVAX'],
            ['🤖 AI API Call', '5h ago', '1 call', '0.001 AVAX'],
            ['💾 Storage Upload', '1d ago', '24h', '0.0024 AVAX'],
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between py-2 text-zinc-300">
              <div>{r[0]}</div>
              <div className="text-zinc-500">{r[1]}</div>
              <div className="text-zinc-500">{r[2]}</div>
              <div className="font-mono">{r[3]}</div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default Dashboard;
