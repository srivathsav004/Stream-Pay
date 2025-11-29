import React from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const Storage: React.FC = () => {
  return (
    <DashboardLayout>
      <h1 className="text-xl md:text-2xl font-semibold mb-4">Cloud Storage</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <div className="font-medium mb-2">Your Stats</div>
          <ul className="text-sm text-zinc-400 space-y-2 list-disc pl-5">
            <li>Total Stored: 1.2 GB</li>
            <li>Total Spent: 0.288 AVAX</li>
            <li>Active Files: 47</li>
            <li>Storage Time: 240 hours</li>
          </ul>
        </Card>
        <Card className="p-4">
          <div className="font-medium mb-2">Pricing</div>
          <div className="text-sm text-zinc-400">Rate: 0.00001 AVAX/MB/hour (~$0.024/GB/day)</div>
        </Card>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="font-medium">Your Files</div>
          <Button variant="primary">Upload File</Button>
        </div>
        <div className="mt-3 text-sm text-zinc-300 space-y-2">
          <div>📄 document.pdf — 2.5 MB — 2d ago — 0.0012 AVAX</div>
          <div>🖼️ image.png — 1.2 MB — 5d ago — 0.0014 AVAX</div>
          <div>📊 data.csv — 5.0 MB — 1w ago — 0.0084 AVAX</div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="font-medium mb-2">Current Costs</div>
          <div className="text-sm text-zinc-400 space-y-1">
            <div>Hourly: 0.012 AVAX</div>
            <div>Daily: 0.288 AVAX</div>
            <div>Monthly: 8.64 AVAX</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="font-medium mb-2">Storage Usage Over Time</div>
          <div className="h-40 grid place-items-center text-zinc-500 text-sm">Line Chart Placeholder</div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Storage;
