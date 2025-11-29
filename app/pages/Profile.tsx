import React from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const Profile: React.FC = () => {
  return (
    <DashboardLayout>
      <h1 className="text-xl md:text-2xl font-semibold mb-4">Profile & Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <div className="font-medium mb-2">Wallet Information</div>
          <div className="text-sm text-zinc-400 space-y-2">
            <div>Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb</div>
            <div>Network: Avalanche Fuji Testnet</div>
            <div>Connected: 2 days ago</div>
            <div className="pt-2"><Button variant="outline">Disconnect Wallet</Button></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="font-medium mb-2">Account Stats</div>
          <div className="text-sm text-zinc-400 space-y-1">
            <div>Member Since: Nov 27, 2024</div>
            <div>Total Spent: 7.41 AVAX ($296.40)</div>
            <div>Total Saved: $142.35 vs subscriptions</div>
            <div>Services Used: 4</div>
            <div>Total Sessions: 127</div>
          </div>
        </Card>
      </div>

      <Card className="p-4 mb-6">
        <div className="font-medium mb-2">Preferences</div>
        <div className="text-sm text-zinc-400 space-y-3">
          <div>
            <div className="font-medium text-zinc-300 mb-1">Notifications</div>
            <div className="space-y-1">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Low balance alerts (&lt; 0.1 AVAX)</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Stream started/stopped</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Weekly usage summary</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Marketing emails</label>
            </div>
          </div>
          <div>
            <div className="font-medium text-zinc-300 mb-1">Spending Limits</div>
            <div className="flex flex-wrap items-center gap-2">
              <span>Daily limit:</span>
              <input className="w-24 rounded-md bg-zinc-900 border border-zinc-800 px-2 py-1" defaultValue="1.0" />
              <span>AVAX</span>
              <span className="ml-4">Per-service limit:</span>
              <input className="w-24 rounded-md bg-zinc-900 border border-zinc-800 px-2 py-1" defaultValue="0.5" />
              <span>AVAX</span>
              <label className="flex items-center gap-2 ml-4"><input type="checkbox" defaultChecked /> Enable spending limits</label>
            </div>
          </div>
          <div>
            <div className="font-medium text-zinc-300 mb-1">Appearance</div>
            <select className="rounded-md bg-zinc-900 border border-zinc-800 px-2 py-1">
              <option>Dark</option>
              <option>Light</option>
              <option>System</option>
            </select>
          </div>
          <div>
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="font-medium mb-2">Danger Zone</div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Button variant="outline">Export All Data</Button>
          <Button variant="outline">Clear History</Button>
          <Button variant="secondary">Delete Account</Button>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default Profile;
