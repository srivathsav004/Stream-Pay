import React from 'react';

const PageHeader: React.FC<{ title: string; right?: React.ReactNode }> = ({ title, right }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl md:text-2xl font-semibold">{title}</h1>
      {right ?? null}
    </div>
  );
};

export default PageHeader;
