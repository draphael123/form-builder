'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type IconType = 'inbox' | 'search' | 'document' | 'chart' | 'users';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: IconType;
  customIcon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const icons = {
  inbox: (
    <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
      <motion.rect
        x="20"
        y="30"
        width="80"
        height="60"
        rx="8"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
      <motion.path
        d="M20 50 L60 70 L100 50"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      <motion.circle
        cx="60"
        cy="50"
        r="6"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      />
    </svg>
  ),
  search: (
    <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
      <motion.circle
        cx="50"
        cy="50"
        r="30"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.line
        x1="72"
        y1="72"
        x2="100"
        y2="100"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />
      <motion.path
        d="M40 50 L45 55 L60 40"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      />
    </svg>
  ),
  document: (
    <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
      <motion.path
        d="M30 20 L30 100 L90 100 L90 40 L70 20 L30 20"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.path
        d="M70 20 L70 40 L90 40"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />
      <motion.line x1="45" y1="55" x2="75" y2="55" stroke="currentColor" strokeWidth="2" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.2 }} />
      <motion.line x1="45" y1="70" x2="75" y2="70" stroke="currentColor" strokeWidth="2" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.4 }} />
      <motion.line x1="45" y1="85" x2="65" y2="85" stroke="currentColor" strokeWidth="2" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.6 }} />
    </svg>
  ),
  chart: (
    <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
      <motion.line
        x1="20"
        y1="100"
        x2="100"
        y2="100"
        stroke="currentColor"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.line
        x1="20"
        y1="100"
        x2="20"
        y2="20"
        stroke="currentColor"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />
      <motion.rect x="35" y="60" width="15" height="35" fill="currentColor" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ originY: 1 }} transition={{ delay: 0.8, type: 'spring' }} />
      <motion.rect x="55" y="40" width="15" height="55" fill="currentColor" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ originY: 1 }} transition={{ delay: 1, type: 'spring' }} />
      <motion.rect x="75" y="50" width="15" height="45" fill="currentColor" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ originY: 1 }} transition={{ delay: 1.2, type: 'spring' }} />
    </svg>
  ),
  users: (
    <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
      <motion.circle
        cx="60"
        cy="35"
        r="15"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
      />
      <motion.path
        d="M35 95 C35 75 45 60 60 60 C75 60 85 75 85 95"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      <motion.circle cx="30" cy="45" r="10" stroke="currentColor" strokeWidth="2" fill="none" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.5 }} transition={{ delay: 1 }} />
      <motion.circle cx="90" cy="45" r="10" stroke="currentColor" strokeWidth="2" fill="none" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.5 }} transition={{ delay: 1.2 }} />
    </svg>
  ),
};

export function EmptyState({ title, description, icon = 'inbox', customIcon, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="w-32 h-32 mb-6 text-[var(--color-parchment)]">
        {customIcon || icons[icon]}
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-charcoal)] mb-2">{title}</h3>
      {description && (
        <p className="text-[var(--color-warm-gray)] max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <motion.button
          onClick={action.onClick}
          className="btn btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}

export function NoResultsState({ searchTerm }: { searchTerm: string }) {
  return (
    <EmptyState
      icon="search"
      title="No results found"
      description={`We couldn't find anything matching "${searchTerm}". Try adjusting your search.`}
    />
  );
}

export function NoSubmissionsState() {
  return (
    <EmptyState
      icon="document"
      title="No submissions yet"
      description="When users submit the form, their submissions will appear here."
    />
  );
}

export function NoDataState() {
  return (
    <EmptyState
      icon="chart"
      title="No data available"
      description="There isn't enough data to display analytics yet. Check back later."
    />
  );
}
