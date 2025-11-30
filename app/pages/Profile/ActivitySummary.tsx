import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ActivityItem } from './types';

interface ActivitySummaryProps {
  activities: ActivityItem[];
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({ activities }) => {
  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        <Button variant="ghost" size="sm">View All →</Button>
      </div>
      <div className="text-sm text-[#a1a1a1] mb-4">Last 7 Days</div>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors">
            <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
            <div className="flex-1">
              <div className="text-sm text-white">{activity.action}</div>
              <div className="text-xs text-[#a1a1a1] mt-1">{activity.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ActivitySummary;

