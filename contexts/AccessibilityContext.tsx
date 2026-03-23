'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilitySettings {
  darkMode: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  language: 'en' | 'es';
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  setDarkMode: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
  setFontSize: (value: 'small' | 'medium' | 'large') => void;
  setLanguage: (value: 'en' | 'es') => void;
}

const defaultSettings: AccessibilitySettings = {
  darkMode: false,
  highContrast: false,
  fontSize: 'medium',
  language: 'en',
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (e) {
        console.error('Failed to parse accessibility settings', e);
      }
    }
  }, []);

  // Save settings to localStorage and apply to document
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));

    // Apply dark mode
    document.documentElement.classList.toggle('dark-mode', settings.darkMode);

    // Apply high contrast
    document.documentElement.classList.toggle('high-contrast', settings.highContrast);

    // Apply font size
    const fontSizes = {
      small: '14px',
      medium: '15px',
      large: '17px',
    };
    document.documentElement.style.fontSize = fontSizes[settings.fontSize];

    // Apply language
    document.documentElement.lang = settings.language;
  }, [settings]);

  const setDarkMode = (value: boolean) => {
    setSettings((prev) => ({ ...prev, darkMode: value }));
  };

  const setHighContrast = (value: boolean) => {
    setSettings((prev) => ({ ...prev, highContrast: value }));
  };

  const setFontSize = (value: 'small' | 'medium' | 'large') => {
    setSettings((prev) => ({ ...prev, fontSize: value }));
  };

  const setLanguage = (value: 'en' | 'es') => {
    setSettings((prev) => ({ ...prev, language: value }));
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        setDarkMode,
        setHighContrast,
        setFontSize,
        setLanguage,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
