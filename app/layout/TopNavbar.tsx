import React from 'react';
import { Wallet } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useWallet } from '@/app/state/WalletContext';

interface TopNavbarProps {
  sidebarWidth?: string;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ sidebarWidth = '56px' }) => {
  const { connected, balanceAvax, connect, disconnect } = useWallet();

  return (
    <div 
      className="fixed top-0 right-0 h-14 border-b border-zinc-800/60 bg-zinc-950/95 backdrop-blur-lg"
      style={{
        left: sidebarWidth,
        transition: 'left 0.3s ease',
        width: `calc(100% - ${sidebarWidth})`
      }}
    >
      <div className="flex h-full items-center justify-end px-6 w-full">
        <div className="flex items-center gap-3">
          {connected ? (
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium px-3 py-1.5 rounded-md bg-zinc-800/50 text-zinc-200">
                {balanceAvax.toFixed(3)} AVAX
              </div>
              <Button variant="outline" size="sm" onClick={disconnect} className="gap-2">
                <Wallet className="h-4 w-4" /> Disconnect
              </Button>
            </div>
          ) : (
            <Button variant="primary" size="sm" onClick={connect} className="gap-2">
              <Wallet className="h-4 w-4" /> Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
