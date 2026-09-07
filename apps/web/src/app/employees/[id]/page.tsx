'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  User,
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  FileText,
  Clock,
  History,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function EmployeeProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'timeline' | 'financial' | 'contacts' | 'documents'>('profile');

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res: any = await apiClient.get(`/employees/${id}`);
      setEmployee(res.data || res);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmProbation = async () => {
    try {
      await apiClient.patch(`/employees/${id}/status`, {
        status: 'ACTIVE',
        reason: 'Passed probation period',
      });
      fetchProfile();
    } catch {
      // Handled
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6 text-center text-xs text-slate-500">
        Employee record not found or access denied.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
              {employee.firstName[0]}
              {employee.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">
                  {employee.firstName} {employee.lastName}
                </h1>
                <Badge variant="neutral">{employee.employeeCode}</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {employee.position?.title || 'Unassigned Position'} • {employee.department?.name || 'Unassigned Dept'}
              </p>
              <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{employee.email}</span>
                {employee.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{employee.phone}</span>}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge variant={employee.status === 'ACTIVE' ? 'success' : 'warning'}>
              Status: {employee.status}
            </Badge>
            {employee.status === 'PROBATION' && (
              <button
                onClick={handleConfirmProbation}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Probation
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Personal & Placement
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'timeline' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Lifecycle Timeline ({employee.histories?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('financial')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'financial' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Financial & Bank Info
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'contacts' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Emergency Contacts ({employee.emergencyContacts?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'documents' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Documents & Contracts ({employee.documents?.length || 0})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Employment Details">
            <dl className="divide-y divide-slate-100 text-xs">
              <div className="py-2 flex justify-between"><dt className="text-slate-500">Department</dt><dd className="font-semibold text-slate-800">{employee.department?.name || '—'}</dd></div>
              <div className="py-2 flex justify-between"><dt className="text-slate-500">Branch</dt><dd className="font-semibold text-slate-800">{employee.branch?.name || '—'}</dd></div>
              <div className="py-2 flex justify-between"><dt className="text-slate-500">Job Position</dt><dd className="font-semibold text-slate-800">{employee.position?.title || '—'}</dd></div>
              <div className="py-2 flex justify-between"><dt className="text-slate-500">Job Grade Band</dt><dd className="font-semibold text-slate-800">{employee.jobGrade?.name || '—'}</dd></div>
              <div className="py-2 flex justify-between"><dt className="text-slate-500">Hire Date</dt><dd className="font-semibold text-slate-800">{new Date(employee.hireDate).toLocaleDateString()}</dd></div>
              <div className="py-2 flex justify-between"><dt className="text-slate-500">Confirmation Date</dt><dd className="font-semibold text-slate-800">{employee.confirmationDate ? new Date(employee.confirmationDate).toLocaleDateString() : 'Pending Confirmation'}</dd></div>
            </dl>
          </Card>

          <Card title="Personal Information">
            <dl className="divide-y divide-slate-100 text-xs">
              <div className="py-2 flex justify-between"><dt className="text-slate-500">Full Name</dt><dd className="font-semibold text-slate-800">{employee.firstName} {employee.lastName}</dd></div>
              <div className="py-2 flex justify-between"><dt className="text-slate-500">Gender</dt><dd className="font-semibold text-slate-800">{employee.gender || '—'}</dd></div>
              <div className="py-2 flex justify-between"><dt className="text-slate-500">Marital Status</dt><dd className="font-semibold text-slate-800">{employee.maritalStatus || '—'}</dd></div>
              <div className="py-2 flex justify-between"><dt className="text-slate-500">National ID / NIN</dt><dd className="font-semibold text-slate-800">{employee.nationalId || '—'}</dd></div>
              <div className="py-2 flex justify-between"><dt className="text-slate-500">Country</dt><dd className="font-semibold text-slate-800">{employee.country}</dd></div>
            </dl>
          </Card>
        </div>
      )}

      {activeTab === 'timeline' && (
        <Card title="Employee Lifecycle Timeline" subtitle="Chronological record of status changes, promotions, and updates">
          <div className="space-y-4">
            {employee.histories?.map((h: any) => (
              <div key={h.id} className="flex gap-4 border-l-2 border-blue-500 pl-4 py-1">
                <div>
                  <p className="text-xs font-bold text-slate-900">{h.eventType}: {h.description}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{new Date(h.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'financial' && (
        <Card title="Financial & Bank Details" subtitle="Confidential salary and disbursement information">
          <dl className="divide-y divide-slate-100 text-xs max-w-lg">
            <div className="py-2 flex justify-between"><dt className="text-slate-500">Base Salary</dt><dd className="font-semibold text-slate-900">₦{employee.basicSalary?.toLocaleString()}</dd></div>
            <div className="py-2 flex justify-between"><dt className="text-slate-500">Bank Name</dt><dd className="font-semibold text-slate-800">{employee.bankName || '—'}</dd></div>
            <div className="py-2 flex justify-between"><dt className="text-slate-500">Account Number</dt><dd className="font-semibold text-slate-800">{employee.accountNumber || '—'}</dd></div>
            <div className="py-2 flex justify-between"><dt className="text-slate-500">Tax ID</dt><dd className="font-semibold text-slate-800">{employee.taxId || '—'}</dd></div>
          </dl>
        </Card>
      )}

      {activeTab === 'contacts' && (
        <Card title="Emergency Contacts">
          {employee.emergencyContacts?.length === 0 ? (
            <p className="text-xs text-slate-500">No emergency contacts registered.</p>
          ) : (
            <div className="space-y-3">
              {employee.emergencyContacts?.map((c: any) => (
                <div key={c.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">{c.name} ({c.relationship})</p>
                    <p className="text-[11px] text-slate-500">{c.phone}</p>
                  </div>
                  {c.isPrimary && <Badge variant="info">Primary</Badge>}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'documents' && (
        <Card title="Employee Documents & Contracts">
          {employee.documents?.length === 0 ? (
            <p className="text-xs text-slate-500">No documents uploaded.</p>
          ) : (
            <div className="space-y-2">
              {employee.documents?.map((d: any) => (
                <div key={d.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-semibold text-slate-800">{d.title}</p>
                      <p className="text-[10px] text-slate-500">{d.category}</p>
                    </div>
                  </div>
                  <a href={d.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
