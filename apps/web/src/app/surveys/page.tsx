'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface SurveyCampaign {
  id: string;
  title: string;
  code: string;
  type: 'PULSE' | 'ENPS' | 'CUSTOM' | 'ANNUAL_SATISFACTION';
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED';
  responseCount: number;
  eNpsScore: number;
  createdAt: string;
}

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<SurveyCampaign[]>([
    {
      id: 'sv1',
      title: 'Q3 Enterprise Employee Pulse Survey',
      code: 'PULSE_Q3_2026',
      type: 'PULSE',
      status: 'ACTIVE',
      responseCount: 142,
      eNpsScore: +68,
      createdAt: '2026-08-15',
    },
    {
      id: 'sv2',
      title: 'Workplace Flexibility & Remote Support Benchmark',
      code: 'REMOTE_BENCHMARK',
      type: 'ENPS',
      status: 'ACTIVE',
      responseCount: 98,
      eNpsScore: +74,
      createdAt: '2026-08-28',
    },
    {
      id: 'sv3',
      title: '2025 Annual Employee Engagement Audit',
      code: 'ANNUAL_2025',
      type: 'ANNUAL_SATISFACTION',
      status: 'CLOSED',
      responseCount: 215,
      eNpsScore: +62,
      createdAt: '2025-12-01',
    },
  ]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'PULSE' | 'ENPS' | 'CUSTOM' | 'ANNUAL_SATISFACTION'>('PULSE');

  const handleCreateSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCode) return;

    const created: SurveyCampaign = {
      id: `sv_${Date.now()}`,
      title: newTitle,
      code: newCode.toUpperCase(),
      type: newType,
      status: 'ACTIVE',
      responseCount: 0,
      eNpsScore: +50,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setSurveys([created, ...surveys]);
    setShowModal(false);
    setNewTitle('');
    setNewCode('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/feedback"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Anonymous Feedback Box &rarr;
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Employee Engagement & Pulse Surveys
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Measure employee sentiment, calculate eNPS scores, and run pulse feedback campaigns.
            </p>
          </div>
          <div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow"
            >
              + Launch Survey Campaign
            </button>
          </div>
        </div>

        {/* eNPS Dashboard Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Overall eNPS Score</div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              +71 <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
              ↑ 8 points vs previous quarter
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Promoters (9-10 Rating)</div>
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              76%
            </div>
            <div className="text-xs text-slate-400 mt-2">182 Active Advocates</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Passives (7-8 Rating)</div>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
              19%
            </div>
            <div className="text-xs text-slate-400 mt-2">45 Neutral Responses</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Detractors (0-6 Rating)</div>
            <div className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">
              5%
            </div>
            <div className="text-xs text-slate-400 mt-2">12 Actionable Inputs</div>
          </div>
        </div>
      </div>

      {/* Main Campaign Directory */}
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Active & Historical Survey Campaigns ({surveys.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {survey.type}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded font-bold ${
                      survey.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {survey.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {survey.title}
                </h3>
                <div className="text-xs text-slate-500 mb-4">
                  Code: <code className="font-semibold">{survey.code}</code>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-500">Responses:</span>{' '}
                  <strong className="text-slate-900 dark:text-white">{survey.responseCount}</strong>
                </div>
                <div>
                  <span className="text-slate-500">eNPS:</span>{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{survey.eNpsScore > 0 ? `+${survey.eNpsScore}` : survey.eNpsScore}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Launch Survey */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Launch Engagement Survey Campaign
            </h3>
            <form onSubmit={handleCreateSurvey} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Survey Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Q4 Leadership & Culture Pulse"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Campaign Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. PULSE_Q4"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Survey Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  >
                    <option value="PULSE">PULSE (Weekly/Monthly)</option>
                    <option value="ENPS">eNPS (NPS Benchmark)</option>
                    <option value="ANNUAL_SATISFACTION">ANNUAL SATISFACTION</option>
                    <option value="CUSTOM">CUSTOM</option>
                  </select>
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
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Publish Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
