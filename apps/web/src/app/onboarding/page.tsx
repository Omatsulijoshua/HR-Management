'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { CheckSquare, Square, CheckCircle2, User, Clock, ShieldCheck } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface OnboardingTask {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

interface OnboardingProcess {
  id: string;
  progressPercentage: number;
  isCompleted: boolean;
  employee: { firstName: string; lastName: string; employeeCode: string };
  template?: { title: string };
  tasks: OnboardingTask[];
}

export default function OnboardingPage() {
  const [processes, setProcesses] = useState<OnboardingProcess[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async () => {
    setLoading(true);
    try {
      const res: any = await apiClient.get('/onboarding/processes');
      setProcesses(res.data || res || []);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await apiClient.patch(`/onboarding/tasks/${taskId}`, { status: nextStatus });
      fetchProcesses();
    } catch {
      // Handled
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">New Hire Onboarding Tracker</h1>
          <p className="text-xs text-slate-500 mt-1">Track checklist progress, task completion, and orientation milestones</p>
        </div>
        <Badge variant="info">Automated Workflow</Badge>
      </div>

      {loading ? (
        <Skeleton className="h-48 w-full" />
      ) : processes.length === 0 ? (
        <Card className="text-center py-12 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-semibold text-slate-700">No Active Onboarding Processes</p>
          <p className="text-[11px] text-slate-500">Onboard a new employee to assign checklist workflows.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {processes.map((proc) => (
            <Card key={proc.id} className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                    {proc.employee?.firstName[0]}
                    {proc.employee?.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      {proc.employee?.firstName} {proc.employee?.lastName} ({proc.employee?.employeeCode})
                    </h3>
                    <p className="text-[11px] text-slate-500">Template: {proc.template?.title || 'Standard Onboarding'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-36 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${proc.progressPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{proc.progressPercentage}%</span>
                  {proc.isCompleted && <Badge variant="success">Complete</Badge>}
                </div>
              </div>

              {/* Task Checklist Items */}
              <div className="space-y-2">
                {proc.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id, task.status)}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition"
                  >
                    <div className="flex items-center gap-3">
                      {task.status === 'COMPLETED' ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <div>
                        <p className={`text-xs font-semibold ${task.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {task.title}
                        </p>
                        {task.description && <p className="text-[10px] text-slate-500">{task.description}</p>}
                      </div>
                    </div>
                    <Badge variant={task.status === 'COMPLETED' ? 'success' : 'neutral'}>
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
