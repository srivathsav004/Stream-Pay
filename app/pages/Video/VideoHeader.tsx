import React from 'react';

interface VideoHeaderProps {
  balance: number;
}

const VideoHeader: React.FC<VideoHeaderProps> = ({ balance }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-white mb-2">Video Streaming</h1>
      <p className="text-sm text-[#a1a1a1] mb-4">Stream per second or buy once. Choose per video.</p>
      <div className="text-sm text-white">
        Your Balance: <span className="font-semibold">{balance} AVAX</span>
      </div>
    </div>
  );
};

export default VideoHeader;

