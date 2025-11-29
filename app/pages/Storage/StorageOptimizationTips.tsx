import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const StorageOptimizationTips: React.FC = () => {
  return (
    <Card className="p-6 mb-8">
      <h2 className="text-lg font-semibold text-white mb-6">💡 Storage Optimization Tips</h2>
      <div className="space-y-4">
        <Card className="p-4 bg-amber-600/10 border-amber-600/50">
          <div className="text-sm font-medium text-white mb-2">📊 Large Files Detected</div>
          <div className="text-sm text-[#a1a1a1] mb-3">
            video.mp4 (25 MB) is costing you 0.00025 AVAX/hour. Consider deleting if no longer needed.
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">View File</Button>
            <Button variant="outline" size="sm">Delete</Button>
          </div>
        </Card>

        <Card className="p-4 bg-blue-600/10 border-blue-600/50">
          <div className="text-sm font-medium text-white mb-2">🗑️ Old Files</div>
          <div className="text-sm text-[#a1a1a1] mb-3">
            You have 8 files stored for over 30 days. Review and delete unused files to save costs.
          </div>
          <Button variant="outline" size="sm">Review Files</Button>
        </Card>

        <Card className="p-4 bg-amber-600/10 border-amber-600/50">
          <div className="text-sm font-medium text-white mb-2">💰 Cost Projection</div>
          <div className="text-sm text-[#a1a1a1] mb-3">
            At current usage (1.2 GB), you'll spend ~8.64 AVAX/month. Your balance will last ~8.5 days.
          </div>
          <Button variant="primary" size="sm">Deposit AVAX</Button>
        </Card>
      </div>
    </Card>
  );
};

export default StorageOptimizationTips;

