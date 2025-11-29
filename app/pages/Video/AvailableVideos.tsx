import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Video } from './types';
import { fetchOEmbed, fetchYouTubeDuration, getYouTubeId } from './youtube';

interface AvailableVideosProps {
  videos: Video[];
  onStream: (video: Video) => void;
  onPurchase: (video: Video) => void;
  hiddenIds?: string[];
}

const YT_URLS = [
  'https://youtu.be/RVm2Debv_Ic',
  'https://youtu.be/nTbA7qrEsP0',
  'https://youtu.be/IE5H0lMLUw8',
  'https://youtu.be/1__SDbGPUQM',
];

const AvailableVideos: React.FC<AvailableVideosProps> = ({ videos, onStream, onPurchase, hiddenIds = [] }) => {
  const [fetched, setFetched] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    const run = async () => {
      if (videos && videos.length > 0) return;
      setLoading(true);
      const results = await Promise.all(
        YT_URLS.map(async (url) => {
          const id = getYouTubeId(url) ?? url;
          const meta = await fetchOEmbed(url);
          const duration = (id && (await fetchYouTubeDuration(id))) || '4:00';
          return {
            id,
            title: meta?.title ?? 'YouTube Video',
            duration,
            quality: '1080p',
            thumbnail: meta?.thumbnail_url ?? `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
            streamPrice: 0.00005,
            purchasePrice: 0.25,
            description: meta?.author_name ? `by ${meta.author_name}` : undefined,
          } as Video;
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

  const list = ((videos && videos.length > 0) ? videos : fetched).filter(v => !hiddenIds.includes(v.id));
  const calculateStreamCost = (duration: string, rate: number): number => {
    const parts = duration.split(':').map((n) => Number(n));
    let totalSeconds = 0;
    if (parts.length === 3) {
      const [h, m, s] = parts;
      totalSeconds = h * 3600 + m * 60 + s;
    } else if (parts.length === 2) {
      const [m, s] = parts;
      totalSeconds = m * 60 + s;
    }
    return totalSeconds * rate;
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-white mb-6">Available Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading && list.length === 0 && Array.from({ length: 4 }).map((_, i) => (
          <Card key={`skeleton-${i}`} className="overflow-hidden">
            <div className="aspect-video bg-[#262626] animate-pulse" />
            <div className="p-4">
              <div className="h-4 bg-[#262626] rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-3 bg-[#262626] rounded w-1/2 mb-4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-8 bg-[#0a0a0a] border border-[#262626] rounded animate-pulse" />
                <div className="h-20 bg-[#0a0a0a] border border-[#262626] rounded animate-pulse" />
              </div>
            </div>
          </Card>
        ))}
        {list.map((video) => {
          const streamCost = calculateStreamCost(video.duration, video.streamPrice);
          return (
            <Card key={video.id} className="overflow-hidden hover:border-blue-600">
              <div
                className="relative aspect-video bg-[#262626] cursor-pointer group"
                onClick={() => onStream(video)}
              >
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

