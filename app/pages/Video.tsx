import React from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PageHeader from '@/app/layout/PageHeader';

const Video: React.FC = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Video Streaming" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <div className="font-medium mb-2">Your Stats</div>
          <ul className="text-sm text-zinc-400 space-y-2 list-disc pl-5">
            <li>Total Watched: 12.5 hours</li>
            <li>Total Spent: 4.5 AVAX</li>
            <li>Avg Session: 45 min</li>
            <li>Last Used: 2 hours ago</li>
          </ul>
        </Card>
        <Card className="p-4">
          <div className="font-medium mb-2">Pricing</div>
          <div className="text-sm text-zinc-400">Rate: 0.0001 AVAX/sec (~$0.24/hr)</div>
        </Card>
      </div>

      <Card className="p-4 mb-6">
        <div className="h-64 grid place-items-center text-zinc-500">Demo Video Player</div>
        <div className="mt-3 flex items-center gap-2">
          <Button variant="secondary">▶️ Play</Button>
          <Button variant="outline">⏸️ Pause</Button>
          <Button variant="outline">⏹️ Stop</Button>
        </div>
      </Card>

      <Card className="p-4 mb-6">
        <div className="font-medium mb-2">Current Session</div>
        <div className="text-sm text-zinc-400">Status: ⚫ Not Started</div>
        <div className="mt-3"><Button variant="primary">Start Watching</Button></div>
      </Card>

      <Card className="p-4">
        <div className="font-medium mb-2">Usage History (Last 10 Sessions)</div>
        <div className="text-sm text-zinc-300 space-y-2">
          <div>2h ago — 00:42:15 — 0.0425 AVAX — Sample Video 1</div>
          <div>1d ago — 00:31:12 — 0.0312 AVAX — Sample Video 2</div>
          <div>2d ago — 01:05:33 — 0.0655 AVAX — Sample Video 1</div>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default Video;
