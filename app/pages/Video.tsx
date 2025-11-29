import React, { useState } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import {
  usageHistory,
  analyticsData,
  videoStats,
} from './Video/data';
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

const VideoPage: React.FC = () => {
  const [balance] = useState(2.47);
  const [streamModalVideo, setStreamModalVideo] = useState<Video | null>(null);
  const [purchaseModalVideo, setPurchaseModalVideo] = useState<Video | null>(null);
  const [watchVideo, setWatchVideo] = useState<Video | null>(null);
  const [userOwnedVideos, setUserOwnedVideos] = useState<OwnedVideo[]>([]);
  const [userAvailableVideos, setUserAvailableVideos] = useState<Video[]>([]);

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

  return (
    <DashboardLayout>
      <VideoHeader balance={balance} />
      {/* <PricingBanner /> */}
      <VideoStats
        totalSpent={videoStats.totalSpent}
        videosOwned={videoStats.videosOwned}
        totalWatched={videoStats.totalWatched}
        sessions={videoStats.sessions}
      />
      <YourLibrary videos={userOwnedVideos} onWatch={handleWatch} />
      <AvailableVideos
        videos={userAvailableVideos}
        onStream={handleStream}
        onPurchase={handlePurchase}
        hiddenIds={userOwnedVideos.map(v => v.id)}
        onWatch={handleWatch}
      />
      <UsageHistory history={usageHistory} />
      <VideoAnalytics data={analyticsData} />
      
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
