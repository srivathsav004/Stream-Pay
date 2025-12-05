import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import ProfileHeader from './Profile/ProfileHeader';
import AccountOverview from './Profile/AccountOverview';
import AccountStatistics from './Profile/AccountStatistics';
import Preferences from './Profile/Preferences';
import ConnectedServices from './Profile/ConnectedServices';
import ActivitySummary from './Profile/ActivitySummary';
import DangerZone from './Profile/DangerZone';
import { useAccount } from 'wagmi';
import { listTransactions, TxRow } from '@/app/shared/services/web2-services/transactions';

const Profile: React.FC = () => {
  const { address } = (useAccount as any)() || { address: undefined };
  const [txRows, setTxRows] = useState<TxRow[]>([]);

  const walletInfo = useMemo(() => {
    const base = {
      address: address || '-',
      network: 'Avalanche Fuji Testnet',
      memberSince: '-',
      connectedAt: '-',
    };
    if (!address || !txRows.length) return base;
    const sorted = [...txRows].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    return {
      address,
      network: 'Avalanche Fuji Testnet',
      memberSince: new Date(first.created_at).toLocaleDateString(),
      connectedAt: new Date(last.created_at).toLocaleString(),
    };
  }, [address, txRows]);

  const accountStats = useMemo(() => {
    // Only count spending on service usage, not deposits/withdrawals
    const SPEND_SERVICES = new Set(['video_stream', 'video_purchase', 'api_session', 'storage']);

    const totalSpent = txRows.reduce((sum, r) => {
      if (!SPEND_SERVICES.has(r.service)) return sum;
      const amt = Number(r.amount_usdc ?? 0);
      return sum + Math.abs(amt);
    }, 0);

    // Group concrete service_types into 3 logical services
    const serviceGroups = new Set<string>();
    for (const r of txRows) {
      if (r.service === 'video_stream' || r.service === 'video_purchase') {
        serviceGroups.add('video');
      } else if (r.service === 'api_session') {
        serviceGroups.add('api');
      } else if (r.service === 'storage') {
        serviceGroups.add('storage');
      }
    }

    const activeDays = new Set(
      txRows.map(r => new Date(r.created_at).toISOString().slice(0, 10))
    ).size;

    return {
      totalSpent: Number(totalSpent.toFixed(6)),
      servicesUsed: serviceGroups.size,
      activeDays,
      transactions: txRows.length,
    };
  }, [txRows]);
  const notificationSettings = { lowBalanceAlerts: false, transactionConfirmations: false, weeklyUsageSummary: false, serviceUpdates: false, marketingEmails: false };
  const spendingControls = { dailyLimit: 0, perServiceLimit: 0, enabled: false, requireConfirmation: false, confirmationThreshold: 0 };
  const appearanceSettings = { theme: 'dark', currency: 'USD', dateFormat: 'MM/DD/YYYY' } as const;
  const securitySettings = { requireWalletSignature: false, autoLock: false, autoLockMinutes: 0, twoFactorEnabled: false };
  const connectedServices: any[] = [];
  const activityHistory: any[] = [];
  const handleDisconnect = () => {
    console.log('Disconnecting wallet...');
    // In a real app, this would disconnect the wallet
  };

  useEffect(() => {
    (async () => {
      if (!address) return;
      try {
        const { items } = await listTransactions({ user_address: address, page: 1, page_size: 50, sort: 'recent' });
        setTxRows(items);
      } catch {}
    })();
  }, [address]);

  const handleSaveSettings = (settings: {
    notifications: typeof notificationSettings;
    spending: typeof spendingControls;
    appearance: typeof appearanceSettings;
    security: typeof securitySettings;
  }) => {
    console.log('Saving settings...', settings);
    // In a real app, this would save to backend
  };

  const handleExportData = () => {
    const data = {
      wallet: walletInfo,
      stats: accountStats,
      settings: {
        notifications: notificationSettings,
        spending: spendingControls,
        appearance: appearanceSettings,
        security: securitySettings,
      },
      services: connectedServices,
      activities: activityHistory,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `streampay-data-${new Date().toISOString()}.json`;
    a.click();
  };

  const handleClearHistory = () => {
    console.log('Clearing history...');
    // In a real app, this would clear history with confirmation
  };

  const handleDeleteAccount = () => {
    console.log('Deleting account...');
    // In a real app, this would delete account with confirmation
  };

  return (
    <DashboardLayout>
      <ProfileHeader />
      <AccountOverview wallet={walletInfo} onDisconnect={handleDisconnect} />
      <AccountStatistics stats={accountStats} />
      {/* <Preferences
        notifications={notificationSettings}
        spending={spendingControls}
        appearance={appearanceSettings}
        security={securitySettings}
        onSave={handleSaveSettings}
      />
      <ConnectedServices services={connectedServices} />
      <ActivitySummary activities={activityHistory} />
      <DangerZone
        onExportData={handleExportData}
        onClearHistory={handleClearHistory}
        onDeleteAccount={handleDeleteAccount}
      /> */}
    </DashboardLayout>
  );
};

export default Profile;
