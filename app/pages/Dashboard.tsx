import React, { useState } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import { TimeFilter } from './Dashboard/types';
import DashboardHeader from './Dashboard/DashboardHeader';
import HeroStats from './Dashboard/HeroStats';
import SpendingOverTime from './Dashboard/SpendingOverTime';
import ServiceBreakdown from './Dashboard/ServiceBreakdown';
import ServiceDetails from './Dashboard/ServiceDetails';
import ActiveStreams from './Dashboard/ActiveStreams';
import ActivityTimeline from './Dashboard/ActivityTimeline';
import QuickInsights from './Dashboard/QuickInsights';
import { useDashboardData } from './Dashboard/useDashboardData';

const Dashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30D');
  const {
    spendingOverTime,
    serviceUsage,
    activity,
    totals,
    serviceDetails,
    loading,
  } = useDashboardData();
  const activeStreams: any[] = [];

  return (
    <DashboardLayout>
      <DashboardHeader timeFilter={timeFilter} onTimeFilterChange={setTimeFilter} />
      <HeroStats
        spentThisMonth={totals.spentThisMonth}
        totalApiSessions={totals.totalApiSessions}
        totalStreams={totals.totalStreams}
      />
      <SpendingOverTime data={spendingOverTime} />
      <ServiceBreakdown serviceData={serviceUsage} activeDays={spendingOverTime.length} />
      <ServiceDetails
        videoStreamingTrend={serviceDetails.video.trend}
        videoTotalSpent={serviceDetails.video.totalSpent}
        videoSessions={serviceDetails.video.stats.sessions}
        videoHoursWatched={serviceDetails.video.stats.hoursWatched}
        videoAvgPerSession={serviceDetails.video.stats.avgPerSession}
        apiCallsData={serviceDetails.api.data}
        apiTotalSpent={serviceDetails.api.totalSpent}
        apiTotalCalls={serviceDetails.api.stats.totalCalls}
        apiCallsPerDayAvg={serviceDetails.api.stats.callsPerDayAvg}
        apiAvgPerCall={serviceDetails.api.stats.avgPerCall}
        storageData={serviceDetails.storage.data}
        storageTotalSpent={serviceDetails.storage.totalSpent}
        storageTotalGB={serviceDetails.storage.stats.totalStoredGB}
        storageActiveFiles={serviceDetails.storage.stats.activeFiles}
        storageAvgHoursPerFile={serviceDetails.storage.stats.avgHoursPerFile}
      />
      {/* <ActiveStreams streams={activeStreams} /> */}
      {/* <ActivityTimeline activities={activity} /> */}
      <QuickInsights spendingData={spendingOverTime} serviceUsageData={serviceUsage} />
    </DashboardLayout>
  );
};

export default Dashboard;
