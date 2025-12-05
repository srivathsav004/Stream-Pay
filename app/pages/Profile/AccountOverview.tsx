import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { WalletInfo } from './types';

interface AccountOverviewProps {
  wallet: WalletInfo;
  onDisconnect: () => void;
}

// Simple identicon generator (creates a colorful pattern from address)
const generateIdenticon = (address: string) => {
  // Use address to generate colors
  const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  const saturation = 60 + (hash % 20);
  const lightness = 50 + (hash % 20);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const AccountOverview: React.FC<AccountOverviewProps> = ({ wallet, onDisconnect }) => {
  const identiconColor = generateIdenticon(wallet.address);
  const shortAddress = `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.address);
  };

  const handleViewExplorer = () => {
    window.open(`https://testnet.snowtrace.io/address/${wallet.address}`, '_blank');
  };

  return (
    <Card className="p-6 mb-8">
      <h2 className="text-lg font-semibold text-white mb-6">Account Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center justify-center">
          <div
            className="w-32 h-32 rounded-full mb-4 flex items-center justify-center text-4xl font-bold text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${identiconColor}, ${identiconColor}dd)`,
            }}
          >
            {wallet.address.slice(2, 4).toUpperCase()}
          </div>
          <div className="text-sm text-[#a1a1a1]">Wallet Identicon</div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-sm text-[#a1a1a1] mb-1">Wallet Address</div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-mono text-white">{shortAddress}</div>
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={handleCopy}>
                Copy
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={handleViewExplorer}>
                View on Explorer
              </Button>
            </div>
          </div>

          <div>
            <div className="text-sm text-[#a1a1a1] mb-1">Network</div>
            <Badge variant="secondary">{wallet.network}</Badge>
          </div>

          <div>
            <div className="text-sm text-[#a1a1a1] mb-1">Member Since</div>
            <div className="text-xs text-[#a1a1a1]">{wallet.connectedAt}</div>
          </div>

          <Button variant="outline" size="sm" onClick={onDisconnect}>
            Disconnect Wallet
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AccountOverview;

