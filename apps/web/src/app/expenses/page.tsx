'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ExpenseClaimItem {
  id: string;
  claimNumber: string;
  employeeName: string;
  title: string;
  category: 'TRAVEL' | 'MEALS_ENTERTAINMENT' | 'SUPPLIES' | 'TRAINING_CERTIFICATION' | 'UTILITIES';
  amount: number;
  currency: string;
  status: 'SUBMITTED' | 'MANAGER_APPROVED' | 'FINANCE_APPROVED' | 'DISBURSED' | 'REJECTED';
  submittedAt: string;
  receiptUrl?: string;
}

export default function ExpensesPage() {
  const [claims, setClaims] = useState<ExpenseClaimItem[]>([
    {
      id: 'clm1',
      claimNumber: 'CLM-00042',
      employeeName: 'Omatsuli Joshua',
      title: 'AWS Cloud Architecture Certification Exam Fee',
      category: 'TRAINING_CERTIFICATION',
      amount: 150000.0,
      currency: 'NGN',
      status: 'DISBURSED',
      submittedAt: '2026-08-20',
      receiptUrl: 'https://cdn.nexushcm.io/receipts/rec_aws_982.pdf',
    },
    {
      id: 'clm2',
      claimNumber: 'CLM-00043',
      employeeName: 'Amina Bello',
      title: 'Client Business Dinner & Strategy Meeting',
      category: 'MEALS_ENTERTAINMENT',
      amount: 45000.0,
      currency: 'NGN',
      status: 'MANAGER_APPROVED',
      submittedAt: '2026-09-02',
    },
    {
      id: 'clm3',
      claimNumber: 'CLM-00044',
      employeeName: 'David Chen',
      title: 'Flight & Hotel Booking - Lagos to Abuja Regional Meeting',
      category: 'TRAVEL',
      amount: 320000.0,
      currency: 'NGN',
      status: 'SUBMITTED',
      submittedAt: '2026-09-05',
    },
  ]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [empName, setEmpName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'TRAVEL' | 'MEALS_ENTERTAINMENT' | 'SUPPLIES' | 'TRAINING_CERTIFICATION' | 'UTILITIES'>('SUPPLIES');
  const [amount, setAmount] = useState(15000);

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    const created: ExpenseClaimItem = {
      id: `clm_${Date.now()}`,
      claimNumber: `CLM-${String(claims.length + 45).padStart(5, '0')}`,
      employeeName: empName || 'Omatsuli Joshua',
      title,
      category,
      amount: Number(amount),
      currency: 'NGN',
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString().split('T')[0],
    };

    setClaims([created, ...claims]);
    setShowModal(false);
    setTitle('');
    setAmount(15000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DISBURSED':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'FINANCE_APPROVED':
      case 'MANAGER_APPROVED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
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
                href="/payroll"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                &larr; Payroll & Payslips
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Expense Management & Financial Claims
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              File expense reimbursements, attach receipts, track multi-level approvals, and monitor disbursements.
            </p>
          </div>
          <div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow"
            >
              + File Expense Claim
            </button>
          </div>
        </div>

        {/* Claim Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Total Claims Filed</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              ₦{claims.reduce((acc, c) => acc + c.amount, 0).toLocaleString()}
            </div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-medium">{claims.length} Claims Recorded</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Pending Approval</div>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
              ₦{claims.filter((c) => c.status === 'SUBMITTED' || c.status === 'MANAGER_APPROVED').reduce((acc, c) => acc + c.amount, 0).toLocaleString()}
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium">In Manager/Finance Review</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Disbursed Reimbursements</div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              ₦{claims.filter((c) => c.status === 'DISBURSED').reduce((acc, c) => acc + c.amount, 0).toLocaleString()}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">Paid out via Bank Transfer</div>
          </div>
        </div>
      </div>

      {/* Main Expense Table */}
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Expense Claims Directory & Approval Tracking
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Multi-stage approval pipeline: Manager Review &rarr; Finance Audit &rarr; Disbursement.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/50 uppercase text-xs text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">Claim #</th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Expense Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {claims.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                  <td className="px-6 py-4 font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                    {item.claimNumber}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                    {item.employeeName}
                  </td>
                  <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {item.category.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                    ₦{item.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {item.submittedAt}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded font-bold ${getStatusBadge(item.status)}`}>
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: File Expense Claim */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              File Expense Reimbursement Claim
            </h3>
            <form onSubmit={handleCreateClaim} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Employee Name
                </label>
                <input
                  type="text"
                  required
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  placeholder="e.g. Omatsuli Joshua"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Expense Title / Purpose
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Client Dinner Meeting"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  >
                    <option value="TRAVEL">TRAVEL</option>
                    <option value="MEALS_ENTERTAINMENT">MEALS & ENTERTAINMENT</option>
                    <option value="SUPPLIES">SUPPLIES</option>
                    <option value="TRAINING_CERTIFICATION">TRAINING & CERTIFICATION</option>
                    <option value="UTILITIES">UTILITIES</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Amount (NGN)
                  </label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                </div>
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
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
