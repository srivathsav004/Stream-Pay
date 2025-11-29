import React, { useState } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import {
  availableVideos,
  ownedVideos,
  usageHistory,
  analyticsData,
  videoStats,
} from './Video/data';
import { Video } from './Video/types';
import VideoHeader from './Video/VideoHeader';
import PricingBanner from './Video/PricingBanner';
import VideoStats from './Video/VideoStats';
import YourLibrary from './Video/YourLibrary';
import AvailableVideos from './Video/AvailableVideos';
import UsageHistory from './Video/UsageHistory';
import VideoAnalytics from './Video/VideoAnalytics';
import StreamModal from './Video/StreamModal';
import PurchaseModal from './Video/PurchaseModal';

const VideoPage: React.FC = () => {
  const [balance] = useState(2.47);
  const [streamModalVideo, setStreamModalVideo] = useState<Video | null>(null);
  const [purchaseModalVideo, setPurchaseModalVideo] = useState<Video | null>(null);
  const [userOwnedVideos, setUserOwnedVideos] = useState(ownedVideos);
  const [userAvailableVideos, setUserAvailableVideos] = useState(
    availableVideos.filter(v => !userOwnedVideos.some(ov => ov.id === v.id))
  );

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

  const handleWatch = (videoId: string) => {
    // In a real app, this would open a video player
    console.log('Watching video:', videoId);
  };

  return (
    <DashboardLayout>
      <VideoHeader balance={balance} />
      <PricingBanner />
      <VideoStats
        totalSpent={videoStats.totalSpent}
        videosOwned={videoStats.videosOwned}
        totalWatched={videoStats.totalWatched}
        sessions={videoStats.sessions}
      />
      {userOwnedVideos.length > 0 && (
        <YourLibrary videos={userOwnedVideos} onWatch={handleWatch} />
      )}
      <AvailableVideos
        videos={userAvailableVideos}
        onStream={handleStream}
        onPurchase={handlePurchase}
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
    </DashboardLayout>
  );
};

export default VideoPage;
