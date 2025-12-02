import {
  Transaction,
  BalanceBreakdown,
  BalanceHistoryData,
  TransactionBreakdown,
  ServiceTransactionCount,
  SpendingInsights,
} from './types';

export const balanceBreakdown: BalanceBreakdown = {
  available: 2.35,
  locked: 0.12,
  totalIn: 10.0,
  totalOut: 7.53,
};

export const transactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    date: '2 hours ago',
    amount: 1.0,
    status: 'complete',
    txHash: '0x7a2b4c8d9e3f1a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f',
    block: 12345678,
    confirmations: 47,
  },
  {
    id: '2',
    type: 'payment',
    service: 'Video Streaming',
    date: '2 hours ago',
    amount: -0.0425,
    status: 'complete',
    txHash: '0x9c4d6e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    block: 12345679,
    confirmations: 46,
    gasUsed: 21000,
    gasPrice: 25,
    streamId: 'stream_abc123xyz',
    duration: '00:42:15',
    rate: '0.0001 USDC/sec',
  },
  {
    id: '3',
    type: 'payment',
    service: 'AI Assistant',
    date: '5 hours ago',
    amount: -0.001,
    status: 'complete',
    txHash: '0x1f8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
    block: 12345650,
    confirmations: 43,
  },
  {
    id: '4',
    type: 'payment',
    service: 'Cloud Storage',
    date: '1 day ago',
    amount: -0.0024,
    status: 'complete',
    txHash: '0x3b7a8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f',
    block: 12345600,
    confirmations: 38,
  },
  {
    id: '5',
    type: 'deposit',
    date: '1 day ago',
    amount: 2.0,
    status: 'complete',
    txHash: '0x5d2c3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a',
    block: 12345500,
    confirmations: 30,
  },
  {
    id: '6',
    type: 'payment',
    service: 'Video Streaming',
    date: '2 days ago',
    amount: -0.0312,
    status: 'complete',
    txHash: '0x8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c',
    block: 12345000,
    confirmations: 20,
  },
  {
    id: '7',
    type: 'withdraw',
    date: '2 days ago',
    amount: -0.5,
    status: 'pending',
    txHash: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e',
  },
  {
    id: '8',
    type: 'payment',
    service: 'AI Assistant',
    date: '3 days ago',
    amount: -0.005,
    status: 'complete',
    txHash: '0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f',
    block: 12344000,
    confirmations: 10,
  },
];

export const balanceHistory: BalanceHistoryData[] = [
  { date: 'Nov 1', balance: 2.0 },
  { date: 'Nov 5', balance: 1.5 },
  { date: 'Nov 10', balance: 3.0 },
  { date: 'Nov 15', balance: 2.8 },
  { date: 'Nov 20', balance: 2.2 },
  { date: 'Nov 25', balance: 2.5 },
  { date: 'Nov 27', balance: 2.47 },
];

export const transactionBreakdown: TransactionBreakdown = {
  deposits: 40,
  payments: 50,
  withdrawals: 10,
  refunds: 0,
};

export const serviceTransactionCounts: ServiceTransactionCount[] = [
  { service: 'Video', count: 60 },
  { service: 'AI', count: 45 },
  { service: 'Storage', count: 22 },
];

export const spendingInsights: SpendingInsights = {
  avgDailySpending: 0.35,
  largestTransaction: {
    amount: 2.0,
    type: 'Deposit',
    date: '1 day ago',
  },
  mostActiveDay: 'Saturday',
  avgOnMostActiveDay: 0.85,
  spendingTrend: {
    percentage: 12,
    direction: 'up',
  },
};

