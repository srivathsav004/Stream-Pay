export type TransactionType = 'deposit' | 'payment' | 'withdraw' | 'refund';

export type TransactionStatus = 'complete' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  service?: string;
  date: string;
  amount: number;
  status: TransactionStatus;
  txHash: string;
  block?: number;
  confirmations?: number;
  gasUsed?: number;
  gasPrice?: number;
  streamId?: string;
  duration?: string;
  rate?: string;
}

export interface BalanceBreakdown {
  available: number;
  locked: number;
  totalIn: number;
  totalOut: number;
}

export interface BalanceHistoryData {
  date: string;
  balance: number;
}

export interface TransactionBreakdown {
  deposits: number;
  payments: number;
  withdrawals: number;
  refunds: number;
}

export interface ServiceTransactionCount {
  service: string;
  count: number;
}

export interface SpendingInsights {
  avgDailySpending: number;
  largestTransaction: {
    amount: number;
    type: string;
    date: string;
  };
  mostActiveDay: string;
  avgOnMostActiveDay: number;
  spendingTrend: {
    percentage: number;
    direction: 'up' | 'down';
  };
}

