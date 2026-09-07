'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Option {
  id: string;
  name: string;
  tier: string;
  empCost: number;
  emprCost: number;
}

interface Plan {
  id: string;
  name: string;
  code: string;
  type: string;
  provider: string;
  options: Option[];
}

interface Enrollment {
  id: string;
  employeeName: string;
  planName: string;
  tierName: string;
  empCost: number;
  emprCost: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  effectiveFrom: string;
}

export default function BenefitsPage() {
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 'p1',
      name: 'AXA Mansard HMO Executive Plan',
      code: 'AXA_EXEC',
      type: 'HEALTH_INSURANCE',
      provider: 'AXA Mansard Health Ltd',
      options: [
        { id: 'o1', name: 'Individual Cover', tier: 'Single', empCost: 5000, emprCost: 25000 },
        { id: 'o2', name: 'Family Comprehensive Cover', tier: 'Family (Spouse + 3 Kids)', empCost: 15000, emprCost: 65000 },
      ],
    },
    {
      id: 'p2',
      name: 'Stanbic IBTC Pension RSA Co-Contribution',
      code: 'PENSION_STANBIC',
      type: 'RETIREMENT_SAVINGS',
      provider: 'Stanbic IBTC Pension Managers',
      options: [
        { id: 'o3', name: 'Standard Statutory Split (8% Employee / 10% Employer)', tier: 'Standard', empCost: 12000, emprCost: 15000 },
      ],
    },
    {
      id: 'p3',
      name: 'Leadway Group Life & Disability Cover',
      code: 'GROUP_LIFE',
      type: 'LIFE_INSURANCE',
      provider: 'Leadway Assurance Co.',
      options: [
        { id: 'o4', name: '3x Annual Basic Cover', tier: 'Full Coverage', empCost: 0, emprCost: 35000 },
      ],
    },
  ]);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([
    {
      id: 'e1',
      employeeName: 'Omatsuli Joshua',
      planName: 'AXA Mansard HMO Executive Plan',
      tierName: 'Family Comprehensive Cover',
      empCost: 15000,
      emprCost: 65000,
      status: 'APPROVED',
      effectiveFrom: '2026-09-01',
    },
    {
      id: 'e2',
      employeeName: 'Amina Bello',
      planName: 'Leadway Group Life & Disability Cover',
      tierName: '3x Annual Basic Cover',
      empCost: 0,
      emprCost: 35000,
      status: 'PENDING',
      effectiveFrom: '2026-10-01',
    },
  ]);

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  // Form states
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanCode, setNewPlanCode] = useState('');
  const [newPlanProvider, setNewPlanProvider] = useState('');
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionEmp, setNewOptionEmp] = useState(0);
  const [newOptionEmpr, setNewOptionEmpr] = useState(0);

  const [selectedPlanId, setSelectedPlanId] = useState('p1');
  const [enrollEmpName, setEnrollEmpName] = useState('');

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName || !newPlanCode) return;

    const created: Plan = {
      id: String(Date.now()),
      name: newPlanName,
      code: newPlanCode.toUpperCase(),
      type: 'HEALTH_INSURANCE',
      provider: newPlanProvider || 'Corporate Health Ltd',
      options: [
        {
          id: String(Date.now() + 1),
          name: newOptionName || 'Standard Tier',
          tier: 'Standard',
          empCost: Number(newOptionEmp),
          emprCost: Number(newOptionEmpr),
        },
      ],
    };

    setPlans([...plans, created]);
    setShowPlanModal(false);
    setNewPlanName('');
    setNewPlanCode('');
    setNewPlanProvider('');
  };

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollEmpName) return;
    const plan = plans.find((p) => p.id === selectedPlanId);
    const option = plan?.options[0];

    const newEnrollment: Enrollment = {
      id: String(Date.now()),
      employeeName: enrollEmpName,
      planName: plan ? plan.name : 'Health Insurance Plan',
      tierName: option ? option.name : 'Standard Cover',
      empCost: option ? option.empCost : 5000,
      emprCost: option ? option.emprCost : 25000,
      status: 'PENDING',
      effectiveFrom: new Date().toISOString().split('T')[0],
    };

    setEnrollments([newEnrollment, ...enrollments]);
    setShowEnrollModal(false);
    setEnrollEmpName('');
  };

  const handleApproveEnrollment = (id: string) => {
    setEnrollments(enrollments.map((e) => (e.id === id ? { ...e, status: 'APPROVED' } : e)));
  };

  const handleRejectEnrollment = (id: string) => {
    setEnrollments(enrollments.map((e) => (e.id === id ? { ...e, status: 'REJECTED' } : e)));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Phase 8 — Benefits Administration
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Employee Benefits & Health Plans</h1>
            <p className="text-sm text-slate-500">Corporate benefit packages, coverage options, employee enrollment, and employer co-contribution tracking.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEnrollModal(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-lg transition"
            >
              + Enroll Employee
            </button>
            <button
              onClick={() => setShowPlanModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition"
            >
              + Create Benefit Plan
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Metric Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Benefit Plans</span>
            <div className="text-2xl font-bold text-slate-900 mt-2">{plans.length} Corporate Plans</div>
            <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">HMO, Life, Pension & Wellness</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Enrolled Employees</span>
            <div className="text-2xl font-bold text-indigo-600 mt-2">42 Employees</div>
            <span className="text-xs text-slate-500 mt-1 inline-block">100% Employee Coverage</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Monthly Employer Subsidy</span>
            <div className="text-2xl font-bold text-teal-600 mt-2">₦5,200,000.00</div>
            <span className="text-xs text-slate-500 mt-1 inline-block">80% Employer Subsidy Rate</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Enrollments</span>
            <div className="text-2xl font-bold text-amber-600 mt-2">
              {enrollments.filter((e) => e.status === 'PENDING').length} Pending Approval
            </div>
            <span className="text-xs text-slate-500 mt-1 inline-block">Requires HR Verification</span>
          </div>
        </div>

        {/* SECTION 1: Corporate Benefit Plans Catalog */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Corporate Benefit Packages & Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase">
                      {plan.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mt-3">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">Provider: {plan.provider}</p>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">Code: {plan.code}</p>

                  <div className="mt-6 space-y-3">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Coverage Tiers</span>
                    {plan.options.map((opt) => (
                      <div key={opt.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                        <div className="font-semibold text-slate-800">{opt.name} ({opt.tier})</div>
                        <div className="flex justify-between text-slate-500 mt-1.5 pt-1.5 border-t border-slate-200/60">
                          <span>Emp: ₦{opt.empCost.toLocaleString()}</span>
                          <span className="font-semibold text-emerald-700">Company: ₦{opt.emprCost.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlanId(plan.id);
                    setShowEnrollModal(true);
                  }}
                  className="mt-6 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition"
                >
                  Enroll Staff in Plan
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: Employee Benefit Enrollments Table */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Employee Benefit Enrollments</h2>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Employee Name</th>
                <th className="px-6 py-3">Benefit Plan</th>
                <th className="px-6 py-3">Coverage Tier</th>
                <th className="px-6 py-3">Employee Cost</th>
                <th className="px-6 py-3">Employer Subsidy</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {enrollments.map((enr) => (
                <tr key={enr.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900">{enr.employeeName}</td>
                  <td className="px-6 py-4">{enr.planName}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-700">{enr.tierName}</td>
                  <td className="px-6 py-4 font-mono">₦{enr.empCost.toLocaleString()}/mo</td>
                  <td className="px-6 py-4 font-mono text-emerald-700 font-semibold">₦{enr.emprCost.toLocaleString()}/mo</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        enr.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : enr.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {enr.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {enr.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleApproveEnrollment(enr.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectEnrollment(enr.id)}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {enr.status !== 'PENDING' && (
                      <span className="text-xs text-slate-400 font-medium">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* Create Benefit Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create Corporate Benefit Plan</h3>
            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Plan Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liberty Dental & Optical Plan"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Plan Code</label>
                <input
                  type="text"
                  required
                  placeholder="DENTAL_OPTICAL"
                  value={newPlanCode}
                  onChange={(e) => setNewPlanCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Provider Name</label>
                <input
                  type="text"
                  placeholder="Liberty Health Insurance"
                  value={newPlanProvider}
                  onChange={(e) => setNewPlanProvider(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Coverage Tier Name</label>
                <input
                  type="text"
                  placeholder="Comprehensive Cover"
                  value={newOptionName}
                  onChange={(e) => setNewOptionName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Emp Cost (₦)</label>
                  <input
                    type="number"
                    value={newOptionEmp}
                    onChange={(e) => setNewOptionEmp(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Company Subsidy (₦)</label>
                  <input
                    type="number"
                    value={newOptionEmpr}
                    onChange={(e) => setNewOptionEmpr(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enroll Employee Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Enroll Employee in Benefit Plan</h3>
            <form onSubmit={handleEnroll} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Select Benefit Plan</label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Employee Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Babatunde Raji"
                  value={enrollEmpName}
                  onChange={(e) => setEnrollEmpName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg"
                >
                  Submit Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
