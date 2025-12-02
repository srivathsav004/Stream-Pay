import { SpendingData, ServiceUsageData, ActivityData, ActiveStream } from './types';

export const spendingData: SpendingData[] = [
  { date: 'Nov 1', amount: 0.1, sessions: 2 },
  { date: 'Nov 5', amount: 0.3, sessions: 5 },
  { date: 'Nov 10', amount: 0.5, sessions: 8 },
  { date: 'Nov 15', amount: 0.8, sessions: 12 },
  { date: 'Nov 20', amount: 1.0, sessions: 15 },
  { date: 'Nov 25', amount: 1.2, sessions: 18 },
  { date: 'Nov 27', amount: 1.23, sessions: 20 },
];

export const serviceUsageData: ServiceUsageData[] = [
  { service: 'Video Streaming', amount: 4.45, percentage: 60, sessions: 47, color: '#3b82f6' },
  { service: 'API Calls', amount: 2.22, percentage: 30, sessions: 247, color: '#8b5cf6' },
  { service: 'Cloud Storage', amount: 0.74, percentage: 10, sessions: 47, color: '#06b6d4' },
];

export const videoStreamingTrend = [
  { day: 'Mon', value: 0.5 },
  { day: 'Tue', value: 0.6 },
  { day: 'Wed', value: 0.4 },
  { day: 'Thu', value: 0.7 },
  { day: 'Fri', value: 0.8 },
  { day: 'Sat', value: 0.9 },
  { day: 'Sun', value: 0.65 },
];

export const apiCallsData = [
  { day: 'Mon', calls: 30 },
  { day: 'Tue', calls: 35 },
  { day: 'Wed', calls: 28 },
  { day: 'Thu', calls: 40 },
  { day: 'Fri', calls: 45 },
  { day: 'Sat', calls: 35 },
  { day: 'Sun', calls: 34 },
];

export const storageData = [
  { day: 'Mon', value: 0.1 },
  { day: 'Tue', value: 0.12 },
  { day: 'Wed', value: 0.11 },
  { day: 'Thu', value: 0.13 },
  { day: 'Fri', value: 0.14 },
  { day: 'Sat', value: 0.15 },
  { day: 'Sun', value: 0.14 },
];

export const activityData: ActivityData[] = [
  {
    id: 1,
    service: 'Video Streaming',
    time: '2 hours ago',
    duration: '00:42:15',
    cost: 0.0425,
    type: 'stream',
    details: {
      streamId: 'stream_abc123xyz',
      started: 'Nov 27, 2024 at 2:30 PM',
      ended: 'Nov 27, 2024 at 3:12 PM',
      rate: '0.0001 USDC/sec',
      txHash: '0x7a2b...',
    },
  },
  {
    id: 2,
    service: 'API Call',
    time: '5 hours ago',
    calls: 1,
    cost: 0.001,
    type: 'api',
  },
  {
    id: 3,
    service: 'Storage Upload',
    time: '1 day ago',
    duration: '24 hours',
    cost: 0.0024,
    type: 'storage',
  },
  {
    id: 4,
    service: 'Video Streaming',
    time: '2 days ago',
    duration: '00:31:12',
    cost: 0.0312,
    type: 'stream',
  },
  {
    id: 5,
    service: 'API Call',
    time: '2 days ago',
    calls: 5,
    cost: 0.005,
    type: 'api',
  },
];

export const activeStreams: ActiveStream[] = [
  {
    id: 1,
    service: 'Video Streaming',
    duration: '00:42:15',
    cost: 0.0425,
    rate: '0.0001 USDC/sec',
    progress: 70,
  },
  {
    id: 2,
    service: 'API Calls',
    calls: 47,
    cost: 0.047,
    rate: '0.001 USDC/call',
    lastCall: '2 minutes ago',
  },
];

