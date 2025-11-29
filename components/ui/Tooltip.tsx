import React, { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
      {open && (
        <div className="absolute z-50 -top-2 left-1/2 -translate-y-full -translate-x-1/2 whitespace-nowrap rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-300 shadow-lg">
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
