import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ConnectedService } from './types';

interface ConnectedServicesProps {
  services: ConnectedService[];
}

const ConnectedServices: React.FC<ConnectedServicesProps> = ({ services }) => {
  return (
    <Card className="p-6 mb-8">
      <h2 className="text-lg font-semibold text-white mb-6">Connected Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <Card key={service.id} className="p-4 hover:border-blue-600">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{service.icon}</span>
                <div>
                  <h3 className="text-base font-semibold text-white">{service.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={service.status === 'active' ? 'success' : 'secondary'}>
                      {service.status === 'active' ? '✓ Active' : '⚫ Not Used'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="text-sm text-[#a1a1a1]">
                Last Used: <span className="text-white">{service.lastUsed}</span>
              </div>
              <div className="text-sm text-[#a1a1a1]">
                Total Spent: <span className="text-white font-mono">{service.totalSpent} AVAX</span>
              </div>
            </div>
            <Button
              variant={service.status === 'active' ? 'ghost' : 'primary'}
              size="sm"
              className="w-full"
            >
              {service.status === 'active' ? 'View Details →' : 'Get Started →'}
            </Button>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default ConnectedServices;

