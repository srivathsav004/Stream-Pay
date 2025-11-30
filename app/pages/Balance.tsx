import React, { useState } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import {
  balanceBreakdown,
  transactions,
  balanceHistory,
  transactionBreakdown,
  serviceTransactionCounts,
  spendingInsights,
} from './Balance/data';
import BalanceHeader from './Balance/BalanceHeader';
import BalanceOverview from './Balance/BalanceOverview';
import QuickActions from './Balance/QuickActions';
import TransactionHistory from './Balance/TransactionHistory';
import BalanceAnalytics from './Balance/BalanceAnalytics';
import SpendingInsights from './Balance/SpendingInsights';
import DepositModal from './Balance/DepositModal';
import WithdrawModal from './Balance/WithdrawModal';

const Balance: React.FC = () => {
  const [balance] = useState(2.47);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [quickDepositAmount, setQuickDepositAmount] = useState<number | null>(null);

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

  const handleConfirmDeposit = (amount: number) => {
    console.log('Depositing:', amount);
    // In a real app, this would trigger the deposit transaction
    setShowDepositModal(false);
    setQuickDepositAmount(null);
  };

  const handleConfirmWithdraw = (amount: number) => {
    console.log('Withdrawing:', amount);
    // In a real app, this would trigger the withdrawal transaction
    setShowWithdrawModal(false);
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
      <SpendingInsights insights={spendingInsights} />

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
