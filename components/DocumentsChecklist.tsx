'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { getTranslation } from '@/lib/translations';

interface DocumentItem {
  id: string;
  label: string;
  labelEs: string;
  required: boolean;
  forClinical?: boolean;
}

const documents: DocumentItem[] = [
  {
    id: 'governmentId',
    label: "Driver's License or Government ID",
    labelEs: 'Licencia de conducir o identificación oficial',
    required: true,
  },
  {
    id: 'resume',
    label: 'Resume / CV',
    labelEs: 'Currículum / CV',
    required: true,
  },
  {
    id: 'licenses',
    label: 'Medical Licenses (state licenses with numbers)',
    labelEs: 'Licencias médicas (licencias estatales con números)',
    required: false,
    forClinical: true,
  },
  {
    id: 'dea',
    label: 'DEA License',
    labelEs: 'Licencia DEA',
    required: false,
    forClinical: true,
  },
  {
    id: 'boardCerts',
    label: 'Board Certifications',
    labelEs: 'Certificaciones de la junta',
    required: false,
    forClinical: true,
  },
  {
    id: 'npdb',
    label: 'NPDB Self-Query Report (within 90 days)',
    labelEs: 'Informe de auto-consulta NPDB (dentro de 90 días)',
    required: false,
    forClinical: true,
  },
  {
    id: 'nursys',
    label: 'Nursys License Verification (for NP/RN)',
    labelEs: 'Verificación de licencia Nursys (para NP/RN)',
    required: false,
    forClinical: true,
  },
];

interface DocumentsChecklistProps {
  uploadedDocuments?: string[];
  isClinicalStaff?: boolean;
  onDismiss?: () => void;
}

export function DocumentsChecklist({
  uploadedDocuments = [],
  isClinicalStaff = false,
  onDismiss,
}: DocumentsChecklistProps) {
  const { settings } = useAccessibility();
  const language = settings.language;

  const visibleDocuments = documents.filter(
    (doc) => !doc.forClinical || (doc.forClinical && isClinicalStaff)
  );

  return (
    <div className="documents-checklist">
      <div className="documents-checklist-title">
        <svg className="w-5 h-5 text-[var(--color-terracotta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {getTranslation('documents.title', language)}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="ml-auto text-[var(--color-warm-gray)] hover:text-[var(--color-charcoal)]"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <p className="text-sm text-[var(--color-warm-gray)] mb-3">
        {getTranslation('documents.subtitle', language)}
      </p>
      <div className="space-y-1">
        {visibleDocuments.map((doc) => {
          const isChecked = uploadedDocuments.includes(doc.id);
          return (
            <div
              key={doc.id}
              className={`documents-checklist-item ${isChecked ? 'checked' : ''}`}
            >
              {isChecked ? (
                <svg className="w-4 h-4 text-[var(--color-sage)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" strokeWidth={2} />
                </svg>
              )}
              <span>{language === 'es' ? doc.labelEs : doc.label}</span>
              {doc.required && (
                <span className="text-[var(--color-terracotta)] text-xs ml-1">*</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
