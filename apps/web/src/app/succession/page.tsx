'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface SuccessionCandidateItem {
  id: string;
  name: string;
  currentRole: string;
  readinessLevel: 'READY_NOW' | 'READY_1_2_YEARS' | 'READY_3_PLUS_YEARS' | 'EMERGENCY_BACKUP';
  performanceRating: number;
}

interface SuccessionPlanItem {
  id: string;
  positionTitle: string;
  department: string;
  incumbentName: string;
  riskOfLoss: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  impactOfLoss: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  candidates: SuccessionCandidateItem[];
}

export default function SuccessionPage() {
  const [plans, setPlans] = useState<SuccessionPlanItem[]>([
    {
      id: 'sp1',
      positionTitle: 'Chief Technology Officer (CTO)',
      department: 'Executive Leadership',
      incumbentName: 'Dr. Chidi Nnamdi',
      riskOfLoss: 'MEDIUM',
      impactOfLoss: 'CRITICAL',
      candidates: [
        {
          id: 'sc1',
          name: 'Omatsuli Joshua',
          currentRole: 'Principal Systems Architect',
          readinessLevel: 'READY_NOW',
          performanceRating: 4.8,
        },
        {
          id: 'sc2',
          name: 'Amina Bello',
          currentRole: 'VP of Engineering',
          readinessLevel: 'READY_1_2_YEARS',
          performanceRating: 4.5,
        },
      ],
    },
    {
      id: 'sp2',
      positionTitle: 'Head of Global Talent Acquisition',
      department: 'Human Resources',
      incumbentName: 'Sarah Jenkins',
      riskOfLoss: 'HIGH',
      impactOfLoss: 'HIGH',
      candidates: [
        {
          id: 'sc3',
          name: 'David Chen',
          currentRole: 'Lead Recruitment Manager',
          readinessLevel: 'READY_NOW',
          performanceRating: 4.6,
        },
      ],
    },
  ]);

  // Modal State
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);

  const [selectedPlanId, setSelectedPlanId] = useState<string>('sp1');

  // New Plan Form
  const [newPosition, setNewPosition] = useState('');
  const [newDept, setNewDept] = useState('');
  const [newIncumbent, setNewIncumbent] = useState('');
  const [newRisk, setNewRisk] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [newImpact, setNewImpact] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');

  // New Candidate Form
  const [candName, setCandName] = useState('');
  const [candRole, setCandRole] = useState('');
  const [candReadiness, setCandReadiness] = useState<'READY_NOW' | 'READY_1_2_YEARS' | 'READY_3_PLUS_YEARS' | 'EMERGENCY_BACKUP'>('READY_1_2_YEARS');

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosition) return;

    const created: SuccessionPlanItem = {
      id: `sp_${Date.now()}`,
      positionTitle: newPosition,
      department: newDept || 'General Management',
      incumbentName: newIncumbent || 'Vacant / Unassigned',
      riskOfLoss: newRisk,
      impactOfLoss: newImpact,
      candidates: [],
    };

    setPlans([...plans, created]);
    setShowPlanModal(false);
    setNewPosition('');
    setNewDept('');
    setNewIncumbent('');
  };

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candName || !candRole) return;

    const newCand: SuccessionCandidateItem = {
      id: `sc_${Date.now()}`,
      name: candName,
      currentRole: candRole,
      readinessLevel: candReadiness,
      performanceRating: 4.2,
    };

    setPlans(
      plans.map((p) =>
        p.id === selectedPlanId
          ? { ...p, candidates: [...p.candidates, newCand] }
          : p
      )
    );

    setShowCandidateModal(false);
    setCandName('');
    setCandRole('');
  };

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'READY_NOW':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'READY_1_2_YEARS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'READY_3_PLUS_YEARS':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      default:
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
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
                href="/mobility"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Internal Mobility &rarr;
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Succession Planning & Talent Pools
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Identify key position risks, build readiness pipelines, and maintain talent continuity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPlanModal(true)}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow"
            >
              + Add Key Role Plan
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto space-y-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
          >
            {/* Header section */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {plan.department}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Incumbent: <strong className="text-slate-900 dark:text-white">{plan.incumbentName}</strong>
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {plan.positionTitle}
                </h3>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs text-slate-500">Risk of Loss</div>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                    plan.riskOfLoss === 'CRITICAL' || plan.riskOfLoss === 'HIGH'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {plan.riskOfLoss}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Impact of Loss</div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    {plan.impactOfLoss}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedPlanId(plan.id);
                    setShowCandidateModal(true);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  + Add Successor
                </button>
              </div>
            </div>

            {/* Successor Candidates List */}
            <div className="p-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Designated Successor Bench ({plan.candidates.length})
              </h4>
              {plan.candidates.length === 0 ? (
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-sm">
                  ⚠️ No successor candidates currently mapped for this position. High talent risk exposure.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plan.candidates.map((cand) => (
                    <div
                      key={cand.id}
                      className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {cand.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {cand.currentRole}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-xs px-2.5 py-1 rounded font-bold ${getBadgeColor(cand.readinessLevel)}`}>
                          {cand.readinessLevel.replace(/_/g, ' ')}
                        </span>
                        <div className="text-xs text-slate-400 font-medium mt-1">
                          Score: ⭐ {cand.performanceRating}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Succession Plan */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Create Key Position Succession Plan
            </h3>
            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Position Title
                </label>
                <input
                  type="text"
                  required
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  placeholder="e.g. VP of Product Operations"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    placeholder="e.g. Product"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Current Incumbent
                  </label>
                  <input
                    type="text"
                    value={newIncumbent}
                    onChange={(e) => setNewIncumbent(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Risk of Loss
                  </label>
                  <select
                    value={newRisk}
                    onChange={(e) => setNewRisk(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Impact of Loss
                  </label>
                  <select
                    value={newImpact}
                    onChange={(e) => setNewImpact(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Save Succession Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Successor Candidate */}
      {showCandidateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Add Successor Candidate
            </h3>
            <form onSubmit={handleAddCandidate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Candidate Name
                </label>
                <input
                  type="text"
                  required
                  value={candName}
                  onChange={(e) => setCandName(e.target.value)}
                  placeholder="e.g. Omatsuli Joshua"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Current Role
                </label>
                <input
                  type="text"
                  required
                  value={candRole}
                  onChange={(e) => setCandRole(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Readiness Horizon
                </label>
                <select
                  value={candReadiness}
                  onChange={(e) => setCandReadiness(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                >
                  <option value="READY_NOW">READY NOW (Immediate)</option>
                  <option value="READY_1_2_YEARS">READY IN 1-2 YEARS</option>
                  <option value="READY_3_PLUS_YEARS">READY IN 3+ YEARS</option>
                  <option value="EMERGENCY_BACKUP">EMERGENCY BACKUP ONLY</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCandidateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                >
                  Save Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
