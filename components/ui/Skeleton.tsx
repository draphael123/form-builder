'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'wave',
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animationClass = animation === 'wave' ? 'skeleton' : animation === 'pulse' ? 'animate-pulse bg-[var(--color-parchment)]' : 'bg-[var(--color-parchment)]';

  return (
    <div
      className={`${variantStyles[variant]} ${animationClass} ${className}`}
      style={{
        width: width,
        height: height || (variant === 'text' ? '1em' : undefined),
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="form-card p-6 space-y-4">
      <Skeleton variant="text" width="60%" height={24} />
      <Skeleton variant="text" width="40%" height={16} />
      <div className="space-y-3 pt-4">
        <Skeleton variant="rounded" height={48} />
        <Skeleton variant="rounded" height={48} />
        <Skeleton variant="rounded" height={48} />
      </div>
      <div className="flex gap-3 pt-4">
        <Skeleton variant="rounded" width={100} height={44} />
        <Skeleton variant="rounded" width={100} height={44} />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-[var(--color-parchment)]">
        <Skeleton variant="text" width="30%" height={24} />
      </div>
      <div className="divide-y divide-[var(--color-parchment)]">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="40%" height={16} />
              <Skeleton variant="text" width="60%" height={14} />
            </div>
            <Skeleton variant="rounded" width={80} height={28} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <Skeleton variant="text" width="50%" height={14} className="mb-2" />
          <Skeleton variant="text" width="40%" height={32} className="mb-1" />
          <Skeleton variant="text" width="60%" height={12} />
        </motion.div>
      ))}
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton variant="text" width="30%" height={20} className="mb-2" />
        <Skeleton variant="rounded" height={48} />
      </div>
      <div>
        <Skeleton variant="text" width="40%" height={20} className="mb-2" />
        <Skeleton variant="rounded" height={48} />
      </div>
      <div>
        <Skeleton variant="text" width="35%" height={20} className="mb-2" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton variant="rounded" height={56} />
          <Skeleton variant="rounded" height={56} />
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <Skeleton variant="rounded" width={100} height={44} />
        <Skeleton variant="rounded" width={100} height={44} />
      </div>
    </div>
  );
}
