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
import { ERC20_ABI, FUJI_USDC_ADDRESS } from '@/app/shared/contracts/erc20';
import { recordDepositTx } from '@/app/shared/services/web2-services/transactions';

interface DepositModalProps {
  isOpen: boolean;
  currentBalance: number;
  quickAmount?: number | null;
  onClose: () => void;
  onDepositComplete?: (amount: number, newBalance: number) => void;
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  currentBalance,
  quickAmount,
  onClose,
  onDepositComplete,
}) => {
  const [amount, setAmount] = useState(quickAmount || 1.0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const { toast } = useToast();
  const { address, chainId } = (useAccount as any)() || { address: undefined, chainId: undefined };
  const { writeContractAsync } = (useWriteContract as any)();
  const config = (useConfig as any)();

  useEffect(() => {
    if (quickAmount) {
      setAmount(quickAmount);
    }
  }, [quickAmount]);
  const quickAmounts = [0.5, 1.0, 2.0, 5.0];

  if (!isOpen) return null;

  const handleDeposit = async () => {
    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
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
      const usdcAddress = FUJI_USDC_ADDRESS as `0x${string}`;

      setStatus('Approving USDC...');
      const approveHash = await writeContractAsync({
        address: usdcAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [escrowAddress, value],
      });
      const { waitForTransactionReceipt } = await import('wagmi/actions');
      await waitForTransactionReceipt(config, { hash: approveHash });

      setStatus('Depositing to escrow...');
      const depositHash = await writeContractAsync({
        address: escrowAddress,
        abi: STREAMPAY_ESCROW_ABI,
        functionName: 'deposit',
        args: [value],
      });
      await waitForTransactionReceipt(config, { hash: depositHash });

      setStatus('Recording transaction...');
      await recordDepositTx({
        user_address: address,
        amount_usdc: amount,
        tx_hash: String(depositHash),
      });

      const newBalance = currentBalance + amount;
      toast({
        title: "Deposit successful",
        description: `Deposited ${amount} USDC successfully`,
      });
      
      onDepositComplete?.(amount, newBalance);
      setTimeout(() => {
        onClose();
        setLoading(false);
        setStatus(null);
      }, 500);
    } catch (err: any) {
      const errorMsg = err?.message || 'Deposit failed';
      setStatus(null);
      toast({
        title: "Deposit failed",
        description: errorMsg,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const estimateUsage = (USDC: number) => {
    return {
      videoHours: Math.floor(USDC / (0.001*60)),
      aiCalls: Math.floor(USDC / 0.01),
      storageDays: Math.floor(USDC / (0.0001 * 60 * 24)),
    };
  };

  const usage = estimateUsage(amount);

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
            className="bg-[#0a0a0a] border border-[#262626] rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-[#262626] flex-shrink-0">
              <h2 className="text-lg font-semibold text-white">Deposit USDC</h2>
              <button
                onClick={onClose}
                className="text-[#a1a1a1] hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <div className="mb-6">
                <label className="block text-sm text-[#a1a1a1] mb-2">Amount (USDC)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-2 text-lg text-white font-mono"
                    step="0.1"
                    min="0"
                  />
                  <span className="text-lg text-white font-mono">USDC</span>
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

              <Separator className="my-6" />

              <div className="mb-6">
                <div className="text-sm font-medium text-white mb-3">This will last approximately:</div>
                <div className="space-y-2 text-sm text-[#a1a1a1]">
                  <div>• Video Streaming: ~{usage.videoHours} hours</div>
                  <div>• AI Assistant: ~{usage.aiCalls.toLocaleString()} calls</div>
                  <div>• Cloud Storage: ~{usage.storageDays} days (1GB)</div>
                </div>
              </div>

          <Separator className="mb-6" />

          <div className="mb-6 bg-[#1A1A1A] p-4 rounded-lg">
            <div className="flex justify-between mb-3">
              <span className="text-sm text-[#a1a1a1]">Current Balance</span>
              <span className="text-sm font-mono text-white">{currentBalance.toFixed(3)} USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#a1a1a1]">After Deposit</span>
              <span className="text-sm font-mono text-white">{(currentBalance + amount).toFixed(3)} USDC</span>
            </div>
          </div>

          {status && (
            <div className="mb-4 p-3 bg-[#1A1A1A] border border-[#262626] rounded-lg">
              <div className="text-sm text-[#a1a1a1] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                {status}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border-[#262626] hover:bg-[#262626]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeposit} 
              loading={loading}
              disabled={loading || amount <= 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
                  {status || 'Deposit USDC'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DepositModal;

