export type TimeFilter = 'Today' | '7D' | '30D' | 'All';

export interface SpendingData {
  date: string;
  amount: number;
  sessions: number;
}

export interface ServiceUsageData {
  service: string;
  amount: number;
  percentage: number;
  sessions: number;
  color: string;
}

export interface ActivityData {
  id: number;
  service: string;
  time: string;
  duration?: string;
  calls?: number;
  cost: number;
  type: 'stream' | 'api' | 'storage';
  details?: {
    streamId: string;
    started: string;
    ended: string;
    rate: string;
    txHash: string;
  };
}

export interface ActiveStream {
  id: number;
  service: string;
  duration?: string;
  calls?: number;
  cost: number;
  rate: string;
  progress?: number;
  lastCall?: string;
}

