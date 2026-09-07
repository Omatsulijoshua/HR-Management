'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface PolicyItem {
  id: string;
  title: string;
  code: string;
  category: 'CODE_OF_CONDUCT' | 'IT_SECURITY' | 'WORKPLACE_HEALTH_SAFETY' | 'LEAVE_COMPLIANCE' | 'GENERAL';
  version: string;
  isMandatory: boolean;
  acknowledgedCount: number;
  totalEmployees: number;
}

interface IncidentItem {
  id: string;
  incidentNumber: string;
  title: string;
  reporterName: string;
  location: string;
  severity: 'MINOR' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
  status: 'REPORTED' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'CLOSED';
  reportedAt: string;
}

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<'policies' | 'hse'>('policies');

  const [policies, setPolicies] = useState<PolicyItem[]>([
    {
      id: 'pol1',
      title: '2026 Enterprise Code of Conduct & Anti-Harassment Policy',
      code: 'COC_2026_V2',
      category: 'CODE_OF_CONDUCT',
      version: '2.1',
      isMandatory: true,
      acknowledgedCount: 238,
      totalEmployees: 250,
    },
    {
      id: 'pol2',
      title: 'Cybersecurity, Data Privacy & Remote Access Policy (SOC2 / GDPR)',
      code: 'SEC_POLICY_V3',
      category: 'IT_SECURITY',
      version: '3.0',
      isMandatory: true,
      acknowledgedCount: 210,
      totalEmployees: 250,
    },
    {
      id: 'pol3',
      title: 'Workplace Health, Safety & Environment (HSE) Standard',
      code: 'HSE_STD_2026',
      category: 'WORKPLACE_HEALTH_SAFETY',
      version: '1.2',
      isMandatory: true,
      acknowledgedCount: 195,
      totalEmployees: 250,
    },
  ]);

  const [incidents, setIncidents] = useState<IncidentItem[]>([
    {
      id: 'hse1',
      incidentNumber: 'HSE-00018',
      title: 'Water Leak Floor Hazard near Server Room',
      reporterName: 'Omatsuli Joshua',
      location: 'Building B - 3rd Floor East Wing',
      severity: 'MINOR',
      status: 'RESOLVED',
      reportedAt: '2026-08-29',
    },
    {
      id: 'hse2',
      incidentNumber: 'HSE-00019',
      title: 'Frayed Extension Cable in Training Room B',
      reporterName: 'Amina Bello',
      location: 'Headquarters - Room 204',
      severity: 'MODERATE',
      status: 'UNDER_INVESTIGATION',
      reportedAt: '2026-09-03',
    },
  ]);

  // Modal State
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  // Policy Form
  const [polTitle, setPolTitle] = useState('');
  const [polCode, setPolCode] = useState('');
  const [polCategory, setPolCategory] = useState<'CODE_OF_CONDUCT' | 'IT_SECURITY' | 'WORKPLACE_HEALTH_SAFETY' | 'LEAVE_COMPLIANCE' | 'GENERAL'>('CODE_OF_CONDUCT');

  // Incident Form
  const [incTitle, setIncTitle] = useState('');
  const [incLocation, setIncLocation] = useState('');
  const [incSeverity, setIncSeverity] = useState<'MINOR' | 'MODERATE' | 'SEVERE' | 'CRITICAL'>('MINOR');
  const [incDesc, setIncDesc] = useState('');

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!polTitle || !polCode) return;

    const created: PolicyItem = {
      id: `pol_${Date.now()}`,
      title: polTitle,
      code: polCode.toUpperCase(),
      category: polCategory,
      version: '1.0',
      isMandatory: true,
      acknowledgedCount: 0,
      totalEmployees: 250,
    };

    setPolicies([created, ...policies]);
    setShowPolicyModal(false);
    setPolTitle('');
    setPolCode('');
  };

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incTitle || !incDesc) return;

    const created: IncidentItem = {
      id: `hse_${Date.now()}`,
      incidentNumber: `HSE-${String(incidents.length + 20).padStart(5, '0')}`,
      title: incTitle,
      reporterName: 'Omatsuli Joshua',
      location: incLocation || 'Main Office',
      severity: incSeverity,
      status: 'REPORTED',
      reportedAt: new Date().toISOString().split('T')[0],
    };

    setIncidents([created, ...incidents]);
    setShowIncidentModal(false);
    setIncTitle('');
    setIncLocation('');
    setIncDesc('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/organization/settings"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                &larr; Organization Settings
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Compliance, Policy Library & HSE Safety Portal
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage corporate policies, track mandatory employee read-and-sign acknowledgments, and audit HSE incidents.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPolicyModal(true)}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow"
            >
              + Upload Company Policy
            </button>
            <button
              onClick={() => setShowIncidentModal(true)}
              className="px-4 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow"
            >
              + Report HSE Incident
            </button>
          </div>
        </div>

        {/* Tab Header */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mt-8 gap-8">
          <button
            onClick={() => setActiveTab('policies')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'policies'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Policy Repository & Acknowledgments ({policies.length})
          </button>
          <button
            onClick={() => setActiveTab('hse')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'hse'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            HSE Safety Incidents Log ({incidents.length})
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto">
        {/* TAB 1: Policy Directory */}
        {activeTab === 'policies' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {policies.map((pol) => {
                const ackPercent = Math.round((pol.acknowledgedCount / pol.totalEmployees) * 100);
                return (
                  <div
                    key={pol.id}
                    className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold px-2.5 py-1 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {pol.category.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-mono text-slate-400">v{pol.version}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {pol.title}
                      </h3>
                      <div className="text-xs text-slate-500 mb-4">
                        Code: <code className="font-semibold">{pol.code}</code>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Sign-off Coverage:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{ackPercent}% Verified</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${ackPercent}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: HSE Incidents Log */}
        {activeTab === 'hse' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Workplace Health, Safety & Environmental Incidents
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Log, investigate, and audit safety hazards and workplace injury reports.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/50 uppercase text-xs text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Incident #</th>
                    <th className="px-6 py-4">Hazard / Event Title</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Severity</th>
                    <th className="px-6 py-4">Reporter</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {incidents.map((inc) => (
                    <tr key={inc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                      <td className="px-6 py-4 font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                        {inc.incidentNumber}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        {inc.title}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {inc.location}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span className={`px-2.5 py-0.5 rounded font-bold ${
                          inc.severity === 'CRITICAL' || inc.severity === 'SEVERE'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200 text-xs">
                        {inc.reporterName}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {inc.reportedAt}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {inc.status.replace(/_/g, ' ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Create Policy */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Upload Company Policy Document
            </h3>
            <form onSubmit={handleCreatePolicy} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Policy Title
                </label>
                <input
                  type="text"
                  required
                  value={polTitle}
                  onChange={(e) => setPolTitle(e.target.value)}
                  placeholder="e.g. Remote Work Safety & Ergonomics"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Policy Code
                  </label>
                  <input
                    type="text"
                    required
                    value={polCode}
                    onChange={(e) => setPolCode(e.target.value)}
                    placeholder="e.g. HSE_REMOTE_01"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={polCategory}
                    onChange={(e) => setPolCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  >
                    <option value="CODE_OF_CONDUCT">CODE OF CONDUCT</option>
                    <option value="IT_SECURITY">IT SECURITY</option>
                    <option value="WORKPLACE_HEALTH_SAFETY">HSE SAFETY</option>
                    <option value="LEAVE_COMPLIANCE">LEAVE COMPLIANCE</option>
                    <option value="GENERAL">GENERAL</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPolicyModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Save Policy Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Report HSE Incident */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Report Workplace HSE Incident
            </h3>
            <form onSubmit={handleReportIncident} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Incident Title / Short Summary
                </label>
                <input
                  type="text"
                  required
                  value={incTitle}
                  onChange={(e) => setIncTitle(e.target.value)}
                  placeholder="e.g. Electrical Socket Short Circuit"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={incLocation}
                    onChange={(e) => setIncLocation(e.target.value)}
                    placeholder="e.g. Floor 2 Breakroom"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Severity Level
                  </label>
                  <select
                    value={incSeverity}
                    onChange={(e) => setIncSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  >
                    <option value="MINOR">MINOR</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="SEVERE">SEVERE</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Description of Hazard / Incident
                </label>
                <textarea
                  rows={3}
                  required
                  value={incDesc}
                  onChange={(e) => setIncDesc(e.target.value)}
                  placeholder="Provide precise details of the hazard..."
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
                >
                  File Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
