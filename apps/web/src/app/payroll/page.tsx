'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Component {
  id: string;
  name: string;
  code: string;
  type: 'EARNING' | 'DEDUCTION';
  calculationType: 'FIXED' | 'PERCENTAGE_OF_BASIC';
  defaultAmount: number;
  isTaxable: boolean;
  isStatutory: boolean;
}

interface Period {
  id: string;
  name: string;
  frequency: string;
  startDate: string;
  endDate: string;
  payDate: string;
  isClosed: boolean;
}

interface PayrollRun {
  id: string;
  periodName: string;
  status: 'DRAFT' | 'PROCESSING' | 'APPROVED' | 'DISBURSED';
  totalEmployees: number;
  totalGross: number;
  totalTax: number;
  totalPension: number;
  totalNet: number;
  processedAt: string;
}

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState<'runs' | 'components' | 'structures' | 'periods'>('runs');
  const [showRunModal, setShowRunModal] = useState(false);
  const [showComponentModal, setShowComponentModal] = useState(false);
  const [showPeriodModal, setShowPeriodModal] = useState(false);

  // Sample State Data
  const [components, setComponents] = useState<Component[]>([
    { id: '1', name: 'Basic Salary', code: 'BASIC', type: 'EARNING', calculationType: 'FIXED', defaultAmount: 150000, isTaxable: true, isStatutory: false },
    { id: '2', name: 'Housing Allowance', code: 'HOUSING', type: 'EARNING', calculationType: 'FIXED', defaultAmount: 50000, isTaxable: true, isStatutory: false },
    { id: '3', name: 'Transport Allowance', code: 'TRANSPORT', type: 'EARNING', calculationType: 'FIXED', defaultAmount: 30000, isTaxable: true, isStatutory: false },
    { id: '4', name: 'Pension (Employee 8%)', code: 'PENSION_EMP', type: 'DEDUCTION', calculationType: 'PERCENTAGE_OF_BASIC', defaultAmount: 12000, isTaxable: false, isStatutory: true },
    { id: '5', name: 'PAYE Tax (10%)', code: 'PAYE_TAX', type: 'DEDUCTION', calculationType: 'PERCENTAGE_OF_BASIC', defaultAmount: 21800, isTaxable: false, isStatutory: true },
  ]);

  const [periods, setPeriods] = useState<Period[]>([
    { id: 'p1', name: 'September 2026 Payroll', frequency: 'MONTHLY', startDate: '2026-09-01', endDate: '2026-09-30', payDate: '2026-09-25', isClosed: false },
    { id: 'p2', name: 'August 2026 Payroll', frequency: 'MONTHLY', startDate: '2026-08-01', endDate: '2026-08-31', payDate: '2026-08-25', isClosed: true },
  ]);

  const [runs, setRuns] = useState<PayrollRun[]>([
    {
      id: 'run-1',
      periodName: 'September 2026 Payroll',
      status: 'DRAFT',
      totalEmployees: 42,
      totalGross: 9660000,
      totalTax: 887200,
      totalPension: 772800,
      totalNet: 8000000,
      processedAt: '2026-09-07',
    },
    {
      id: 'run-2',
      periodName: 'August 2026 Payroll',
      status: 'DISBURSED',
      totalEmployees: 40,
      totalGross: 9200000,
      totalTax: 845000,
      totalPension: 736000,
      totalNet: 7619000,
      processedAt: '2026-08-25',
    },
  ]);

  // Form States
  const [newComponentName, setNewComponentName] = useState('');
  const [newComponentCode, setNewComponentCode] = useState('');
  const [newComponentType, setNewComponentType] = useState<'EARNING' | 'DEDUCTION'>('EARNING');
  const [newComponentAmount, setNewComponentAmount] = useState(0);

  const [newPeriodName, setNewPeriodName] = useState('');
  const [newPeriodStart, setNewPeriodStart] = useState('');
  const [newPeriodEnd, setNewPeriodEnd] = useState('');
  const [newPeriodPayDate, setNewPeriodPayDate] = useState('');

  const [selectedPeriodId, setSelectedPeriodId] = useState('p1');

  const handleCreateComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComponentName || !newComponentCode) return;
    const created: Component = {
      id: String(Date.now()),
      name: newComponentName,
      code: newComponentCode.toUpperCase(),
      type: newComponentType,
      calculationType: 'FIXED',
      defaultAmount: Number(newComponentAmount),
      isTaxable: true,
      isStatutory: false,
    };
    setComponents([...components, created]);
    setShowComponentModal(false);
    setNewComponentName('');
    setNewComponentCode('');
    setNewComponentAmount(0);
  };

  const handleCreatePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPeriodName || !newPeriodStart || !newPeriodEnd) return;
    const created: Period = {
      id: String(Date.now()),
      name: newPeriodName,
      frequency: 'MONTHLY',
      startDate: newPeriodStart,
      endDate: newPeriodEnd,
      payDate: newPeriodPayDate || newPeriodEnd,
      isClosed: false,
    };
    setPeriods([created, ...periods]);
    setShowPeriodModal(false);
    setNewPeriodName('');
  };

  const handleRunPayroll = () => {
    const selected = periods.find((p) => p.id === selectedPeriodId);
    const newRun: PayrollRun = {
      id: String(Date.now()),
      periodName: selected ? selected.name : 'Custom Period',
      status: 'DRAFT',
      totalEmployees: 42,
      totalGross: 9660000,
      totalTax: 887200,
      totalPension: 772800,
      totalNet: 8000000,
      processedAt: new Date().toISOString().split('T')[0],
    };
    setRuns([newRun, ...runs]);
    setShowRunModal(false);
  };

  const handleApproveRun = (id: string) => {
    setRuns(runs.map((r) => (r.id === id ? { ...r, status: 'APPROVED' } : r)));
  };

  const handleDisburseRun = (id: string) => {
    setRuns(runs.map((r) => (r.id === id ? { ...r, status: 'DISBURSED' } : r)));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                Phase 7 — Multi-Tenant HCM Engine
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Payroll & Compensation Management</h1>
            <p className="text-sm text-slate-500">Automated gross-to-net pay calculation, salary structures, tax & pension compliance, and payslips.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/payslips"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-lg transition"
            >
              Employee Payslips Portal →
            </Link>
            <button
              onClick={() => setShowRunModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition"
            >
              + Execute Payroll Run
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Monthly Payroll</span>
            <div className="text-2xl font-bold text-slate-900 mt-2">₦9,660,000.00</div>
            <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">↑ 5.0% vs last month</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Net Employee Disbursements</span>
            <div className="text-2xl font-bold text-indigo-600 mt-2">₦8,000,000.00</div>
            <span className="text-xs text-slate-500 mt-1 inline-block">42 Active Employees</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Statutory PAYE Tax</span>
            <div className="text-2xl font-bold text-amber-600 mt-2">₦887,200.00</div>
            <span className="text-xs text-slate-500 mt-1 inline-block">10% PAYE Tax Deduction</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Statutory Pension (8%)</span>
            <div className="text-2xl font-bold text-teal-600 mt-2">₦772,800.00</div>
            <span className="text-xs text-slate-500 mt-1 inline-block">RSA Employer Remittance</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('runs')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === 'runs'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Payroll Runs & Disbursements
          </button>
          <button
            onClick={() => setActiveTab('components')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === 'components'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Salary Components ({components.length})
          </button>
          <button
            onClick={() => setActiveTab('periods')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === 'periods'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Payroll Periods ({periods.length})
          </button>
        </div>

        {/* TAB 1: Payroll Runs */}
        {activeTab === 'runs' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Payroll Period</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Employees</th>
                  <th className="px-6 py-3">Total Gross</th>
                  <th className="px-6 py-3">Statutory Deductions</th>
                  <th className="px-6 py-3">Net Pay</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {runs.map((run) => (
                  <tr key={run.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900">{run.periodName}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                          run.status === 'DISBURSED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : run.status === 'APPROVED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {run.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{run.totalEmployees} Employees</td>
                    <td className="px-6 py-4 font-mono font-medium">₦{run.totalGross.toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-slate-500">
                      Tax: ₦{run.totalTax.toLocaleString()} | Pension: ₦{run.totalPension.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-indigo-600">₦{run.totalNet.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {run.status === 'DRAFT' && (
                        <button
                          onClick={() => handleApproveRun(run.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition"
                        >
                          Approve
                        </button>
                      )}
                      {run.status === 'APPROVED' && (
                        <button
                          onClick={() => handleDisburseRun(run.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition"
                        >
                          Disburse
                        </button>
                      )}
                      {run.status === 'DISBURSED' && (
                        <span className="text-xs text-slate-400 font-medium">Finalized</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: Salary Components */}
        {activeTab === 'components' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">Configured Earnings & Deductions</h2>
              <button
                onClick={() => setShowComponentModal(true)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg shadow-sm transition"
              >
                + Add Component
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {components.map((comp) => (
                <div key={comp.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                        comp.type === 'EARNING' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {comp.type}
                    </span>
                    {comp.isStatutory && (
                      <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded">
                        STATUTORY
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-base mt-2">{comp.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Code: {comp.code}</p>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-600">
                    <span>Calc Type: {comp.calculationType}</span>
                    <span className="font-semibold text-slate-900">₦{comp.defaultAmount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Payroll Periods */}
        {activeTab === 'periods' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">Financial Reporting Periods</h2>
              <button
                onClick={() => setShowPeriodModal(true)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg shadow-sm transition"
              >
                + Create Period
              </button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Period Name</th>
                    <th className="px-6 py-3">Frequency</th>
                    <th className="px-6 py-3">Start Date</th>
                    <th className="px-6 py-3">End Date</th>
                    <th className="px-6 py-3">Pay Date</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {periods.map((p) => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 font-semibold text-slate-900">{p.name}</td>
                      <td className="px-6 py-4">{p.frequency}</td>
                      <td className="px-6 py-4">{p.startDate}</td>
                      <td className="px-6 py-4">{p.endDate}</td>
                      <td className="px-6 py-4">{p.payDate}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded ${
                            p.isClosed ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.isClosed ? 'CLOSED' : 'ACTIVE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Execute Run Modal */}
      {showRunModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Execute Automated Payroll Calculation</h3>
            <p className="text-sm text-slate-500 mb-4">
              Computes basic pay, allowances, 8% pension statutory deduction, 10% PAYE tax, and net salaries across active employees.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Select Payroll Period</label>
                <select
                  value={selectedPeriodId}
                  onChange={(e) => setSelectedPeriodId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  {periods.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.startDate} to {p.endDate})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowRunModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRunPayroll}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg"
              >
                Calculate Payroll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Component Modal */}
      {showComponentModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create Salary Component</h3>
            <form onSubmit={handleCreateComponent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Component Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Utility Allowance"
                  value={newComponentName}
                  onChange={(e) => setNewComponentName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Component Code</label>
                <input
                  type="text"
                  required
                  placeholder="UTILITY"
                  value={newComponentCode}
                  onChange={(e) => setNewComponentCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Type</label>
                <select
                  value={newComponentType}
                  onChange={(e: any) => setNewComponentType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="EARNING">EARNING (Allowance)</option>
                  <option value="DEDUCTION">DEDUCTION (Tax / Loan)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Default Amount (₦)</label>
                <input
                  type="number"
                  required
                  value={newComponentAmount}
                  onChange={(e) => setNewComponentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowComponentModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg"
                >
                  Save Component
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Period Modal */}
      {showPeriodModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Setup Payroll Period</h3>
            <form onSubmit={handleCreatePeriod} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Period Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. October 2026 Payroll"
                  value={newPeriodName}
                  onChange={(e) => setNewPeriodName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newPeriodStart}
                    onChange={(e) => setNewPeriodStart(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newPeriodEnd}
                    onChange={(e) => setNewPeriodEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPeriodModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg"
                >
                  Save Period
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
