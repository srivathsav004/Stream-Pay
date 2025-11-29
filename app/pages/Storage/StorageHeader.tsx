import React from 'react';

const StorageHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="text-sm text-[#a1a1a1] mb-2">
        Dashboard &gt; Services &gt; Cloud Storage
      </div>
      <h1 className="text-2xl font-semibold text-white mb-2">Cloud Storage</h1>
      <p className="text-sm text-[#a1a1a1]">
        Pay per MB per hour. Store files, pay only while stored.
      </p>
    </div>
  );
};

export default StorageHeader;

