import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { OwnedVideo } from './types';
 

interface YourLibraryProps {
  videos: OwnedVideo[];
  onWatch: (video: OwnedVideo) => void;
}

const YourLibrary: React.FC<YourLibraryProps> = ({ videos, onWatch }) => {
  const [loading] = useState(false);
  const list = (videos && videos.length > 0) ? videos : [];

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Your Library ({list.length} Videos)</h2>
        <Button variant="ghost" size="sm">View All →</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading && list.length === 0 && Array.from({ length: 4 }).map((_, i) => (
          <Card key={`skeleton-${i}`} className="overflow-hidden">
            <div className="aspect-video bg-[#262626] animate-pulse" />
            <div className="p-4">
              <div className="h-4 bg-[#262626] rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-3 bg-[#262626] rounded w-1/2 mb-4 animate-pulse" />
              <div className="h-8 bg-[#0a0a0a] border border-[#262626] rounded animate-pulse" />
            </div>
          </Card>
        ))}
        {!loading && list.length === 0 && (
          <Card className="col-span-full p-8 text-center border-dashed">
            <div className="text-4xl mb-2">🎬</div>
            <div className="text-white font-medium mb-1">No videos in your library yet</div>
            <div className="text-sm text-[#a1a1a1] mb-4">Purchase or stream a video to see it appear here.</div>
            <Button variant="primary" size="sm">Browse Videos</Button>
          </Card>
        )}
        {list.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:border-blue-600">
            <div
              className="relative aspect-video bg-[#262626] cursor-pointer group"
              onClick={() => onWatch(video)}
            >
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
              <div className="text-[11px] text-[#8a8a8a] mb-2 font-mono">
                ID: {video.id} {video.catalogId != null && (
                  <span className="ml-2">• Catalog #{video.catalogId}</span>
                )}
              </div>
              {/* <div className="text-xs text-[#a1a1a1] mb-3">Watched {video.watchCount}x</div> */}
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => onWatch(video)}
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

