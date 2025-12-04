import React from 'react';
import { TimeFilter } from './types';
import { motion } from 'framer-motion';
import { upsertUser } from '@/app/shared/services/web2-services/user';
import { useAccount } from 'wagmi';

interface DashboardHeaderProps {
  timeFilter: TimeFilter;
  onTimeFilterChange: (filter: TimeFilter) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ timeFilter, onTimeFilterChange }) => {
  const { address, isConnected } = useAccount();
  const [toast, setToast] = React.useState<string | null>(null);
  const upsertedRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    const run = async () => {
      if (isConnected && address && upsertedRef.current !== address) {
        try {
          await upsertUser({ address: address.toLowerCase() });
          upsertedRef.current = address;
          setToast('Profile ready');
          setTimeout(() => setToast(null), 2000);
        } catch (e: any) {
          setToast(e?.message || 'Failed to prepare profile');
          setTimeout(() => setToast(null), 2500);
        }
      }
    };
    run();
  }, [address, isConnected]);

  return (
    <div className="mb-8 relative">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">Dashboard</h1>
          <p className="text-sm text-[#a1a1a1] mb-4">Overview of your usage and spending</p>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
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
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="absolute top-0 right-0 translate-y-[-120%] bg-[#0a0a0a] border border-[#262626] text-white text-sm px-4 py-2 rounded shadow-lg"
        >
          {toast}
        </motion.div>
      )}
    </div>
  );
};

export default DashboardHeader;

