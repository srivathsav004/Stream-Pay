import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useBalance } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { readEscrowBalance } from '@/app/shared/contracts/balance';
import { balanceRefreshEmitter } from '@/app/layout/TopNavbar';
import { WalletInfo } from '../../types';

interface TokenHoldingsPanelProps {
  wallet: WalletInfo;
}

const TokenHoldingsPanel: React.FC<TokenHoldingsPanelProps> = ({ wallet }) => {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    chainId: avalancheFuji.id,
    query: { 
      enabled: !!address,
      refetchInterval: 30000,
    },
  });
  const { data: usdcBalance, refetch: refetchUsdcBalance } = useBalance({
    address,
    chainId: avalancheFuji.id,
    token: '0x5425890298aed601595a70ab815c96711a31bc65',
    query: { 
      enabled: !!address,
      refetchInterval: 30000,
    },
  });
  
  // Escrow functionality commented out as per request
  // const [escrowBalance, setEscrowBalance] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Listen for balance refresh events
  useEffect(() => {
    const unsubscribe = balanceRefreshEmitter.subscribe(() => {
      setRefreshTrigger(prev => prev + 1);
      refetchUsdcBalance();
    });
    return unsubscribe;
  }, [refetchUsdcBalance]);
  
  // Escrow balance fetching commented out
  // useEffect(() => {
  //   if (address) {
  //     readEscrowBalance(address).then(balance => {
  //       setEscrowBalance(balance);
  //     }).catch(err => {
  //       console.error('Failed to fetch escrow balance:', err);
  //       setEscrowBalance(0);
  //     });
  //   } else {
  //     setEscrowBalance(0);
  //   }
  // }, [address, refreshTrigger]);

  const tokens = [
    {
      symbol: 'AVAX',
      amount: balance ? Number(balance.formatted) : 0,
      icon: '/avax-icon.svg',
      color: '#E84142',
    },
    {
      symbol: 'USDC',
      amount: usdcBalance ? Number(usdcBalance.formatted) : 0,
      icon: '/usdc-icon.svg',
      color: '#2775CA',
    },
    // Escrow entry removed as per request
    // {
    //   symbol: 'Escrow',
    //   amount: escrowBalance,
    //   icon: '/usdc-icon.svg',
    //   color: '#8b5cf6',
    //   isEscrow: true,
    // },
  ];

  return (
    <motion.div
      className="quantum-panel relative overflow-hidden"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Holographic background */}
      <div className="absolute inset-0 quantum-holographic-bg opacity-30" />
      
      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          💰 Holdings
        </div>

        <div className="space-y-3">
          {tokens.map((token, index) => (
            <motion.div
              key={token.symbol}
              className="flex items-center justify-between"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 2 }}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={token.icon}
                    alt={token.symbol}
                    className="w-7 h-7"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{token.symbol}</div>
                </div>
              </div>
              <div className="text-right">
                <motion.div
                  className="text-sm font-mono font-semibold text-white"
                  key={token.amount}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {token.amount.toFixed(token.symbol === 'USDC' ? 2 : 3)}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TokenHoldingsPanel;

