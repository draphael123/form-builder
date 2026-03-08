'use client';

import { useState, forwardRef, InputHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
  helpText?: string;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, success, helpText, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== '';
    const isActive = isFocused || hasValue;

    return (
      <div className="relative">
        <div className="relative">
          <input
            ref={ref}
            {...props}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`peer w-full px-4 pt-6 pb-2 text-[var(--color-charcoal)] bg-[var(--color-cream)] border-2 rounded-xl transition-all duration-200 outline-none ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : success
                ? 'border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                : 'border-[var(--color-parchment)] focus:border-[var(--color-terracotta)] focus:ring-2 focus:ring-[var(--color-terracotta)]/20'
            } ${className}`}
            placeholder=" "
          />
          <motion.label
            className={`absolute left-4 pointer-events-none transition-colors duration-200 ${
              error
                ? 'text-red-500'
                : isFocused
                ? 'text-[var(--color-terracotta)]'
                : 'text-[var(--color-warm-gray)]'
            }`}
            animate={{
              top: isActive ? '0.5rem' : '50%',
              y: isActive ? 0 : '-50%',
              fontSize: isActive ? '0.75rem' : '0.9375rem',
              fontWeight: isActive ? 500 : 400,
            }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {label}
            {props.required && <span className="text-[var(--color-terracotta)] ml-0.5">*</span>}
          </motion.label>

          {/* Status icons */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <AnimatePresence>
              {success && !error && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Error/Help text */}
        <AnimatePresence>
          {(error || helpText) && (
            <motion.p
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              className={`text-sm mt-1.5 ${error ? 'text-red-500' : 'text-[var(--color-warm-gray)]'}`}
            >
              {error || helpText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';

interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const FloatingTextarea = forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== '';
    const isActive = isFocused || hasValue;

    return (
      <div className="relative">
        <div className="relative">
          <textarea
            ref={ref}
            {...props}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`peer w-full px-4 pt-7 pb-3 text-[var(--color-charcoal)] bg-[var(--color-cream)] border-2 rounded-xl transition-all duration-200 outline-none resize-none ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-[var(--color-parchment)] focus:border-[var(--color-terracotta)] focus:ring-2 focus:ring-[var(--color-terracotta)]/20'
            } ${className}`}
            placeholder=" "
          />
          <motion.label
            className={`absolute left-4 pointer-events-none transition-colors duration-200 ${
              error
                ? 'text-red-500'
                : isFocused
                ? 'text-[var(--color-terracotta)]'
                : 'text-[var(--color-warm-gray)]'
            }`}
            animate={{
              top: isActive ? '0.5rem' : '1rem',
              fontSize: isActive ? '0.75rem' : '0.9375rem',
              fontWeight: isActive ? 500 : 400,
            }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {label}
            {props.required && <span className="text-[var(--color-terracotta)] ml-0.5">*</span>}
          </motion.label>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-sm text-red-500 mt-1.5"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FloatingTextarea.displayName = 'FloatingTextarea';
