import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Separator from '@/components/ui/Separator';
import { useToast } from '@/components/ui/use-toast';
import { useAccount, useWriteContract, useConfig } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { parseUnits } from 'viem';
import { STREAMPAY_ESCROW_ABI } from '@/app/shared/contracts/streampayEscrow';
import { STREAMPAY_ESCROW_ADDRESS } from '@/app/shared/contracts/config';
import { recordWithdrawTx } from '@/app/shared/services/web2-services/transactions';

interface WithdrawModalProps {
  isOpen: boolean;
  availableBalance: number;
  lockedBalance: number;
  onClose: () => void;
  onWithdrawComplete?: (amount: number, newBalance: number) => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  availableBalance,
  lockedBalance,
  onClose,
  onWithdrawComplete,
}) => {
  const [amount, setAmount] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const { toast } = useToast();
  const { address, chainId } = (useAccount as any)() || { address: undefined, chainId: undefined };
  const { writeContractAsync } = (useWriteContract as any)();
  const config = (useConfig as any)();

  useEffect(() => {
    if (!isOpen) {
      setLoading(false);
      setStatus(null);
      setAmount(0.5);
    }
  }, [isOpen]);

  const handleWithdraw = async () => {
    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    if (amount > availableBalance) {
      toast({
        title: "Insufficient balance",
        description: `Available: ${availableBalance} USDC`,
        variant: "destructive",
      });
      return;
    }
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      setStatus('Preparing transaction...');
      
      if (!STREAMPAY_ESCROW_ADDRESS) throw new Error('Escrow not configured');
      if (chainId !== avalancheFuji.id) throw new Error('Switch to Avalanche Fuji');

      const value = (parseUnits as any)(String(amount), 6);
      const escrowAddress = STREAMPAY_ESCROW_ADDRESS as `0x${string}`;

      setStatus('Withdrawing from escrow...');
      const withdrawHash = await writeContractAsync({
        address: escrowAddress,
        abi: STREAMPAY_ESCROW_ABI,
        functionName: 'withdraw',
        args: [value],
      });
      const { waitForTransactionReceipt } = await import('wagmi/actions');
      await waitForTransactionReceipt(config, { hash: withdrawHash });

      setStatus('Recording transaction...');
      await recordWithdrawTx({
        user_address: address,
        amount_usdc: amount,
        tx_hash: String(withdrawHash),
      });

      const newBalance = availableBalance - amount;
      toast({
        title: "Withdrawal successful",
        description: `Withdrew ${amount} USDC successfully`,
      });
      
      onWithdrawComplete?.(amount, newBalance);
      setTimeout(() => {
        onClose();
        setLoading(false);
        setStatus(null);
      }, 500);
    } catch (err: any) {
      const errorMsg = err?.message || 'Withdrawal failed';
      setStatus(null);
      toast({
        title: "Withdrawal failed",
        description: errorMsg,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleWithdrawAll = () => {
    if (availableBalance <= 0) {
      toast({
        title: "No balance available",
        description: "No available balance to withdraw",
        variant: "destructive",
      });
      return;
    }
    setAmount(availableBalance);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0a0a0a] border border-[#262626] rounded-lg w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
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
          </div>

          <div className="mb-6">
            <Button variant="outline" size="sm" onClick={handleWithdrawAll}>
              Withdraw All Available
            </Button>
          </div>

          <Separator className="mb-6" />
{/* 
          <div className="mb-6 p-4 bg-amber-600/10 border border-amber-600/50 rounded-lg">
            <div className="text-sm font-medium text-amber-300 mb-2">⚠️ Important:</div>
            <div className="space-y-1 text-sm text-[#a1a1a1]">
              <div>• You have {lockedBalance} USDC locked in active streams</div>
              <div>• Stop streams first to withdraw locked funds</div>
              <div>• Withdrawal may take a few minutes to process</div>
            </div>
          </div> */}
{/* 
          <Separator className="mb-6" /> */}

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

          {status && (
            <div className="mb-4 p-3 bg-blue-600/10 border border-blue-600/50 rounded-lg">
              <div className="text-sm text-blue-300">{status}</div>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={handleWithdraw}
              loading={loading}
              disabled={amount > availableBalance || amount <= 0 || loading}
            >
              Withdraw
            </Button>
          </div>
        </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WithdrawModal;

