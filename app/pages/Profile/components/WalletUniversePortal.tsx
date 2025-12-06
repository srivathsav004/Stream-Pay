import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletInfo } from '../types';

interface WalletUniversePortalProps {
  wallet: WalletInfo;
  identiconColor: string;
  onClose: () => void;
}

interface Transaction {
  id: string;
  x: number;
  y: number;
  z: number;
  type: 'send' | 'receive';
  amount: number;
}

const WalletUniversePortal: React.FC<WalletUniversePortalProps> = ({
  wallet,
  identiconColor,
  onClose,
}) => {
  const [phase, setPhase] = React.useState<'opening' | 'reveal' | 'interactive'>('opening');
  const [transactions] = React.useState<Transaction[]>(() => {
    // Generate mock transaction positions in 3D space
    return Array.from({ length: 14 }, (_, i) => ({
      id: `tx-${i}`,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      z: (Math.random() - 0.5) * 400,
      type: Math.random() > 0.5 ? 'send' : 'receive',
      amount: Math.random() * 100,
    }));
  });

  useEffect(() => {
    // Phase transitions
    const timer1 = setTimeout(() => setPhase('reveal'), 800);
    const timer2 = setTimeout(() => setPhase('interactive'), 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Close button */}
        <motion.button
          className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-zinc-900/80 border border-zinc-700 text-white flex items-center justify-center hover:bg-zinc-800 transition-colors"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ✕
        </motion.button>

        {/* Portal Content */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Phase 1: Portal Opening */}
          {phase === 'opening' && (
            <motion.div
              className="relative"
              initial={{ scale: 1 }}
              animate={{ scale: 3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Avatar explosion */}
              <motion.div
                className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, ${identiconColor}, ${identiconColor}dd)`,
                }}
                animate={{
                  boxShadow: [
                    `0 0 0 0 ${identiconColor}40`,
                    `0 0 0 200px ${identiconColor}00`,
                  ],
                }}
                transition={{ duration: 0.8 }}
              >
                {wallet.address.slice(2, 4).toUpperCase()}
              </motion.div>
            </motion.div>
          )}

          {/* Phase 2 & 3: Universe Reveal */}
          {(phase === 'reveal' || phase === 'interactive') && (
            <motion.div
              className="relative w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Central Sun (Wallet Provider) */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                  style={{
                    background: `radial-gradient(circle, ${identiconColor}, ${identiconColor}80)`,
                    boxShadow: `0 0 60px ${identiconColor}80`,
                  }}
                >
                  {wallet.address.slice(2, 4).toUpperCase()}
                </div>
              </motion.div>

              {/* Transaction Stars */}
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transform: `translate(${tx.x}px, ${tx.y}px)`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: tx.x,
                    y: tx.y,
                  }}
                  transition={{
                    delay: 1 + index * 0.05,
                    type: 'spring',
                    stiffness: 100,
                  }}
                  whileHover={{ scale: 1.5, zIndex: 10 }}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      tx.type === 'send' ? 'bg-red-400' : 'bg-green-400'
                    }`}
                    style={{
                      boxShadow: `0 0 10px ${
                        tx.type === 'send' ? 'rgba(248, 113, 113, 0.8)' : 'rgba(74, 222, 128, 0.8)'
                      }`,
                    }}
                  />
                </motion.div>
              ))}

              {/* Connecting Lines */}
              {phase === 'interactive' && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {transactions.map((tx) => {
                    // Calculate percentage positions relative to viewport
                    const centerX = 50;
                    const centerY = 50;
                    const offsetX = (tx.x / 400) * 25; // Scale to reasonable percentage
                    const offsetY = (tx.y / 400) * 25;
                    return (
                      <motion.line
                        key={`line-${tx.id}`}
                        x1={`${centerX}%`}
                        y1={`${centerY}%`}
                        x2={`${centerX + offsetX}%`}
                        y2={`${centerY + offsetY}%`}
                        stroke={identiconColor}
                        strokeWidth="1"
                        strokeOpacity="0.3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                      />
                    );
                  })}
                </svg>
              )}

              {/* Network Planets */}
              <motion.div
                className="absolute top-20 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 border border-zinc-700 rounded-full">
                  <img src="/avax-icon.svg" alt="AVAX" className="w-5 h-5" />
                  <span className="text-white text-sm">{wallet.network}</span>
                </div>
              </motion.div>

              {/* Info Panel */}
              {phase === 'interactive' && (
                <motion.div
                  className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-zinc-900/80 border border-zinc-700 rounded-lg p-4 max-w-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  <div className="text-white text-center">
                    <div className="text-lg font-bold mb-2">Wallet Universe</div>
                    <div className="text-sm text-zinc-400">
                      {transactions.length} transactions visualized
                    </div>
                    <div className="text-xs text-zinc-500 mt-2">
                      Hover over stars to see transaction details
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WalletUniversePortal;

