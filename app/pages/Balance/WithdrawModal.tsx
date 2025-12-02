import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Separator from '@/components/ui/Separator';

interface WithdrawModalProps {
  isOpen: boolean;
  availableBalance: number;
  lockedBalance: number;
  onClose: () => void;
  onWithdraw: (amount: number) => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  availableBalance,
  lockedBalance,
  onClose,
  onWithdraw,
}) => {
  const [amount, setAmount] = useState(0.5);

  if (!isOpen) return null;

  const handleWithdraw = () => {
    if (amount <= availableBalance) {
      onWithdraw(amount);
      onClose();
    }
  };

  const handleWithdrawAll = () => {
    setAmount(availableBalance);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#262626]">
          <h2 className="text-lg font-semibold text-white">Withdraw USDC</h2>
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
                max={availableBalance}
              />
              <span className="text-lg text-white font-mono">USDC</span>
            </div>
            <div className="text-sm text-[#a1a1a1] mt-2">
              ≈ ${(amount * 40).toFixed(2)} USD
            </div>
          </div>

          <div className="mb-6">
            <Button variant="outline" size="sm" onClick={handleWithdrawAll}>
              Withdraw All Available
            </Button>
          </div>

          <Separator className="mb-6" />

          <div className="mb-6 p-4 bg-amber-600/10 border border-amber-600/50 rounded-lg">
            <div className="text-sm font-medium text-amber-300 mb-2">⚠️ Important:</div>
            <div className="space-y-1 text-sm text-[#a1a1a1]">
              <div>• You have {lockedBalance} USDC locked in active streams</div>
              <div>• Stop streams first to withdraw locked funds</div>
              <div>• Withdrawal may take a few minutes to process</div>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[#a1a1a1]">Available Balance:</span>
              <span className="text-sm font-semibold text-white">{availableBalance} USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#a1a1a1]">After Withdrawal:</span>
              <span className="text-sm font-semibold text-white">{availableBalance - amount} USDC</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={handleWithdraw}
              disabled={amount > availableBalance || amount <= 0}
            >
              Withdraw
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;

