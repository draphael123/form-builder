'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AnalyticsSummary {
  totalSessions: number;
  completedSessions: number;
  abandonedSessions: number;
  inProgressSessions: number;
  completionRate: number;
  averageCompletionTimeSeconds: number;
  deviceBreakdown: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  dropOffByPage: Record<number, number>;
  dailyStats: Array<{
    date: string;
    started: number;
    completed: number;
  }>;
  fieldInteractions: Record<string, number>;
  validationErrors: Record<string, number>;
}

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [daysBack, setDaysBack] = useState(30);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const response = await fetch(`/api/analytics?days=${daysBack}`);
        const result = await response.json();
        if (result.success) {
          setSummary(result.summary);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [daysBack]);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No analytics data available</p>
          <Link href="/admin" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  // Calculate max value for daily stats chart
  const maxDailyValue = Math.max(
    ...summary.dailyStats.map(d => Math.max(d.started, d.completed)),
    1
  );

  // Device breakdown percentages
  const totalDevices = summary.deviceBreakdown.mobile + summary.deviceBreakdown.tablet + summary.deviceBreakdown.desktop;
  const devicePercentages = {
    mobile: totalDevices > 0 ? (summary.deviceBreakdown.mobile / totalDevices) * 100 : 0,
    tablet: totalDevices > 0 ? (summary.deviceBreakdown.tablet / totalDevices) * 100 : 0,
    desktop: totalDevices > 0 ? (summary.deviceBreakdown.desktop / totalDevices) * 100 : 0,
  };

  // Top validation errors
  const topValidationErrors = Object.entries(summary.validationErrors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Form Analytics</h1>
            <p className="text-gray-600 mt-1">Track form completion and user behavior</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-4">
            <select
              value={daysBack}
              onChange={(e) => setDaysBack(parseInt(e.target.value, 10))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <Link
              href="/admin"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Back to Admin
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900">{summary.totalSessions}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completion Rate</p>
                <p className="text-3xl font-bold text-green-600">{summary.completionRate.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Completion Time</p>
                <p className="text-3xl font-bold text-purple-600">
                  {formatTime(summary.averageCompletionTimeSeconds)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Abandoned</p>
                <p className="text-3xl font-bold text-red-600">{summary.abandonedSessions}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Submissions Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Form Activity</h2>
            {summary.dailyStats.length > 0 ? (
              <div className="space-y-2">
                {summary.dailyStats.slice(-14).map((day) => (
                  <div key={day.date} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-20">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden relative">
                        <div
                          className="absolute h-full bg-blue-500 rounded-full"
                          style={{ width: `${(day.started / maxDailyValue) * 100}%` }}
                        />
                        <div
                          className="absolute h-full bg-green-500 rounded-full"
                          style={{ width: `${(day.completed / maxDailyValue) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 w-16 text-right">
                        {day.started} / {day.completed}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-end gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-gray-600">Started</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-gray-600">Completed</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Desktop */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="20"
                    strokeDasharray={`${devicePercentages.desktop * 2.51} 251`}
                  />
                  {/* Tablet */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="20"
                    strokeDasharray={`${devicePercentages.tablet * 2.51} 251`}
                    strokeDashoffset={`${-devicePercentages.desktop * 2.51}`}
                  />
                  {/* Mobile */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="20"
                    strokeDasharray={`${devicePercentages.mobile * 2.51} 251`}
                    strokeDashoffset={`${-(devicePercentages.desktop + devicePercentages.tablet) * 2.51}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-700">{totalDevices}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium text-gray-700">Desktop</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{summary.deviceBreakdown.desktop}</p>
                <p className="text-xs text-gray-500">{devicePercentages.desktop.toFixed(0)}%</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <span className="text-sm font-medium text-gray-700">Tablet</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{summary.deviceBreakdown.tablet}</p>
                <p className="text-xs text-gray-500">{devicePercentages.tablet.toFixed(0)}%</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium text-gray-700">Mobile</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{summary.deviceBreakdown.mobile}</p>
                <p className="text-xs text-gray-500">{devicePercentages.mobile.toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Drop-off by Page */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Drop-off by Section</h2>
            {Object.keys(summary.dropOffByPage).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(summary.dropOffByPage)
                  .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                  .map(([page, count]) => {
                    const maxDropOff = Math.max(...Object.values(summary.dropOffByPage));
                    return (
                      <div key={page} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-24">Section {parseInt(page) + 1}</span>
                        <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full transition-all"
                            style={{ width: `${(count / maxDropOff) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-12 text-right">{count}</span>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No drop-offs recorded</p>
            )}
          </div>

          {/* Top Validation Errors */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Validation Errors</h2>
            {topValidationErrors.length > 0 ? (
              <div className="space-y-3">
                {topValidationErrors.map(([fieldId, count]) => {
                  const maxErrors = topValidationErrors[0][1];
                  return (
                    <div key={fieldId} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-40 truncate" title={fieldId}>
                        {fieldId}
                      </span>
                      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 rounded-full transition-all"
                          style={{ width: `${(count / maxErrors) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-12 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No validation errors recorded</p>
            )}
          </div>
        </div>

        {/* Session Status Summary */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Session Status Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-700">{summary.completedSessions}</p>
              <p className="text-xs text-green-600 mt-1">
                {summary.totalSessions > 0
                  ? `${((summary.completedSessions / summary.totalSessions) * 100).toFixed(1)}% of total`
                  : '0%'}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-600 font-medium">In Progress</p>
              <p className="text-3xl font-bold text-yellow-700">{summary.inProgressSessions}</p>
              <p className="text-xs text-yellow-600 mt-1">
                {summary.totalSessions > 0
                  ? `${((summary.inProgressSessions / summary.totalSessions) * 100).toFixed(1)}% of total`
                  : '0%'}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-600 font-medium">Abandoned</p>
              <p className="text-3xl font-bold text-red-700">{summary.abandonedSessions}</p>
              <p className="text-xs text-red-600 mt-1">
                {summary.totalSessions > 0
                  ? `${((summary.abandonedSessions / summary.totalSessions) * 100).toFixed(1)}% of total`
                  : '0%'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-8">
          Analytics data from the last {daysBack} days
        </p>
      </div>
    </div>
  );
}
