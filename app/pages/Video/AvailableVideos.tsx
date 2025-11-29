import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Video } from './types';

interface AvailableVideosProps {
  videos: Video[];
  onStream: (video: Video) => void;
  onPurchase: (video: Video) => void;
}

const AvailableVideos: React.FC<AvailableVideosProps> = ({ videos, onStream, onPurchase }) => {
  const calculateStreamCost = (duration: string, rate: number): number => {
    const [minutes, seconds] = duration.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    return totalSeconds * rate;
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-white mb-6">Available Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => {
          const streamCost = calculateStreamCost(video.duration, video.streamPrice);
          return (
            <Card key={video.id} className="overflow-hidden hover:border-blue-600">
              <div className="relative aspect-video bg-[#262626]">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 text-xs text-white bg-black/70 px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-white mb-1">{video.title}</h3>
                <div className="text-xs text-[#a1a1a1] mb-4">
                  {video.duration} • {video.quality}
                </div>

                {/* Stream Option */}
                <Card className="p-3 mb-3 bg-[#0a0a0a] border-[#262626]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🎬</span>
                    <span className="text-sm font-medium text-white">Stream</span>
                  </div>
                  <div className="text-xs text-[#a1a1a1] mb-1">
                    {video.streamPrice} AVAX/sec
                  </div>
                  <div className="text-xs text-[#a1a1a1] mb-3">
                    ~{streamCost.toFixed(4)} AVAX total
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => onStream(video)}
                  >
                    Stream Now
                  </Button>
                </Card>

                {/* Purchase Option */}
                <Card className="p-3 bg-[#0a0a0a] border-[#262626]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">💎</span>
                    <span className="text-sm font-medium text-white">Buy Once</span>
                  </div>
                  <div className="text-xs text-[#a1a1a1] mb-1">
                    {video.purchasePrice} AVAX
                  </div>
                  <div className="text-xs text-[#a1a1a1] mb-3">
                    Own forever
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => onPurchase(video)}
                  >
                    Buy Now
                  </Button>
                </Card>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AvailableVideos;

