import React from 'react';

interface ProgressProps {
  value: number;
  className?: string;
  max?: number;
}

const Progress: React.FC<ProgressProps> = ({ value, className = '', max = 100 }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={`w-full bg-zinc-800 rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-blue-600 transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default Progress;

