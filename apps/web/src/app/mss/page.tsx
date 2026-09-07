'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface DirectReport {
  id: string;
  name: string;
  position: string;
  status: 'PRESENT' | 'ON_LEAVE' | 'REMOTE';
  attendanceTime: string;
}

interface PendingApproval {
  id: string;
  employeeName: string;
  type: 'Annual Leave' | 'Overtime' | 'Expense Claim';
  details: string;
  submittedDate: string;
}

interface DelegationItem {
  id: string;
  delegateName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'ACTIVE' | 'EXPIRED';
}

export default function MssPage() {
  const [team, setTeam] = useState<DirectReport[]>([
    {
      id: 'emp2',
      name: 'Amina Bello',
      position: 'Cloud Security Analyst',
      status: 'PRESENT',
      attendanceTime: '08:14 AM (Office)',
    },
    {
      id: 'emp3',
      name: 'David Chen',
      position: 'Database Administrator',
      status: 'REMOTE',
      attendanceTime: '08:30 AM (Home)',
    },
    {
      id: 'emp4',
      name: 'Sarah Jenkins',
      position: 'Senior Talent Sourcer',
      status: 'ON_LEAVE',
      attendanceTime: 'Annual Vacation',
    },
  ]);

  const [approvals, setApprovals] = useState<PendingApproval[]>([
    {
      id: 'ap1',
      employeeName: 'David Chen',
      type: 'Annual Leave',
      details: '5 Days (Sep 14 - Sep 18)',
      submittedDate: '2026-09-05',
    },
    {
      id: 'ap2',
      employeeName: 'Amina Bello',
      type: 'Overtime',
      details: '4 Hours (Database Migration)',
      submittedDate: '2026-09-06',
    },
  ]);

  const [delegations, setDelegations] = useState<DelegationItem[]>([
    {
      id: 'del1',
      delegateName: 'Amina Bello',
      startDate: '2026-09-20',
      endDate: '2026-09-27',
      reason: 'Out of Office - Annual Vacation',
      status: 'ACTIVE',
    },
  ]);

  // Modal State
  const [showDelegationModal, setShowDelegationModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  // Delegation Form
  const [delName, setDelName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  // 1-on-1 Form
  const [meetingEmp, setMeetingEmp] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');

  const handleCreateDelegation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delName || !startDate) return;

    const newDel: DelegationItem = {
      id: `del_${Date.now()}`,
      delegateName: delName,
      startDate,
      endDate: endDate || startDate,
      reason: reason || 'Out of office coverage',
      status: 'ACTIVE',
    };

    setDelegations([newDel, ...delegations]);
    setShowDelegationModal(false);
    setDelName('');
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  const handleApprove = (id: string) => {
    setApprovals(approvals.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/ess"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                &larr; Employee Self-Service (ESS)
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Manager Self-Service (MSS) Command Center
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Direct report management, pending team approvals, 1-on-1 meeting scheduling, and manager authority delegation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDelegationModal(true)}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow"
            >
              + Delegate Manager Authority
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Direct Reports & Attendance Status */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                My Direct Reports ({team.length})
              </h3>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                2 Present Today
              </span>
            </div>

            <div className="space-y-3">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/70 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      {member.name}
                    </div>
                    <div className="text-[11px] text-slate-500">{member.position}</div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        member.status === 'PRESENT'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : member.status === 'REMOTE'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {member.status}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">{member.attendanceTime}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manager Delegations Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              Active Delegations ({delegations.length})
            </h3>
            {delegations.map((d) => (
              <div key={d.id} className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs">
                <div className="flex justify-between font-bold text-indigo-900 dark:text-indigo-200 mb-1">
                  <span>Delegate: {d.delegateName}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-100">{d.status}</span>
                </div>
                <div className="text-slate-600 dark:text-slate-400">{d.reason}</div>
                <div className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1">Period: {d.startDate} to {d.endDate}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Area: Team Pending Approval Queue & Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Pending Team Approval Queue ({approvals.length})
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Review and sign off on leave applications, overtime hours, and expense claims for direct reports.
            </p>

            {approvals.length === 0 ? (
              <div className="p-6 text-center text-sm text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                ✓ All team approval requests cleared!
              </div>
            ) : (
              <div className="space-y-3">
                {approvals.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {item.employeeName}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {item.details}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Delegate Authority */}
      {showDelegationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Delegate Manager Approval Authority
            </h3>
            <form onSubmit={handleCreateDelegation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Delegate Name (Peer / Subordinate)
                </label>
                <input
                  type="text"
                  required
                  value={delName}
                  onChange={(e) => setDelName(e.target.value)}
                  placeholder="e.g. Amina Bello"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Reason for Delegation
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Out of Office for Annual Vacation"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDelegationModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Grant Delegation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
