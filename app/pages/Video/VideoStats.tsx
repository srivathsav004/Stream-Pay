import React from 'react';
import Card from '@/components/ui/Card';

interface VideoStatsProps {
  totalSpent: number;
  videosOwned: number;
  totalWatched: number;
  sessions: number;
}

const VideoStats: React.FC<VideoStatsProps> = ({
  totalSpent,
  videosOwned,
  totalWatched,
  sessions,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Total Spent</div>
        <div className="text-3xl font-semibold text-white">{totalSpent} USDC</div>
      </Card>

      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Videos Owned</div>
        <div className="text-3xl font-semibold text-white">{videosOwned} videos</div>
      </Card>

      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Total Watched</div>
        <div className="text-3xl font-semibold text-white">{totalWatched} hours</div>
      </Card>

      <Card className="p-6" hoverEffect={true}>
        <div className="text-sm text-[#a1a1a1] mb-2">Sessions</div>
        <div className="text-3xl font-semibold text-white">{sessions}</div>
      </Card>
    </div>
  );
};

export default VideoStats;

