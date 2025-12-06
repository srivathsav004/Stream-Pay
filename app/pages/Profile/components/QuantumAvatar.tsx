import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletInfo } from '../types';
import DataPanels from './DataPanels';
import WalletUniversePortal from './WalletUniversePortal';

interface QuantumAvatarProps {
  wallet: WalletInfo;
}

// Generate identicon color from address
const generateIdenticon = (address: string) => {
  const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  const saturation = 60 + (hash % 20);
  const lightness = 50 + (hash % 20);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const QuantumAvatar: React.FC<QuantumAvatarProps> = ({ wallet }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [avatarPosition, setAvatarPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const avatarRef = useRef<HTMLDivElement>(null);
  const identiconColor = generateIdenticon(wallet.address);
  const avatarInitials = wallet.address.slice(2, 4).toUpperCase();

  // Update avatar position for panel positioning
  useEffect(() => {
    const updatePosition = () => {
      if (avatarRef.current) {
        const rect = avatarRef.current.getBoundingClientRect();
        setAvatarPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isHovered]);

  return (
    <>
      <div className="relative flex flex-col items-center justify-center">
        {/* Avatar with hover/click handlers */}
        <motion.div
          ref={avatarRef}
          className="relative cursor-pointer"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={() => setIsPortalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Removed water ripple effect */}
          <motion.div 
            className="absolute inset-0 rounded-full overflow-hidden"
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            <motion.div 
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 50% 50%, 
                  ${identiconColor}20, 
                  transparent 60%
                )`,
                opacity: 0,
              }}
              animate={{
                opacity: isHovered ? [0, 0.4, 0] : 0,
                scale: isHovered ? [0.8, 1.2] : 1,
              }}
              transition={{
                duration: 2,
                repeat: isHovered ? Infinity : 0,
                delay: 0.2,
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          {/* Main avatar circle */}
          <motion.div
            className="relative w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl z-10"
            style={{
              background: `linear-gradient(135deg, ${identiconColor}, ${identiconColor}dd)`,
            }}
            animate={{
              boxShadow: isHovered
                ? `0 0 30px ${identiconColor}80, 0 0 60px ${identiconColor}40`
                : '0 10px 30px rgba(0,0,0,0.3)',
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Holographic shimmer overlay */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)`,
              }}
              animate={{
                rotate: isHovered ? 360 : 0,
              }}
              transition={{
                duration: 3,
                repeat: isHovered ? Infinity : 0,
                ease: 'linear',
              }}
            />

            {/* Initials */}
            <span className="relative z-10">{avatarInitials}</span>

            {/* Water droplet effect */}
            {[0, 1, 2].map((i) => {
              // Random positions for droplets
              const angle = (i * 120 * Math.PI) / 180;
              const distance = 0.4;
              const x = 50 + Math.cos(angle) * 30;
              const y = 50 + Math.sin(angle) * 30;
              
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: '20%',
                    height: '20%',
                    background: `radial-gradient(circle at 30% 30%, white, ${identiconColor}60)`,
                    x: `${x}%`,
                    y: `${y}%`,
                    opacity: 0,
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{
                    y: isHovered ? [`${y}%`, `${y - 20}%`] : `${y}%`,
                    opacity: isHovered ? [0, 0.8, 0] : 0,
                    scale: isHovered ? [0.5, 1.2] : 0.5,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isHovered ? Infinity : 0,
                    delay: i * 0.4,
                    ease: 'easeOut',
                  }}
                />
              );
            })}
            
            {/* Water surface reflection */}
            <motion.div 
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{
                background: `radial-gradient(circle at 50% 30%, 
                  rgba(255,255,255,0.3) 0%, 
                  transparent 60%
                )`,
                opacity: 0.5,
              }}
              animate={{
                opacity: isHovered ? [0.5, 0.2, 0.5] : 0.5,
              }}
              transition={{
                duration: 2,
                repeat: isHovered ? Infinity : 0,
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          {/* Hint text */}
          <motion.div
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-[#a1a1a1] whitespace-nowrap"
            animate={{
              opacity: isHovered ? 1 : 0.5,
            }}
          >
            {isHovered ? 'Click to explore' : 'Wallet Identicon'}
          </motion.div>
        </motion.div>

      </div>

      {/* Data Panels - appear on hover (desktop only) - Fixed positioning overlay */}
      <AnimatePresence>
        {isHovered && !isPortalOpen && (
          <div className="hidden md:block">
            <DataPanels 
              wallet={wallet} 
              identiconColor={identiconColor}
              avatarPosition={avatarPosition}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Full-screen portal */}
      <AnimatePresence>
        {isPortalOpen && (
          <WalletUniversePortal
            wallet={wallet}
            identiconColor={identiconColor}
            onClose={() => setIsPortalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default QuantumAvatar;

