import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { BalanceBreakdown } from './types';

interface BalanceOverviewProps {
  balance: number;
  breakdown: BalanceBreakdown;
  isLoading?: boolean;
  onDeposit: () => void;
  onWithdraw: () => void;
}

import Skeleton from '@/components/ui/Skeleton';

const BalanceOverview: React.FC<BalanceOverviewProps> = ({
  balance,
  breakdown,
  isLoading,
  onDeposit,
  onWithdraw,
}) => {
  return (
    <div className="mb-8">
      <Card className="p-8 mb-6">
        <div className="text-center">
          <div className="text-sm text-[#a1a1a1] mb-2">Current Balance</div>
          {isLoading ? (
            <Skeleton className="h-16 w-48 mx-auto mb-2" />
          ) : (
            <div className="text-5xl font-semibold text-white mb-2 font-mono">{balance.toFixed(2)} USDC</div>
          )}
          <div className="flex justify-center gap-3 mt-6">
            <Button
              variant="primary"
              size="md"
              onClick={onDeposit}
              disabled={isLoading}
            >
              Deposit
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={onWithdraw}
              disabled={isLoading}
            >
              Withdraw
            </Button>
          </div>
        </div>
      </Card>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="p-6" hoverEffect={true}>
          <div className="text-sm text-[#a1a1a1] mb-2">Available</div>
          <div className="text-2xl font-semibold text-white font-mono mb-1">{breakdown.available} USDC</div>
          <div className="text-xs text-[#a1a1a1]">Free to use</div>
        </Card>

        <Card className="p-6" hoverEffect={true}>
          <div className="text-sm text-[#a1a1a1] mb-2">Locked</div>
          <div className="text-2xl font-semibold text-white font-mono mb-1">{breakdown.locked} USDC</div>
          <div className="text-xs text-[#a1a1a1]">In streams</div>
        </Card>

        <Card className="p-6" hoverEffect={true}>
          <div className="text-sm text-[#a1a1a1] mb-2">Total In</div>
          <div className="text-2xl font-semibold text-white font-mono mb-1">{breakdown.totalIn} USDC</div>
          <div className="text-xs text-[#a1a1a1]">Deposited</div>
        </Card>

        <Card className="p-6" hoverEffect={true}>
          <div className="text-sm text-[#a1a1a1] mb-2">Total Out</div>
          <div className="text-2xl font-semibold text-white font-mono mb-1">{breakdown.totalOut} USDC</div>
          <div className="text-xs text-[#a1a1a1]">Spent+Withdrawn</div>
        </Card>
      </div> */}
    </div>
  );
};

export default BalanceOverview;

