import React from 'react';
import { motion } from 'framer-motion';
import { WalletInfo } from '../../types';

interface NetworkStatsPanelProps {
  wallet: WalletInfo;
}

const NetworkStatsPanel: React.FC<NetworkStatsPanelProps> = ({ wallet }) => {
  return (
    <motion.div
      className="quantum-panel relative overflow-hidden"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Holographic background */}
      <div className="absolute inset-0 quantum-holographic-bg opacity-30" />
      
      {/* Content */}
      <div className="relative z-10 p-4 h-full flex items-center justify-center">
        {/* Network Icon and Name */}
        <div className="flex flex-col items-center gap-2 text-center">
          <motion.img
            src="/avax-icon.svg"
            alt="AVAX"
            className="w-12 h-12"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <div className="text-sm font-bold text-white uppercase tracking-wider">
            Avalanche Fuji
            <div className="text-xs text-gray-400">Testnet</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NetworkStatsPanel;

