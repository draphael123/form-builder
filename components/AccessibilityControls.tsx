'use client';

import { useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export function AccessibilityControls() {
  const [showPanel, setShowPanel] = useState(false);
  const { settings, setDarkMode, setHighContrast, setFontSize, setLanguage } = useAccessibility();

  return (
    <div className="accessibility-controls">
      {/* Accessibility Panel */}
      {showPanel && (
        <div className="accessibility-panel">
          <div className="accessibility-panel-title">Accessibility Settings</div>

          {/* Dark Mode */}
          <div className="accessibility-option">
            <span className="accessibility-option-label">Dark Mode</span>
            <button
              type="button"
              className={`toggle-switch ${settings.darkMode ? 'active' : ''}`}
              onClick={() => setDarkMode(!settings.darkMode)}
              aria-pressed={settings.darkMode}
              aria-label="Toggle dark mode"
            />
          </div>

          {/* High Contrast */}
          <div className="accessibility-option">
            <span className="accessibility-option-label">High Contrast</span>
            <button
              type="button"
              className={`toggle-switch ${settings.highContrast ? 'active' : ''}`}
              onClick={() => setHighContrast(!settings.highContrast)}
              aria-pressed={settings.highContrast}
              aria-label="Toggle high contrast mode"
            />
          </div>

          {/* Font Size */}
          <div className="accessibility-option">
            <span className="accessibility-option-label">Text Size</span>
            <div className="font-size-controls">
              <button
                type="button"
                className="font-size-btn"
                onClick={() => setFontSize('small')}
                aria-pressed={settings.fontSize === 'small'}
                aria-label="Small text"
              >
                A
              </button>
              <button
                type="button"
                className="font-size-btn"
                onClick={() => setFontSize('medium')}
                aria-pressed={settings.fontSize === 'medium'}
                aria-label="Medium text"
                style={{ fontSize: '16px' }}
              >
                A
              </button>
              <button
                type="button"
                className="font-size-btn"
                onClick={() => setFontSize('large')}
                aria-pressed={settings.fontSize === 'large'}
                aria-label="Large text"
                style={{ fontSize: '18px' }}
              >
                A
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="accessibility-option">
            <span className="accessibility-option-label">Language</span>
            <div className="language-selector">
              <button
                type="button"
                className={`language-btn ${settings.language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
                aria-pressed={settings.language === 'en'}
              >
                EN
              </button>
              <button
                type="button"
                className={`language-btn ${settings.language === 'es' ? 'active' : ''}`}
                onClick={() => setLanguage('es')}
                aria-pressed={settings.language === 'es'}
              >
                ES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        type="button"
        className={`accessibility-btn ${showPanel ? 'active' : ''}`}
        onClick={() => setShowPanel(!showPanel)}
        aria-expanded={showPanel}
        aria-label="Accessibility settings"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    </div>
  );
}
