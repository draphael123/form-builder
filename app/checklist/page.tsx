'use client';

import Link from 'next/link';
import { useState } from 'react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
  forClinical: boolean;
  forNonClinical: boolean;
  condition?: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'id',
    title: "Driver's License or Government ID",
    description: 'A clear photo or scan of your valid government-issued ID',
    required: true,
    forClinical: true,
    forNonClinical: true,
  },
  {
    id: 'resume',
    title: 'Resume / CV',
    description: 'Your current resume or curriculum vitae',
    required: true,
    forClinical: true,
    forNonClinical: true,
  },
  {
    id: 'nameChange',
    title: 'Name Change Documents',
    description: 'If you have used other names, legal documentation of name changes',
    required: false,
    forClinical: true,
    forNonClinical: true,
    condition: 'Only if you have used other names',
  },
  {
    id: 'npdb',
    title: 'NPDB Self-Query Report',
    description: 'National Practitioner Data Bank report dated within the last 90 days',
    required: true,
    forClinical: true,
    forNonClinical: false,
    condition: 'NP, MD, DO only',
  },
  {
    id: 'nursys',
    title: 'Nursys License Verification',
    description: 'Nursys Quick Confirm License Verification report pulled within the last 30 days',
    required: true,
    forClinical: true,
    forNonClinical: false,
    condition: 'NP, RN only',
  },
  {
    id: 'boardCert',
    title: 'Board Certifications',
    description: 'Copies of all active board certifications',
    required: false,
    forClinical: true,
    forNonClinical: false,
    condition: 'If you have board certifications',
  },
  {
    id: 'health',
    title: 'Health Documentation',
    description: 'Release/clearance documentation if applicable to health questions',
    required: false,
    forClinical: true,
    forNonClinical: false,
    condition: 'Only if any health questions answered Yes',
  },
];

const INFO_TO_HAVE_READY = [
  'Social Security Number',
  'Emergency contact information (name and phone)',
  'Personal email address',
  'Current home address',
  'Date of birth and place of birth',
];

const CLINICAL_INFO = [
  'All state license numbers with issue and expiration dates',
  'DEA license numbers (if applicable)',
  'NPI number',
  'CSR (Controlled Substance Registration) details',
  'Education history (middle school through graduate programs)',
  'Work history with supervisor contact information',
  'Three professional references with contact details',
];

export default function ChecklistPage() {
  const [isClinical, setIsClinical] = useState<boolean | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const filteredItems = CHECKLIST_ITEMS.filter(item => {
    if (isClinical === null) return true;
    if (isClinical) return item.forClinical;
    return item.forNonClinical;
  });

  const requiredItems = filteredItems.filter(item => item.required);
  const allRequiredChecked = requiredItems.every(item => checkedItems.has(item.id));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="border-t-8 border-blue-600" />
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Before You Begin
            </h1>
            <p className="text-sm text-gray-600">
              Please review this checklist and gather the necessary documents before starting the New Hire Onboarding form. Having everything ready will help you complete the form in one session.
            </p>
          </div>
        </div>

        {/* Staff Type Selection */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">What type of staff are you?</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setIsClinical(true)}
              className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                isClinical === true
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-medium text-gray-900">Clinical Staff</p>
              <p className="text-sm text-gray-500">MD, DO, NP, RN</p>
            </button>
            <button
              onClick={() => setIsClinical(false)}
              className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                isClinical === false
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-medium text-gray-900">Non-Clinical Staff</p>
              <p className="text-sm text-gray-500">Administrative, Support</p>
            </button>
          </div>
        </div>

        {/* Documents Checklist */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Documents to Upload
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Check off each item as you gather them. Required items are marked with *.
          </p>
          <div className="space-y-3">
            {filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  checkedItems.has(item.id)
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    checkedItems.has(item.id)
                      ? 'bg-green-600 border-green-600'
                      : 'border-gray-300'
                  }`}>
                    {checkedItems.has(item.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {item.title}
                      {item.required && <span className="text-red-500 ml-1">*</span>}
                    </p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    {item.condition && (
                      <p className="text-xs text-blue-600 mt-1">{item.condition}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Information to Have Ready */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Information to Have Ready
          </h2>
          <ul className="space-y-2">
            {INFO_TO_HAVE_READY.map((info, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {info}
              </li>
            ))}
          </ul>

          {(isClinical === true || isClinical === null) && (
            <>
              <h3 className="text-md font-medium text-gray-900 mt-6 mb-3">
                Additional for Clinical Staff:
              </h3>
              <ul className="space-y-2">
                {CLINICAL_INFO.map((info, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {info}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Time Estimate */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium text-blue-900">Estimated Time</p>
              <p className="text-sm text-blue-700">
                {isClinical === false
                  ? '10-15 minutes for non-clinical staff'
                  : isClinical === true
                  ? '30-45 minutes for clinical staff'
                  : '10-45 minutes depending on staff type'}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Your progress is automatically saved, so you can return later if needed.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href="/"
            className={`flex-1 py-3 px-6 rounded-lg text-center font-medium transition-colors ${
              allRequiredChecked
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {allRequiredChecked ? "I'm Ready - Start Form" : 'Start Form'}
          </Link>
        </div>
        {!allRequiredChecked && requiredItems.length > 0 && (
          <p className="text-center text-sm text-gray-500 mt-2">
            Check off the required documents above when you have them ready
          </p>
        )}
      </div>
    </div>
  );
}
