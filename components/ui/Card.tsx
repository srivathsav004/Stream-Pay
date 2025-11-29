import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean | string;
}

const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = false }) => {
  const getHoverClass = () => {
    if (!hoverEffect) return '';
    if (hoverEffect === true || hoverEffect === 'blue') return 'hover:border-blue-600';
    if (hoverEffect === 'purple') return 'hover:border-[#8b5cf6]';
    if (hoverEffect === 'cyan') return 'hover:border-[#06b6d4]';
    return '';
  };
  
  return (
    <div
      className={`bg-[#141414] border border-[#262626] rounded-lg overflow-hidden transition-colors ${getHoverClass()} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;