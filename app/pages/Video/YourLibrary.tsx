import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { OwnedVideo } from './types';

interface YourLibraryProps {
  videos: OwnedVideo[];
  onWatch: (videoId: string) => void;
}

const YourLibrary: React.FC<YourLibraryProps> = ({ videos, onWatch }) => {
  if (videos.length === 0) return null;

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Your Library ({videos.length} Videos)</h2>
        <Button variant="ghost" size="sm">View All →</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:border-blue-600">
            <div className="relative aspect-video bg-[#262626]">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="success" className="!bg-[#10b981] !text-white !border-[#10b981]">
                  ✓ OWNED
                </Badge>
              </div>
              <div className="absolute bottom-2 left-2 text-xs text-white bg-black/70 px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-white mb-1 line-clamp-2">{video.title}</h3>
              <div className="text-xs text-[#a1a1a1] mb-3">Watched {video.watchCount}x</div>
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => onWatch(video.id)}
              >
                ▶ Watch
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default YourLibrary;

