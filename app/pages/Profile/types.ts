export interface WalletInfo {
  address: string;
  network: string;
  memberSince: string;
  connectedAt: string;
}

export interface AccountStats {
  totalSpent: number;
  servicesUsed: number;
  activeDays: number;
  transactions: number;
}

export interface NotificationSettings {
  lowBalanceAlerts: boolean;
  transactionConfirmations: boolean;
  weeklyUsageSummary: boolean;
  serviceUpdates: boolean;
  marketingEmails: boolean;
}

export interface SpendingControls {
  dailyLimit: number;
  perServiceLimit: number;
  enabled: boolean;
  requireConfirmation: boolean;
  confirmationThreshold: number;
}

export interface AppearanceSettings {
  theme: 'dark' | 'light' | 'system';
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
}

export interface SecuritySettings {
  requireWalletSignature: boolean;
  autoLock: boolean;
  autoLockMinutes: number;
  twoFactorEnabled: boolean;
}

export interface ConnectedService {
  id: string;
  name: string;
  icon: string;
  status: 'active' | 'inactive';
  lastUsed: string;
  totalSpent: number;
}

export interface ActivityItem {
  id: string;
  action: string;
  timestamp: string;
}

