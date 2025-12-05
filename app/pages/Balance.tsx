import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import BalanceHeader from './Balance/BalanceHeader';
import BalanceOverview from './Balance/BalanceOverview';
import QuickActions from './Balance/QuickActions';
import TransactionHistory from './Balance/TransactionHistory';
import BalanceAnalytics from './Balance/BalanceAnalytics';
import SpendingInsights from './Balance/SpendingInsights';
import DepositModal from './Balance/DepositModal';
import WithdrawModal from './Balance/WithdrawModal';
import { useAccount, useWriteContract, useConfig } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { parseUnits } from 'viem';
import { listTransactions, TxRow, recordDepositTx, recordWithdrawTx } from '@/app/shared/services/web2-services/transactions';
import { STREAMPAY_ESCROW_ABI } from '@/app/shared/contracts/streampayEscrow';
import { STREAMPAY_ESCROW_ADDRESS } from '@/app/shared/contracts/config';
import { ERC20_ABI, FUJI_USDC_ADDRESS } from '@/app/shared/contracts/erc20';
import { readEscrowBalance } from '@/app/shared/contracts/balance';
import type {
  Transaction as UITransaction,
  BalanceHistoryData,
  TransactionBreakdown,
  ServiceTransactionCount,
} from './Balance/types';

