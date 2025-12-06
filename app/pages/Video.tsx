import React, { useState, useEffect, useCallback } from 'react';
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
import { fetchCatalogVideos } from '@/app/shared/services/web2-services/video';
import { fetchUserPurchases, fetchUserStreamSessions } from '@/app/shared/services/web2-services/video';
import { fetchOEmbed, getYouTubeId } from './Video/youtube';
import { useAccount } from 'wagmi';
import { useToast } from '@/components/ui/use-toast';

const VideoPage: React.FC = () => {
  const [balance] = useState(0);
  const [streamModalVideo, setStreamModalVideo] = useState<Video | null>(null);
  const [purchaseModalVideo, setPurchaseModalVideo] = useState<Video | null>(null);
  const [watchVideo, setWatchVideo] = useState<Video | null>(null);
  const [userOwnedVideos, setUserOwnedVideos] = useState<OwnedVideo[]>([]);
  const [userAvailableVideos, setUserAvailableVideos] = useState<Video[]>([]);
  const { address, isConnected } = useAccount();
  const [usageHistory, setUsageHistory] = useState<import('./Video/types').UsageHistoryItem[]>([]);
  const [analyticsData, setAnalyticsData] = useState<import('./Video/types').AnalyticsData[]>([]);
  const [purchasesState, setPurchasesState] = useState<Awaited<ReturnType<typeof fetchUserPurchases>>>([]);
  const [sessionsState, setSessionsState] = useState<Awaited<ReturnType<typeof fetchUserStreamSessions>>>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const { toast } = useToast();

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

  // Unified refresh function to update all data after transactions
  const refreshAllData = useCallback(async () => {
    if (!isConnected || !address) return;
    try {
      setIsLoadingUserData(true);
      const [purchases, sessions] = await Promise.all([
        fetchUserPurchases(address),
        fetchUserStreamSessions(address),
      ]);
      setPurchasesState(purchases);
      setSessionsState(sessions);
      
      // Update owned videos
      const owned: OwnedVideo[] = await Promise.all(purchases.map(async (p) => {
        const url = p.video?.url ?? '';
        const ytId = url ? getYouTubeId(url) : String(p.video_id);
        const duration = p.video?.duration_seconds != null ? formatDuration(p.video.duration_seconds) : '00:00';
        const oembed = url ? await fetchOEmbed(url) : null;
        return {
          id: ytId,
          title: oembed?.title || `Video #${p.video_id}`,
          duration,
          quality: 'HD',
          thumbnail: ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '',
          streamPrice: 0.001,
          purchasePrice: Number(p.amount_usdc) || 0,
          sourceUrl: url,
          catalogId: p.video_id,
          watchCount: 0,
        };
      }));
      setUserOwnedVideos(owned);
      
      // Update available videos - remove owned ones
      setUserAvailableVideos((prev) => prev.filter(v => !owned.some(o => o.catalogId === v.catalogId)));

      // Build usage history
      const formatDateTime = (iso: string) => {
        try {
          const d = new Date(iso);
          return d.toLocaleString();
        } catch { return iso; }
      };
      const toHistoryFromPurchases = purchases.map((p) => ({
        id: `purchase-${p.id}`,
        type: 'purchase' as const,
        videoTitle: `Video #${p.video_id}`,
        date: formatDateTime(p.purchased_at),
        duration: undefined,
        cost: Number(p.amount_usdc || 0),
        tx_hash: p.tx_hash || undefined,
      }));
      const toHistoryFromSessions = sessions.map((s) => ({
        id: `stream-${s.id}`,
        type: 'stream' as const,
        videoTitle: `Video #${s.video_id}`,
        date: formatDateTime(s.created_at),
        duration: s.seconds_streamed != null ? formatDuration(s.seconds_streamed) : undefined,
        cost: Number(s.amount_usdc || 0),
        tx_hash: s.tx_hash || undefined,
      }));
      const mergedHistory = [...toHistoryFromPurchases, ...toHistoryFromSessions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setUsageHistory(mergedHistory);

      // Build analytics by day
      const dayKey = (iso: string) => {
        const d = new Date(iso);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      };
      const map: Record<string, { streamingCost: number; purchaseCost: number }> = {};
      for (const s of sessions) {
        const k = dayKey(s.created_at);
        map[k] = map[k] || { streamingCost: 0, purchaseCost: 0 };
        map[k].streamingCost += Number(s.amount_usdc || 0);
      }
      for (const p of purchases) {
        const k = dayKey(p.purchased_at);
        map[k] = map[k] || { streamingCost: 0, purchaseCost: 0 };
        map[k].purchaseCost += Number(p.amount_usdc || 0);
      }
      const days = Object.keys(map).sort();
      setAnalyticsData(days.map(d => ({ date: d, ...map[d] })));
    } catch (e: any) {
      console.error('Error refreshing data:', e);
      toast({
        title: "Error",
        description: e?.message || 'Failed to refresh data',
        variant: "destructive",
      });
    } finally {
      setIsLoadingUserData(false);
    }
  }, [isConnected, address, toast]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoadingVideos(true);
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
              purchasePrice: 0.5, // default price
              sourceUrl: c.url,
              catalogId: c.id,
            };
          })
        );
        setUserAvailableVideos(mapped);
      } catch (e) {
        console.error('Error loading videos:', e);
      } finally {
        setIsLoadingVideos(false);
      }
    })();
  }, []);

  // Load user's purchased videos (library) after wallet connects
  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  return (
    <DashboardLayout>
      <VideoHeader balance={balance} />
      {/* <PricingBanner /> */}
      <VideoStats
        totalSpent={
          purchasesState.reduce((s, p) => s + Number(p.amount_usdc || 0), 0) +
          sessionsState.reduce((s, x) => s + Number(x.amount_usdc || 0), 0)
        }
        videosOwned={userOwnedVideos.length}
        totalWatched={sessionsState.reduce((s, x) => s + (x.seconds_streamed || 0), 0)}
        sessions={sessionsState.length}
      />
      <AvailableVideos
        videos={userAvailableVideos}
        onStream={handleStream}
        onPurchase={handlePurchase}
        onPurchased={async () => {
          // Refresh all data after purchase
          await refreshAllData();
        }}
        hiddenIds={userOwnedVideos.map(v => v.id)}
        onWatch={handleWatch}
        onSettled={refreshAllData}
      />
      <YourLibrary videos={userOwnedVideos} onWatch={handleWatch} />
      <UsageHistory history={usageHistory} />
      <VideoAnalytics data={analyticsData} />
      
      <StreamModal
        video={streamModalVideo}
        isOpen={streamModalVideo !== null}
        onClose={() => setStreamModalVideo(null)}
        onUpgrade={handleUpgrade}
        onSettled={async () => {
          toast({
            title: "Stream session settled",
            description: "Stream session settled successfully",
          });
          await refreshAllData();
        }}
      />
      
      <PurchaseModal
        video={purchaseModalVideo}
        isOpen={purchaseModalVideo !== null}
        balance={balance}
        onClose={() => setPurchaseModalVideo(null)}
        onConfirm={handleConfirmPurchase}
        onSettled={async () => {
          toast({
            title: "Purchase completed",
            description: "Purchase completed successfully",
          });
          await refreshAllData();
        }}
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
