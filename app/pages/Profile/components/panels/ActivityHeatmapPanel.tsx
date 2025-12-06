import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WalletInfo } from '../../types';

interface ActivityHeatmapPanelProps {
  wallet: WalletInfo;
}

const ActivityHeatmapPanel: React.FC<ActivityHeatmapPanelProps> = ({ wallet }) => {
  // Generate mock activity data for last 30 days
  const generateActivityData = () => {
    const days = 30;
    const data = [];
    for (let i = 0; i < days; i++) {
      data.push({
        day: i,
        count: Math.floor(Math.random() * 10),
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000),
      });
    }
    return data;
  };

  const [activityData] = useState(generateActivityData());
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const maxActivity = Math.max(...activityData.map((d) => d.count));

  const getIntensity = (count: number) => {
    if (count === 0) return 0;
    return Math.min((count / maxActivity) * 100, 100);
  };

  const mostActiveDay = activityData.reduce((max, day) =>
    day.count > max.count ? day : max
  );

  return (
    <motion.div
      className="quantum-panel relative overflow-hidden"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Holographic background */}
      <div className="absolute inset-0 quantum-holographic-bg opacity-30" />
      
      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="text-sm font-bold text-white uppercase tracking-wider mb-3">
          📅 Activity (Last 30 Days)
        </div>

        {/* Heatmap Grid */}
        <div className="flex gap-1 mb-3 flex-wrap">
          {activityData.map((day, index) => {
            const intensity = getIntensity(day.count);
            return (
              <motion.div
                key={day.day}
                className="w-3 h-3 rounded-sm cursor-pointer"
                style={{
                  backgroundColor: intensity > 0
                    ? `rgba(0, 255, 136, ${intensity / 100})`
                    : 'rgba(255, 255, 255, 0.1)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.02 }}
                whileHover={{
                  scale: 1.5,
                  zIndex: 10,
                }}
                onHoverStart={() => setHoveredDay(day.day)}
                onHoverEnd={() => setHoveredDay(null)}
              >
                {hoveredDay === day.day && (
                  <motion.div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-zinc-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: {day.count} TX
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Most Active Day */}
        <div className="text-xs text-[#a1a1a1]">
          Most Active:{' '}
          <span className="text-white font-semibold">
            {mostActiveDay.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ({mostActiveDay.count} TX)
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityHeatmapPanel;

