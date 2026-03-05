'use client';

import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { FileUploadQuestion } from '@/types/form';
import { useState, useCallback } from 'react';

interface FileUploadProps {
  question: FileUploadQuestion;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
  watch: UseFormWatch<Record<string, unknown>>;
  setValue: UseFormSetValue<Record<string, unknown>>;
}

interface UploadedFile {
  fileName: string;
  fileUrl: string;
  webViewLink: string;
}

export function FileUpload({ question, register, errors, watch, setValue }: FileUploadProps) {
  const error = errors[question.id];
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const acceptString = question.accept?.join(',') || '*';
  const maxSizeMB = question.maxSize || 10;

  // Get submitter name from form for file naming
  const submitterName = watch('fullLegalName') as string || watch('printedName') as string || undefined;

  const uploadFile = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data URL prefix (e.g., "data:image/png;base64,")
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: base64,
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream',
          submitterName,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const uploaded: UploadedFile = {
          fileName: file.name,
          fileUrl: result.data.fileUrl,
          webViewLink: result.data.webViewLink,
        };
        setUploadedFile(uploaded);
        // Store the Google Drive URL in the form
        setValue(question.id, result.data.webViewLink);
      } else {
        setUploadError(result.message || 'Failed to upload file');
        setValue(question.id, '');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('Failed to upload file. Please try again.');
      setValue(question.id, '');
    } finally {
      setIsUploading(false);
    }
  }, [question.id, setValue, submitterName]);

  const handleFile = useCallback((file: File | null) => {
    if (!file) {
      setUploadedFile(null);
      setUploadError(null);
      setValue(question.id, '');
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setUploadError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type if specified
    if (question.accept && question.accept.length > 0) {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType = question.accept.some(accept => {
        if (accept.startsWith('.')) {
          return accept.toLowerCase() === fileExtension;
        }
        // Handle MIME type patterns like "image/*"
        if (accept.endsWith('/*')) {
          return file.type.startsWith(accept.replace('/*', '/'));
        }
        return file.type === accept;
      });

      if (!isValidType) {
        setUploadError(`Please upload a file of type: ${question.accept.join(', ')}`);
        return;
      }
    }

    uploadFile(file);
  }, [maxSizeMB, question.accept, question.id, setValue, uploadFile]);

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

  const removeFile = () => {
    setUploadedFile(null);
    setUploadError(null);
    setValue(question.id, '');
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
            : error || uploadError
            ? 'border-red-500'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="space-y-2">
            <svg
              className="animate-spin mx-auto h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-sm text-gray-600">Uploading file...</p>
          </div>
        ) : uploadedFile ? (
          <div className="space-y-2">
            <svg
              className="mx-auto h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-sm text-gray-700 font-medium">{uploadedFile.fileName}</p>
            <a
              href={uploadedFile.webViewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              View uploaded file
            </a>
            <div>
              <button
                type="button"
                onClick={removeFile}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remove file
              </button>
            </div>
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
                  disabled={isUploading}
                />
              </label>
              <span> or drag and drop</span>
            </div>
            <p className="text-xs text-gray-500">
              {question.accept?.join(', ') || 'Any file'} up to {maxSizeMB}MB
            </p>
            <p className="text-xs text-gray-400">
              Files are stored securely
            </p>
          </div>
        )}
      </div>
      {/* Hidden input for form registration */}
      <input type="hidden" {...register(question.id, {
        required: question.required ? 'Please upload a file' : false,
      })} />
      {(error || uploadError) && (
        <p className="text-sm text-red-500">{uploadError || (error?.message as string)}</p>
      )}
    </div>
  );
}
