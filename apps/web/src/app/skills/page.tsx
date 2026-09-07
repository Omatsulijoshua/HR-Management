'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface SkillItem {
  id: string;
  name: string;
  category: string;
  description: string;
  employeesCount: number;
}

interface EmployeeSkillRecord {
  id: string;
  employeeName: string;
  skillName: string;
  proficiencyLevel: 'NOVICE' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsExperience: number;
  isVerified: boolean;
}

interface PositionRequirement {
  id: string;
  positionTitle: string;
  skillName: string;
  requiredLevel: 'NOVICE' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  isMandatory: boolean;
}

export default function SkillsPage() {
  const [activeTab, setActiveTab] = useState<'taxonomy' | 'employee' | 'gap'>('taxonomy');

  const [skills, setSkills] = useState<SkillItem[]>([
    {
      id: 'sk1',
      name: 'TypeScript & Node.js Architecture',
      category: 'Software Engineering',
      description: 'Designing modular, type-safe enterprise microservices with NestJS and Node.js.',
      employeesCount: 14,
    },
    {
      id: 'sk2',
      name: 'PostgreSQL Database Optimization',
      category: 'Database Administration',
      description: 'Query tuning, index strategies, partition management, and schema migrations.',
      employeesCount: 8,
    },
    {
      id: 'sk3',
      name: 'Cloud Security & Compliance (AWS)',
      category: 'DevOps & Security',
      description: 'IAM policy setup, VPC peering, KMS encryption, and SOC2/GDPR compliance.',
      employeesCount: 5,
    },
    {
      id: 'sk4',
      name: 'Strategic Talent Acquisition',
      category: 'Human Resources',
      description: 'Executive hiring, candidate pipeline management, and behavioral assessment.',
      employeesCount: 6,
    },
  ]);

  const [employeeSkills, setEmployeeSkills] = useState<EmployeeSkillRecord[]>([
    {
      id: 'es1',
      employeeName: 'Omatsuli Joshua',
      skillName: 'TypeScript & Node.js Architecture',
      proficiencyLevel: 'EXPERT',
      yearsExperience: 6,
      isVerified: true,
    },
    {
      id: 'es2',
      employeeName: 'Amina Bello',
      skillName: 'Cloud Security & Compliance (AWS)',
      proficiencyLevel: 'ADVANCED',
      yearsExperience: 4,
      isVerified: true,
    },
    {
      id: 'es3',
      employeeName: 'David Chen',
      skillName: 'PostgreSQL Database Optimization',
      proficiencyLevel: 'INTERMEDIATE',
      yearsExperience: 2,
      isVerified: false,
    },
  ]);

  const [positionRequirements, setPositionRequirements] = useState<PositionRequirement[]>([
    {
      id: 'pr1',
      positionTitle: 'Senior Backend Engineer',
      skillName: 'TypeScript & Node.js Architecture',
      requiredLevel: 'EXPERT',
      isMandatory: true,
    },
    {
      id: 'pr2',
      positionTitle: 'Senior Backend Engineer',
      skillName: 'PostgreSQL Database Optimization',
      requiredLevel: 'ADVANCED',
      isMandatory: true,
    },
    {
      id: 'pr3',
      positionTitle: 'DevOps & Security Lead',
      skillName: 'Cloud Security & Compliance (AWS)',
      requiredLevel: 'EXPERT',
      isMandatory: true,
    },
  ]);

  // Modal states
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // New Skill Form
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [newSkillDesc, setNewSkillDesc] = useState('');

  // Assign Skill Form
  const [assignEmployee, setAssignEmployee] = useState('');
  const [assignSkill, setAssignSkill] = useState('');
  const [assignLevel, setAssignLevel] = useState<'NOVICE' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>('INTERMEDIATE');
  const [assignYears, setAssignYears] = useState(3);

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName || !newSkillCategory) return;

    const newEntry: SkillItem = {
      id: `sk_${Date.now()}`,
      name: newSkillName,
      category: newSkillCategory,
      description: newSkillDesc || 'No description provided.',
      employeesCount: 0,
    };

    setSkills([...skills, newEntry]);
    setShowSkillModal(false);
    setNewSkillName('');
    setNewSkillCategory('');
    setNewSkillDesc('');
  };

  const handleAssignSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignEmployee || !assignSkill) return;

    const newRecord: EmployeeSkillRecord = {
      id: `es_${Date.now()}`,
      employeeName: assignEmployee,
      skillName: assignSkill,
      proficiencyLevel: assignLevel,
      yearsExperience: Number(assignYears),
      isVerified: true,
    };

    setEmployeeSkills([newRecord, ...employeeSkills]);
    setShowAssignModal(false);
    setAssignEmployee('');
    setAssignSkill('');
  };

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'EXPERT':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'ADVANCED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'INTERMEDIATE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
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
                href="/training"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                &larr; Training & L&D Portal
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Skills Inventory & Competency Matrix
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage workforce skill taxonomies, employee competency proficiencies, and position gap analyses.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSkillModal(true)}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow"
            >
              + Add New Skill
            </button>
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow"
            >
              + Record Skill Assessment
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mt-8 gap-8">
          <button
            onClick={() => setActiveTab('taxonomy')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'taxonomy'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Skills Taxonomy Directory ({skills.length})
          </button>
          <button
            onClick={() => setActiveTab('employee')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'employee'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Employee Skill Competencies ({employeeSkills.length})
          </button>
          <button
            onClick={() => setActiveTab('gap')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'gap'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Position Skill Gap Analyzer
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto">
        {/* TAB 1: Skills Taxonomy */}
        {activeTab === 'taxonomy' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {skill.category}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {skill.employeesCount} Employees Qualified
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {skill.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {skill.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center text-xs text-slate-500">
                  <span>Category ID: {skill.id}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer">
                    View Matrix &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: Employee Competencies */}
        {activeTab === 'employee' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Verified Workforce Skills & Proficiency Matrix
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Individual skill ratings evaluated through peer review, certifications, and technical assessments.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/50 uppercase text-xs text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Skill Name</th>
                    <th className="px-6 py-4">Proficiency Level</th>
                    <th className="px-6 py-4">Experience</th>
                    <th className="px-6 py-4">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {employeeSkills.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                        {rec.employeeName}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                        {rec.skillName}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded font-bold ${getLevelBadgeClass(
                            rec.proficiencyLevel
                          )}`}
                        >
                          {rec.proficiencyLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4">{rec.yearsExperience} Years</td>
                      <td className="px-6 py-4">
                        {rec.isVerified ? (
                          <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 gap-1">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="text-xs text-amber-600 dark:text-amber-400">
                            Self-Reported
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Skill Gap Analyzer */}
        {activeTab === 'gap' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Organizational Skill Gap Analysis
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Compare job position skill requirements against existing team proficiency levels to identify training needs.
            </p>

            <div className="space-y-4">
              {positionRequirements.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {req.positionTitle}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold">
                        Mandatory
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Required Skill:{' '}
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {req.skillName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-xs text-slate-500">Target Benchmark</div>
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        {req.requiredLevel}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Current Coverage</div>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        85% Ready
                      </span>
                    </div>
                    <button className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50">
                      Auto-Assign Course &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Create Skill */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Add Skill to Taxonomy
            </h3>
            <form onSubmit={handleCreateSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Kubernetes Cluster Security"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Skill Category
                </label>
                <input
                  type="text"
                  required
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  placeholder="e.g. DevOps & Cloud"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newSkillDesc}
                  onChange={(e) => setNewSkillDesc(e.target.value)}
                  placeholder="Competency description..."
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Create Skill Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Assessment */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Record Skill Assessment
            </h3>
            <form onSubmit={handleAssignSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Employee Name
                </label>
                <input
                  type="text"
                  required
                  value={assignEmployee}
                  onChange={(e) => setAssignEmployee(e.target.value)}
                  placeholder="e.g. Omatsuli Joshua"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Skill Title
                </label>
                <select
                  value={assignSkill}
                  onChange={(e) => setAssignSkill(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                >
                  <option value="">Select Skill</option>
                  {skills.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Proficiency Level
                  </label>
                  <select
                    value={assignLevel}
                    onChange={(e) => setAssignLevel(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  >
                    <option value="NOVICE">NOVICE</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                    <option value="EXPERT">EXPERT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    value={assignYears}
                    onChange={(e) => setAssignYears(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                >
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
