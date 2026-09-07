'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface LineItem {
  name: string;
  type: 'EARNING' | 'DEDUCTION';
  amount: number;
}

interface Payslip {
  id: string;
  periodName: string;
  payDate: string;
  basicSalary: number;
  totalAllowances: number;
  grossSalary: number;
  taxDeduction: number;
  pensionDeduction: number;
  otherDeductions: number;
  totalDeductions: number;
  netPay: number;
  lineItems: LineItem[];
}

export default function PayslipsPage() {
  const [payslips] = useState<Payslip[]>([
    {
      id: 'ps-1',
      periodName: 'August 2026 Payroll',
      payDate: '2026-08-25',
      basicSalary: 200000,
      totalAllowances: 80000,
      grossSalary: 280000,
      taxDeduction: 26400,
      pensionDeduction: 16000,
      otherDeductions: 0,
      totalDeductions: 42400,
      netPay: 237600,
      lineItems: [
        { name: 'Basic Salary', type: 'EARNING', amount: 200000 },
        { name: 'Housing Allowance', type: 'EARNING', amount: 50000 },
        { name: 'Transport Allowance', type: 'EARNING', amount: 30000 },
        { name: 'Pension (Employee 8%)', type: 'DEDUCTION', amount: 16000 },
        { name: 'PAYE Tax (10%)', type: 'DEDUCTION', amount: 26400 },
      ],
    },
    {
      id: 'ps-2',
      periodName: 'July 2026 Payroll',
      payDate: '2026-07-25',
      basicSalary: 200000,
      totalAllowances: 80000,
      grossSalary: 280000,
      taxDeduction: 26400,
      pensionDeduction: 16000,
      otherDeductions: 0,
      totalDeductions: 42400,
      netPay: 237600,
      lineItems: [
        { name: 'Basic Salary', type: 'EARNING', amount: 200000 },
        { name: 'Housing Allowance', type: 'EARNING', amount: 50000 },
        { name: 'Transport Allowance', type: 'EARNING', amount: 30000 },
        { name: 'Pension (Employee 8%)', type: 'DEDUCTION', amount: 16000 },
        { name: 'PAYE Tax (10%)', type: 'DEDUCTION', amount: 26400 },
      ],
    },
  ]);

  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(payslips[0]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Payslips & Compensation Statement</h1>
          <p className="text-xs text-slate-500">Employee Self-Service Portal</p>
        </div>
        <Link
          href="/payroll"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
        >
          ← Back to Admin Payroll Engine
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Payslip History */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Payroll History</h2>
          {payslips.map((ps) => (
            <button
              key={ps.id}
              onClick={() => setSelectedPayslip(ps)}
              className={`w-full text-left p-5 rounded-xl border transition ${
                selectedPayslip?.id === ps.id
                  ? 'bg-indigo-50/50 border-indigo-500 shadow-sm'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900 text-base">{ps.periodName}</span>
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  PAID
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Disbursed on {ps.payDate}</p>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-between items-center text-sm">
                <span className="text-slate-500">Net Pay:</span>
                <span className="font-bold text-indigo-600 font-mono text-base">₦{ps.netPay.toLocaleString()}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Column: Detailed Payslip Card */}
        {selectedPayslip && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-md p-8">
            <div className="border-b border-slate-200 pb-6 mb-6 flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Official Payslip Statement</span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">{selectedPayslip.periodName}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Pay Date: {selectedPayslip.payDate}</p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition shadow-sm"
              >
                🖨️ Download / Print
              </button>
            </div>

            {/* Employee Info Header */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl mb-6 text-xs text-slate-600">
              <div>
                <span className="block font-semibold text-slate-700 uppercase">Employee Name</span>
                <span className="text-sm font-bold text-slate-900">Omatsuli Joshua</span>
              </div>
              <div>
                <span className="block font-semibold text-slate-700 uppercase">Employee Code</span>
                <span className="text-sm font-bold text-slate-900 font-mono">EMP-2026-001</span>
              </div>
            </div>

            {/* Earnings & Deductions Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Earnings */}
              <div>
                <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">Earnings & Allowances</h3>
                <div className="space-y-2">
                  {selectedPayslip.lineItems
                    .filter((item) => item.type === 'EARNING')
                    .map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1.5 border-b border-slate-100">
                        <span className="text-slate-600">{item.name}</span>
                        <span className="font-semibold text-slate-900 font-mono">₦{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  <div className="flex justify-between text-sm py-2 font-bold bg-emerald-50 px-3 rounded-lg text-emerald-900 mt-2">
                    <span>Total Gross Pay</span>
                    <span className="font-mono">₦{selectedPayslip.grossSalary.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-3">Deductions & Taxes</h3>
                <div className="space-y-2">
                  {selectedPayslip.lineItems
                    .filter((item) => item.type === 'DEDUCTION')
                    .map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1.5 border-b border-slate-100">
                        <span className="text-slate-600">{item.name}</span>
                        <span className="font-semibold text-slate-900 font-mono">₦{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  <div className="flex justify-between text-sm py-2 font-bold bg-rose-50 px-3 rounded-lg text-rose-900 mt-2">
                    <span>Total Deductions</span>
                    <span className="font-mono">₦{selectedPayslip.totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Pay Callout */}
            <div className="bg-indigo-600 text-white p-6 rounded-xl flex justify-between items-center shadow-lg">
              <div>
                <span className="text-xs uppercase font-semibold text-indigo-200 tracking-wider">Take-Home Pay</span>
                <div className="text-xs text-indigo-100 mt-0.5">Credited directly to employee salary account</div>
              </div>
              <div className="text-3xl font-extrabold font-mono">₦{selectedPayslip.netPay.toLocaleString()}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
