import React from 'react';
import { TimeFilter } from './types';

interface DashboardHeaderProps {
  timeFilter: TimeFilter;
  onTimeFilterChange: (filter: TimeFilter) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ timeFilter, onTimeFilterChange }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-white mb-2">Dashboard</h1>
      <p className="text-sm text-[#a1a1a1] mb-4">Overview of your usage and spending</p>
      <div className="flex gap-2">
        {(['Today', '7D', '30D', 'All'] as TimeFilter[]).map((filter) => (
          <button
            key={filter}
            onClick={() => onTimeFilterChange(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeFilter === filter
                ? 'bg-blue-600 text-white'
                : 'bg-[#141414] border border-[#262626] text-[#a1a1a1] hover:border-blue-600'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardHeader;

