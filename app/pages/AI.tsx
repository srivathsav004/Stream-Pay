import React from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const AI: React.FC = () => {
  return (
    <DashboardLayout>
      <h1 className="text-xl md:text-2xl font-semibold mb-4">AI Assistant</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <div className="font-medium mb-2">Your Stats</div>
          <ul className="text-sm text-zinc-400 space-y-2 list-disc pl-5">
            <li>Total Calls: 247</li>
            <li>Total Spent: 0.247 AVAX</li>
            <li>Avg/Day: 12 calls</li>
            <li>Last Used: 5 hours ago</li>
          </ul>
        </Card>
        <Card className="p-4">
          <div className="font-medium mb-2">Pricing</div>
          <div className="text-sm text-zinc-400">Rate: 0.001 AVAX/call (~$0.04)</div>
        </Card>
      </div>

      <Card className="p-4 mb-6">
        <div className="font-medium mb-3">AI Chat Interface</div>
        <div className="h-48 grid place-items-center text-zinc-500 text-sm">Chat Area Placeholder</div>
        <div className="mt-3 flex gap-2">
          <input className="flex-1 rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none" placeholder="Type your message..." />
          <Button variant="primary">Send</Button>
        </div>
        <div className="mt-2 text-xs text-zinc-500">Each message costs 0.001 AVAX (~$0.04)</div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="font-medium mb-2">Session Stats</div>
          <div className="text-sm text-zinc-400 space-y-1">
            <div>Calls This Session: 5</div>
            <div>Cost This Session: 0.005 AVAX</div>
            <div>Remaining Balance: 2.465 AVAX (493 calls)</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="font-medium mb-2">Usage History</div>
          <div className="h-40 grid place-items-center text-zinc-500 text-sm">Bar Chart Placeholder</div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AI;
