import React from 'react';

const Separator: React.FC<{ className?: string; orientation?: 'horizontal' | 'vertical' }>
= ({ className = '', orientation = 'horizontal' }) => {
  const base = 'bg-zinc-800';
  const size = orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full';
  return <div className={`${base} ${size} ${className}`} />;
};

export default Separator;
