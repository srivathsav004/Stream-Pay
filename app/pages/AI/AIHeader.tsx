import React from 'react';

const AIHeader: React.FC = () => {
  return (
    <div className="mb-8">
      {/* <div className="text-sm text-[#a1a1a1] mb-2">
        Dashboard &gt; Services &gt; AI Assistant
      </div> */}
      <h1 className="text-2xl font-semibold text-white mb-2">AI Assistant</h1>
      <p className="text-sm text-[#a1a1a1]">
        Pay per API call. Ask anything, pay only for what you use.
      </p>
    </div>
  );
};

export default AIHeader;

