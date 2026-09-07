'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface MobilityRequestItem {
  id: string;
  employeeName: string;
  currentRole: string;
  targetRole: string;
  department: string;
  reason: string;
  submittedAt: string;
  status: 'SUBMITTED' | 'MANAGER_APPROVED' | 'HR_APPROVED' | 'REJECTED' | 'COMPLETED';
}

export default function MobilityPage() {
  const [requests, setRequests] = useState<MobilityRequestItem[]>([
    {
      id: 'mr1',
      employeeName: 'Omatsuli Joshua',
      currentRole: 'Senior Software Engineer',
      targetRole: 'Principal Infrastructure Architect',
      department: 'Software Engineering',
      reason: 'Career progression initiative and alignment with distributed systems roadmap.',
      submittedAt: '2026-09-02',
      status: 'HR_APPROVED',
    },
    {
      id: 'mr2',
      employeeName: 'Amina Bello',
      currentRole: 'Cloud Security Analyst',
      targetRole: 'DevOps Lead Engineer',
      department: 'Infrastructure & Security',
      reason: 'Lateral transfer request to expand cloud governance responsibilities.',
      submittedAt: '2026-09-05',
      status: 'SUBMITTED',
    },
  ]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [empName, setEmpName] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [dept, setDept] = useState('');
  const [reasonText, setReasonText] = useState('');

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !targetRole) return;

    const newReq: MobilityRequestItem = {
      id: `mr_${Date.now()}`,
      employeeName: empName,
      currentRole: currentRole || 'Current Specialist',
      targetRole: targetRole,
      department: dept || 'Engineering',
      reason: reasonText || 'Internal career growth request.',
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'SUBMITTED',
    };

    setRequests([newReq, ...requests]);
    setShowModal(false);
    setEmpName('');
    setCurrentRole('');
    setTargetRole('');
    setDept('');
    setReasonText('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'HR_APPROVED':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
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
                href="/career"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                &larr; Career Pathways
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Internal Mobility & Job Transfer Portal
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Facilitate lateral internal transfers, promotion approvals, and cross-departmental mobility.
            </p>
          </div>
          <div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow"
            >
              + Submit Mobility Request
            </button>
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Active Internal Transfer Requests
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track approval state through Manager Review, HR Approval, and Final Placement.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/50 uppercase text-xs text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4">Target Position</th>
                <th className="px-6 py-4">Reason / Justification</th>
                <th className="px-6 py-4">Submitted Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                    {req.employeeName}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {req.currentRole}
                  </td>
                  <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">
                    {req.targetRole}
                  </td>
                  <td className="px-6 py-4 text-xs max-w-xs truncate text-slate-500">
                    {req.reason}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {req.submittedAt}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded font-bold ${getStatusBadge(req.status)}`}>
                      {req.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Submit Mobility Request */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Submit Internal Mobility Request
            </h3>
            <form onSubmit={handleCreateRequest} className="space-y-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Current Role
                  </label>
                  <input
                    type="text"
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    placeholder="e.g. Software Engineering"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Target Position
                </label>
                <input
                  type="text"
                  required
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Principal Infrastructure Architect"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Justification / Career Goals
                </label>
                <textarea
                  rows={3}
                  value={reasonText}
                  onChange={(e) => setReasonText(e.target.value)}
                  placeholder="State motivation for internal transfer..."
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
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
