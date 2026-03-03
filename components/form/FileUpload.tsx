'use client';

import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { FileUploadQuestion } from '@/types/form';
import { useState } from 'react';

interface FileUploadProps {
  question: FileUploadQuestion;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
  watch: UseFormWatch<Record<string, unknown>>;
  setValue: UseFormSetValue<Record<string, unknown>>;
}

export function FileUpload({ question, register, errors, watch, setValue }: FileUploadProps) {
  const error = errors[question.id];
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const acceptString = question.accept?.join(',') || '*';
  const maxSizeMB = question.maxSize || 10;

  const handleFile = (file: File | null) => {
    if (!file) {
      setFileName(null);
      setValue(question.id, '');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setFileName(file.name);
    // In a real implementation, you would upload the file and store the URL
    // For now, we'll just store the file name
    setValue(question.id, file.name);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {question.description && (
        <p className="text-sm text-gray-500">{question.description}</p>
      )}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : error
            ? 'border-red-500'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {fileName ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-700">{fileName}</p>
            <button
              type="button"
              onClick={() => handleFile(null)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600">
              <label className="cursor-pointer text-blue-600 hover:text-blue-700">
                <span>Upload a file</span>
                <input
                  type="file"
                  className="sr-only"
                  accept={acceptString}
                  onChange={(e) => handleFile(e.target.files?.[0] || null)}
                />
              </label>
              <span> or drag and drop</span>
            </div>
            <p className="text-xs text-gray-500">
              {question.accept?.join(', ') || 'Any file'} up to {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>
      {/* Hidden input for form registration */}
      <input type="hidden" {...register(question.id, {
        required: question.required ? 'Please upload a file' : false,
      })} />
      {error && (
        <p className="text-sm text-red-500">{error.message as string}</p>
      )}
    </div>
  );
}
