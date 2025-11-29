import React from 'react';
import Card from '@/components/ui/Card';

const PricingBanner: React.FC = () => {
  return (
    <Card className="p-4 mb-8 bg-blue-600/10 border-blue-600/50">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-white mb-1">Pricing Information</div>
          <div className="text-xs text-[#a1a1a1]">
            Stream Rate: 0.0001 AVAX/sec (~$0.24/hr) • Purchase prices vary by video
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PricingBanner;

