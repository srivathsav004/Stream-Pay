import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Separator from '@/components/ui/Separator';
import {
  NotificationSettings,
  SpendingControls,
  AppearanceSettings,
  SecuritySettings,
} from './types';

interface PreferencesProps {
  notifications: NotificationSettings;
  spending: SpendingControls;
  appearance: AppearanceSettings;
  security: SecuritySettings;
  onSave: (settings: {
    notifications: NotificationSettings;
    spending: SpendingControls;
    appearance: AppearanceSettings;
    security: SecuritySettings;
  }) => void;
}

const Preferences: React.FC<PreferencesProps> = ({
  notifications: initialNotifications,
  spending: initialSpending,
  appearance: initialAppearance,
  security: initialSecurity,
  onSave,
}) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [spending, setSpending] = useState(initialSpending);
  const [appearance, setAppearance] = useState(initialAppearance);
  const [security, setSecurity] = useState(initialSecurity);

  const handleSave = () => {
    onSave({ notifications, spending, appearance, security });
  };

  return (
    <Card className="p-6 mb-8">
      <h2 className="text-lg font-semibold text-white mb-6">Preferences</h2>

      <div className="space-y-6">
        {/* Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🔔</span>
            <h3 className="text-base font-semibold text-white">Notifications</h3>
          </div>
          <div className="space-y-3 pl-7">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.lowBalanceAlerts}
                onChange={(e) => setNotifications({ ...notifications, lowBalanceAlerts: e.target.checked })}
                className="rounded border-[#262626]"
              />
              <span className="text-sm text-white">Low balance alerts (&lt; 0.1 USDC)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.transactionConfirmations}
                onChange={(e) => setNotifications({ ...notifications, transactionConfirmations: e.target.checked })}
                className="rounded border-[#262626]"
              />
              <span className="text-sm text-white">Transaction confirmations</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.weeklyUsageSummary}
                onChange={(e) => setNotifications({ ...notifications, weeklyUsageSummary: e.target.checked })}
                className="rounded border-[#262626]"
              />
              <span className="text-sm text-white">Weekly usage summary</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.serviceUpdates}
                onChange={(e) => setNotifications({ ...notifications, serviceUpdates: e.target.checked })}
                className="rounded border-[#262626]"
              />
              <span className="text-sm text-white">Service updates</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.marketingEmails}
                onChange={(e) => setNotifications({ ...notifications, marketingEmails: e.target.checked })}
                className="rounded border-[#262626]"
              />
              <span className="text-sm text-white">Marketing emails</span>
            </label>
          </div>
        </div>

        <Separator />

        {/* Spending Controls */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">💰</span>
            <h3 className="text-base font-semibold text-white">Spending Controls</h3>
          </div>
          <div className="space-y-4 pl-7">
            <div>
              <label className="block text-sm text-[#a1a1a1] mb-2">Daily Spending Limit</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={spending.dailyLimit}
                  onChange={(e) => setSpending({ ...spending, dailyLimit: parseFloat(e.target.value) })}
                  className="w-24 bg-[#0a0a0a] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white"
                  step="0.1"
                />
                <span className="text-sm text-white">USDC</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#a1a1a1] mb-2">Per-Service Limit</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={spending.perServiceLimit}
                  onChange={(e) => setSpending({ ...spending, perServiceLimit: parseFloat(e.target.value) })}
                  className="w-24 bg-[#0a0a0a] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white"
                  step="0.1"
                />
                <span className="text-sm text-white">USDC</span>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={spending.enabled}
                onChange={(e) => setSpending({ ...spending, enabled: e.target.checked })}
                className="rounded border-[#262626]"
              />
              <span className="text-sm text-white">Enable spending limits</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={spending.requireConfirmation}
                onChange={(e) => setSpending({ ...spending, requireConfirmation: e.target.checked })}
                className="rounded border-[#262626]"
              />
              <span className="text-sm text-white">Require confirmation for transactions &gt; {spending.confirmationThreshold} USDC</span>
            </label>
          </div>
        </div>

        <Separator />

        {/* Appearance */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🎨</span>
            <h3 className="text-base font-semibold text-white">Appearance</h3>
          </div>
          <div className="space-y-4 pl-7">
            <div>
              <label className="block text-sm text-[#a1a1a1] mb-2">Theme</label>
              <select
                value={appearance.theme}
                onChange={(e) => setAppearance({ ...appearance, theme: e.target.value as any })}
                className="bg-[#0a0a0a] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#a1a1a1] mb-2">Currency Display</label>
              <select
                value={appearance.currency}
                onChange={(e) => setAppearance({ ...appearance, currency: e.target.value as any })}
                className="bg-[#0a0a0a] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#a1a1a1] mb-2">Date Format</label>
              <select
                value={appearance.dateFormat}
                onChange={(e) => setAppearance({ ...appearance, dateFormat: e.target.value as any })}
                className="bg-[#0a0a0a] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Security */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🔐</span>
            <h3 className="text-base font-semibold text-white">Security</h3>
          </div>
          <div className="space-y-3 pl-7">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={security.requireWalletSignature}
                onChange={(e) => setSecurity({ ...security, requireWalletSignature: e.target.checked })}
                className="rounded border-[#262626]"
              />
              <span className="text-sm text-white">Require wallet signature for all transactions</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={security.autoLock}
                onChange={(e) => setSecurity({ ...security, autoLock: e.target.checked })}
                className="rounded border-[#262626]"
              />
              <span className="text-sm text-white">Auto-lock after {security.autoLockMinutes} minutes of inactivity</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer opacity-50">
              <input
                type="checkbox"
                checked={false}
                disabled
                className="rounded border-[#262626]"
              />
              <span className="text-sm text-white">Enable two-factor authentication (Coming soon)</span>
            </label>
          </div>
        </div>

        <Separator />

        <Button variant="primary" size="sm" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </Card>
  );
};

export default Preferences;

