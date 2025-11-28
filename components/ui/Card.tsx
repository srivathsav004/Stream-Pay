import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4 } : {}}
      className={`bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-xl overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;