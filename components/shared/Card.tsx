import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white dark:bg-slate-800/50 shadow-md dark:shadow-black/20 rounded-2xl p-4 sm:p-6 ring-1 ring-slate-200/50 dark:ring-slate-700/50 ${className}`}>
      {children}
    </div>
  );
};

export default Card;