import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Video } from './types';

interface PurchaseModalProps {
  video: Video | null;
  isOpen: boolean;
  balance: number;
  onClose: () => void;
  onConfirm: (video: Video) => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ video, isOpen, balance, onClose, onConfirm }) => {
  if (!isOpen || !video) return null;

  const afterPurchase = balance - video.purchasePrice;
  const breakEvenMinutes = Math.ceil((video.purchasePrice / video.streamPrice) / 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#262626]">
          <h2 className="text-lg font-semibold text-white">Purchase Video</h2>
          <button
            onClick={onClose}
            className="text-[#a1a1a1] hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Video Info */}
          <div className="flex gap-4 mb-6">
            <div className="w-32 h-20 bg-[#262626] rounded overflow-hidden flex-shrink-0">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-1">{video.title}</h3>
              <div className="text-sm text-[#a1a1a1]">
                Duration: {video.duration} • {video.quality}
              </div>
            </div>
          </div>

          <div className="border-t border-[#262626] pt-6 mb-6">
            <h4 className="text-sm font-semibold text-white mb-4">Purchase Details</h4>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-[#a1a1a1]">One-Time Cost:</span>
                <span className="text-sm font-semibold text-white">
                  {video.purchasePrice} AVAX (${(video.purchasePrice * 40).toFixed(2)})
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm font-medium text-white mb-2">What You Get:</div>
              <ul className="space-y-1 text-sm text-[#a1a1a1]">
                <li>✓ Unlimited views</li>
                <li>✓ Permanent access</li>
                <li>✓ Watch anytime</li>
                <li>✓ No time limits</li>
              </ul>
            </div>

            <Card className="p-3 bg-blue-600/10 border-blue-600/50 mb-6">
              <div className="text-xs text-[#a1a1a1]">
                💡 Break-even: Watch more than {breakEvenMinutes} minutes to save vs streaming
              </div>
            </Card>
          </div>

          <div className="border-t border-[#262626] pt-6 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[#a1a1a1]">Your Balance:</span>
              <span className="text-sm font-semibold text-white">{balance} AVAX</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#a1a1a1]">After Purchase:</span>
              <span className="text-sm font-semibold text-white">{afterPurchase.toFixed(2)} AVAX</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => onConfirm(video)}
              disabled={balance < video.purchasePrice}
            >
              Confirm Purchase - {video.purchasePrice} AVAX
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;

