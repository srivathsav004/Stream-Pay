import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface QuickActionsProps {
  onDeposit: () => void;
  onWithdraw: () => void;
  onStopAll: () => void;
  onExport: () => void;
  onQuickDeposit: (amount: number) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onDeposit,
  onWithdraw,
  onStopAll,
  onExport,
  onQuickDeposit,
}) => {
  const quickAmounts = [0.5, 1.0, 2.0, 5.0];

  return (
    <Card className="p-6 mb-8">
      <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-[#0a0a0a] border-[#262626] hover:border-blue-600 cursor-pointer" onClick={onDeposit}>
          <div className="text-center">
            <div className="text-2xl mb-2">💰</div>
            <div className="text-sm font-medium text-white mb-1">Deposit</div>
            <div className="text-xs text-[#a1a1a1]">Add USDC</div>
          </div>
        </Card>

        <Card className="p-4 bg-[#0a0a0a] border-[#262626] hover:border-blue-600 cursor-pointer" onClick={onWithdraw}>
          <div className="text-center">
            <div className="text-2xl mb-2">💵</div>
            <div className="text-sm font-medium text-white mb-1">Withdraw</div>
            <div className="text-xs text-[#a1a1a1]">Remove USDC</div>
          </div>
        </Card>

        <Card className="p-4 bg-[#0a0a0a] border-[#262626] hover:border-blue-600 cursor-pointer" onClick={onStopAll}>
          <div className="text-center">
            <div className="text-2xl mb-2">⏹️</div>
            <div className="text-sm font-medium text-white mb-1">Stop All</div>
            <div className="text-xs text-[#a1a1a1]">Stop Streams</div>
          </div>
        </Card>

        <Card className="p-4 bg-[#0a0a0a] border-[#262626] hover:border-blue-600 cursor-pointer" onClick={onExport}>
          <div className="text-center">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-white mb-1">Export</div>
            <div className="text-xs text-[#a1a1a1]">Export CSV</div>
          </div>
        </Card>
      </div>

      <div>
        <div className="text-sm text-[#a1a1a1] mb-3">Suggested Amounts:</div>
        <div className="flex flex-wrap gap-2">
          {quickAmounts.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => onQuickDeposit(amount)}
            >
              {amount} USDC
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={onDeposit}>
            Custom
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QuickActions;

