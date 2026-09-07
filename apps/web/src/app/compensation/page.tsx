'use client';

import React, { useState } from 'react';

interface GradeBand {
  id: string;
  name: string;
  code: string;
  minSalary: number;
  maxSalary: number;
  marketMidpoint: number;
}

interface Review {
  id: string;
  employeeName: string;
  title: string;
  currentSalary: number;
  proposedSalary: number;
  percentIncrease: number;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  effectiveDate: string;
}

interface Bonus {
  id: string;
  employeeName: string;
  title: string;
  amount: number;
  isPaid: boolean;
  date: string;
}

export default function CompensationPage() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'grades' | 'bonuses'>('reviews');

  const [grades] = useState<GradeBand[]>([
    { id: 'g1', name: 'Grade 1 — Executive Management', code: 'EXEC_L1', minSalary: 12000000, maxSalary: 25000000, marketMidpoint: 18500000 },
    { id: 'g2', name: 'Grade 2 — Senior Leadership / Lead Architects', code: 'SR_LEAD_L2', minSalary: 7500000, maxSalary: 14000000, marketMidpoint: 10750000 },
    { id: 'g3', name: 'Grade 3 — Mid-Level Specialists & Engineers', code: 'MID_SPEC_L3', minSalary: 4000000, maxSalary: 8000000, marketMidpoint: 6000000 },
    { id: 'g4', name: 'Grade 4 — Entry Level & Support Staff', code: 'ENTRY_L4', minSalary: 2000000, maxSalary: 4500000, marketMidpoint: 3250000 },
  ]);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'r1',
      employeeName: 'Omatsuli Joshua',
      title: '2026 Annual Merit Review',
      currentSalary: 6000000,
      proposedSalary: 7200000,
      percentIncrease: 20.0,
      status: 'SUBMITTED',
      effectiveDate: '2026-10-01',
    },
    {
      id: 'r2',
      employeeName: 'Kemi Adebayo',
      title: 'Mid-Year Promotion Adjustment',
      currentSalary: 4500000,
      proposedSalary: 5400000,
      percentIncrease: 20.0,
      status: 'APPROVED',
      effectiveDate: '2026-09-01',
    },
  ]);

  const [bonuses, setBonuses] = useState<Bonus[]>([
    { id: 'b1', employeeName: 'Omatsuli Joshua', title: 'Q3 Product Delivery Excellence Bonus', amount: 500000, isPaid: true, date: '2026-08-31' },
    { id: 'b2', employeeName: 'Chidi Nnamdi', title: 'Annual Commercial Target Overachievement', amount: 750000, isPaid: false, date: '2026-09-07' },
  ]);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showBonusModal, setShowBonusModal] = useState(false);

  // Form states
  const [reviewEmpName, setReviewEmpName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewCurrent, setReviewCurrent] = useState(0);
  const [reviewProposed, setReviewProposed] = useState(0);

  const [bonusEmpName, setBonusEmpName] = useState('');
  const [bonusTitle, setBonusTitle] = useState('');
  const [bonusAmount, setBonusAmount] = useState(0);

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewEmpName || !reviewProposed) return;
    const pct = reviewCurrent > 0 ? ((reviewProposed - reviewCurrent) / reviewCurrent) * 100 : 0;
    const created: Review = {
      id: String(Date.now()),
      employeeName: reviewEmpName,
      title: reviewTitle || 'Merit Increase',
      currentSalary: Number(reviewCurrent),
      proposedSalary: Number(reviewProposed),
      percentIncrease: Number(pct.toFixed(1)),
      status: 'SUBMITTED',
      effectiveDate: new Date().toISOString().split('T')[0],
    };
    setReviews([created, ...reviews]);
    setShowReviewModal(false);
    setReviewEmpName('');
  };

  const handleCreateBonus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bonusEmpName || !bonusAmount) return;
    const created: Bonus = {
      id: String(Date.now()),
      employeeName: bonusEmpName,
      title: bonusTitle || 'Performance Bonus',
      amount: Number(bonusAmount),
      isPaid: false,
      date: new Date().toISOString().split('T')[0],
    };
    setBonuses([created, ...bonuses]);
    setShowBonusModal(false);
    setBonusEmpName('');
  };

  const handleApproveReview = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: 'APPROVED' } : r)));
  };

  const handleRejectReview = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r)));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Phase 8 — Compensation Workbench
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Compensation & Salary Reviews</h1>
            <p className="text-sm text-slate-500">Salary grade bands, market pay benchmarking, merit salary review approvals, and variable bonus distribution.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBonusModal(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-lg transition"
            >
              + Allocate Bonus
            </button>
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition"
            >
              + Initiate Salary Review
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Metric Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Salary Grade Bands</span>
            <div className="text-2xl font-bold text-slate-900 mt-2">4 Active Bands</div>
            <span className="text-xs text-indigo-600 font-medium mt-1 inline-block">Benchmarked to Local Market</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Salary Reviews</span>
            <div className="text-2xl font-bold text-amber-600 mt-2">
              {reviews.filter((r) => r.status === 'SUBMITTED').length} Pending Executive Approval
            </div>
            <span className="text-xs text-slate-500 mt-1 inline-block">Merit Salary Increases</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Approved Merit Increase Rate</span>
            <div className="text-2xl font-bold text-emerald-600 mt-2">15.0% Average</div>
            <span className="text-xs text-slate-500 mt-1 inline-block">Based on Performance Ratings</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Bonus Allocation</span>
            <div className="text-2xl font-bold text-purple-600 mt-2">
              ₦{bonuses.reduce((acc, b) => acc + b.amount, 0).toLocaleString()}
            </div>
            <span className="text-xs text-slate-500 mt-1 inline-block">Q3 Performance Distribution</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Salary Reviews & Merit Increases ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === 'grades'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Salary Grade Bands ({grades.length})
          </button>
          <button
            onClick={() => setActiveTab('bonuses')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === 'bonuses'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Variable Bonus Distribution ({bonuses.length})
          </button>
        </div>

        {/* TAB 1: Salary Reviews */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Employee Name</th>
                  <th className="px-6 py-3">Review Title</th>
                  <th className="px-6 py-3">Current Salary</th>
                  <th className="px-6 py-3">Proposed Salary</th>
                  <th className="px-6 py-3">Merit Increase</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900">{rev.employeeName}</td>
                    <td className="px-6 py-4">{rev.title}</td>
                    <td className="px-6 py-4 font-mono">₦{rev.currentSalary.toLocaleString()}/yr</td>
                    <td className="px-6 py-4 font-mono font-semibold text-indigo-600">
                      ₦{rev.proposedSalary.toLocaleString()}/yr
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">+{rev.percentIncrease}%</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          rev.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rev.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {rev.status === 'SUBMITTED' && (
                        <>
                          <button
                            onClick={() => handleApproveReview(rev.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectReview(rev.id)}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded transition"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {rev.status !== 'SUBMITTED' && (
                        <span className="text-xs text-slate-400 font-medium">Finalized</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: Salary Grade Bands */}
        {activeTab === 'grades' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {grades.map((grade) => (
              <div key={grade.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {grade.code}
                </span>
                <h3 className="font-bold text-slate-900 text-lg mt-2">{grade.name}</h3>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Min Salary Range</span>
                    <span className="font-mono font-semibold text-slate-800">₦{grade.minSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Market Midpoint</span>
                    <span className="font-mono font-bold text-indigo-600">₦{grade.marketMidpoint.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Max Salary Range</span>
                    <span className="font-mono font-semibold text-slate-800">₦{grade.maxSalary.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-indigo-600 h-full w-3/4 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Bonuses */}
        {activeTab === 'bonuses' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Employee Name</th>
                  <th className="px-6 py-3">Bonus Title</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bonuses.map((b) => (
                  <tr key={b.id}>
                    <td className="px-6 py-4 font-semibold text-slate-900">{b.employeeName}</td>
                    <td className="px-6 py-4">{b.title}</td>
                    <td className="px-6 py-4 font-mono font-semibold text-purple-700">₦{b.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 text-xs font-bold rounded ${
                          b.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.isPaid ? 'PAID' : 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{b.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Salary Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Initiate Salary Review / Merit Adjustment</h3>
            <form onSubmit={handleCreateReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Employee Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Omatsuli Joshua"
                  value={reviewEmpName}
                  onChange={(e) => setReviewEmpName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Review Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026 Annual Performance Review"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Current Salary (₦)</label>
                  <input
                    type="number"
                    required
                    value={reviewCurrent}
                    onChange={(e) => setReviewCurrent(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Proposed Salary (₦)</label>
                  <input
                    type="number"
                    required
                    value={reviewProposed}
                    onChange={(e) => setReviewProposed(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bonus Allocation Modal */}
      {showBonusModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Allocate Variable Bonus</h3>
            <form onSubmit={handleCreateBonus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Employee Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chidi Nnamdi"
                  value={bonusEmpName}
                  onChange={(e) => setBonusEmpName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Bonus Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Sales Target Bonus"
                  value={bonusTitle}
                  onChange={(e) => setBonusTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Bonus Amount (₦)</label>
                <input
                  type="number"
                  required
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBonusModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg"
                >
                  Allocate Bonus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
