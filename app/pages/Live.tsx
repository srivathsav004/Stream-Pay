import React from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const Live: React.FC = () => {
  return (
    <DashboardLayout>
      <h1 className="text-xl md:text-2xl font-semibold mb-4">Live Streaming</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <div className="font-medium mb-2">Your Stats</div>
          <ul className="text-sm text-zinc-400 space-y-2 list-disc pl-5">
            <li>Total Streams: 12</li>
            <li>Total Viewers: 1,247</li>
            <li>Total Spent: 12.47 AVAX</li>
            <li>Avg Viewers: 104/stream</li>
          </ul>
        </Card>
        <Card className="p-4">
          <div className="font-medium mb-2">Pricing</div>
          <div className="text-sm text-zinc-400">Rate: 0.0001 AVAX/viewer/sec (~$0.24/viewer/hr)</div>
        </Card>
      </div>

      <Card className="p-4 mb-6">
        <div className="font-medium mb-2">Start New Stream</div>
        <div className="grid gap-3">
          <input className="rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm" placeholder="Stream Title" />
          <textarea className="rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm" placeholder="Description" />
          <div className="flex gap-2">
            <Button variant="primary">🔴 Go Live</Button>
            <Button variant="outline">Test Stream</Button>
          </div>
        </div>
      </Card>

      <Card className="p-4 mb-6">
        <div className="font-medium mb-2">Active Streams (0)</div>
        <div className="text-sm text-zinc-500">No active streams. Click "Go Live" to start streaming.</div>
      </Card>

      <Card className="p-4">
        <div className="font-medium mb-2">Past Streams</div>
        <div className="text-sm text-zinc-300 space-y-2">
          <div>Demo Stream 1 — 2d ago — 01:23:45 — 127 viewers — 1.27 AVAX</div>
          <div>Test Stream — 5d ago — 00:45:12 — 89 viewers — 0.89 AVAX</div>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default Live;
