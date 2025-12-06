import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { WalletInfo } from './types';
import QuantumAvatar from './components/QuantumAvatar';
import './components/styles/quantum.css';

interface AccountOverviewProps {
  wallet: WalletInfo;
  onDisconnect: () => void;
}

const AccountOverview: React.FC<AccountOverviewProps> = ({ wallet, onDisconnect }) => {
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
        <div className="flex flex-col items-center justify-center relative">
          <QuantumAvatar wallet={wallet} />
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
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{wallet.network}</Badge>
              <img 
                src="/avax-icon.svg" 
                alt="AVAX" 
                className="w-5 h-5"
              />
            </div>
          </div>

          <div>
            <div className="text-sm text-[#a1a1a1] mb-1">Member Since</div>
            <div className="text-xs text-[#a1a1a1]">{wallet.connectedAt}</div>
          </div>

          <Button variant="" size="sm" onClick={onDisconnect}>
            {/* Disconnect Wallet */}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AccountOverview;

