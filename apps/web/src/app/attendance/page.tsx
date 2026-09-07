'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Clock, CheckCircle2, LogOut, AlertCircle, Calendar, Plus, MapPin } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface AttendanceRecordItem {
  id: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  totalHours: number;
  status: 'PRESENT' | 'LATE' | 'EARLY_DEPARTURE' | 'ABSENT' | 'ON_LEAVE';
  employee?: {
    firstName: string;
    lastName: string;
    employeeCode: string;
  };
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clocking, setClocking] = useState(false);
  const [clockedInToday, setClockedInToday] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);

  // Correction Form
  const [reqClockIn, setReqClockIn] = useState('');
  const [reqClockOut, setReqClockOut] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res: any = await apiClient.get('/attendance/records');
      const data = res.data || res || [];
      setRecords(data);

      const todayStr = new Date().toISOString().split('T')[0];
      const todayRecord = data.find((r: any) => r.date?.startsWith(todayStr));
      if (todayRecord && todayRecord.clockIn && !todayRecord.clockOut) {
        setClockedInToday(true);
      } else {
        setClockedInToday(false);
      }
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    setClocking(true);
    try {
      await apiClient.post('/attendance/clock-in', {});
      fetchAttendance();
    } catch {
      // Handled
    } finally {
      setClocking(false);
    }
  };

  const handleClockOut = async () => {
    setClocking(true);
    try {
      await apiClient.post('/attendance/clock-out', {});
      fetchAttendance();
    } catch {
      // Handled
    } finally {
      setClocking(false);
    }
  };

  const handleCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/attendance/corrections', {
        requestedClockIn: reqClockIn,
        requestedClockOut: reqClockOut,
        reason,
      });
      setShowCorrectionModal(false);
      setReqClockIn('');
      setReqClockOut('');
      setReason('');
      fetchAttendance();
    } catch {
      // Handled
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Time & Attendance Tracking</h1>
          <p className="text-xs text-slate-500 mt-1">Web clock-in, daily shift logs, and attendance corrections</p>
        </div>
        <button
          onClick={() => setShowCorrectionModal(true)}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Request Correction
        </button>
      </div>

      {/* Web Clock Widget */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-xs text-slate-400 font-medium">Web Attendance Clock</p>
            <h2 className="text-2xl font-bold tracking-tight">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </h2>
            <p className="text-xs text-slate-300">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="flex items-center gap-3">
            {!clockedInToday ? (
              <button
                onClick={handleClockIn}
                disabled={clocking}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/30 transition flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                {clocking ? 'Clocking In...' : 'Clock In Now'}
              </button>
            ) : (
              <button
                onClick={handleClockOut}
                disabled={clocking}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/30 transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {clocking ? 'Clocking Out...' : 'Clock Out'}
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Attendance Log Table */}
      <Card title="Attendance Logs & Working Hours" subtitle="Recent daily shift check-ins and hours calculation">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No Attendance Records Recorded</p>
            <p className="text-[11px] text-slate-500">Clock in using the widget above to record your attendance.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Clock In</th>
                  <th className="p-3">Clock Out</th>
                  <th className="p-3">Total Duration</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-800">
                      {new Date(r.date).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {r.employee ? `${r.employee.firstName} ${r.employee.lastName}` : 'Current User'}
                    </td>
                    <td className="p-3 text-slate-600">
                      {r.clockIn ? new Date(r.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="p-3 text-slate-600">
                      {r.clockOut ? new Date(r.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending Out'}
                    </td>
                    <td className="p-3 font-semibold text-slate-800">
                      {r.totalHours ? `${r.totalHours} hrs` : 'In Progress'}
                    </td>
                    <td className="p-3">
                      <Badge variant={r.status === 'PRESENT' ? 'success' : r.status === 'LATE' ? 'warning' : 'info'}>
                        {r.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Correction Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-sm font-bold text-slate-900">Request Attendance Correction</h2>
            <form onSubmit={handleCorrection} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Requested Clock-In</label>
                <input
                  type="datetime-local"
                  required
                  value={reqClockIn}
                  onChange={(e) => setReqClockIn(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Requested Clock-Out</label>
                <input
                  type="datetime-local"
                  required
                  value={reqClockOut}
                  onChange={(e) => setReqClockOut(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Correction</label>
                <textarea
                  required
                  placeholder="Explain why clocking was missed or inaccurate"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
