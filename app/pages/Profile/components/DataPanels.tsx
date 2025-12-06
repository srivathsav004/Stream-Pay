import React from 'react';
import { motion } from 'framer-motion';
import { WalletInfo } from '../types';
import WalletProviderPanel from './panels/WalletProviderPanel';
import NetworkStatsPanel from './panels/NetworkStatsPanel';
import TransactionDataPanel from './panels/TransactionDataPanel';
import TokenHoldingsPanel from './panels/TokenHoldingsPanel';
import ActivityHeatmapPanel from './panels/ActivityHeatmapPanel';

interface DataPanelsProps {
  wallet: WalletInfo;
  identiconColor: string;
  avatarPosition: { top: number; left: number; width: number; height: number };
}

const DataPanels: React.FC<DataPanelsProps> = ({ wallet, identiconColor, avatarPosition }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      x: 100, 
      y: 0,
      opacity: 0, 
      scale: 0.8,
      rotate: -5,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
  };

  // Calculate positions for 3 panels in a curved layout
  const panelWidth = 300; // Width of quantum-panel
  const panelHeight = 160; // Approximate height per panel
  const totalPanels = 3;
  const horizontalOffset = 50; // Base offset from avatar
  const gapBetweenPanels = 0; // Equal gap between panels (bottom to top) - consistent spacing
  const curveIntensity = 100; // Curve intensity
  const rightShift = 60; // Rightward shift for all panels
  
  // Calculate the total spacing needed: panel height + gap
  const spacingPerPanel = panelHeight + gapBetweenPanels;

  // Calculate positions along a smooth curved path
  const getPanelPosition = (index: number) => {
    // Calculate base position closer to avatar
    const baseX = avatarPosition.left + avatarPosition.width + horizontalOffset;
    const baseY = avatarPosition.top + avatarPosition.height / 2;
    
    // Create a smooth arc: panels spread vertically with a natural curve
    // Use a quadratic curve for smoothness
    const t = index / (totalPanels - 1); // 0 to 1 (normalized position)
    
    // Calculate vertical position with EQUAL gaps between panels
    // First panel starts above center, then each subsequent panel is spaced by (height + gap)
    const firstPanelTop = baseY - (panelHeight / 2) - spacingPerPanel; // Start above center
    const verticalOffset = firstPanelTop + (index * spacingPerPanel);
    
    // Create a smooth horizontal curve using a quadratic function
    // This creates a natural arc where middle panel is furthest out
    const curveFactor = 4 * t * (1 - t); // Quadratic curve (0 at edges, 1 at center)
    // Apply curve with base shift and intensity, using a cubic easing for a smoother curve
    const easedCurve = curveFactor * curveFactor * (3 - 2 * curveFactor); // Cubic easing
    const horizontalCurve = rightShift + (easedCurve * curveIntensity);
    
    return {
      left: baseX + horizontalCurve,
      top: verticalOffset, // Top position of the panel
    };
  };

  // Ensure panels don't go off-screen
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

  const panels = [
    { component: WalletProviderPanel, index: 0 },
    { component: NetworkStatsPanel, index: 1 },
    { component: TokenHoldingsPanel, index: 2 },
  ];

  return (
    <>
      {/* Panels positioned along curve - no connecting lines */}
      {panels.map((panel, index) => {
        const pos = getPanelPosition(panel.index);
        
        // Adjust if panel would overflow viewport
        let adjustedLeft = pos.left;
        let adjustedTop = pos.top;
        
        if (adjustedLeft + panelWidth > viewportWidth) {
          adjustedLeft = avatarPosition.left - panelWidth - 40;
        }
        if (adjustedLeft < 0) {
          adjustedLeft = 16;
        }
        if (adjustedTop < 16) {
          adjustedTop = 16;
        }
        if (adjustedTop + panelHeight > viewportHeight - 16) {
          adjustedTop = viewportHeight - panelHeight - 16;
        }

        const PanelComponent = panel.component;
        
        return (
          <motion.div
            key={`panel-${index}`}
            className="fixed z-[9998]"
            variants={itemVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            style={{
              left: `${adjustedLeft}px`,
              top: `${adjustedTop}px`,
              pointerEvents: 'auto',
            }}
          >
            <PanelComponent wallet={wallet} />
          </motion.div>
        );
      })}
    </>
  );
};

export default DataPanels;

