'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface SaveAndContinueModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onEmailChange: (email: string) => void;
  onSave: () => void;
  onStartFresh: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
  title?: string;
  description?: string;
  saveButtonLabel?: string;
  startFreshLabel?: string;
}

export function SaveAndContinueModal({
  isOpen,
  onClose,
  email,
  onEmailChange,
  onSave,
  onStartFresh,
  isSaving,
  saveSuccess,
  title = 'Save & Continue Later',
  description = "Enter your email and we'll send you a link to continue where you left off.",
  saveButtonLabel = 'Send Link',
  startFreshLabel = 'Start Over',
}: SaveAndContinueModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-sage)]/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--color-sage)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[var(--color-charcoal)]">
                    {title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {saveSuccess ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-lg text-[var(--color-charcoal)] mb-2">
                    Link Sent!
                  </h4>
                  <p className="text-[var(--color-warm-gray)] text-sm">
                    Check your email for a link to continue your application.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-[var(--color-warm-gray)] text-sm mb-4">
                    {description}
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="save-email" className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
                        Email Address
                      </label>
                      <input
                        id="save-email"
                        type="email"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        placeholder="your@email.com"
                        className="form-input w-full"
                        disabled={isSaving}
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={onStartFresh}
                        disabled={isSaving}
                        className="btn btn-secondary flex-1"
                      >
                        {startFreshLabel}
                      </button>
                      <button
                        type="button"
                        onClick={onSave}
                        disabled={isSaving || !email}
                        className="btn btn-primary flex-1"
                      >
                        {isSaving ? (
                          <>
                            <span className="spinner" />
                            Sending...
                          </>
                        ) : (
                          saveButtonLabel
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
