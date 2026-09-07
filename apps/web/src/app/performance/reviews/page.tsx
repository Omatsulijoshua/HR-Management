'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Review {
  id: string;
  employeeName: string;
  cycleTitle: string;
  reviewerName: string;
  selfRating: number;
  managerRating: number;
  finalRating: number;
  status: 'SELF_EVALUATION_PENDING' | 'MANAGER_EVALUATION_PENDING' | 'COMPLETED';
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      employeeName: 'Omatsuli Joshua',
      cycleTitle: '2026 Annual Performance Cycle',
      reviewerName: 'Dr. Chidi Nnamdi',
      selfRating: 4.5,
      managerRating: 4.8,
      finalRating: 4.7,
      status: 'COMPLETED',
    },
    {
      id: 'rev-2',
      employeeName: 'Amina Bello',
      cycleTitle: '2026 Annual Performance Cycle',
      reviewerName: 'Dr. Chidi Nnamdi',
      selfRating: 4.0,
      managerRating: 0,
      finalRating: 0,
      status: 'MANAGER_EVALUATION_PENDING',
    },
    {
      id: 'rev-3',
      employeeName: 'Babatunde Raji',
      cycleTitle: '2026 Mid-Year Evaluation',
      reviewerName: 'Kemi Adebayo',
      selfRating: 0,
      managerRating: 0,
      finalRating: 0,
      status: 'SELF_EVALUATION_PENDING',
    },
  ]);

  const [selectedReview, setSelectedReview] = useState<Review | null>(reviews[0]);
  const [selfScoreInput, setSelfScoreInput] = useState(4.0);
  const [mgrScoreInput, setMgrScoreInput] = useState(4.5);

  const handleSelfSubmit = (id: string) => {
    setReviews(
      reviews.map((r) =>
        r.id === id
          ? {
              ...r,
              selfRating: Number(selfScoreInput),
              status: 'MANAGER_EVALUATION_PENDING',
            }
          : r
      )
    );
    if (selectedReview) {
      setSelectedReview({
        ...selectedReview,
        selfRating: Number(selfScoreInput),
        status: 'MANAGER_EVALUATION_PENDING',
      });
    }
  };

  const handleManagerSubmit = (id: string) => {
    const selfScore = selectedReview?.selfRating || 4.0;
    const mgrScore = Number(mgrScoreInput);
    const finalScore = Number(((selfScore * 0.4) + (mgrScore * 0.6)).toFixed(1));

    setReviews(
      reviews.map((r) =>
        r.id === id
          ? {
              ...r,
              managerRating: mgrScore,
              finalRating: finalScore,
              status: 'COMPLETED',
            }
          : r
      )
    );
    if (selectedReview) {
      setSelectedReview({
        ...selectedReview,
        managerRating: mgrScore,
        finalRating: finalScore,
        status: 'COMPLETED',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            Phase 9 — Evaluation Workbench
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Performance Evaluation & 360 Feedback</h1>
        </div>
        <Link
          href="/performance/goals"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
        >
          ← Back to OKR Goal Tracker
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Review List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Evaluation Cycles</h2>
          {reviews.map((rev) => (
            <button
              key={rev.id}
              onClick={() => setSelectedReview(rev)}
              className={`w-full text-left p-5 rounded-xl border transition ${
                selectedReview?.id === rev.id
                  ? 'bg-indigo-50/50 border-indigo-500 shadow-sm'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900 text-base">{rev.employeeName}</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    rev.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : rev.status === 'MANAGER_EVALUATION_PENDING'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {rev.status === 'COMPLETED' ? 'COMPLETED' : 'IN PROGRESS'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{rev.cycleTitle}</p>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-between items-center text-xs text-slate-600">
                <span>Reviewer: {rev.reviewerName}</span>
                <span className="font-bold font-mono text-indigo-600 text-sm">
                  {rev.finalRating > 0 ? `${rev.finalRating} / 5.0` : 'Pending'}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Column: Interactive Evaluation Matrix Card */}
        {selectedReview && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-md p-8 space-y-6">
            <div className="border-b border-slate-200 pb-6 flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Evaluation Form</span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">{selectedReview.employeeName}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{selectedReview.cycleTitle}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium">Weighted Score</span>
                <div className="text-3xl font-extrabold text-indigo-600 font-mono">
                  {selectedReview.finalRating > 0 ? selectedReview.finalRating : '--'} / 5.0
                </div>
              </div>
            </div>

            {/* Score Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Self Evaluation */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm">Self Evaluation (40% Weight)</h3>
                  <span className="font-mono font-bold text-indigo-600 text-lg">
                    {selectedReview.selfRating > 0 ? selectedReview.selfRating : 'Pending'}
                  </span>
                </div>
                {selectedReview.status === 'SELF_EVALUATION_PENDING' ? (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Enter Self Rating (1.0 to 5.0)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={selfScoreInput}
                        onChange={(e) => setSelfScoreInput(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                      />
                    </div>
                    <button
                      onClick={() => handleSelfSubmit(selectedReview.id)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg shadow-sm transition"
                    >
                      Submit Self-Evaluation
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Self evaluation rating recorded.</p>
                )}
              </div>

              {/* Manager Evaluation */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm">Manager Review (60% Weight)</h3>
                  <span className="font-mono font-bold text-emerald-600 text-lg">
                    {selectedReview.managerRating > 0 ? selectedReview.managerRating : 'Pending'}
                  </span>
                </div>
                {selectedReview.status === 'MANAGER_EVALUATION_PENDING' ? (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Enter Manager Rating (1.0 to 5.0)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={mgrScoreInput}
                        onChange={(e) => setMgrScoreInput(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                      />
                    </div>
                    <button
                      onClick={() => handleManagerSubmit(selectedReview.id)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg shadow-sm transition"
                    >
                      Submit Final Manager Review
                    </button>
                  </div>
                ) : selectedReview.status === 'COMPLETED' ? (
                  <p className="text-xs text-emerald-700 font-medium italic">Manager review submitted and score finalized.</p>
                ) : (
                  <p className="text-xs text-slate-400 italic">Awaiting self-evaluation completion.</p>
                )}
              </div>
            </div>

            {/* 360 Peer Feedback Section */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">360-Degree Peer Feedback</h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-800">Peer Feedback: Senior Software Architect</span>
                  <span className="font-bold text-indigo-600">5.0 / 5.0</span>
                </div>
                <p className="text-slate-600 italic">
                  &quot;Consistently delivers production-ready modular architecture, maintains 100% unit test coverage, and enforces multi-tenant security isolation.&quot;
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