const Balance: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [quickDepositAmount, setQuickDepositAmount] = useState<number | null>(null);
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [txRows, setTxRows] = useState<TxRow[]>([]);
  const { address, chainId } = (useAccount as any)() || { address: undefined, chainId: undefined };
  const { writeContractAsync } = (useWriteContract as any)();
  const config = (useConfig as any)();

  const balanceBreakdown = { available: balance, locked: 0, streaming: 0 } as const;
  const transactions: UITransaction[] = useMemo(() => {
    return txRows.map((r) => {
      const svc = r.service;
      const isDeposit = svc === 'deposit';
      const isWithdraw = svc === 'withdraw';
      const type: UITransaction['type'] = isDeposit ? 'deposit' : isWithdraw ? 'withdraw' : 'payment';
      const amt = Number(r.amount_usdc ?? 0);
      return {
        id: String(r.id),
        type,
        service: svc,
        date: new Date(r.created_at).toLocaleString(),
        amount: isDeposit ? Math.abs(amt) : -Math.abs(amt),
        status: 'complete',
        txHash: r.tx_hash || '-',
      } as UITransaction;
    });
  }, [txRows]);

  const balanceHistory: BalanceHistoryData[] = useMemo(() => {
    if (!txRows.length) return [];
    const countsByDay = new Map<string, number>();
    for (const r of txRows) {
      const d = new Date(r.created_at).toLocaleDateString();
      countsByDay.set(d, (countsByDay.get(d) || 0) + 1);
    }
    return Array.from(countsByDay.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, count]) => ({ date, balance: count }));
  }, [txRows]);

  const transactionBreakdown: TransactionBreakdown = useMemo(() => {
    const counts: TransactionBreakdown = { deposits: 0, payments: 0, withdrawals: 0, refunds: 0 };
    for (const tx of transactions) {
      if (tx.type === 'deposit') counts.deposits += 1;
      else if (tx.type === 'withdraw') counts.withdrawals += 1;
      else if (tx.type === 'payment') counts.payments += 1;
      else if (tx.type === 'refund') counts.refunds += 1;
    }
    return counts;
  }, [transactions]);

  const serviceTransactionCounts: ServiceTransactionCount[] = useMemo(() => {
    const map = new Map<string, number>();
    for (const tx of transactions) {
      const key = tx.service || 'unknown';
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries()).map(([service, count]) => ({ service, count }));
  }, [transactions]);
  const spendingInsights = {
    avgDailySpending: 0,
    largestTransaction: { amount: 0, type: '-', date: '-' },
    mostActiveDay: '-',
    avgOnMostActiveDay: 0,
    spendingTrend: { direction: 'down', percentage: 0 },
  };

  useEffect(() => {
    (async () => {
      if (!address) return;
      try {
        // Fetch transactions
        const { items } = await listTransactions({ user_address: address, page: 1, page_size: 100, sort: 'recent' });
        setTxRows(items);
        
        // Fetch contract balance
        const contractBalance = await readEscrowBalance(address);
        setBalance(contractBalance);
      } catch (error) {
        console.error('Error fetching balance data:', error);
      }
    })();
  }, [address]);

  const refreshData = async () => {
    if (!address) return;
    try {
      const { items } = await listTransactions({ user_address: address, page: 1, page_size: 100, sort: 'recent' });
      setTxRows(items);
      const contractBalance = await readEscrowBalance(address);
      setBalance(contractBalance);
    } catch (err) {
      console.error('Error refreshing balance data:', err);
    }
  };

  const handleDeposit = () => {
    setShowDepositModal(true);
  };

  const handleWithdraw = () => {
    setShowWithdrawModal(true);
  };

  const handleQuickDeposit = (amount: number) => {
    setQuickDepositAmount(amount);
    setShowDepositModal(true);
  };

  const handleConfirmDeposit = async (amount: number) => {
    if (!address) return;
    try {
      setDepositLoading(true);
      if (!STREAMPAY_ESCROW_ADDRESS) throw new Error('Escrow not configured');
      if (!amount || amount <= 0) throw new Error('Enter a valid amount');
      if (chainId !== avalancheFuji.id) throw new Error('Switch to Avalanche Fuji');

      const value = (parseUnits as any)(String(amount), 6);
      const escrowAddress = STREAMPAY_ESCROW_ADDRESS as `0x${string}`;
      const usdcAddress = FUJI_USDC_ADDRESS as `0x${string}`;

      // Approve USDC spending
      const approveHash = await writeContractAsync({
        address: usdcAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [escrowAddress, value],
      });
      const { waitForTransactionReceipt } = await import('wagmi/actions');
      await waitForTransactionReceipt(config, { hash: approveHash });

      // Deposit into escrow
      const depositHash = await writeContractAsync({
        address: escrowAddress,
        abi: STREAMPAY_ESCROW_ABI,
        functionName: 'deposit',
        args: [value],
      });
      await waitForTransactionReceipt(config, { hash: depositHash });

      // Record transaction in web2 DB
      await recordDepositTx({
        user_address: address,
        amount_usdc: amount,
        tx_hash: String(depositHash),
      });

      await refreshData();
    } catch (err) {
      console.error('Deposit failed', err);
    } finally {
      setDepositLoading(false);
      setShowDepositModal(false);
      setQuickDepositAmount(null);
    }
  };

  const handleConfirmWithdraw = async (amount: number) => {
    if (!address) return;
    try {
      setWithdrawLoading(true);
      if (!STREAMPAY_ESCROW_ADDRESS) throw new Error('Escrow not configured');
      if (!amount || amount <= 0) throw new Error('Enter a valid amount');
      if (chainId !== avalancheFuji.id) throw new Error('Switch to Avalanche Fuji');

      const value = (parseUnits as any)(String(amount), 6);
      const escrowAddress = STREAMPAY_ESCROW_ADDRESS as `0x${string}`;

      const withdrawHash = await writeContractAsync({
        address: escrowAddress,
        abi: STREAMPAY_ESCROW_ABI,
        functionName: 'withdraw',
        args: [value],
      });
      const { waitForTransactionReceipt } = await import('wagmi/actions');
      await waitForTransactionReceipt(config, { hash: withdrawHash });

      await recordWithdrawTx({
        user_address: address,
        amount_usdc: amount,
        tx_hash: String(withdrawHash),
      });

      await refreshData();
    } catch (err) {
      console.error('Withdraw failed', err);
    } finally {
      setWithdrawLoading(false);
      setShowWithdrawModal(false);
    }
  };

  const handleStopAll = () => {
    console.log('Stopping all streams...');
    // In a real app, this would stop all active streams
  };

  const handleExport = () => {
    const csv = [
      ['Type', 'Service', 'Date', 'Amount', 'Status', 'Tx Hash'],
      ...transactions.map(tx => [
        tx.type,
        tx.service || '-',
        tx.date,
        tx.amount.toString(),
        tx.status,
        tx.txHash,
      ]),
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <DashboardLayout>
      <BalanceHeader />
      <BalanceOverview
        balance={balance}
        breakdown={balanceBreakdown}
        isDepositing={depositLoading}
        isWithdrawing={withdrawLoading}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
      />
      {/* <QuickActions
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
        onStopAll={handleStopAll}
        onExport={handleExport}
        onQuickDeposit={handleQuickDeposit}
      /> */}
      <TransactionHistory transactions={transactions} />
      <BalanceAnalytics
        balanceHistory={balanceHistory}
        transactionBreakdown={transactionBreakdown}
        serviceCounts={serviceTransactionCounts}
      />
      {/* <SpendingInsights insights={spendingInsights} /> */}

      <DepositModal
        isOpen={showDepositModal}
        currentBalance={balance}
        quickAmount={quickDepositAmount}
        onClose={() => {
          setShowDepositModal(false);
          setQuickDepositAmount(null);
        }}
        onDeposit={handleConfirmDeposit}
      />

      <WithdrawModal
        isOpen={showWithdrawModal}
        availableBalance={balanceBreakdown.available}
        lockedBalance={balanceBreakdown.locked}
        onClose={() => setShowWithdrawModal(false)}
        onWithdraw={handleConfirmWithdraw}
      />
    </DashboardLayout>
  );
};

export default Balance;
