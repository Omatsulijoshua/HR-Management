'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Briefcase, Plus, Users, UserCheck, ArrowRight, Star, ChevronRight } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface JobItem {
  id: string;
  title: string;
  code: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  department?: { name: string };
  _count?: { applications: number };
}

interface ApplicationItem {
  id: string;
  stage: 'APPLIED' | 'SCREENING' | 'SHORTLISTED' | 'INTERVIEW' | 'ASSESSMENT' | 'OFFER' | 'HIRED' | 'REJECTED';
  candidate: { id: string; firstName: string; lastName: string; email: string; phone?: string };
  jobPosting: { title: string };
}

const pipelineStages = [
  { key: 'APPLIED', title: 'Applied', color: 'bg-slate-100 text-slate-700' },
  { key: 'SCREENING', title: 'Screening', color: 'bg-blue-50 text-blue-700' },
  { key: 'SHORTLISTED', title: 'Shortlisted', color: 'bg-indigo-50 text-indigo-700' },
  { key: 'INTERVIEW', title: 'Interview', color: 'bg-purple-50 text-purple-700' },
  { key: 'OFFER', title: 'Offer Sent', color: 'bg-amber-50 text-amber-700' },
  { key: 'HIRED', title: 'Hired', color: 'bg-emerald-50 text-emerald-700' },
];

export default function RecruitmentATSPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showConvertModal, setShowConvertModal] = useState(false);

  // Convert Candidate Form
  const [empCode, setEmpCode] = useState('');
  const [hireDate, setHireDate] = useState('2026-10-01');
  const [converting, setConverting] = useState(false);

  // Job Form
  const [jobTitle, setJobTitle] = useState('');
  const [jobCode, setJobCode] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [creatingJob, setCreatingJob] = useState(false);

  useEffect(() => {
    fetchRecruitmentData();
  }, []);

  const fetchRecruitmentData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appRes]: any = await Promise.all([
        apiClient.get('/recruitment/jobs'),
        apiClient.get('/recruitment/applications'),
      ]);
      setJobs(jobsRes.data || jobsRes || []);
      setApplications(appRes.data || appRes || []);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingJob(true);
    try {
      await apiClient.post('/recruitment/jobs', {
        title: jobTitle,
        code: jobCode,
        description: jobDesc,
        status: 'PUBLISHED',
      });
      setShowJobModal(false);
      setJobTitle('');
      setJobCode('');
      setJobDesc('');
      fetchRecruitmentData();
    } catch {
      // Handled
    } finally {
      setCreatingJob(false);
    }
  };

  const handleStageMove = async (appId: string, stage: string) => {
    try {
      await apiClient.patch(`/recruitment/applications/${appId}/stage`, { stage });
      fetchRecruitmentData();
    } catch {
      // Handled
    }
  };

  const handleConvertCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;
    setConverting(true);

    try {
      await apiClient.post(`/recruitment/candidates/${selectedCandidate.id}/convert`, {
        employeeCode: empCode,
        hireDate,
      });
      setShowConvertModal(false);
      setSelectedCandidate(null);
      fetchRecruitmentData();
    } catch {
      // Handled
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Recruitment & ATS Pipeline</h1>
          <p className="text-xs text-slate-500 mt-1">Manage job requisitions, candidate stages, and 1-click hire conversions</p>
        </div>
        <button
          onClick={() => setShowJobModal(true)}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Create Job Post
        </button>
      </div>

      {/* Active Job Requisitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <Skeleton className="h-24 w-full" />
        ) : jobs.length === 0 ? (
          <Card className="col-span-3 text-center py-6 text-xs text-slate-500">
            No active job requisitions found. Create a job posting to begin sourcing candidates.
          </Card>
        ) : (
          jobs.map((j) => (
            <Card key={j.id} className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800">{j.title}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{j.code} • {j.department?.name || 'General'}</p>
              </div>
              <Badge variant="info">{j._count?.applications || 0} Applicants</Badge>
            </Card>
          ))
        )}
      </div>

      {/* Applicant Pipeline Stages (Kanban Board Columns) */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          Candidate Pipeline Board
        </h2>

        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 overflow-x-auto">
            {pipelineStages.map((stage) => {
              const stageApps = applications.filter((a) => a.stage === stage.key);
              return (
                <div key={stage.key} className="bg-slate-100/70 rounded-xl p-3 space-y-3 min-w-[200px]">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">{stage.title}</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border">
                      {stageApps.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {stageApps.map((app) => (
                      <div key={app.id} className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-2 shadow-sm">
                        <div>
                          <p className="font-bold text-slate-900">
                            {app.candidate.firstName} {app.candidate.lastName}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">{app.jobPosting?.title}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          {stage.key !== 'HIRED' ? (
                            <button
                              onClick={() => {
                                const nextIndex = pipelineStages.findIndex((s) => s.key === stage.key) + 1;
                                if (nextIndex < pipelineStages.length) {
                                  handleStageMove(app.id, pipelineStages[nextIndex].key);
                                }
                              }}
                              className="text-[10px] text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
                            >
                              Advance <ChevronRight className="w-3 h-3" />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedCandidate(app.candidate);
                                setEmpCode(`EMP-${Math.floor(100 + Math.random() * 900)}`);
                                setShowConvertModal(true);
                              }}
                              className="text-[10px] bg-emerald-600 text-white font-semibold px-2 py-1 rounded hover:bg-emerald-700 transition flex items-center gap-1"
                            >
                              <UserCheck className="w-3 h-3" /> Convert
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Convert Candidate Modal */}
      {showConvertModal && selectedCandidate && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-sm font-bold text-slate-900">1-Click Convert to Active Employee</h2>
            <p className="text-xs text-slate-500">
              Convert candidate <strong>{selectedCandidate.firstName} {selectedCandidate.lastName}</strong> into an active employee record.
            </p>
            <form onSubmit={handleConvertCandidate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Employee Code</label>
                <input
                  type="text"
                  required
                  value={empCode}
                  onChange={(e) => setEmpCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hire Date</label>
                <input
                  type="date"
                  required
                  value={hireDate}
                  onChange={(e) => setHireDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowConvertModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={converting}
                  className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition"
                >
                  {converting ? 'Converting...' : 'Convert to Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-sm font-bold text-slate-900">Create Job Requisition</h2>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior React Developer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JOB-DEV-01"
                  value={jobCode}
                  onChange={(e) => setJobCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  placeholder="Job summary and requirements"
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingJob}
                  className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                >
                  {creatingJob ? 'Publishing...' : 'Publish Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
