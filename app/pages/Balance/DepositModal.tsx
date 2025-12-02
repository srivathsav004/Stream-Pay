import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Separator from '@/components/ui/Separator';

interface DepositModalProps {
  isOpen: boolean;
  currentBalance: number;
  quickAmount?: number | null;
  onClose: () => void;
  onDeposit: (amount: number) => void;
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  currentBalance,
  quickAmount,
  onClose,
  onDeposit,
}) => {
  const [amount, setAmount] = useState(quickAmount || 1.0);

  useEffect(() => {
    if (quickAmount) {
      setAmount(quickAmount);
    }
  }, [quickAmount]);
  const quickAmounts = [0.5, 1.0, 2.0, 5.0];

  if (!isOpen) return null;

  const handleDeposit = () => {
    onDeposit(amount);
    onClose();
  };

  const estimateUsage = (USDC: number) => {
    return {
      videoHours: Math.floor(USDC / 0.0001 / 3600),
      aiCalls: Math.floor(USDC / 0.001),
      storageDays: Math.floor(USDC / (0.00001 * 1024 * 24)),
    };
  };

  const usage = estimateUsage(amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#262626]">
          <h2 className="text-lg font-semibold text-white">Deposit USDC</h2>
          <button
            onClick={onClose}
            className="text-[#a1a1a1] hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm text-[#a1a1a1] mb-2">Amount (USDC)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="flex-1 bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-lg text-white font-mono"
                step="0.1"
                min="0"
              />
              <span className="text-lg text-white font-mono">USDC</span>
            </div>
            <div className="text-sm text-[#a1a1a1] mt-2">
              ≈ ${(amount * 40).toFixed(2)} USD
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-[#a1a1a1] mb-3">Quick amounts:</div>
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount)}
                  className={amount === quickAmount ? 'border-blue-600' : ''}
                >
                  {quickAmount}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="mb-6">
            <div className="text-sm font-medium text-white mb-3">This will last approximately:</div>
            <div className="space-y-2 text-sm text-[#a1a1a1]">
              <div>• Video Streaming: ~{usage.videoHours} hours</div>
              <div>• AI Assistant: ~{usage.aiCalls.toLocaleString()} calls</div>
              <div>• Cloud Storage: ~{usage.storageDays} days (1GB)</div>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[#a1a1a1]">Current Balance:</span>
              <span className="text-sm font-semibold text-white">{currentBalance} USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#a1a1a1]">After Deposit:</span>
              <span className="text-sm font-semibold text-white">{currentBalance + amount} USDC</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" className="flex-1" onClick={handleDeposit}>
              Deposit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;

