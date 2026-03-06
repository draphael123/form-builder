'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

type SubmissionStatus = 'pending' | 'reviewed' | 'processing' | 'complete';

interface Submission {
  id: string;
  timestamp: string;
  data: Record<string, unknown>;
  status?: SubmissionStatus;
  statusUpdatedAt?: string;
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
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    }
  };

  // Delete a submission
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) {
      return;
    }

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
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert('Failed to delete submission');
      console.error(err);
    }
  };

  // Format date for display
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
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
    return { total, pending, complete, clinical };
  }, [submissions]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Form Submissions</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and review onboarding submissions
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                View Form
              </Link>
              <Link
                href="/admin/analytics"
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                Analytics
              </Link>
              <button
                onClick={handleExportCSV}
                disabled={submissions.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Export CSV
              </button>
              <button
                onClick={fetchSubmissions}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Complete</p>
            <p className="text-2xl font-bold text-green-600">{stats.complete}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Clinical Staff</p>
            <p className="text-2xl font-bold text-blue-600">{stats.clinical}</p>
          </div>
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
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading submissions...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {submissions.length === 0 ? 'No submissions yet' : 'No matching submissions'}
            </h3>
            <p className="mt-2 text-gray-500">
              {submissions.length === 0
                ? 'Submissions will appear here once the form is filled out.'
                : 'Try adjusting your search or filters.'}
            </p>
            {submissions.length === 0 && (
              <Link
                href="/"
                className="mt-4 inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Go to Form
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Submissions List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="divide-y divide-gray-200 max-h-[calc(100vh-400px)] overflow-y-auto">
                  {filteredSubmissions.map((submission) => {
                    const preview = getPreview(submission.data);
                    const isSelected = selectedSubmission?.id === submission.id;

                    return (
                      <div
                        key={submission.id}
                        onClick={() => setSelectedSubmission(submission)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {preview.name}
                              </p>
                              {preview.isClinical && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  Clinical
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate">{preview.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusBadge(submission.status)}
                              <span className="text-xs text-gray-400">
                                {formatDate(submission.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
