import React, { useState } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import { Video, OwnedVideo } from './Video/types';
import VideoHeader from './Video/VideoHeader';
import PricingBanner from './Video/PricingBanner';
import VideoStats from './Video/VideoStats';
import YourLibrary from './Video/YourLibrary';
import AvailableVideos from './Video/AvailableVideos';
import UsageHistory from './Video/UsageHistory';
import VideoAnalytics from './Video/VideoAnalytics';
import StreamModal from './Video/StreamModal';
import PurchaseModal from './Video/PurchaseModal';
import VideoPlayerModal from './Video/VideoPlayerModal';
import { useEffect } from 'react';
import { fetchCatalogVideos } from '@/app/shared/services/web2-services/video';
import { fetchUserPurchases } from '@/app/shared/services/web2-services/video';
import { fetchOEmbed, getYouTubeId } from './Video/youtube';
import { useAccount } from 'wagmi';

const VideoPage: React.FC = () => {
  const [balance] = useState(0);
  const [streamModalVideo, setStreamModalVideo] = useState<Video | null>(null);
  const [purchaseModalVideo, setPurchaseModalVideo] = useState<Video | null>(null);
  const [watchVideo, setWatchVideo] = useState<Video | null>(null);
  const [userOwnedVideos, setUserOwnedVideos] = useState<OwnedVideo[]>([]);
  const [userAvailableVideos, setUserAvailableVideos] = useState<Video[]>([]);
  const { address, isConnected } = useAccount();

  const handleStream = (video: Video) => {
    setStreamModalVideo(video);
  };

  const handlePurchase = (video: Video) => {
    setPurchaseModalVideo(video);
  };

  const handleConfirmPurchase = (video: Video) => {
    // Add video to owned videos
    const newOwnedVideo = {
      ...video,
      watchCount: 0,
      lastWatched: undefined,
    };
    setUserOwnedVideos([...userOwnedVideos, newOwnedVideo]);
    
    // Remove from available videos
    setUserAvailableVideos(userAvailableVideos.filter(v => v.id !== video.id));
    
    // Close modal
    setPurchaseModalVideo(null);
    
    // In a real app, you'd also update balance and make API call
  };

  const handleUpgrade = (video: Video) => {
    // Close stream modal
    setStreamModalVideo(null);
    
    // Open purchase modal
    setPurchaseModalVideo(video);
  };

  const handleWatch = (video: Video) => {
    setWatchVideo(video);
  };

  // Helper: parse YouTube ID from URL
  const getYouTubeId = (url: string) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '');
      const v = u.searchParams.get('v');
      return v || url;
    } catch { return url; }
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
  };

  useEffect(() => {
    (async () => {
      try {
        const catalog = await fetchCatalogVideos();
        const mapped: Video[] = await Promise.all(
          catalog.map(async (c) => {
            const ytId = getYouTubeId(c.url);
            const oembed = await fetchOEmbed(c.url);
            return {
              id: ytId,
              title: oembed?.title || `Video #${c.id}`,
              duration: formatDuration(c.duration_seconds),
              quality: 'HD',
              thumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
              streamPrice: 0.001, // default rate
              purchasePrice: 0.1, // default price
              sourceUrl: c.url,
              catalogId: c.id,
            };
          })
        );
        setUserAvailableVideos(mapped);
      } catch (e) {
        // ignore for now
      }
    })();
  }, []);

  // Load user's purchased videos (library) after wallet connects
  useEffect(() => {
    (async () => {
      if (!isConnected || !address) return;
      try {
        const purchases = await fetchUserPurchases(address);
        const owned: OwnedVideo[] = purchases.map((p) => {
          const url = p.video?.url ?? '';
          const ytId = url ? getYouTubeId(url) : String(p.video_id);
          const duration = p.video?.duration_seconds != null ? formatDuration(p.video.duration_seconds) : '00:00';
          return {
            id: ytId,
            title: `Video #${p.video_id}`,
            duration,
            quality: 'HD',
            thumbnail: ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '',
            streamPrice: 0.001,
            purchasePrice: Number(p.amount_usdc) || 0,
            sourceUrl: url,
            catalogId: p.video_id,
            watchCount: 0,
          };
        });
        setUserOwnedVideos(owned);
        // Also remove owned from available list
        setUserAvailableVideos((prev) => prev.filter(v => !owned.some(o => o.catalogId === v.catalogId)));
      } catch {}
    })();
  }, [isConnected, address]);

  return (
    <DashboardLayout>
      <VideoHeader balance={balance} />
      {/* <PricingBanner /> */}
      <VideoStats
        totalSpent={0}
        videosOwned={userOwnedVideos.length}
        totalWatched={0}
        sessions={0}
      />
      <AvailableVideos
        videos={userAvailableVideos}
        onStream={handleStream}
        onPurchase={handlePurchase}
        onPurchased={(v) => {
          // Optimistically move to library
          const ownedItem: OwnedVideo = { ...v, watchCount: 0 };
          setUserOwnedVideos((prev) => {
            if (prev.some(p => p.catalogId === v.catalogId)) return prev;
            return [...prev, ownedItem];
          });
          setUserAvailableVideos((prev) => prev.filter(x => x.catalogId !== v.catalogId));
          // Background sync from API (if connected)
          (async () => {
            try {
              if (isConnected && address) {
                const purchases = await fetchUserPurchases(address);
                const owned: OwnedVideo[] = purchases.map((p) => {
                  const url = p.video?.url ?? '';
                  const ytId = url ? getYouTubeId(url) : String(p.video_id);
                  const duration = p.video?.duration_seconds != null ? formatDuration(p.video.duration_seconds) : '00:00';
                  return {
                    id: ytId,
                    title: `Video #${p.video_id}`,
                    duration,
                    quality: 'HD',
                    thumbnail: ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '',
                    streamPrice: 0.001,
                    purchasePrice: Number(p.amount_usdc) || 0,
                    sourceUrl: url,
                    catalogId: p.video_id,
                    watchCount: 0,
                  };
                });
                setUserOwnedVideos(owned);
              }
            } catch {}
          })();
        }}
        hiddenIds={userOwnedVideos.map(v => v.id)}
        onWatch={handleWatch}
      />
      <YourLibrary videos={userOwnedVideos} onWatch={handleWatch} />
      <UsageHistory history={[]} />
      <VideoAnalytics data={[]} />
      
      <StreamModal
        video={streamModalVideo}
        isOpen={streamModalVideo !== null}
        onClose={() => setStreamModalVideo(null)}
        onUpgrade={handleUpgrade}
      />
      
      <PurchaseModal
        video={purchaseModalVideo}
        isOpen={purchaseModalVideo !== null}
        balance={balance}
        onClose={() => setPurchaseModalVideo(null)}
        onConfirm={handleConfirmPurchase}
      />

      <VideoPlayerModal
        video={watchVideo}
        isOpen={watchVideo !== null}
        onClose={() => setWatchVideo(null)}
      />
    </DashboardLayout>
  );
};

export default VideoPage;
