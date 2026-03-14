'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface DraftRestoreBannerProps {
  show: boolean;
  onRestore: () => void;
  onDismiss: () => void;
  restoreLabel?: string;
  dismissLabel?: string;
  message?: string;
}

export function DraftRestoreBanner({
  show,
  onRestore,
  onDismiss,
  restoreLabel = 'Restore',
  dismissLabel = 'Start Fresh',
  message = 'You have a saved draft. Would you like to continue where you left off?',
}: DraftRestoreBannerProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="form-card border-l-4 border-[var(--color-sage)] mb-6"
        >
          <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-sage)]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[var(--color-sage)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[var(--color-charcoal)]">Welcome back!</p>
                <p className="text-sm text-[var(--color-warm-gray)] mt-0.5">
                  {message}
                </p>
              </div>
            </div>
            <div className="flex gap-2 sm:flex-shrink-0">
              <button
                type="button"
                onClick={onDismiss}
                className="btn btn-secondary btn-sm"
              >
                {dismissLabel}
              </button>
              <button
                type="button"
                onClick={onRestore}
                className="btn btn-primary btn-sm"
              >
                {restoreLabel}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
