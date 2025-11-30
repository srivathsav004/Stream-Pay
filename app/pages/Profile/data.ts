import {
  WalletInfo,
  AccountStats,
  NotificationSettings,
  SpendingControls,
  AppearanceSettings,
  SecuritySettings,
  ConnectedService,
  ActivityItem,
} from './types';

export const walletInfo: WalletInfo = {
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  network: 'Avalanche Fuji Testnet',
  memberSince: 'Nov 27, 2024',
  connectedAt: '2 days ago',
};

export const accountStats: AccountStats = {
  totalSpent: 7.41,
  servicesUsed: 3,
  activeDays: 23,
  transactions: 127,
};

export const notificationSettings: NotificationSettings = {
  lowBalanceAlerts: true,
  transactionConfirmations: true,
  weeklyUsageSummary: true,
  serviceUpdates: true,
  marketingEmails: false,
};

export const spendingControls: SpendingControls = {
  dailyLimit: 1.0,
  perServiceLimit: 0.5,
  enabled: true,
  requireConfirmation: true,
  confirmationThreshold: 0.1,
};

export const appearanceSettings: AppearanceSettings = {
  theme: 'dark',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
};

export const securitySettings: SecuritySettings = {
  requireWalletSignature: true,
  autoLock: true,
  autoLockMinutes: 30,
  twoFactorEnabled: false,
};

export const connectedServices: ConnectedService[] = [
  {
    id: 'video',
    name: 'Video Streaming',
    icon: '🎥',
    status: 'active',
    lastUsed: '2 hours ago',
    totalSpent: 4.45,
  },
  {
    id: 'ai',
    name: 'AI Assistant',
    icon: '🤖',
    status: 'active',
    lastUsed: '5 hours ago',
    totalSpent: 2.22,
  },
  {
    id: 'storage',
    name: 'Cloud Storage',
    icon: '💾',
    status: 'active',
    lastUsed: '1 day ago',
    totalSpent: 0.74,
  },
  {
    id: 'live',
    name: 'Live Streaming',
    icon: '📡',
    status: 'inactive',
    lastUsed: 'Never',
    totalSpent: 0,
  },
];

export const activityHistory: ActivityItem[] = [
  {
    id: '1',
    action: 'Logged in from new device',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    action: 'Changed notification settings',
    timestamp: '1 day ago',
  },
  {
    id: '3',
    action: 'Updated spending limits',
    timestamp: '3 days ago',
  },
  {
    id: '4',
    action: 'Exported transaction history',
    timestamp: '5 days ago',
  },
];

