'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { newHireFormConfig } from '@/lib/form-config';
import { Question, FormSection as FormSectionType } from '@/types/form';
import {
  FormSection,
  TextField,
  MultipleChoice,
  Checkbox,
  Dropdown,
  DatePicker,
  TimePicker,
  LinearScale,
  Grid,
  FileUpload,
} from '@/components/form';
import { useFormAutoSave } from '@/hooks/useFormAutoSave';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { useTimeTracking } from '@/hooks/useTimeTracking';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { getTranslation, TranslationKey } from '@/lib/translations';
import { FloatingProgressBar } from '@/components/FloatingProgressBar';
import { AccessibilityControls } from '@/components/AccessibilityControls';
import { DocumentsChecklist } from '@/components/DocumentsChecklist';
import { FAQAccordion } from '@/components/FAQAccordion';
import { SectionOverview } from '@/components/SectionOverview';
import { SessionTimeoutWarning } from '@/components/SessionTimeoutWarning';

export default function FormPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveEmail, setSaveEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showReviewPage, setShowReviewPage] = useState(false);
  const [pageDirection, setPageDirection] = useState<'forward' | 'backward'>('forward');
  const [announcement, setAnnouncement] = useState('');
  const [validatedFields, setValidatedFields] = useState<Set<string>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDocumentsChecklist, setShowDocumentsChecklist] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Accessibility
  const { settings } = useAccessibility();
  const t = (key: TranslationKey, params?: Record<string, string | number>) =>
    getTranslation(key, settings.language, params);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors, dirtyFields },
  } = useForm<Record<string, unknown>>({
    mode: 'onChange', // Enable inline validation
  });

  const watchedValues = watch();

  // Track unsaved changes
  useEffect(() => {
    const hasDirty = Object.keys(dirtyFields).length > 0;
    setHasUnsavedChanges(hasDirty);
  }, [dirtyFields]);

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !showReviewPage) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, showReviewPage]);

  // Update browser tab title with progress
  useEffect(() => {
    const baseTitle = 'Fountain Onboarding';
    if (showReviewPage) {
      document.title = `Review - ${baseTitle}`;
    } else {
      const progress = Math.round(progressPercentage);
      document.title = `${progress}% Complete - ${baseTitle}`;
    }
    return () => {
      document.title = baseTitle;
    };
  });

  // Auto-save hook
  const {
    hasDraft,
    lastSavedText,
    restoreDraft,
    clearDraft,
  } = useFormAutoSave({
    formId: 'new-hire-form',
    watch,
    reset,
    onRestore: (data) => {
      Object.keys(data).forEach((key) => {
        if (data[key]) {
          trigger(key);
        }
      });
    },
  });

  // Analytics hook
  const {
    trackPageChange,
    trackFormComplete,
    trackSaveDraft,
    trackValidationError,
  } = useAnalytics();

  // Track page changes
  useEffect(() => {
    trackPageChange(currentPage);
  }, [currentPage, trackPageChange]);

  // Focus management - focus first field on page change
  useEffect(() => {
    const timer = setTimeout(() => {
      const firstInput = formRef.current?.querySelector<HTMLInputElement>(
        'input:not([type="hidden"]), select, textarea'
      );
      firstInput?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [currentPage, showReviewPage]);

  // Screen reader announcements
  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 1000);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (!isLastPage && !showReviewPage) {
          e.preventDefault();
          handleNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (!isFirstPage && !showReviewPage) {
          e.preventDefault();
          handlePrevious();
        }
      } else if (e.key === 'Escape' && showReviewPage) {
        e.preventDefault();
        setShowReviewPage(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Mobile swipe navigation
  useSwipeNavigation({
    onSwipeLeft: () => {
      if (!isLastPage && !showReviewPage) {
        handleNext();
      }
    },
    onSwipeRight: () => {
      if (!isFirstPage && !showReviewPage) {
        handlePrevious();
      }
    },
    enabled: !showReviewPage,
  });

  // Check for restored draft from continue link
  useEffect(() => {
    const restored = localStorage.getItem('form-draft-restore');
    if (restored) {
      try {
        const { data, currentPage: page } = JSON.parse(restored);
        Object.entries(data).forEach(([key, value]) => {
          setValue(key, value);
        });
        if (page !== undefined) {
          setCurrentPage(page);
        }
        localStorage.removeItem('form-draft-restore');
      } catch (err) {
        console.error('Error restoring draft:', err);
      }
    }
  }, [setValue]);

  // Show draft banner on initial load if draft exists
  useEffect(() => {
    if (hasDraft) {
      setShowDraftBanner(true);
    }
  }, [hasDraft]);

  // Handle restoring draft
  const handleRestoreDraft = () => {
    const restored = restoreDraft();
    if (restored?.currentPage !== undefined) {
      setCurrentPage(restored.currentPage);
    }
    setShowDraftBanner(false);
    announce('Draft restored successfully');
  };

  // Handle dismissing draft
  const handleDismissDraft = () => {
    clearDraft();
    setShowDraftBanner(false);
  };

  // Handle save & continue later
  const handleSaveAndContinue = async () => {
    if (!saveEmail) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: saveEmail,
          data: watchedValues,
          currentPage,
          sendEmail: true,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSaveSuccess(true);
        trackSaveDraft(currentPage);
      } else {
        alert(result.message || 'Failed to save progress');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save progress. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Check if a question should be shown based on conditional logic
  const shouldShowQuestion = useCallback((question: Question): boolean => {
    if (!question.showWhen) return true;

    const { field, equals } = question.showWhen;
    const currentValue = watchedValues[field];

    // Handle undefined/null currentValue
    if (currentValue === undefined || currentValue === null) {
      return false;
    }

    // If equals is an array, check if currentValue is in the array
    if (Array.isArray(equals)) {
      // Ensure currentValue is a string before checking
      if (typeof currentValue === 'string') {
        return equals.includes(currentValue);
      }
      return false;
    }

    // Simple string comparison
    return currentValue === equals;
  }, [watchedValues]);

  // Check if a section should be shown (has at least one visible question)
  const shouldShowSection = useCallback((section: FormSectionType): boolean => {
    return section.questions.some((question) => shouldShowQuestion(question));
  }, [shouldShowQuestion]);

  // Get visible sections only
  const visibleSections = useMemo(() => {
    return newHireFormConfig.sections.filter((section) => shouldShowSection(section));
  }, [shouldShowSection]);

  const totalPages = visibleSections.length;
  const currentSection = visibleSections[currentPage];
  const isLastPage = currentPage === totalPages - 1;
  const isFirstPage = currentPage === 0;

  // Time tracking hook
  const { getCompletionData, getElapsedTime } = useTimeTracking({
    formId: 'new-hire-form',
    currentSectionId: currentSection?.id || 'intro',
    currentSectionTitle: currentSection?.title || 'Introduction',
  });

  // Track completed sections
  const completedSections = useMemo(() => {
    const completed = new Set<number>();
    visibleSections.forEach((section, index) => {
      const visibleQuestions = section.questions.filter(shouldShowQuestion);
      const allFilled = visibleQuestions.every((q) => {
        const value = watchedValues[q.id];
        if (!q.required) return true;
        if (Array.isArray(value)) return value.length > 0;
        return value !== undefined && value !== '';
      });
      const noErrors = visibleQuestions.every((q) => !errors[q.id]);
      if (allFilled && noErrors && index < currentPage) {
        completed.add(index);
      }
    });
    return completed;
  }, [visibleSections, watchedValues, errors, currentPage, shouldShowQuestion]);

  // Calculate total visible questions and current question range
  const questionCounts = useMemo(() => {
    let totalQuestions = 0;
    let questionsBeforeCurrentPage = 0;
    let questionsOnCurrentPage = 0;

    visibleSections.forEach((section, index) => {
      const visibleQuestionsInSection = section.questions.filter((q) => shouldShowQuestion(q)).length;
      totalQuestions += visibleQuestionsInSection;

      if (index < currentPage) {
        questionsBeforeCurrentPage += visibleQuestionsInSection;
      } else if (index === currentPage) {
        questionsOnCurrentPage = visibleQuestionsInSection;
      }
    });

    return {
      total: totalQuestions,
      startOfCurrentPage: questionsBeforeCurrentPage + 1,
      endOfCurrentPage: questionsBeforeCurrentPage + questionsOnCurrentPage,
    };
  }, [visibleSections, currentPage, shouldShowQuestion]);

  const progressPercentage = (questionCounts.endOfCurrentPage / questionCounts.total) * 100;

  // Check if a field has a valid value
  const isFieldComplete = useCallback((questionId: string): boolean => {
    const value = watchedValues[questionId];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== '' && !errors[questionId];
  }, [watchedValues, errors]);

  // Handle inline validation
  const handleFieldBlur = useCallback((fieldId: string) => {
    trigger(fieldId).then((isValid) => {
      if (isValid) {
        setValidatedFields((prev) => new Set(prev).add(fieldId));
      }
    });
  }, [trigger]);

  // Render a question based on its type
  const renderQuestion = (question: Question) => {
    if (!shouldShowQuestion(question)) return null;

    const commonProps = {
      register,
      errors,
      watch,
      setValue,
      onBlur: () => handleFieldBlur(question.id),
    };

    const isComplete = isFieldComplete(question.id);

    const questionElement = (() => {
      switch (question.type) {
        case 'short-text':
        case 'long-text':
          return <TextField key={question.id} question={question} {...commonProps} />;
        case 'multiple-choice':
          return <MultipleChoice key={question.id} question={question} {...commonProps} />;
        case 'checkbox':
          return <Checkbox key={question.id} question={question} {...commonProps} />;
        case 'dropdown':
          return <Dropdown key={question.id} question={question} {...commonProps} />;
        case 'date':
          return <DatePicker key={question.id} question={question} {...commonProps} />;
        case 'time':
          return <TimePicker key={question.id} question={question} {...commonProps} />;
        case 'linear-scale':
          return <LinearScale key={question.id} question={question} {...commonProps} />;
        case 'multiple-choice-grid':
        case 'checkbox-grid':
          return <Grid key={question.id} question={question} {...commonProps} />;
        case 'file-upload':
          return <FileUpload key={question.id} question={question} {...commonProps} />;
        default:
          return null;
      }
    })();

    return (
      <div key={question.id} className="relative">
        {questionElement}
        {/* Field completion indicator */}
        {isComplete && question.required && (
          <span
            className={`field-complete-indicator ${isComplete ? 'visible' : ''}`}
            style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            aria-hidden="true"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </div>
    );
  };

  // Get current page errors for error summary
  const currentPageErrors = useMemo(() => {
    if (!currentSection) return [];
    return currentSection.questions
      .filter(shouldShowQuestion)
      .filter((q) => errors[q.id])
      .map((q) => ({
        id: q.id,
        label: q.label,
        message: (errors[q.id] as { message?: string })?.message || 'This field is required',
      }));
  }, [currentSection, errors, shouldShowQuestion]);

  // Handle next page
  const handleNext = async () => {
    const currentQuestions = currentSection.questions.filter(shouldShowQuestion);
    const fieldIds = currentQuestions.map((q) => q.id);

    const isValid = await trigger(fieldIds);

    if (isValid) {
      if (isLastPage) {
        setShowReviewPage(true);
        announce('Review page. Please review your answers before submitting.');
      } else {
        setPageDirection('forward');
        setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
        announce(`Section ${currentPage + 2} of ${totalPages}: ${visibleSections[currentPage + 1]?.title}`);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      fieldIds.forEach((fieldId) => {
        if (errors[fieldId]) {
          trackValidationError(fieldId, currentPage);
        }
      });
      announce(`${currentPageErrors.length} errors found. Please correct them before continuing.`);
    }
  };

  // Handle previous page
  const handlePrevious = () => {
    setPageDirection('backward');
    setCurrentPage((prev) => Math.max(prev - 1, 0));
    announce(`Section ${currentPage} of ${totalPages}: ${visibleSections[currentPage - 1]?.title}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle section jump from stepper
  const handleSectionJump = async (targetIndex: number) => {
    if (targetIndex === currentPage) return;
    if (targetIndex > currentPage) {
      // Validate all sections up to target
      for (let i = currentPage; i < targetIndex; i++) {
        const section = visibleSections[i];
        const fieldIds = section.questions.filter(shouldShowQuestion).map((q) => q.id);
        const isValid = await trigger(fieldIds);
        if (!isValid) {
          setCurrentPage(i);
          announce('Please complete this section before jumping ahead.');
          return;
        }
      }
    }
    setPageDirection(targetIndex > currentPage ? 'forward' : 'backward');
    setCurrentPage(targetIndex);
    announce(`Jumped to section ${targetIndex + 1}: ${visibleSections[targetIndex]?.title}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle edit from review page
  const handleEditFromReview = (sectionIndex: number) => {
    setShowReviewPage(false);
    setCurrentPage(sectionIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Get timing data for analytics
    const timingData = getCompletionData();

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          _timing: {
            totalDuration: timingData.totalDuration,
            sectionTimings: timingData.sectionTimings.map(s => ({
              sectionId: s.sectionId,
              sectionTitle: s.sectionTitle,
              duration: s.duration,
            })),
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        clearDraft();
        trackFormComplete();
        setHasUnsavedChanges(false);
        router.push(`/success?id=${result.submissionId}`);
      } else {
        setSubmitError(result.message || 'Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render review page
  const renderReviewPage = () => {
    return (
      <div className="animate-fade-in-up">
        <div className="form-card mb-6">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[var(--color-sage)]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--color-sage)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold text-[var(--color-charcoal)]">
                  Review Your Answers
                </h2>
                <p className="text-[var(--color-warm-gray)]">
                  Please review your information before submitting
                </p>
              </div>
            </div>

            {visibleSections.map((section, sectionIndex) => {
              const visibleQuestions = section.questions.filter(shouldShowQuestion);
              if (visibleQuestions.length === 0) return null;

              return (
                <div key={section.id} className="review-section">
                  <div className="flex items-center justify-between">
                    <h3 className="review-section-title">{section.title}</h3>
                    <button
                      type="button"
                      onClick={() => handleEditFromReview(sectionIndex)}
                      className="review-edit-btn"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </button>
                  </div>
                  {visibleQuestions.map((question) => {
                    const value = watchedValues[question.id];
                    let displayValue: string;

                    if (value === undefined || value === null || value === '') {
                      displayValue = '';
                    } else if (Array.isArray(value)) {
                      displayValue = value.join(', ');
                    } else if (typeof value === 'object') {
                      displayValue = JSON.stringify(value);
                    } else {
                      displayValue = String(value);
                    }

                    // Handle file uploads
                    if (question.type === 'file-upload' && displayValue) {
                      displayValue = 'File uploaded';
                    }

                    return (
                      <div key={question.id} className="review-field">
                        <span className="review-field-label">{question.label}</span>
                        <span className={`review-field-value ${!displayValue ? 'empty' : ''}`}>
                          {displayValue || 'Not provided'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="form-card border-l-4 border-red-500 animate-fade-in mb-6">
            <div className="p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-red-800">Submission Error</p>
                <p className="text-sm text-red-600 mt-1">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-4">
          <button
            type="button"
            onClick={() => setShowReviewPage(false)}
            className="btn btn-secondary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Form
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? (
              <>
                <span className="spinner" />
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  // Determine if clinical staff for conditional features
  const isClinicalStaff = watchedValues.isClinicalStaff === 'Yes';

  return (
    <div className="min-h-screen py-8 px-4 sm:py-12 sm:px-6 relative">
      {/* Floating progress bar */}
      <FloatingProgressBar progress={progressPercentage} />

      {/* Screen reader announcements */}
      <div className="live-region" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Floating decorative shapes */}
      <div className="floating-shape floating-shape-1" />
      <div className="floating-shape floating-shape-2" />

      {/* Accessibility controls */}
      <AccessibilityControls />

      {/* Session timeout warning */}
      <SessionTimeoutWarning timeoutMinutes={30} warningMinutes={5} />

      <div className="max-w-2xl mx-auto">
        {/* Draft Restore Banner */}
        {showDraftBanner && (
          <div className="draft-banner p-4 mb-6 animate-fade-in-up flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-sage)]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[var(--color-sage)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[var(--color-charcoal)]">Welcome back!</p>
                <p className="text-sm text-[var(--color-warm-gray)]">You have a saved draft. Continue where you left off?</p>
              </div>
            </div>
            <div className="flex gap-2 sm:flex-shrink-0">
              <button
                type="button"
                onClick={handleRestoreDraft}
                className="btn btn-primary text-sm px-4 py-2"
              >
                Restore Draft
              </button>
              <button
                type="button"
                onClick={handleDismissDraft}
                className="btn btn-secondary text-sm px-4 py-2"
              >
                Start Fresh
              </button>
            </div>
          </div>
        )}

        {/* Documents Checklist - show on first page */}
        {showDocumentsChecklist && currentPage === 0 && !showReviewPage && (
          <DocumentsChecklist
            isClinicalStaff={isClinicalStaff}
            onDismiss={() => setShowDocumentsChecklist(false)}
          />
        )}

        {/* Form Header Card */}
        <div className="form-card mb-6 animate-fade-in-up">
          <div className="p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-terracotta)] to-[var(--color-terracotta-dark)] flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="badge badge-terracotta">New Hire</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--color-charcoal)] tracking-tight mb-3">
              {newHireFormConfig.title}
            </h1>
            {newHireFormConfig.description && (
              <p className="text-[var(--color-warm-gray)] leading-relaxed whitespace-pre-line">
                {newHireFormConfig.description}
              </p>
            )}
          </div>
        </div>

        {/* Section Stepper */}
        {!showReviewPage && (
          <div className="form-card mb-6 animate-fade-in-up stagger-1">
            <div className="p-4">
              <nav className="section-stepper" aria-label="Form sections">
                {visibleSections.map((section, index) => {
                  const isActive = index === currentPage;
                  const isCompleted = completedSections.has(index);
                  const isAccessible = index <= currentPage || completedSections.has(index - 1);

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => isAccessible && handleSectionJump(index)}
                      disabled={!isAccessible}
                      className={`stepper-item ${isActive ? 'stepper-active' : ''} ${isCompleted ? 'stepper-completed' : ''} ${!isAccessible ? 'stepper-disabled' : ''}`}
                      aria-current={isActive ? 'step' : undefined}
                      aria-label={`${section.title}${isCompleted ? ' (completed)' : ''}${isActive ? ' (current)' : ''}`}
                    >
                      <span className="stepper-number">
                        {isCompleted ? (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className="hidden sm:inline">{section.title.length > 20 ? section.title.substring(0, 20) + '...' : section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Progress Card */}
        {!showReviewPage && (
          <div className="form-card mb-6 animate-fade-in-up stagger-2">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-2xl font-semibold text-[var(--color-terracotta)]">
                      {currentPage + 1}
                    </span>
                    <span className="text-[var(--color-warm-gray-light)]">/</span>
                    <span className="text-[var(--color-warm-gray)]">{totalPages}</span>
                  </div>
                  <div className="h-6 w-px bg-[var(--color-parchment)]" />
                  <span className="text-sm text-[var(--color-warm-gray)]">
                    {questionCounts.startOfCurrentPage === questionCounts.endOfCurrentPage
                      ? `Question ${questionCounts.startOfCurrentPage}`
                      : `Questions ${questionCounts.startOfCurrentPage}–${questionCounts.endOfCurrentPage}`} of {questionCounts.total}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {lastSavedText && (
                    <span className="flex items-center gap-1.5 text-xs text-[var(--color-sage)]">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {lastSavedText}
                    </span>
                  )}
                  <span className="text-sm font-medium text-[var(--color-charcoal)]">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>

              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {showReviewPage ? (
            renderReviewPage()
          ) : (
            <>
              {/* Error Summary */}
              {currentPageErrors.length > 0 && (
                <div className="error-summary animate-fade-in" role="alert">
                  <div className="error-summary-title">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Please fix {currentPageErrors.length} error{currentPageErrors.length > 1 ? 's' : ''} before continuing
                  </div>
                  <ul className="error-summary-list">
                    {currentPageErrors.map((error) => (
                      <li key={error.id} className="error-summary-item" onClick={() => {
                        document.getElementById(error.id)?.focus();
                      }}>
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span><strong>{error.label}:</strong> {error.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Current Section */}
              {currentSection && (
                <div
                  key={currentSection.id}
                  className={`page-transition ${pageDirection === 'forward' ? 'page-slide-enter-active' : 'page-slide-enter-active'}`}
                >
                  {/* Section Overview */}
                  <SectionOverview
                    section={currentSection}
                    visibleQuestions={currentSection.questions.filter(shouldShowQuestion)}
                    completedFields={new Set(
                      currentSection.questions
                        .filter(shouldShowQuestion)
                        .filter((q) => isFieldComplete(q.id))
                        .map((q) => q.id)
                    )}
                  />

                  <FormSection
                    title={currentSection.title}
                    description={currentSection.description}
                  >
                    {currentSection.questions.map((question) => renderQuestion(question))}
                  </FormSection>
                </div>
              )}

              {/* Error Message */}
              {submitError && (
                <div className="form-card border-l-4 border-red-500 animate-fade-in">
                  <div className="p-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-red-800">Submission Error</p>
                      <p className="text-sm text-red-600 mt-1">{submitError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-4 pt-4">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={isFirstPage}
                  className="btn btn-secondary"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary"
                >
                  {isLastPage ? 'Review Answers' : 'Continue'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Keyboard Navigation Hint */}
              <div className="keyboard-hint">
                <span>Keyboard:</span>
                <span className="keyboard-key">←</span>
                <span>Previous</span>
                <span className="keyboard-key">→</span>
                <span>Next</span>
              </div>

              {/* Mobile Swipe Indicator */}
              <div className="swipe-indicator">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <span>{settings.language === 'es' ? 'Desliza para navegar' : 'Swipe to navigate'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </>
          )}
        </form>

        {/* Save & Continue Later */}
        {!showReviewPage && (
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => setShowSaveModal(true)}
              className="inline-flex items-center gap-2 text-sm text-[var(--color-warm-gray)] hover:text-[var(--color-terracotta)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save & Continue Later
            </button>
          </div>
        )}

        {/* FAQ Section */}
        {!showReviewPage && (
          <div className="mt-8">
            <FAQAccordion isClinicalStaff={isClinicalStaff} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-[var(--color-warm-gray-light)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>{settings.language === 'es' ? 'Tu información está segura y encriptada' : 'Your information is secure and encrypted'}</span>
          </div>
        </footer>
      </div>

      {/* Save & Continue Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="form-card max-w-md w-full animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            {saveSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-sage)]/10 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-[var(--color-sage)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-display text-2xl font-semibold text-[var(--color-charcoal)] mb-2">
                  Progress Saved!
                </h2>
                <p className="text-[var(--color-warm-gray)] mb-2">
                  We&apos;ve sent a link to <strong className="text-[var(--color-charcoal)]">{saveEmail}</strong>
                </p>
                <p className="text-sm text-[var(--color-warm-gray-light)] mb-6">
                  The link expires in 7 days
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowSaveModal(false);
                    setSaveSuccess(false);
                    setSaveEmail('');
                  }}
                  className="btn btn-primary w-full"
                >
                  Continue with Form
                </button>
              </div>
            ) : (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold text-[var(--color-charcoal)]">
                    Save Your Progress
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowSaveModal(false)}
                    className="w-8 h-8 rounded-full hover:bg-[var(--color-cream)] flex items-center justify-center transition-colors"
                  >
                    <svg className="w-5 h-5 text-[var(--color-warm-gray)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="text-[var(--color-warm-gray)] mb-6">
                  Enter your email and we&apos;ll send you a magic link to continue later.
                </p>

                <div className="mb-6">
                  <label htmlFor="save-email" className="question-label block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="save-email"
                    value={saveEmail}
                    onChange={(e) => setSaveEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="form-input"
                  />
                </div>

                <div className="bg-[var(--color-cream)] rounded-xl p-4 mb-6 flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--color-terracotta)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-[var(--color-warm-gray)]">
                    Your progress is auto-saved locally, but this link lets you continue on any device.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSaveModal(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAndContinue}
                    disabled={!saveEmail || isSaving}
                    className="btn btn-primary flex-1"
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Send Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
