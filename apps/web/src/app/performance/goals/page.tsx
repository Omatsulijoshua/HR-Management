'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface KeyResult {
  id: string;
  title: string;
  initialValue: number;
  currentValue: number;
  targetValue: number;
  unit: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'INDIVIDUAL' | 'DEPARTMENTAL' | 'ORGANIZATIONAL';
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'ON_TRACK' | 'AT_RISK' | 'COMPLETED';
  progressPercentage: number;
  targetDate: string;
  keyResults: KeyResult[];
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 'g1',
      title: 'Expand Multi-Tenant HCM Platform Scale',
      description: 'Scale active organization onboardings and reach 99.99% service uptime.',
      category: 'ORGANIZATIONAL',
      status: 'ON_TRACK',
      progressPercentage: 75,
      targetDate: '2026-12-31',
      keyResults: [
        { id: 'kr1', title: 'Onboard 50 new enterprise organizations', initialValue: 0, currentValue: 38, targetValue: 50, unit: 'orgs' },
        { id: 'kr2', title: 'Maintain platform API response time under 150ms', initialValue: 0, currentValue: 120, targetValue: 150, unit: 'ms' },
      ],
    },
    {
      id: 'g2',
      title: 'Engineering Q3 Feature Velocity & Test Coverage',
      description: 'Deliver core Phase 7-12 HCM modules with 100% Jest test suite pass rate.',
      category: 'DEPARTMENTAL',
      status: 'IN_PROGRESS',
      progressPercentage: 60,
      targetDate: '2026-10-31',
      keyResults: [
        { id: 'kr3', title: 'Achieve 95%+ unit test code coverage', initialValue: 50, currentValue: 85, targetValue: 95, unit: '%' },
      ],
    },
  ]);

  const [showGoalModal, setShowGoalModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'INDIVIDUAL' | 'DEPARTMENTAL' | 'ORGANIZATIONAL'>('INDIVIDUAL');
  const [newTargetDate, setNewTargetDate] = useState('');
  const [krTitle, setKrTitle] = useState('');
  const [krTarget, setKrTarget] = useState(100);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const created: Goal = {
      id: String(Date.now()),
      title: newTitle,
      description: newDesc,
      category: newCategory,
      status: 'IN_PROGRESS',
      progressPercentage: 0,
      targetDate: newTargetDate || '2026-12-31',
      keyResults: [
        {
          id: String(Date.now() + 1),
          title: krTitle || 'Complete primary deliverable',
          initialValue: 0,
          currentValue: 0,
          targetValue: Number(krTarget),
          unit: '%',
        },
      ],
    };

    setGoals([created, ...goals]);
    setShowGoalModal(false);
    setNewTitle('');
    setNewDesc('');
    setKrTitle('');
  };

  const handleUpdateKR = (goalId: string, krId: string, val: number) => {
    setGoals(
      goals.map((g) => {
        if (g.id !== goalId) return g;
        const updatedKrs = g.keyResults.map((kr) => (kr.id === krId ? { ...kr, currentValue: val } : kr));
        let total = 0;
        updatedKrs.forEach((kr) => {
          const range = kr.targetValue - kr.initialValue;
          const pct = range > 0 ? Math.min(100, Math.max(0, ((val - kr.initialValue) / range) * 100)) : 100;
          total += pct;
        });
        const overall = Math.round(total / updatedKrs.length);
        return {
          ...g,
          progressPercentage: overall,
          status: overall >= 100 ? 'COMPLETED' : overall >= 70 ? 'ON_TRACK' : 'IN_PROGRESS',
          keyResults: updatedKrs,
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Phase 9 — Performance & Goal Engine
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Objectives & Key Results (OKRs / KPIs)</h1>
            <p className="text-sm text-slate-500">Track strategic organizational goals, key performance indicators, and real-time milestone progress.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/performance/reviews"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-lg transition"
            >
              Performance Reviews Workbench →
            </Link>
            <button
              onClick={() => setShowGoalModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition"
            >
              + Create Objective Goal
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Objectives</span>
            <div className="text-2xl font-bold text-slate-900 mt-2">{goals.length} Strategic Goals</div>
            <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">Organizational & Individual</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Average Completion Rate</span>
            <div className="text-2xl font-bold text-indigo-600 mt-2">
              {Math.round(goals.reduce((acc, g) => acc + g.progressPercentage, 0) / goals.length)}%
            </div>
            <span className="text-xs text-slate-500 mt-1 inline-block">Weighted Key Result Progress</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Goals On-Track</span>
            <div className="text-2xl font-bold text-teal-600 mt-2">
              {goals.filter((g) => g.status === 'ON_TRACK' || g.status === 'COMPLETED').length} Goals
            </div>
            <span className="text-xs text-slate-500 mt-1 inline-block">Target Date: Q4 2026</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Key Results Tracked</span>
            <div className="text-2xl font-bold text-purple-600 mt-2">
              {goals.reduce((acc, g) => acc + g.keyResults.length, 0)} Key Metrics
            </div>
            <span className="text-xs text-slate-500 mt-1 inline-block">Quantitative Targets</span>
          </div>
        </div>

        {/* Objectives List */}
        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase">
                      {goal.category}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        goal.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : goal.status === 'ON_TRACK'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {goal.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">{goal.title}</h2>
                  <p className="text-sm text-slate-500 mt-1">{goal.description}</p>
                </div>

                <div className="md:text-right min-w-[160px]">
                  <span className="text-xs text-slate-400 font-medium">Overall Progress</span>
                  <div className="text-3xl font-extrabold text-indigo-600 font-mono mt-0.5">
                    {goal.progressPercentage}%
                  </div>
                  <span className="text-xs text-slate-400">Target Date: {goal.targetDate}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${goal.progressPercentage}%` }}
                ></div>
              </div>

              {/* Key Results */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Key Results & Metric Targets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {goal.keyResults.map((kr) => (
                    <div key={kr.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200/60 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">{kr.title}</div>
                        <div className="text-slate-500 mt-1 font-mono">
                          Target: {kr.targetValue} {kr.unit} | Current: {kr.currentValue} {kr.unit}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={kr.currentValue}
                          onChange={(e) => handleUpdateKR(goal.id, kr.id, Number(e.target.value))}
                          className="w-20 px-2 py-1 border border-slate-300 rounded font-mono text-center text-sm font-semibold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Create Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create Strategic Objective (OKR)</h3>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Objective Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Increase Engineering Delivery Velocity"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  placeholder="Summary of strategic goal..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm h-20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="INDIVIDUAL">INDIVIDUAL</option>
                  <option value="DEPARTMENTAL">DEPARTMENTAL</option>
                  <option value="ORGANIZATIONAL">ORGANIZATIONAL</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Target Date</label>
                <input
                  type="date"
                  required
                  value={newTargetDate}
                  onChange={(e) => setNewTargetDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Primary Key Result Title</label>
                <input
                  type="text"
                  placeholder="e.g. Complete 100% of Phase 9 deliverables"
                  value={krTitle}
                  onChange={(e) => setKrTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
