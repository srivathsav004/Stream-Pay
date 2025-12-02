import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAccount, useReadContract, useWriteContract, useConfig } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { parseUnits, formatUnits } from 'viem';
import { ERC20_ABI, FUJI_USDC_ADDRESS } from '@/app/shared/contracts/erc20';
import { STREAMPAY_ESCROW_ABI } from '@/app/shared/contracts/streampayEscrow';
import { STREAMPAY_ESCROW_ADDRESS } from '@/app/shared/contracts/config';
import { waitForTransactionReceipt } from 'wagmi/actions';

const HeroStats: React.FC = () => {
  const { isConnected, address, chainId } = useAccount();

  const escrowAddress = STREAMPAY_ESCROW_ADDRESS;
  const usdcAddress = FUJI_USDC_ADDRESS;

  const { data: escrowBalanceData, refetch: refetchEscrow } = useReadContract({
    address: escrowAddress || undefined,
    abi: STREAMPAY_ESCROW_ABI,
    functionName: 'getBalance',
    args: address ? [address] : undefined,
    chainId: avalancheFuji.id,
    query: { enabled: !!address && !!escrowAddress },
  });

  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && escrowAddress ? [address, escrowAddress] : undefined,
    chainId: avalancheFuji.id,
    query: { enabled: !!address && !!escrowAddress },
  });

  const formattedEscrow = escrowBalanceData ? `${Number(formatUnits(escrowBalanceData as bigint, 6)).toFixed(2)} USDC` : '— USDC';

  const [depositOpen, setDepositOpen] = React.useState(false);
  const [amount, setAmount] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'approving' | 'depositing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = React.useState('');

  const { writeContractAsync } = useWriteContract();
  const config = useConfig();

  const onDeposit = async () => {
    setErrorMsg('');
    if (!isConnected) {
      setErrorMsg('Connect your wallet');
      return;
    }
    if (!escrowAddress) {
      setErrorMsg('Escrow contract address not configured');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setErrorMsg('Enter a valid amount');
      return;
    }
    if (chainId !== avalancheFuji.id) {
      setErrorMsg('Switch to Avalanche Fuji');
      return;
    }
    try {
      const value = parseUnits(amount, 6);
      const { data: freshAllowance } = await refetchAllowance();
      const allowance = (freshAllowance ?? allowanceData ?? 0n) as bigint;

      if (allowance < value) {
        setStatus('approving');
        const approveHash = await writeContractAsync({
          address: usdcAddress,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [escrowAddress as `0x${string}`, value],
        });
        await waitForTransactionReceipt(config, { hash: approveHash });
      }

      setStatus('depositing');
      const depositHash = await writeContractAsync({
        address: escrowAddress,
        abi: STREAMPAY_ESCROW_ABI,
        functionName: 'deposit',
        args: [value],
      });
      await waitForTransactionReceipt(config, { hash: depositHash });

      await refetchEscrow();
      setStatus('success');
      setAmount('');
      setTimeout(() => {
        setStatus('idle');
        setDepositOpen(false);
      }, 1200);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err?.shortMessage || err?.message || 'Transaction failed');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Balance</div>
        <div className="text-3xl font-semibold text-white mb-1">{formattedEscrow}</div>
        <div className="text-sm text-[#a1a1a1] mb-4">Escrow Balance</div>
        {!depositOpen ? (
          <Button variant="outline" size="sm" className="w-full" onClick={() => setDepositOpen(true)}>Deposit</Button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount in USDC"
                  className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  inputMode="decimal"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onDeposit}
                disabled={status === 'approving' || status === 'depositing'}
              >
                {status === 'approving' ? 'Approving…' : status === 'depositing' ? 'Depositing…' : 'Confirm'}
              </Button>
            </div>
            {status === 'success' && (
              <div className="text-xs text-green-500">Deposit successful</div>
            )}
            {errorMsg && (
              <div className="text-xs text-red-500">{errorMsg}</div>
            )}
          </div>
        )}
      </Card>

      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Spent This Month</div>
        <div className="text-3xl font-semibold text-white mb-1">1.23 USDC</div>
        <div className="text-sm text-[#a1a1a1] mb-4">$49.20 USD</div>
        <div className="text-sm text-[#10b981]">+12% from last month ↑</div>
      </Card>

      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Total Sessions</div>
        <div className="text-3xl font-semibold text-white mb-1">127</div>
        <div className="text-sm text-[#a1a1a1] mb-4">Across all services</div>
        <div className="text-sm text-[#a1a1a1]">Avg: 18 sessions/week</div>
      </Card>

      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Active Streams</div>
        <div className="text-3xl font-semibold text-white mb-1">2</div>
        <div className="text-sm text-[#a1a1a1] mb-4">Running now</div>
        <Button variant="ghost" size="sm" className="text-blue-600">View Details →</Button>
      </Card>
    </div>
  );
};

export default HeroStats;

