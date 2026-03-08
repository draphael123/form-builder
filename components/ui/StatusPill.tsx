'use client';

import { motion } from 'framer-motion';

type Status = 'pending' | 'reviewed' | 'processing' | 'complete' | 'rejected';

interface StatusPillProps {
  status: Status;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const statusConfig: Record<Status, { label: string; bg: string; text: string; icon: string }> = {
  pending: {
    label: 'Pending',
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    icon: '⏳',
  },
  reviewed: {
    label: 'Reviewed',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    icon: '👁',
  },
  processing: {
    label: 'Processing',
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    icon: '⚙️',
  },
  complete: {
    label: 'Complete',
    bg: 'bg-green-100',
    text: 'text-green-700',
    icon: '✓',
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-red-100',
    text: 'text-red-700',
    icon: '✗',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

export function StatusPill({ status, size = 'md', animated = true }: StatusPillProps) {
  const config = statusConfig[status];
  const Component = animated ? motion.span : 'span';
  const animationProps = animated
    ? {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: 'spring', stiffness: 500, damping: 30 },
      }
    : {};

  return (
    <Component
      {...animationProps}
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${config.bg} ${config.text} ${sizeClasses[size]}`}
    >
      <span className="text-[0.8em]">{config.icon}</span>
      {config.label}
    </Component>
  );
}

interface StaffTypePillProps {
  type: 'clinical' | 'non-clinical';
  size?: 'sm' | 'md' | 'lg';
}

export function StaffTypePill({ type, size = 'md' }: StaffTypePillProps) {
  const isClinical = type === 'clinical';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${sizeClasses[size]} ${
        isClinical
          ? 'bg-indigo-100 text-indigo-700'
          : 'bg-slate-100 text-slate-700'
      }`}
    >
      {isClinical ? (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      )}
      {isClinical ? 'Clinical' : 'Non-Clinical'}
    </span>
  );
}
