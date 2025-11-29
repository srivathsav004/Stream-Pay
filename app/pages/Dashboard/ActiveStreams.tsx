import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Progress from '@/components/ui/Progress';
import { ActiveStream } from './types';

interface ActiveStreamsProps {
  streams: ActiveStream[];
}

const ActiveStreams: React.FC<ActiveStreamsProps> = ({ streams }) => {
  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Active Streams ({streams.length})</h2>
        {streams.length > 0 && (
          <Button variant="outline" size="sm">Stop All Streams</Button>
        )}
      </div>
      {streams.length > 0 ? (
        <div className="space-y-4">
          {streams.map((stream) => (
            <Card key={stream.id} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-white">{stream.service}</h3>
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              {stream.duration ? (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-[#a1a1a1]">Duration</div>
                      <div className="text-white font-medium">{stream.duration}</div>
                    </div>
                    <div>
                      <div className="text-[#a1a1a1]">Cost</div>
                      <div className="text-white font-medium">{stream.cost} AVAX</div>
                    </div>
                    <div>
                      <div className="text-[#a1a1a1]">Rate</div>
                      <div className="text-white font-medium">{stream.rate}</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <Progress value={stream.progress || 0} className="h-2" />
                    <div className="text-xs text-[#a1a1a1] mt-1">{stream.progress}%</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">Stop Stream</Button>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-[#a1a1a1]">Calls</div>
                      <div className="text-white font-medium">{stream.calls}</div>
                    </div>
                    <div>
                      <div className="text-[#a1a1a1]">Cost</div>
                      <div className="text-white font-medium">{stream.cost} AVAX</div>
                    </div>
                    <div>
                      <div className="text-[#a1a1a1]">Rate</div>
                      <div className="text-white font-medium">{stream.rate}</div>
                    </div>
                  </div>
                  <div className="text-sm text-[#a1a1a1] mb-4">Last call: {stream.lastCall}</div>
                  <Button variant="outline" size="sm" className="w-full">Stop Session</Button>
                </>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-[#a1a1a1] mb-4">No active streams. Start using a service to track payments in real-time.</p>
          <Button variant="outline" size="sm">Browse Services</Button>
        </div>
      )}
    </Card>
  );
};

export default ActiveStreams;

