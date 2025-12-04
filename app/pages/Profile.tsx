import React from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import ProfileHeader from './Profile/ProfileHeader';
import AccountOverview from './Profile/AccountOverview';
import AccountStatistics from './Profile/AccountStatistics';
import Preferences from './Profile/Preferences';
import ConnectedServices from './Profile/ConnectedServices';
import ActivitySummary from './Profile/ActivitySummary';
import DangerZone from './Profile/DangerZone';

const Profile: React.FC = () => {
  const walletInfo = { address: '', network: '-', memberSince: '-', connectedAt: '-' };
  const accountStats = { totalSpent: 0, servicesUsed: 0, activeDays: 0, transactions: 0 };
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
