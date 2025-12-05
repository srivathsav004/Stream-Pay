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
        <div className="text-sm text-[#a1a1a1] mb-2">Storage Time</div>
        <div className="text-3xl font-semibold text-white font-mono">{storageTime} minutes</div>
      </Card>
    </div>
  );
};

export default StorageStats;

