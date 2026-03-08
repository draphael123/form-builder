'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { StatusPill, StaffTypePill, Avatar, SkeletonTable, NoSubmissionsState, ThemeToggle } from '@/components/ui';

type SubmissionStatus = 'pending' | 'reviewed' | 'processing' | 'complete';

interface SectionTiming {
  sectionId: string;
  sectionTitle: string;
  duration?: number;
}

interface TimingData {
  totalDuration?: number;
  sectionTimings?: SectionTiming[];
}

interface Submission {
  id: string;
  timestamp: string;
  data: Record<string, unknown>;
  status?: SubmissionStatus;
  statusUpdatedAt?: string;
  timing?: TimingData;
}

const STATUS_OPTIONS: { value: SubmissionStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'reviewed', label: 'Reviewed', color: 'bg-blue-100 text-blue-800' },
  { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
  { value: 'complete', label: 'Complete', color: 'bg-green-100 text-green-800' },
];

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const [staffTypeFilter, setStaffTypeFilter] = useState<'all' | 'clinical' | 'non-clinical'>('all');

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/submissions');
      const result = await response.json();

      if (result.success) {
        setSubmissions(result.submissions);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to load submissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const name = String(submission.data.fullLegalName || '').toLowerCase();
        const email = String(submission.data.email || submission.data.personalEmailAddress || '').toLowerCase();
        const id = submission.id.toLowerCase();
        if (!name.includes(query) && !email.includes(query) && !id.includes(query)) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all') {
        const status = submission.status || 'pending';
        if (status !== statusFilter) {
          return false;
        }
      }

      // Staff type filter
      if (staffTypeFilter !== 'all') {
        const isClinical = submission.data.isClinicalStaff === 'Yes';
        if (staffTypeFilter === 'clinical' && !isClinical) return false;
        if (staffTypeFilter === 'non-clinical' && isClinical) return false;
      }

      return true;
    });
  }, [submissions, searchQuery, statusFilter, staffTypeFilter]);

  // Export as CSV
  const handleExportCSV = () => {
    window.open('/api/submissions?format=csv', '_blank');
  };

  // Download PDF
  const handleDownloadPDF = (id: string) => {
    window.open(`/api/submissions/${id}/pdf`, '_blank');
  };

  // Update status
  const handleStatusChange = async (id: string, newStatus: SubmissionStatus) => {
    try {
      const response = await fetch(`/api/submissions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();

      if (result.success) {
        setSubmissions(submissions.map(s =>
          s.id === id ? { ...s, status: newStatus, statusUpdatedAt: new Date().toISOString() } : s
        ));
        if (selectedSubmission?.id === id) {
          setSelectedSubmission({ ...selectedSubmission, status: newStatus });
        }
        toast.success(`Status updated to ${newStatus}`);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error('Failed to update status');
      console.error(err);
    }
  };

  // Delete a submission
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    const loadingToast = toast.loading('Deleting submission...');

    try {
      const response = await fetch(`/api/submissions?id=${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        setSubmissions(submissions.filter(s => s.id !== id));
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(null);
        }
        toast.success('Submission deleted', { id: loadingToast });
      } else {
        toast.error(result.message, { id: loadingToast });
      }
    } catch (err) {
      toast.error('Failed to delete submission', { id: loadingToast });
      console.error(err);
    }
  };

  // Format date for display
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Format duration in seconds to readable string
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '-';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) {
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Get a preview of the submission (first few fields)
  const getPreview = (data: Record<string, unknown>) => {
    const name = data.fullLegalName || data.printedName || 'Unknown';
    const email = data.email || data.personalEmailAddress || '';
    const isClinical = data.isClinicalStaff === 'Yes';
    return { name: String(name), email: String(email), isClinical };
  };

  // Get status badge
  const getStatusBadge = (status: SubmissionStatus = 'pending') => {
    const option = STATUS_OPTIONS.find(o => o.value === status) || STATUS_OPTIONS[0];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${option.color}`}>
        {option.label}
      </span>
    );
  };

  // Stats
  const stats = useMemo(() => {
    const total = submissions.length;
    const pending = submissions.filter(s => !s.status || s.status === 'pending').length;
    const complete = submissions.filter(s => s.status === 'complete').length;
    const clinical = submissions.filter(s => s.data.isClinicalStaff === 'Yes').length;

    // Calculate average completion time
    const submissionsWithTiming = submissions.filter(s => s.timing?.totalDuration);
    const avgTime = submissionsWithTiming.length > 0
      ? Math.round(submissionsWithTiming.reduce((sum, s) => sum + (s.timing?.totalDuration || 0), 0) / submissionsWithTiming.length)
      : null;

    return { total, pending, complete, clinical, avgTime };
  }, [submissions]);

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Header */}
      <header className="sticky-header shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-2xl font-bold text-[var(--color-charcoal)] font-display">Form Submissions</h1>
              <p className="text-sm text-[var(--color-warm-gray)] mt-1">
                Manage and review onboarding submissions
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-wrap items-center gap-3"
            >
              <ThemeToggle size="sm" />
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-[var(--color-charcoal)] bg-white border border-[var(--color-parchment)] rounded-lg hover:bg-[var(--color-cream)] transition-colors"
              >
                View Form
              </Link>
              <a
                href="https://docs.google.com/spreadsheets/d/1etgBQL9BjxFVVN4JYHN9a_6IfQr41gj8aDMrt6gpT_Y"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 inline-flex items-center gap-1.5 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                  <path d="M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm4-8h6v2h-6zm0 4h6v2h-6zm0 4h6v2h-6z"/>
                </svg>
                Google Sheet
              </a>
              <Link
                href="/admin/analytics"
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Analytics
              </Link>
              <button
                onClick={() => {
                  handleExportCSV();
                  toast.success('CSV export started');
                }}
                disabled={submissions.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={() => {
                  fetchSubmissions();
                  toast.info('Refreshing submissions...');
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-terracotta)] rounded-lg hover:bg-[var(--color-terracotta-dark)] transition-colors"
              >
                Refresh
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'text-[var(--color-charcoal)]', icon: '📊' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-600', icon: '⏳' },
            { label: 'Complete', value: stats.complete, color: 'text-green-600', icon: '✓' },
            { label: 'Clinical Staff', value: stats.clinical, color: 'text-blue-600', icon: '🏥' },
            { label: 'Avg. Completion', value: stats.avgTime ? formatDuration(stats.avgTime) : '-', color: 'text-purple-600', icon: '⏱' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl shadow-sm p-4 card-hover border border-[var(--color-parchment)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--color-warm-gray)]">{stat.label}</p>
                <span className="text-lg">{stat.icon}</span>
              </div>
              <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or ID..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as SubmissionStatus | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Staff Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Staff Type</label>
              <select
                value={staffTypeFilter}
                onChange={(e) => setStaffTypeFilter(e.target.value as 'all' | 'clinical' | 'non-clinical')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="clinical">Clinical Staff</option>
                <option value="non-clinical">Non-Clinical Staff</option>
              </select>
            </div>
          </div>
          {filteredSubmissions.length !== submissions.length && (
            <p className="text-sm text-gray-500 mt-3">
              Showing {filteredSubmissions.length} of {submissions.length} submissions
            </p>
          )}
        </div>

        {loading ? (
          <SkeletonTable rows={5} />
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
          >
            {error}
          </motion.div>
        ) : filteredSubmissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-[var(--color-parchment)]"
          >
            {submissions.length === 0 ? (
              <NoSubmissionsState />
            ) : (
              <div className="text-center py-12 px-4">
                <svg
                  className="mx-auto h-12 w-12 text-[var(--color-warm-gray)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-[var(--color-charcoal)]">
                  No matching submissions
                </h3>
                <p className="mt-2 text-[var(--color-warm-gray)]">
                  Try adjusting your search or filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setStaffTypeFilter('all');
                  }}
                  className="mt-4 px-4 py-2 text-sm font-medium text-[var(--color-terracotta)] border border-[var(--color-terracotta)] rounded-lg hover:bg-[var(--color-terracotta)]/5 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Submissions List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="divide-y divide-gray-200 max-h-[calc(100vh-400px)] overflow-y-auto">
                  <AnimatePresence>
                    {filteredSubmissions.map((submission, index) => {
                      const preview = getPreview(submission.data);
                      const isSelected = selectedSubmission?.id === submission.id;

                      return (
                        <motion.div
                          key={submission.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          onClick={() => setSelectedSubmission(submission)}
                          className={`p-4 cursor-pointer hover:bg-[var(--color-cream)] transition-all ${
                            isSelected ? 'bg-[var(--color-terracotta)]/5 border-l-4 border-[var(--color-terracotta)]' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar name={preview.name} size="md" />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-medium text-[var(--color-charcoal)] truncate">
                                  {preview.name}
                                </p>
                                {preview.isClinical && (
                                  <StaffTypePill type="clinical" size="sm" />
                                )}
                              </div>
                              <p className="text-sm text-[var(--color-warm-gray)] truncate">{preview.email}</p>
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <StatusPill status={(submission.status || 'pending') as 'pending' | 'reviewed' | 'processing' | 'complete'} size="sm" animated={false} />
                                <span className="text-xs text-[var(--color-warm-gray-light)]">
                                  {formatDate(submission.timestamp)}
                                </span>
                                {submission.timing?.totalDuration && (
                                  <span className="inline-flex items-center gap-0.5 text-xs text-purple-600">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {formatDuration(submission.timing.totalDuration)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Submission Details */}
            <div className="lg:col-span-2">
              {selectedSubmission ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">Submission Details</h2>
                      <p className="text-sm text-gray-500">ID: {selectedSubmission.id}</p>
                      <p className="text-sm text-gray-500">
                        Submitted: {formatDate(selectedSubmission.timestamp)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {/* Status Dropdown */}
                      <select
                        value={selectedSubmission.status || 'pending'}
                        onChange={(e) => handleStatusChange(selectedSubmission.id, e.target.value as SubmissionStatus)}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleDownloadPDF(selectedSubmission.id)}
                        className="px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
                      >
                        Download PDF
                      </button>
                      <button
                        onClick={() => handleDelete(selectedSubmission.id)}
                        className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Timing Data */}
                  {selectedSubmission.timing?.totalDuration && (
                    <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                      <h3 className="text-sm font-medium text-purple-900 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Completion Time
                      </h3>
                      <p className="text-2xl font-bold text-purple-700 mb-3">
                        {formatDuration(selectedSubmission.timing.totalDuration)}
                      </p>
                      {selectedSubmission.timing.sectionTimings && selectedSubmission.timing.sectionTimings.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-purple-800 uppercase">Time per Section</p>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedSubmission.timing.sectionTimings.map((section) => (
                              <div key={section.sectionId} className="flex justify-between text-sm">
                                <span className="text-purple-700 truncate">{section.sectionTitle}</span>
                                <span className="text-purple-900 font-medium ml-2">{formatDuration(section.duration)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-4 max-h-[calc(100vh-450px)] overflow-y-auto">
                    {Object.entries(selectedSubmission.data).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-100 pb-3">
                        <dt className="text-sm font-medium text-gray-500 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {value === null || value === undefined || value === '' ? (
                            <span className="text-gray-400 italic">Not provided</span>
                          ) : Array.isArray(value) ? (
                            value.join(', ')
                          ) : typeof value === 'object' ? (
                            JSON.stringify(value, null, 2)
                          ) : String(value).startsWith('/uploads/') || String(value).startsWith('http') ? (
                            <a
                              href={String(value)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View File
                            </a>
                          ) : (
                            String(value)
                          )}
                        </dd>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Select a submission</h3>
                  <p className="mt-2 text-gray-500">Click on a submission from the list to view details.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
