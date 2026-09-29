import React from 'react';

/**
 * Premium Card Component with support for staggered animations
 */
export const Card = ({ children, className = '', animate = true, delay = 0, ...props }) => {
  const staggerClass = delay ? `stagger-${delay}` : '';
  const animateClass = animate ? `animate-in opacity-0 ${staggerClass}` : '';
  
  return (
    <div 
      className={`pro-card p-6 overflow-hidden ${animateClass} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Professional Badge Component
 */
export const Badge = ({ type = 'default', children, className = '' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    overdue: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    primary: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${styles[type] || styles.default} ${className}`}>
      {children}
    </span>
  );
};

/**
 * High-end Button Component
 */
export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-[var(--accent-base)] text-white hover:opacity-90 shadow-lg shadow-[var(--accent-base)]/20',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
    outline: 'border-2 border-[var(--accent-base)] text-[var(--accent-base)] hover:bg-[var(--accent-base)] hover:text-white',
    ghost: 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20',
  };

  return (
    <button className={`pro-button ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Input = ({ label, icon: Icon, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />}
        <input 
          className={`pro-input ${Icon ? 'pl-11' : ''} ${className}`} 
          {...props} 
        />
      </div>
    </div>
  );
};
