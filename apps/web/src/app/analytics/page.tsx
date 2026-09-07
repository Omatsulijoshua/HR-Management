'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Briefcase,
  AlertTriangle,
  Smile,
  Download,
  FileText,
  Filter,
  RefreshCw,
  PieChart,
  Calendar,
  Building2,
  CheckCircle2,
} from 'lucide-react';

interface ExecutiveOverview {
  kpis: {
    totalHeadcount: number;
    monthlyPayrollSpend: number;
    averageSalary: number;
    activeJobPostings: number;
    activeHseIncidents: number;
    eNPSIndex: number;
    totalDepartments: number;
  };
  departmentDistribution: Array<{
    departmentId: string;
    departmentName: string;
    code: string;
    employeeCount: number;
  }>;
  payrollSummary: {
    totalGross: number;
    totalNet: number;
    totalDeductions: number;
    processedEntries: number;
  };
}

interface ReportResult {
  reportType: string;
  totalRecords: number;
  headers: string[];
  rows: string[][];
  generatedAt: string;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<ExecutiveOverview | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'builder'>('dashboard');

  // Custom Report Form State
  const [reportType, setReportType] = useState('HEADCOUNT');
  const [generating, setGenerating] = useState(false);
  const [reportResult, setReportResult] = useState<ReportResult | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/analytics/overview', {
        headers: { 'x-organization-id': 'org-1' },
      });
      if (res.ok) {
        const data = await res.ok ? await res.json() : null;
        setOverview(data);
      } else {
        // Fallback demo data if API offline during SSR
        setOverview({
          kpis: {
            totalHeadcount: 142,
            monthlyPayrollSpend: 685000,
            averageSalary: 4823,
            activeJobPostings: 6,
            activeHseIncidents: 1,
            eNPSIndex: 42,
            totalDepartments: 6,
          },
          departmentDistribution: [
            { departmentId: '1', departmentName: 'Engineering', code: 'ENG', employeeCount: 45 },
            { departmentId: '2', departmentName: 'Product & Design', code: 'PROD', employeeCount: 22 },
            { departmentId: '3', departmentName: 'Sales & Marketing', code: 'SALES', employeeCount: 38 },
            { departmentId: '4', departmentName: 'People & HR', code: 'HR', employeeCount: 12 },
            { departmentId: '5', departmentName: 'Finance & Legal', code: 'FIN', employeeCount: 15 },
            { departmentId: '6', departmentName: 'Customer Support', code: 'SUP', employeeCount: 10 },
          ],
          payrollSummary: {
            totalGross: 685000,
            totalNet: 548000,
            totalDeductions: 137000,
            processedEntries: 142,
          },
        });
      }
    } catch (err) {
      setOverview({
        kpis: {
          totalHeadcount: 142,
          monthlyPayrollSpend: 685000,
          averageSalary: 4823,
          activeJobPostings: 6,
          activeHseIncidents: 1,
          eNPSIndex: 42,
          totalDepartments: 6,
        },
        departmentDistribution: [
          { departmentId: '1', departmentName: 'Engineering', code: 'ENG', employeeCount: 45 },
          { departmentId: '2', departmentName: 'Product & Design', code: 'PROD', employeeCount: 22 },
          { departmentId: '3', departmentName: 'Sales & Marketing', code: 'SALES', employeeCount: 38 },
          { departmentId: '4', departmentName: 'People & HR', code: 'HR', employeeCount: 12 },
          { departmentId: '5', departmentName: 'Finance & Legal', code: 'FIN', employeeCount: 15 },
          { departmentId: '6', departmentName: 'Customer Support', code: 'SUP', employeeCount: 10 },
        ],
        payrollSummary: {
          totalGross: 685000,
          totalNet: 548000,
          totalDeductions: 137000,
          processedEntries: 142,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await fetch('http://localhost:3001/analytics/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-organization-id': 'org-1',
        },
        body: JSON.stringify({ reportType }),
      });
      if (res.ok) {
        const data = await res.json();
        setReportResult(data);
      } else {
        // Fallback demo report
        generateDemoReport(reportType);
      }
    } catch (err) {
      generateDemoReport(reportType);
    } finally {
      setGenerating(false);
    }
  };

  const generateDemoReport = (type: string) => {
    if (type === 'HEADCOUNT') {
      setReportResult({
        reportType: 'HEADCOUNT',
        totalRecords: 4,
        headers: ['Employee Code', 'Full Name', 'Email', 'Department', 'Job Title', 'Status', 'Hire Date'],
        rows: [
          ['EMP-001', 'John Doe', 'john.doe@company.com', 'Engineering', 'Staff Software Engineer', 'ACTIVE', '2023-03-15'],
          ['EMP-002', 'Sarah Jenkins', 'sarah.j@company.com', 'Product & Design', 'VP Product', 'ACTIVE', '2022-08-01'],
          ['EMP-003', 'Michael Chang', 'm.chang@company.com', 'Sales & Marketing', 'Account Executive', 'ACTIVE', '2024-01-10'],
          ['EMP-004', 'Emily Watson', 'emily.w@company.com', 'People & HR', 'HR Business Partner', 'ACTIVE', '2023-11-20'],
        ],
        generatedAt: new Date().toISOString(),
      });
    } else if (type === 'PAYROLL_SUMMARY') {
      setReportResult({
        reportType: 'PAYROLL_SUMMARY',
        totalRecords: 3,
        headers: ['Employee Code', 'Employee Name', 'Base Salary', 'Gross Pay', 'Total Deductions', 'Net Salary', 'Status'],
        rows: [
          ['EMP-001', 'John Doe', '$120,000', '$10,000', '$2,200', '$7,800', 'PAID'],
          ['EMP-002', 'Sarah Jenkins', '$140,000', '$11,666', '$2,566', '$9,100', 'PAID'],
          ['EMP-003', 'Michael Chang', '$90,000', '$7,500', '$1,650', '$5,850', 'PAID'],
        ],
        generatedAt: new Date().toISOString(),
      });
    } else {
      setReportResult({
        reportType: type,
        totalRecords: 2,
        headers: ['Record ID', 'Reference', 'Category', 'Date', 'Status'],
        rows: [
          ['REC-101', 'AUDIT-2026-A', 'General Metric', '2026-09-01', 'COMPLETED'],
          ['REC-102', 'AUDIT-2026-B', 'Compliance Log', '2026-09-05', 'VERIFIED'],
        ],
        generatedAt: new Date().toISOString(),
      });
    }
  };

  const exportToCSV = () => {
    if (!reportResult) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [reportResult.headers.join(','), ...reportResult.rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HR_Report_${reportResult.reportType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRows = reportResult?.rows.filter((row) =>
    row.some((cell) => cell.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            HR Analytics & Executive Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time workforce intelligence, payroll expenditure metrics, and custom report builder.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchOverview}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'dashboard'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <PieChart className="w-4 h-4" />
          Executive Dashboard
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'builder'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          Custom Report Builder
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Headcount</span>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-extrabold text-gray-900">
                {overview?.kpis.totalHeadcount || 0}
              </div>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +4.2% from last quarter
              </p>
            </div>

            <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Monthly Payroll</span>
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-extrabold text-gray-900">
                ${(overview?.kpis.monthlyPayrollSpend || 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">Avg ${(overview?.kpis.averageSalary || 0).toLocaleString()} / employee</p>
            </div>

            <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-semibold uppercase tracking-wider">eNPS Index</span>
                <Smile className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-3xl font-extrabold text-gray-900">
                +{overview?.kpis.eNPSIndex || 0}
              </div>
              <p className="text-xs text-indigo-600 font-medium">Strong Engagement Score</p>
            </div>

            <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Open Requisitions</span>
                <Briefcase className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-3xl font-extrabold text-gray-900">
                {overview?.kpis.activeJobPostings || 0}
              </div>
              <p className="text-xs text-amber-600 font-medium">Active hiring campaigns</p>
            </div>
          </div>

          {/* Breakdown Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Headcount Breakdown */}
            <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Department Headcount Distribution
              </h3>
              <div className="space-y-3">
                {overview?.departmentDistribution.map((dept) => {
                  const percentage = Math.round(
                    (dept.employeeCount / (overview?.kpis.totalHeadcount || 1)) * 100
                  );
                  return (
                    <div key={dept.departmentId} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">{dept.departmentName} ({dept.code})</span>
                        <span className="font-semibold text-gray-900">{dept.employeeCount} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial & Operational Summary */}
            <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Payroll Financial Summary
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-xs text-emerald-700 font-medium uppercase">Gross Pay Expenditure</span>
                    <p className="text-xl font-bold text-emerald-900">
                      ${(overview?.payrollSummary.totalGross || 0).toLocaleString()}
                    </p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="text-xs text-gray-500 font-medium uppercase">Net Disbursements</span>
                    <p className="text-lg font-bold text-gray-900">
                      ${(overview?.payrollSummary.totalNet || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="text-xs text-gray-500 font-medium uppercase">Statutory Deductions</span>
                    <p className="text-lg font-bold text-gray-900">
                      ${(overview?.payrollSummary.totalDeductions || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <div>
                      <span className="text-sm font-semibold text-amber-900">Active HSE Workplace Incidents</span>
                      <p className="text-xs text-amber-700">Under active safety investigation</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-amber-900">{overview?.kpis.activeHseIncidents || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'builder' && (
        <div className="space-y-6">
          {/* Builder Form */}
          <form onSubmit={handleGenerateReport} className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              Dynamic Report Generator
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full text-sm border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="HEADCOUNT">Headcount & Active Roster</option>
                  <option value="PAYROLL_SUMMARY">Payroll Cost Breakdown</option>
                  <option value="ATTENDANCE_SUMMARY">Attendance & Work Hours</option>
                  <option value="TURNOVER">Turnover & Terminations</option>
                  <option value="TRAINING_COMPLETION">Training & L&D Compliance</option>
                  <option value="EXPENSE_SUMMARY">Expense Claims Audit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Department Filter
                </label>
                <select className="w-full text-sm border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500">
                  <option value="">All Departments</option>
                  {overview?.departmentDistribution.map((d) => (
                    <option key={d.departmentId} value={d.departmentId}>
                      {d.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Output Format
                </label>
                <select className="w-full text-sm border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500">
                  <option value="TABLE">Interactive Table View</option>
                  <option value="CSV">Export CSV File</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={generating}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
              >
                {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
                Generate Report
              </button>
            </div>
          </form>

          {/* Results Table Section */}
          {reportResult && (
            <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="text-md font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    Report Results: {reportResult.reportType}
                  </h4>
                  <p className="text-xs text-gray-500">
                    Generated at {new Date(reportResult.generatedAt).toLocaleString()} ({reportResult.totalRecords} records found)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Filter records..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="text-xs border border-gray-300 rounded-lg p-2 w-48 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                    <tr>
                      {reportResult.headers.map((h, i) => (
                        <th key={i} className="p-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredRows && filteredRows.length > 0 ? (
                      filteredRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-gray-50">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3 font-medium text-gray-900">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={reportResult.headers.length} className="p-6 text-center text-gray-500">
                          No matching records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
