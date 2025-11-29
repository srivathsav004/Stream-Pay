import React, { useState } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import { TimeFilter } from './Dashboard/types';
import {
  spendingData,
  serviceUsageData,
  activityData,
  activeStreams,
} from './Dashboard/data';
import DashboardHeader from './Dashboard/DashboardHeader';
import HeroStats from './Dashboard/HeroStats';
import SpendingOverTime from './Dashboard/SpendingOverTime';
import ServiceBreakdown from './Dashboard/ServiceBreakdown';
import ServiceDetails from './Dashboard/ServiceDetails';
import ActiveStreams from './Dashboard/ActiveStreams';
import ActivityTimeline from './Dashboard/ActivityTimeline';
import QuickInsights from './Dashboard/QuickInsights';

const Dashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30D');

  return (
    <DashboardLayout>
      <DashboardHeader timeFilter={timeFilter} onTimeFilterChange={setTimeFilter} />
      <HeroStats />
      <SpendingOverTime data={spendingData} />
      <ServiceBreakdown serviceData={serviceUsageData} />
      <ServiceDetails />
      {/* <ActiveStreams streams={activeStreams} /> */}
      <ActivityTimeline activities={activityData} />
      <QuickInsights spendingData={spendingData} serviceUsageData={serviceUsageData} />
    </DashboardLayout>
  );
};

export default Dashboard;
