'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { newHireFormConfig } from '@/lib/form-config';
import { celebrateSubmit } from '@/lib/confetti';

function useConfetti() {
  const startConfetti = useCallback(() => {
    celebrateSubmit();
  }, []);

  return { startConfetti };
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  const { startConfetti } = useConfetti();

  // Start confetti on mount
  useEffect(() => {
    startConfetti();
    toast.success('Form submitted successfully!', {
      description: 'You will receive a confirmation email shortly.',
    });
  }, [startConfetti]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating decorative shapes */}
      <div className="floating-shape floating-shape-1" />
      <div className="floating-shape floating-shape-2" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="form-card max-w-md w-full">
        <div className="p-10 text-center">
          {/* Success Icon */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          >
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-sage-light)] flex items-center justify-center relative shadow-lg">
              <motion.svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                />
              </motion.svg>
              {/* Decorative rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[var(--color-sage)]"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[var(--color-sage)]"
                initial={{ scale: 1, opacity: 0.3 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5, delay: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="font-display text-3xl font-semibold text-[var(--color-charcoal)] mb-3">
            Submission Complete!
          </h1>

          {/* Message */}
          <p className="text-[var(--color-warm-gray)] leading-relaxed mb-6">
            {newHireFormConfig.successMessage}
          </p>

          {/* Submission ID */}
          {submissionId && (
            <div className="bg-[var(--color-parchment)] rounded-lg px-4 py-3 mb-6 inline-block">
              <p className="text-xs text-[var(--color-warm-gray)] mb-1">Confirmation Number</p>
              <p className="font-mono text-sm font-medium text-[var(--color-charcoal)]">{submissionId}</p>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-[var(--color-parchment)]" />
            <svg className="w-5 h-5 text-[var(--color-terracotta)]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <div className="flex-1 h-px bg-[var(--color-parchment)]" />
          </div>

          {/* Next Steps */}
          <div className="bg-[var(--color-cream)] rounded-xl p-5 mb-8 text-left">
            <h3 className="font-medium text-[var(--color-charcoal)] mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--color-terracotta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-[var(--color-warm-gray)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-terracotta)] mt-0.5">1.</span>
                Our HR team will review your submission
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-terracotta)] mt-0.5">2.</span>
                You&apos;ll receive a confirmation email shortly
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-terracotta)] mt-0.5">3.</span>
                We&apos;ll reach out if we need any additional information
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Submit Another */}
            <Link href="/" className="btn btn-primary w-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Submit Another Response
            </Link>
          </div>

          {/* Replay Confetti Button */}
          <motion.button
            onClick={startConfetti}
            className="mt-6 text-sm text-[var(--color-warm-gray-light)] hover:text-[var(--color-terracotta)] transition-colors inline-flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Celebrate again
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" style={{ borderColor: 'rgba(0,0,0,0.1)', borderTopColor: 'var(--color-terracotta)' }} />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
