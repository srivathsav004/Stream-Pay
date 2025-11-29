import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Progress from '@/components/ui/Progress';
import { Video } from './types';

interface StreamModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (video: Video) => void;
}

const StreamModal: React.FC<StreamModalProps> = ({ video, isOpen, onClose, onUpgrade }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [cost, setCost] = useState(0);

  useEffect(() => {
    if (!isOpen || !video) return;

    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
        setCost((prev) => prev + video.streamPrice);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, video, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setDuration(0);
      setCost(0);
    }
  }, [isOpen]);

  if (!isOpen || !video) return null;

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const [minutes, secs] = video.duration.split(':').map(Number);
  const totalSeconds = minutes * 60 + secs;
  const progress = (duration / totalSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#262626]">
          <h2 className="text-lg font-semibold text-white">
            Stream: {video.title}
          </h2>
          <button
            onClick={onClose}
            className="text-[#a1a1a1] hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Video Player */}
          <Card className="mb-6 bg-[#262626] aspect-video flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">▶️</div>
              <div className="text-sm text-[#a1a1a1]">Video Player Placeholder</div>
            </div>
          </Card>

          {/* Streaming Session Info */}
          <Card className="p-6 mb-6">
            <h3 className="text-base font-semibold text-white mb-4">Streaming Session</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-xs text-[#a1a1a1] mb-1">Status</div>
                <div className="text-sm font-medium text-white">
                  {isPlaying ? '🔵 Streaming' : '⏸ Paused'}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#a1a1a1] mb-1">Duration</div>
                <div className="text-sm font-medium text-white">{formatTime(duration)}</div>
              </div>
              <div>
                <div className="text-xs text-[#a1a1a1] mb-1">Cost</div>
                <div className="text-sm font-medium text-white">{cost.toFixed(4)} AVAX</div>
              </div>
              <div>
                <div className="text-xs text-[#a1a1a1] mb-1">Rate</div>
                <div className="text-sm font-medium text-white">{video.streamPrice} AVAX/sec</div>
              </div>
            </div>
            <div className="mb-4">
              <Progress value={progress} className="h-2" />
            </div>
            <div className="flex gap-2">
              <Button
                variant={isPlaying ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                ⏹ Stop & Settle
              </Button>
            </div>
          </Card>

          {/* Upgrade Prompt */}
          <Card className="p-4 bg-blue-600/10 border-blue-600/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white mb-1">
                  💡 Like this video? Buy for {video.purchasePrice} AVAX and own forever
                </div>
                <div className="text-xs text-[#a1a1a1]">
                  Streaming cost will be deducted from purchase price
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onUpgrade(video)}
              >
                Upgrade to Ownership
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StreamModal;

