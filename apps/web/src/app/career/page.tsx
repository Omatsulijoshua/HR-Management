'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface CareerLadderLevel {
  level: number;
  title: string;
  grade: string;
  minYearsExp: number;
  keyCompetencies: string[];
}

interface CareerPathItem {
  id: string;
  title: string;
  code: string;
  department: string;
  description: string;
  levels: CareerLadderLevel[];
}

export default function CareerPage() {
  const [careerPaths, setCareerPaths] = useState<CareerPathItem[]>([
    {
      id: 'cp1',
      title: 'Engineering & Technology Track',
      code: 'ENG_TRACK',
      department: 'Software Engineering',
      description: 'Technical progression ladder from Associate Engineer to Principal Architect.',
      levels: [
        {
          level: 1,
          title: 'Associate Software Engineer',
          grade: 'L1',
          minYearsExp: 0,
          keyCompetencies: ['Git Workflows', 'Basic TypeScript', 'Unit Testing'],
        },
        {
          level: 2,
          title: 'Software Engineer II',
          grade: 'L2',
          minYearsExp: 2,
          keyCompetencies: ['NestJS Backend', 'PostgreSQL Schema Design', 'REST APIs'],
        },
        {
          level: 3,
          title: 'Senior Software Engineer',
          grade: 'L3',
          minYearsExp: 5,
          keyCompetencies: ['Distributed Systems', 'System Architecture', 'Peer Mentorship'],
        },
        {
          level: 4,
          title: 'Principal Architect',
          grade: 'L4',
          minYearsExp: 8,
          keyCompetencies: ['Multi-Tenant Infrastructure', 'Security Governance', 'Tech Strategy'],
        },
      ],
    },
    {
      id: 'cp2',
      title: 'People & HR Leadership Track',
      code: 'HR_TRACK',
      department: 'Human Resources',
      description: 'Career progression path for Talent Acquisition, Compensation, and HR Business Partners.',
      levels: [
        {
          level: 1,
          title: 'HR Operations Officer',
          grade: 'P1',
          minYearsExp: 1,
          keyCompetencies: ['Employee Onboarding', 'Records Compliance', 'Leave Management'],
        },
        {
          level: 2,
          title: 'Senior HR Business Partner',
          grade: 'P2',
          minYearsExp: 4,
          keyCompetencies: ['Performance Management', 'Employee Relations', 'Comp & Benefits'],
        },
        {
          level: 3,
          title: 'Head of People Operations',
          grade: 'P3',
          minYearsExp: 7,
          keyCompetencies: ['Strategic Workforce Planning', 'Organizational Design', 'Executive Coaching'],
        },
      ],
    },
  ]);

  const [selectedPath, setSelectedPath] = useState<CareerPathItem>(careerPaths[0]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreatePath = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCode) return;

    const newPath: CareerPathItem = {
      id: `cp_${Date.now()}`,
      title: newTitle,
      code: newCode.toUpperCase(),
      department: newDepartment || 'General Operations',
      description: newDesc || 'Standard career ladder track.',
      levels: [
        {
          level: 1,
          title: `${newTitle} Specialist I`,
          grade: 'L1',
          minYearsExp: 1,
          keyCompetencies: ['Core Domain Knowledge', 'Team Collaboration'],
        },
        {
          level: 2,
          title: `Senior ${newTitle} Specialist`,
          grade: 'L2',
          minYearsExp: 4,
          keyCompetencies: ['Advanced Strategy', 'Leadership'],
        },
      ],
    };

    setCareerPaths([...careerPaths, newPath]);
    setSelectedPath(newPath);
    setShowModal(false);
    setNewTitle('');
    setNewCode('');
    setNewDepartment('');
    setNewDesc('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/succession"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Succession Planning &rarr;
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Career Pathways & Progression Matrix
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Define structured career progression ladders, level expectations, and competency criteria.
            </p>
          </div>
          <div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow"
            >
              + Create Career Pathway
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar: Tracks List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Available Career Pathways ({careerPaths.length})
          </h2>
          {careerPaths.map((path) => (
            <div
              key={path.id}
              onClick={() => setSelectedPath(path)}
              className={`p-5 rounded-xl border transition-all cursor-pointer ${
                selectedPath.id === path.id
                  ? 'bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 shadow-md ring-2 ring-indigo-600/20'
                  : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {path.code}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {path.levels.length} Levels Defined
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mt-1">
                {path.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {path.description}
              </p>
            </div>
          ))}
        </div>

        {/* Right Area: Selected Track Progression Map */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase">Department: {selectedPath.department}</span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {selectedPath.title}
                </h2>
              </div>
              <span className="px-3 py-1 text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full">
                Active Ladder
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {selectedPath.description}
            </p>
          </div>

          {/* Vertical Stepper Progression */}
          <div className="relative pl-6 border-l-2 border-indigo-200 dark:border-indigo-900 space-y-8 my-4">
            {selectedPath.levels.map((lvl) => (
              <div key={lvl.level} className="relative">
                {/* Stepper Dot */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-800" />

                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900">
                        {lvl.grade}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {lvl.title}
                      </h4>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      Min {lvl.minYearsExp} Yrs Exp
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs font-semibold text-slate-500 mb-1.5">Key Required Competencies</div>
                    <div className="flex flex-wrap gap-2">
                      {lvl.keyCompetencies.map((comp, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                        >
                          ✓ {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Create Career Pathway */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Create Career Pathway
            </h3>
            <form onSubmit={handleCreatePath} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Track Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Cloud Infrastructure Track"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Track Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. CLOUD_TRACK"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder="e.g. DevOps"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Track description & progression details..."
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
                  Save Pathway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
