import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { WalletInfo } from '../../types';

interface TransactionDataPanelProps {
  wallet: WalletInfo;
}

const TransactionDataPanel: React.FC<TransactionDataPanelProps> = ({ wallet }) => {
  const [totalTx, setTotalTx] = useState(0);
  const [targetTx] = useState(14); // Mock data
  const [walletAge, setWalletAge] = useState(0);

  useEffect(() => {
    // Calculate wallet age
    const date = new Date(wallet.connectedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    setWalletAge(diffDays);

    // Animate counter
    const duration = 1000;
    const steps = 30;
    const increment = targetTx / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetTx) {
        setTotalTx(targetTx);
        clearInterval(timer);
      } else {
        setTotalTx(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetTx, wallet.connectedAt]);

  const firstTxDate = new Date(wallet.connectedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      className="quantum-panel relative overflow-hidden"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Holographic background */}
      <div className="absolute inset-0 quantum-holographic-bg opacity-30" />
      
      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="text-sm font-bold text-white uppercase tracking-wider mb-3">
          📊 Wallet Activity
        </div>

        {/* Total Transactions */}
        <div className="mb-3">
          <div className="text-xs text-[#a1a1a1] mb-1">Total TX</div>
          <motion.div
            className="text-2xl font-mono font-bold text-white"
            key={totalTx}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {totalTx}
          </motion.div>
        </div>

        {/* First Transaction */}
        <div className="mb-3">
          <div className="text-xs text-[#a1a1a1] mb-1">First TX</div>
          <div className="text-sm text-white">{firstTxDate}</div>
        </div>

        {/* Wallet Age Progress */}
        <div>
          <div className="text-xs text-[#a1a1a1] mb-1">Age: {walletAge} days</div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((walletAge / 30) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionDataPanel;

