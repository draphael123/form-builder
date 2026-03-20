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
  previewUrl?: string;
  fileType?: string;
}

// Convert MIME types and extensions to human-readable format
function formatAcceptedTypes(accept: string[] | undefined): string {
  if (!accept || accept.length === 0) return 'Any file type';

  const typeMap: Record<string, string> = {
    '.pdf': 'PDF',
    '.doc': 'DOC',
    '.docx': 'DOCX',
    '.jpg': 'JPG',
    '.jpeg': 'JPEG',
    '.png': 'PNG',
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'image/*': 'Images',
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
  };

  const uniqueTypes = new Set<string>();
  accept.forEach(type => {
    const mapped = typeMap[type];
    if (mapped) {
      uniqueTypes.add(mapped);
    }
  });

  // If we mapped some types, return them; otherwise show simplified list
  if (uniqueTypes.size > 0) {
    // Remove redundant types (e.g., if we have "Images" and "JPG", keep just the specific ones)
    if (uniqueTypes.has('Images') && (uniqueTypes.has('JPG') || uniqueTypes.has('PNG'))) {
      uniqueTypes.delete('Images');
    }
    return Array.from(uniqueTypes).join(', ');
  }

  return 'Any file type';
}

export function FileUpload({ question, register, errors, watch, setValue }: FileUploadProps) {
  const error = errors[question.id];
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const acceptString = question.accept?.join(',') || '*';
  const maxSizeMB = question.maxSize || 10;
  const humanReadableTypes = formatAcceptedTypes(question.accept);

  // Get submitter name from form for file naming
  const firstName = watch('firstName') as string || '';
  const lastName = watch('lastName') as string || '';
  const printedName = watch('printedName') as string || '';
  const submitterName = (firstName && lastName) ? `${firstName} ${lastName}` : printedName || undefined;

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

      // Generate preview for images
      let previewUrl: string | undefined;
      if (file.type.startsWith('image/')) {
        previewUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

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
          previewUrl,
          fileType: file.type,
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
        setUploadError(`Please upload a file of type: ${humanReadableTypes}`);
        return;
      }
    }

    uploadFile(file);
  }, [maxSizeMB, question.accept, question.id, setValue, uploadFile, humanReadableTypes]);

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
    <div className="space-y-3">
      <label className="question-label block">
        {question.label}
        {question.required && <span className="required-mark">*</span>}
      </label>
      {question.description && (
        <p className="question-description">{question.description}</p>
      )}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive
            ? 'border-[var(--color-terracotta)] bg-[var(--color-terracotta)]/5'
            : error || uploadError
            ? 'border-red-400 bg-red-50'
            : 'border-[var(--color-parchment)] hover:border-[var(--color-terracotta-light)] bg-[var(--color-cream)]'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-[var(--color-terracotta)]/10 flex items-center justify-center">
              <svg
                className="animate-spin h-6 w-6 text-[var(--color-terracotta)]"
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
            </div>
            <p className="text-sm text-[var(--color-warm-gray)]">Uploading file...</p>
          </div>
        ) : uploadedFile ? (
          <div className="space-y-3">
            {/* File Preview */}
            {uploadedFile.previewUrl ? (
              <div className="mx-auto w-24 h-24 rounded-lg overflow-hidden border border-[var(--color-parchment)] shadow-sm">
                <img
                  src={uploadedFile.previewUrl}
                  alt={uploadedFile.fileName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : uploadedFile.fileType === 'application/pdf' ? (
              <div className="mx-auto w-16 h-20 rounded-lg bg-red-50 border border-red-200 flex flex-col items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 13a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0v-1h.5a1.5 1.5 0 0 0 0-3H8.5zm.5 1.5h-.5v-1h.5a.5.5 0 0 1 0 1zm3-1.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h1a1.5 1.5 0 0 0 0-3h-1zm.5 2.5v-1.5h.5a.5.5 0 0 1 0 1.5h-.5zm3.5-2.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-.5h1a.5.5 0 0 0 0-1h-1.5z"/>
                </svg>
                <span className="text-[10px] font-medium text-red-600 mt-1">PDF</span>
              </div>
            ) : (
              <div className="mx-auto w-12 h-12 rounded-full bg-[var(--color-sage)]/10 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-[var(--color-sage)]"
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
              </div>
            )}
            <p className="font-medium text-[var(--color-charcoal)] text-sm truncate max-w-[200px] mx-auto">
              {uploadedFile.fileName}
            </p>
            <div className="flex items-center justify-center gap-4">
              {uploadedFile.webViewLink?.startsWith('data:') ? (
                <a
                  href={uploadedFile.webViewLink}
                  download={uploadedFile.fileName}
                  className="text-sm text-[var(--color-terracotta)] hover:text-[var(--color-terracotta-dark)] flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download file
                </a>
              ) : (
                <a
                  href={uploadedFile.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--color-terracotta)] hover:text-[var(--color-terracotta-dark)] flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View file
                </a>
              )}
              <button
                type="button"
                onClick={removeFile}
                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-[var(--color-parchment)] flex items-center justify-center">
              <svg
                className="h-6 w-6 text-[var(--color-warm-gray)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div className="text-[var(--color-warm-gray)]">
              <label className="cursor-pointer">
                <span className="text-[var(--color-terracotta)] hover:text-[var(--color-terracotta-dark)] font-medium">
                  Choose a file
                </span>
                <input
                  type="file"
                  className="sr-only"
                  accept={acceptString}
                  onChange={(e) => handleFile(e.target.files?.[0] || null)}
                  disabled={isUploading}
                />
              </label>
              <span> or drag it here</span>
            </div>
            <p className="text-xs text-[var(--color-warm-gray-light)]">
              {humanReadableTypes} up to {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>
      {/* Hidden input for form registration */}
      <input type="hidden" {...register(question.id, {
        required: question.required ? 'Please upload a file' : false,
      })} />
      {(error || uploadError) && (
        <p className="error-text">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {uploadError || (error?.message as string)}
        </p>
      )}
    </div>
  );
}
