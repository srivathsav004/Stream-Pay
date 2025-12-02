import React from 'react';
import Card from '@/components/ui/Card';

interface PricingBannerProps {
  balance: number;
}

const PricingBanner: React.FC<PricingBannerProps> = ({ balance }) => {
  const callsRemaining = Math.floor(balance / 0.001);

  return (
    <Card className="p-4 mb-8 bg-blue-600/10 border-blue-600/50 sticky top-0 z-10">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <span className="text-sm font-medium text-white">
            💰 Pricing: 0.001 USDC per call • ~$0.04 per call
          </span>
        </div>
        <div className="text-sm text-[#a1a1a1]">
          Your Balance: <span className="font-semibold text-white">{balance} USDC</span> (enough for ~{callsRemaining.toLocaleString()} calls)
        </div>
      </div>
    </Card>
  );
};

export default PricingBanner;

