'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FeedbackItem {
  id: string;
  category: string;
  message: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  responseNote?: string;
  createdAt: string;
}

export default function FeedbackPage() {
  const [items, setItems] = useState<FeedbackItem[]>([
    {
      id: 'fb1',
      category: 'Workplace & Hybrid Policy',
      message: 'Can we expand the flexible Friday policy to include remote core focus hours?',
      status: 'REVIEWED',
      responseNote: 'Discussed with People Operations team. Guidelines being drafted.',
      createdAt: '2026-09-01',
    },
    {
      id: 'fb2',
      category: 'Learning & Certification Subsidies',
      message: 'It would be great to get automated reimbursement processing for cloud certifications.',
      status: 'RESOLVED',
      responseNote: 'Integrated directly into Phase 8 Benefits & Expense portal.',
      createdAt: '2026-08-25',
    },
    {
      id: 'fb3',
      category: 'Health & Wellness Initiatives',
      message: 'Requesting gym membership subsidies or mental wellness support sessions.',
      status: 'PENDING',
      createdAt: '2026-09-04',
    },
  ]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    const newItem: FeedbackItem = {
      id: `fb_${Date.now()}`,
      category: category || 'General Suggestion',
      message: message,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setItems([newItem, ...items]);
    setShowModal(false);
    setCategory('');
    setMessage('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'REVIEWED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/surveys"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                &larr; Pulse Surveys & eNPS
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Anonymous Employee Suggestion Box
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Safe, confidential channel to voice ideas, raise concerns, and offer candid organizational feedback.
            </p>
          </div>
          <div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow"
            >
              + Submit Anonymous Voice
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Feed */}
      <div className="max-w-7xl mx-auto space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Submissions Directory ({items.length})
        </h2>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">🔒 Anonymous Submission</span>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded font-bold ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <p className="text-base font-semibold text-slate-900 dark:text-white mt-2">
                "{item.message}"
              </p>

              {item.responseNote && (
                <div className="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                    💬 Management Response:
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    {item.responseNote}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 text-xs text-slate-400 text-right">
                Submitted on {item.createdAt}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Submit Feedback */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🔒</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Submit Anonymous Feedback
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Your identity is strictly protected. No user IDs or personal metadata are attached to this submission.
            </p>
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Workplace Culture, Compensation, Tooling"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Feedback Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Express your suggestions, questions, or concerns clearly..."
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                >
                  Submit Anonymously
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
