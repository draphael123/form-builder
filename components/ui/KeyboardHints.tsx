'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface KeyboardHint {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

interface KeyboardHintsProps {
  hints: KeyboardHint[];
  show?: boolean;
}

export function KeyboardHints({ hints, show = true }: KeyboardHintsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on desktop
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    setIsVisible(isDesktop && show);
  }, [show]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="flex items-center justify-center gap-6 py-3 text-sm text-[var(--color-warm-gray)]"
        >
          {hints.map((hint, i) => (
            <motion.div
              key={hint.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2"
            >
              <kbd className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 bg-[var(--color-cream)] border border-[var(--color-parchment)] rounded text-xs font-mono font-semibold text-[var(--color-charcoal)] shadow-sm">
                {hint.key}
              </kbd>
              <span className="text-[var(--color-warm-gray)]">{hint.label}</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface KeyProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Key({ children, size = 'md' }: KeyProps) {
  const sizeClasses = {
    sm: 'min-w-[1.25rem] h-5 px-1 text-[10px]',
    md: 'min-w-[1.5rem] h-6 px-1.5 text-xs',
    lg: 'min-w-[2rem] h-8 px-2 text-sm',
  };

  return (
    <kbd
      className={`inline-flex items-center justify-center bg-[var(--color-cream)] border border-[var(--color-parchment)] rounded font-mono font-semibold text-[var(--color-charcoal)] shadow-sm ${sizeClasses[size]}`}
    >
      {children}
    </kbd>
  );
}

export function NavigationHints() {
  return (
    <KeyboardHints
      hints={[
        { key: '←', label: 'Previous' },
        { key: '→', label: 'Next' },
        { key: 'Enter', label: 'Continue' },
        { key: 'Esc', label: 'Cancel' },
      ]}
    />
  );
}

interface ShortcutToastProps {
  shortcut: string;
  action: string;
  show: boolean;
  onHide: () => void;
}

export function ShortcutToast({ shortcut, action, show, onHide }: ShortcutToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onHide, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-[var(--color-charcoal)] text-white rounded-xl shadow-lg"
        >
          <kbd className="px-2 py-1 bg-white/20 rounded text-sm font-mono">{shortcut}</kbd>
          <span className="text-sm">{action}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
