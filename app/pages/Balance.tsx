import React from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const Balance: React.FC = () => {
  return (
    <DashboardLayout>
      <h1 className="text-xl md:text-2xl font-semibold mb-4">Balance & Transactions</h1>

      <Card className="p-6 mb-6">
        <div className="text-center">
          <div className="text-3xl font-semibold">2.47 AVAX</div>
          <div className="text-zinc-500">$98.80 USD</div>
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="primary">Deposit AVAX</Button>
            <Button variant="outline">Withdraw AVAX</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="font-medium mb-2">Balance Breakdown</div>
          <div className="text-sm text-zinc-400 space-y-1">
            <div>Available: 2.47 AVAX</div>
            <div>Locked in Streams: 0.12 AVAX</div>
            <div>Total Deposited: 10 AVAX</div>
            <div>Total Spent: 7.41 AVAX</div>
            <div>Total Withdrawn: 0 AVAX</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="font-medium mb-2">Quick Actions</div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Button variant="secondary">Deposit 0.5 AVAX</Button>
            <Button variant="secondary">Deposit 1 AVAX</Button>
            <Button variant="secondary">Deposit 2 AVAX</Button>
            <Button variant="outline">Custom Amount</Button>
            <Button variant="outline">Withdraw All</Button>
          </div>
        </Card>
        <Card className="p-4">
          <div className="font-medium mb-2">Balance History</div>
          <div className="h-32 grid place-items-center text-zinc-500 text-sm">Area Chart Placeholder</div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">Transaction History</div>
          <Button variant="ghost" size="sm">Filter ▾</Button>
        </div>
        <div className="mt-3 text-sm divide-y divide-zinc-800">
          {[
            ['💰 Deposit', '2h ago', '+1.0 AVAX', '✅ Complete', '0x7a2b...'],
            ['💸 Payment', '2h ago', '-0.0425 AVAX', '✅ Complete', '0x9c4d...'],
            ['💸 Payment', '5h ago', '-0.001 AVAX', '✅ Complete', '0x1f8e...'],
            ['💰 Deposit', '1d ago', '+2.0 AVAX', '✅ Complete', '0x3b7a...'],
            ['💸 Payment', '1d ago', '-0.0312 AVAX', '✅ Complete', '0x5d2c...'],
            ['⏳ Withdraw', '2d ago', '-0.5 AVAX', '⏳ Pending', '0x8e9f...'],
          ].map((r, i) => (
            <div key={i} className="grid grid-cols-5 gap-2 py-2 text-zinc-300">
              <div>{r[0]}</div>
              <div className="text-zinc-500">{r[1]}</div>
              <div className="font-mono">{r[2]}</div>
              <div>{r[3]}</div>
              <div className="text-zinc-500">{r[4]}</div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default Balance;
