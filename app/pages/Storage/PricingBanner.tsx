import React from 'react';
import Card from '@/components/ui/Card';

interface PricingBannerProps {
  balance: number;
}

const PricingBanner: React.FC<PricingBannerProps> = ({ balance }) => {
  // Calculate how many GB can be stored for 1 day
  const ratePerMBPerHour = 0.00001;
  const gbPerDay = (balance / (ratePerMBPerHour * 1024 * 24)).toFixed(1);

  return (
    <Card className="p-4 mb-8 bg-blue-600/10 border-blue-600/50">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <span className="text-sm font-medium text-white">
            💰 Pricing: 0.00001 USDC/MB/hour • ~$0.024/GB/day
          </span>
        </div>
        <div className="text-sm text-[#a1a1a1]">
          Your Balance: <span className="font-semibold text-white">{balance} USDC</span> (enough for ~{gbPerDay} GB for 1 day)
        </div>
      </div>
    </Card>
  );
};

export default PricingBanner;

