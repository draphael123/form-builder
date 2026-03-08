'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilePreview {
  file: File;
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
}

interface EnhancedFileUploadProps {
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  onUpload: (files: File[]) => Promise<void>;
  value?: string[];
  label?: string;
  description?: string;
  error?: string;
}

export function EnhancedFileUpload({
  accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
  maxSize = 10 * 1024 * 1024,
  multiple = false,
  onUpload,
  label,
  description,
  error,
}: EnhancedFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FilePreview[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return (
        <svg className="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      );
    }
    if (type === 'application/pdf') {
      return (
        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File too large. Maximum size is ${formatFileSize(maxSize)}`;
    }
    const allowedTypes = accept.split(',').map((t) => t.trim().toLowerCase());
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!allowedTypes.some((t) => t === fileExt || file.type.includes(t.replace('.', '')))) {
      return `Invalid file type. Allowed: ${accept}`;
    }
    return null;
  };

  const processFiles = async (fileList: FileList) => {
    const newFiles: FilePreview[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const error = validateFile(file);

      const preview: FilePreview = {
        file,
        progress: 0,
        status: error ? 'error' : 'pending',
        error: error || undefined,
      };

      if (file.type.startsWith('image/') && !error) {
        preview.preview = URL.createObjectURL(file);
      }

      newFiles.push(preview);
    }

    setFiles((prev) => (multiple ? [...prev, ...newFiles] : newFiles));

    const validFiles = newFiles.filter((f) => f.status === 'pending');
    if (validFiles.length > 0) {
      for (const filePreview of validFiles) {
        setFiles((prev) =>
          prev.map((f) =>
            f.file === filePreview.file ? { ...f, status: 'uploading' } : f
          )
        );

        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((r) => setTimeout(r, 50));
          setFiles((prev) =>
            prev.map((f) =>
              f.file === filePreview.file ? { ...f, progress } : f
            )
          );
        }

        try {
          await onUpload([filePreview.file]);
          setFiles((prev) =>
            prev.map((f) =>
              f.file === filePreview.file ? { ...f, status: 'complete', progress: 100 } : f
            )
          );
        } catch (err) {
          setFiles((prev) =>
            prev.map((f) =>
              f.file === filePreview.file
                ? { ...f, status: 'error', error: 'Upload failed' }
                : f
            )
          );
        }
      }
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [multiple, maxSize, accept, onUpload]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (file: File) => {
    setFiles((prev) => prev.filter((f) => f.file !== file));
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-[var(--color-charcoal)]">
          {label}
        </label>
      )}

      {/* Drop zone */}
      <motion.div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[var(--color-terracotta)] bg-[var(--color-terracotta)]/5'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-[var(--color-parchment)] hover:border-[var(--color-terracotta-light)] hover:bg-[var(--color-cream)]'
        }`}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? 'var(--color-terracotta)' : undefined,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <motion.div
          animate={{ y: isDragging ? -5 : 0 }}
          className="space-y-3"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-[var(--color-parchment)] flex items-center justify-center">
            <svg
              className={`w-8 h-8 transition-colors ${
                isDragging ? 'text-[var(--color-terracotta)]' : 'text-[var(--color-warm-gray)]'
              }`}
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

          <div>
            <p className="text-[var(--color-charcoal)] font-medium">
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-[var(--color-warm-gray)] mt-1">
              or <span className="text-[var(--color-terracotta)] font-medium">browse</span> to upload
            </p>
          </div>

          {description && (
            <p className="text-xs text-[var(--color-warm-gray)]">{description}</p>
          )}
        </motion.div>

        {/* Drag overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[var(--color-terracotta)]/10 rounded-xl flex items-center justify-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-[var(--color-terracotta)] font-medium"
              >
                Drop to upload
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* File previews */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((filePreview, i) => (
              <motion.div
                key={filePreview.file.name + i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  filePreview.status === 'error'
                    ? 'bg-red-50 border-red-200'
                    : filePreview.status === 'complete'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-[var(--color-parchment)]'
                }`}
              >
                {/* Preview/Icon */}
                {filePreview.preview ? (
                  <img
                    src={filePreview.preview}
                    alt=""
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-[var(--color-cream)] rounded">
                    {getFileIcon(filePreview.file.type)}
                  </div>
                )}

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-charcoal)] truncate">
                    {filePreview.file.name}
                  </p>
                  <p className="text-xs text-[var(--color-warm-gray)]">
                    {formatFileSize(filePreview.file.size)}
                  </p>

                  {/* Progress bar */}
                  {filePreview.status === 'uploading' && (
                    <div className="mt-1 h-1.5 bg-[var(--color-parchment)] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[var(--color-terracotta)] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${filePreview.progress}%` }}
                      />
                    </div>
                  )}

                  {filePreview.error && (
                    <p className="text-xs text-red-500 mt-1">{filePreview.error}</p>
                  )}
                </div>

                {/* Status/Action */}
                <div className="flex-shrink-0">
                  {filePreview.status === 'complete' ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  ) : filePreview.status === 'uploading' ? (
                    <div className="w-8 h-8 rounded-full border-2 border-[var(--color-terracotta)] border-t-transparent animate-spin" />
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(filePreview.file);
                      }}
                      className="w-8 h-8 rounded-full bg-[var(--color-cream)] hover:bg-red-100 flex items-center justify-center text-[var(--color-warm-gray)] hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
