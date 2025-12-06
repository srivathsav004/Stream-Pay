import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { WalletInfo } from '../../types';

interface WalletProviderPanelProps {
  wallet: WalletInfo;
}

// Detect wallet provider from window.ethereum
const detectWalletProvider = () => {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    return { name: 'Unknown', color: '#6b7280', icon: null };
  }

  const ethereum = (window as any).ethereum;
  
  // Check for MetaMask
  if (ethereum.isMetaMask) {
    return {
      name: 'MetaMask',
      color: '#f6851b',
      icon: '/walllets/metamask.svg',
    };
  }
  
  // Check for Coinbase Wallet
  if (ethereum.isCoinbaseWallet || ethereum.providers?.some((p: any) => p.isCoinbaseWallet)) {
    return {
      name: 'Coinbase Wallet',
      color: '#0052ff',
      icon: '/walllets/coinbase.svg',
    };
  }
  
  // Check for Phantom
  if (ethereum.isPhantom) {
    return {
      name: 'Phantom',
      color: '#ab9ff2',
      icon: '/walllets/phantom.svg',
    };
  }
  
  // Check for Core (Avalanche Wallet)
  if (ethereum.isAvalanche || ethereum.isCore) {
    return {
      name: 'Core',
      color: '#000000',
      icon: null, // No icon available in public/walllets
    };
  }
  
  // Default to Injected if injected provider exists
  if (ethereum.isInjected) {
    return {
      name: 'Injected',
      color: '#6b7280',
      icon: null,
    };
  }
  
  return { name: 'Unknown', color: '#6b7280', icon: null };
};

const WalletProviderPanel: React.FC<WalletProviderPanelProps> = ({ wallet }) => {
  const [connectedSince, setConnectedSince] = useState('');
  const [walletProvider, setWalletProvider] = useState(detectWalletProvider());

  useEffect(() => {
    // Re-detect on mount
    setWalletProvider(detectWalletProvider());
  }, []);

  useEffect(() => {
    // Calculate time since connection
    const calculateTimeSince = () => {
      try {
        const date = new Date(wallet.connectedAt);
        const now = new Date();
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
          return wallet.connectedAt || 'Recently';
        }
        
        const diffMs = now.getTime() - date.getTime();
        
        // Check if date is in the future (invalid)
        if (diffMs < 0) {
          return 'Recently';
        }
        
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
          if (diffHours === 0) {
            const diffMins = Math.floor(diffMs / (1000 * 60));
            return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
          }
          return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        }
        return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
      } catch (error) {
        return wallet.connectedAt || 'Recently';
      }
    };

    setConnectedSince(calculateTimeSince());
  }, [wallet.connectedAt]);

  return (
    <motion.div
      className="quantum-panel relative overflow-hidden"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Holographic background */}
      <div className="absolute inset-0 quantum-holographic-bg opacity-30" />
      
      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Logo and Provider Name */}
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: walletProvider.color }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {walletProvider.icon ? (
              <img 
                src={walletProvider.icon} 
                alt={walletProvider.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initial if icon fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.innerHTML = `<span class="text-white font-bold text-lg">${walletProvider.name[0]}</span>`;
                  }
                }}
              />
            ) : (
              <span className="text-white font-bold text-lg">{walletProvider.name[0]}</span>
            )}
          </motion.div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white uppercase tracking-wider">
              {walletProvider.name}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#00ff88' }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <span className="text-xs text-[#a1a1a1]">Connected</span>
            </div>
          </div>
        </div>

        {/* Connection Info */}
        <div className="text-xs text-[#a1a1a1]">
          Since: {connectedSince}
        </div>
      </div>
    </motion.div>
  );
};

export default WalletProviderPanel;

