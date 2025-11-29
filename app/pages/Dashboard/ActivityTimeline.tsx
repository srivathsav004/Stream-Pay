import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Separator from '@/components/ui/Separator';
import { ActivityData } from './types';

interface ActivityTimelineProps {
  activities: ActivityData[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);

  const getServiceColor = (service: string) => {
    if (service.includes('Video')) return '#3b82f6';
    if (service.includes('API')) return '#8b5cf6';
    return '#06b6d4';
  };

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        <Button variant="ghost" size="sm">View All →</Button>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id}>
            <div
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-[#1a1a1a] cursor-pointer transition-colors"
              onClick={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
            >
              <div
                className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                style={{ backgroundColor: getServiceColor(activity.service) }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">{activity.service}</span>
                  <span className="text-xs text-[#a1a1a1]">{activity.time}</span>
                </div>
                <div className="text-sm text-[#a1a1a1]">
                  {activity.duration && `${activity.duration} • `}
                  {activity.calls && `${activity.calls} call${activity.calls > 1 ? 's' : ''} • `}
                  Cost: {activity.cost} AVAX
                </div>
                {expandedActivity === activity.id && activity.details && (
                  <div className="mt-4 p-4 bg-[#0a0a0a] rounded-lg border border-[#262626]">
                    <div className="text-sm font-medium text-white mb-3">Transaction Details:</div>
                    <div className="space-y-2 text-sm text-[#a1a1a1]">
                      <div>• Stream ID: {activity.details.streamId}</div>
                      <div>• Started: {activity.details.started}</div>
                      <div>• Ended: {activity.details.ended}</div>
                      <div>• Rate: {activity.details.rate}</div>
                      <div>• Tx Hash: {activity.details.txHash} <Button variant="ghost" size="sm" className="ml-2 h-auto p-0 text-xs">View on Explorer</Button></div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">Download Receipt</Button>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setExpandedActivity(null); }}>Close</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {index < activities.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Button variant="outline" size="sm">Load More</Button>
      </div>
    </Card>
  );
};

export default ActivityTimeline;

