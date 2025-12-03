import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { OwnedVideo } from './types';
import { fetchOEmbed, getYouTubeId } from './youtube';

interface YourLibraryProps {
  videos: OwnedVideo[];
  onWatch: (video: OwnedVideo) => void;
}

const YT_URLS = [
  'https://youtu.be/k18gSPjWDM0',
  'https://youtu.be/yKbkQ6Vndss',
  'https://youtu.be/c1rBk7XAlj0',
  'https://youtu.be/SZywj7k6tBI',
  'https://youtu.be/fKoHcAM0PEk',
  'https://youtu.be/flxZd7EFhSo',
];

// Simple placeholder duration generator (2:00 to 18:00)
const randomDuration = (): string => {
  const min = 2 * 60; // 2 minutes
  const max = 18 * 60; // 18 minutes
  const totalSeconds = Math.floor(Math.random() * (max - min + 1)) + min;
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

const YourLibrary: React.FC<YourLibraryProps> = ({ videos, onWatch }) => {
  const [fetched, setFetched] = useState<OwnedVideo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    const run = async () => {
      if (videos && videos.length > 0) return; // props take precedence
      setLoading(true);
      const results = await Promise.all(
        YT_URLS.map(async (url) => {
          const id = getYouTubeId(url) ?? url;
          const meta = await fetchOEmbed(url);
          const duration = randomDuration();
          return {
            id,
            title: meta?.title ?? 'YouTube Video',
            duration, // dynamic if API key present, else fallback
            quality: '1080p',
            thumbnail: meta?.thumbnail_url ?? `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
            streamPrice: 0.00005,
            purchasePrice: 0.25,
            description: meta?.author_name ? `by ${meta.author_name}` : undefined,
            watchCount: 0,
          } as OwnedVideo;
        })
      );
      if (!ignore) {
        setFetched(results);
        setLoading(false);
      }
    };
    run();
    return () => { ignore = true; };
  }, [videos]);

  const list = (videos && videos.length > 0) ? videos : fetched;

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
              <div className="text-xs text-[#a1a1a1] mb-3">Watched {video.watchCount}x</div>
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

