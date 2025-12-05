import React from 'react';
import Card from '@/components/ui/Card';

interface StorageStatsProps {
  totalSpent: number;
  totalStored: number;
  activeFiles: number;
  storageTime: number;
}

const StorageStats: React.FC<StorageStatsProps> = ({
  totalSpent,
  totalStored,
  activeFiles,
  storageTime,
}) => {
  const [displayMinutes, setDisplayMinutes] = React.useState<number>(storageTime);
  const baseRef = React.useRef<{ baseMinutes: number; baseTs: number; baseActive: number } | null>(null);
  const animationRef = React.useRef<number | null>(null);
  const lastUpdateRef = React.useRef<number>(0);

  React.useEffect(() => {
    baseRef.current = { baseMinutes: storageTime, baseTs: Date.now(), baseActive: activeFiles };
    setDisplayMinutes(storageTime);
    lastUpdateRef.current = Date.now();
  }, [storageTime, activeFiles]);

  React.useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const b = baseRef.current;
      if (!b) return;
      
      const dtMs = now - b.baseTs;
      const inc = (b.baseActive * dtMs) / 60000;
      const targetValue = b.baseMinutes + inc;
      
      // Smooth transition using linear interpolation
      const timeSinceLastUpdate = now - lastUpdateRef.current;
      const smoothingFactor = Math.min(1, timeSinceLastUpdate / 100); // Smooth over 100ms
      const newValue = displayMinutes + (targetValue - displayMinutes) * smoothingFactor;
      
      setDisplayMinutes(newValue);
      lastUpdateRef.current = now;
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [displayMinutes]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Total Spent</div>
        <div className="text-3xl font-semibold text-white font-mono">{totalSpent.toFixed(6)} USDC</div>
      </Card>

      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Total Stored</div>
        <div className="text-3xl font-semibold text-white font-mono">{totalStored.toFixed(2)} MB</div>
      </Card>

      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Active Files</div>
        <div className="text-3xl font-semibold text-white font-mono">{activeFiles} files</div>
      </Card>

      <Card className="p-6" hoverEffect={true}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-[#a1a1a1] mb-2">Storage Time</div>
          <span className="ml-2 inline-flex items-center gap-1 text-xs text-emerald-300">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>
        <div className="text-3xl font-semibold text-white font-mono">
          {displayMinutes.toFixed(2)} minutes
        </div>
      </Card>
    </div>
  );
};

export default StorageStats;

