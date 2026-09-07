'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface MyProfile {
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  bankName: string;
  accountNumber: string;
  taxId: string;
  rsaNumber: string;
}

export default function EssPage() {
  const [profile, setProfile] = useState<MyProfile>({
    employeeCode: 'EMP-001',
    fullName: 'Omatsuli Joshua',
    email: 'joshua@nexushcm.io',
    phone: '+234 812 345 6789',
    department: 'Software Engineering',
    position: 'Senior Systems Architect',
    bankName: 'Guaranty Trust Bank (GTB)',
    accountNumber: '0123456789',
    taxId: 'TAX-NG-88921',
    rsaNumber: 'PEN-1002938475',
  });

  const [editMode, setEditMode] = useState(false);
  const [phone, setPhone] = useState(profile.phone);
  const [bankName, setBankName] = useState(profile.bankName);
  const [accountNumber, setAccountNumber] = useState(profile.accountNumber);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      ...profile,
      phone,
      bankName,
      accountNumber,
    });
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/mss"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Manager Self-Service (MSS) &rarr;
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Employee Self-Service (ESS) Hub
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage personal info, review leave balances, access payslips, and submit requests.
            </p>
          </div>
          <div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow"
            >
              {editMode ? 'Cancel Edit' : '✏️ Update Profile Details'}
            </button>
          </div>
        </div>

        {/* Quick ESS Action Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          <Link
            href="/leave"
            className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-500 transition-all text-center"
          >
            <div className="text-2xl mb-1">🌴</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Apply for Leave</div>
            <div className="text-[10px] text-slate-400 mt-0.5">18 Days Remaining</div>
          </Link>

          <Link
            href="/payslips"
            className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-500 transition-all text-center"
          >
            <div className="text-2xl mb-1">📄</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Download Payslips</div>
            <div className="text-[10px] text-slate-400 mt-0.5">August 2026 Ready</div>
          </Link>

          <Link
            href="/training"
            className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-500 transition-all text-center"
          >
            <div className="text-2xl mb-1">🎓</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Training Portal</div>
            <div className="text-[10px] text-slate-400 mt-0.5">2 Courses Enrolled</div>
          </Link>

          <Link
            href="/mobility"
            className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-500 transition-all text-center"
          >
            <div className="text-2xl mb-1">🚀</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Internal Transfer</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Apply for New Roles</div>
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal Profile Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
            <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
              OJ
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {profile.fullName}
              </h2>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                {profile.position}
              </p>
              <span className="text-[11px] text-slate-400 font-mono">
                {profile.employeeCode} • {profile.department}
              </span>
            </div>
          </div>

          {!editMode ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Work Email:</span>
                <div className="text-slate-900 dark:text-white font-semibold mt-0.5">{profile.email}</div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Phone Number:</span>
                <div className="text-slate-900 dark:text-white font-semibold mt-0.5">{profile.phone}</div>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50">
                <span className="text-slate-400 font-medium">Bank Name & Account:</span>
                <div className="text-slate-900 dark:text-white font-semibold mt-0.5">{profile.bankName} ({profile.accountNumber})</div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Tax Identifier (TIN):</span>
                <div className="text-slate-900 dark:text-white font-semibold mt-0.5">{profile.taxId}</div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">RSA Pension PIN:</span>
                <div className="text-slate-900 dark:text-white font-semibold mt-0.5">{profile.rsaNumber}</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>

        {/* Right Area: Leave & Pay Overview Widgets */}
        <div className="lg:col-span-2 space-y-6">
          {/* Leave Summary Widget */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              My Annual Leave Allocation & Balances
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
                <div className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold">Annual Vacation Leave</div>
                <div className="text-2xl font-black text-indigo-900 dark:text-indigo-100 mt-1">18 / 20</div>
                <div className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1">2 Days Taken</div>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                <div className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">Paid Sick Leave</div>
                <div className="text-2xl font-black text-emerald-900 dark:text-emerald-100 mt-1">10 / 10</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">0 Days Taken</div>
              </div>

              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900">
                <div className="text-xs text-purple-700 dark:text-purple-300 font-semibold">Study & Exam Leave</div>
                <div className="text-2xl font-black text-purple-900 dark:text-purple-100 mt-1">5 / 5</div>
                <div className="text-[10px] text-purple-600 dark:text-purple-400 mt-1">Available for L&D</div>
              </div>
            </div>
          </div>

          {/* Recent Payslip Feed Widget */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Recent Net Salary Statements
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">August 2026 Monthly Payroll</div>
                  <div className="text-xs text-slate-500">Disbursed on Aug 28, 2026</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    ₦1,850,000.00
                  </span>
                  <Link
                    href="/payslips"
                    className="px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                  >
                    View PDF
                  </Link>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">July 2026 Monthly Payroll</div>
                  <div className="text-xs text-slate-500">Disbursed on Jul 28, 2026</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    ₦1,850,000.00
                  </span>
                  <Link
                    href="/payslips"
                    className="px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                  >
                    View PDF
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
