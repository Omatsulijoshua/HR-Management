'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { CalendarDays, Plus, CheckCircle2, XCircle, Clock, Calendar as CalendarIcon, User } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface LeaveBalanceItem {
  id: string;
  leaveType: { id: string; name: string; code: string; colorCode?: string };
  totalDays: number;
  usedDays: number;
  pendingDays: number;
  remainingDays: number;
}

interface LeaveRequestItem {
  id: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  employee?: { firstName: string; lastName: string; employeeCode: string };
  leaveType: { name: string; colorCode?: string };
}

export default function LeaveManagementPage() {
  const [balances, setBalances] = useState<LeaveBalanceItem[]>([]);
  const [requests, setRequests] = useState<LeaveRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'my' | 'approvals' | 'calendar'>('my');

  // Form State
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState(1);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [balRes, reqRes]: any = await Promise.all([
        apiClient.get('/leave/balances'),
        apiClient.get('/leave/requests'),
      ]);
      setBalances(balRes.data || balRes || []);
      setRequests(reqRes.data || reqRes || []);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/leave/requests', {
        leaveTypeId,
        startDate,
        endDate,
        totalDays: Number(totalDays),
        reason,
      });
      setShowModal(false);
      fetchData();
    } catch {
      // Handled
    } finally {
      setSubmitting(false);
    }
  };

  const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await apiClient.patch(`/leave/requests/${id}/review`, { status });
      fetchData();
    } catch {
      // Handled
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Leave & Absence Management</h1>
          <p className="text-xs text-slate-500 mt-1">Track entitlement balances, request time off, and manage approvals</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Request Leave
        </button>
      </div>

      {/* Leave Entitlement Balances Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <>
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </>
        ) : balances.length === 0 ? (
          <Card className="col-span-3 text-center py-6 text-xs text-slate-500">
            No leave entitlement balances initialized yet.
          </Card>
        ) : (
          balances.map((b) => (
            <Card key={b.id} className="p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-bold text-slate-800">{b.leaveType.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Code: {b.leaveType.code}</p>
                </div>
                <Badge variant="info">{b.remainingDays} Days Remaining</Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-100 mt-3 text-[11px]">
                <div>
                  <p className="text-slate-400">Entitled</p>
                  <p className="font-semibold text-slate-800">{b.totalDays}d</p>
                </div>
                <div>
                  <p className="text-slate-400">Used</p>
                  <p className="font-semibold text-rose-600">{b.usedDays}d</p>
                </div>
                <div>
                  <p className="text-slate-400">Pending</p>
                  <p className="font-semibold text-amber-600">{b.pendingDays}d</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('my')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'my' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          My Leave Requests ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('approvals')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'approvals' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Manager Approval Queue ({requests.filter((r) => r.status === 'PENDING').length})
        </button>
      </div>

      {/* Requests Table */}
      <Card>
        {loading ? (
          <div className="space-y-3 p-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <CalendarDays className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No Leave Requests Found</p>
            <p className="text-[11px] text-slate-500">Submit a leave request to schedule time off.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="p-3">Applicant</th>
                <th className="p-3">Leave Type</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Days</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
                {activeTab === 'approvals' && <th className="p-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests
                .filter((r) => (activeTab === 'approvals' ? r.status === 'PENDING' : true))
                .map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-800">
                      {r.employee ? `${r.employee.firstName} ${r.employee.lastName}` : 'Current User'}
                    </td>
                    <td className="p-3">
                      <Badge variant="neutral">{r.leaveType?.name}</Badge>
                    </td>
                    <td className="p-3 text-slate-600">
                      {new Date(r.startDate).toLocaleDateString()} – {new Date(r.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{r.totalDays} days</td>
                    <td className="p-3 text-slate-500 max-w-xs truncate">{r.reason}</td>
                    <td className="p-3">
                      <Badge variant={r.status === 'APPROVED' ? 'success' : r.status === 'PENDING' ? 'warning' : 'error'}>
                        {r.status}
                      </Badge>
                    </td>
                    {activeTab === 'approvals' && (
                      <td className="p-3 text-right flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleReview(r.id, 'APPROVED')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReview(r.id, 'REJECTED')}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-semibold transition"
                        >
                          Reject
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Leave Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-sm font-bold text-slate-900">Submit Leave Request</h2>
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Leave Type</label>
                <select
                  required
                  value={leaveTypeId}
                  onChange={(e) => setLeaveTypeId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Leave Type</option>
                  {balances.map((b) => (
                    <option key={b.leaveType.id} value={b.leaveType.id}>
                      {b.leaveType.name} ({b.remainingDays} days available)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Days</label>
                <input
                  type="number"
                  required
                  min={0.5}
                  step={0.5}
                  value={totalDays}
                  onChange={(e) => setTotalDays(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Notes</label>
                <textarea
                  required
                  placeholder="Provide reason for time off"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-3.5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
