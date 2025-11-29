import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'destructive';
}

const Badge: React.FC<BadgeProps> = ({ variant = 'default', className = '', children, ...props }) => {
  const variants = {
    default: 'bg-zinc-800 text-zinc-100 border-zinc-700',
    secondary: 'bg-zinc-900 text-zinc-300 border-zinc-800',
    outline: 'bg-transparent text-zinc-300 border-zinc-700',
    success: 'bg-emerald-600/15 text-emerald-300 border-emerald-700/40',
    destructive: 'bg-red-600/15 text-red-300 border-red-700/40',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
