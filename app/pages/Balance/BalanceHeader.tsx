import React from 'react';

const BalanceHeader: React.FC = () => {
  return (
    <div className="mb-8">
      {/* <div className="text-sm text-[#a1a1a1] mb-2">
        Dashboard &gt; Balance
      </div> */}
      <h1 className="text-2xl font-semibold text-white mb-2">Balance & Transactions</h1>
      <p className="text-sm text-[#a1a1a1]">
        Manage your funds and view transaction history
      </p>
    </div>
  );
};

export default BalanceHeader;

