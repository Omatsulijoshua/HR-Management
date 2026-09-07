'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Briefcase } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface Position {
  id: string;
  title: string;
  code: string;
  department: { name: string };
  jobGrade?: { name: string; level: number } | null;
}

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const res: any = await apiClient.get('/organizations/positions');
      setPositions(res.data || res || []);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Job Positions & Salary Grades</h1>
          <p className="text-xs text-slate-500 mt-1">Define job titles, department allocations, and grade bands</p>
        </div>
        <Badge variant="info">Multi-Tenant</Badge>
      </div>

      <Card>
        {loading ? (
          <Skeleton className="h-24 w-full" />
        ) : positions.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No Job Positions Configured</p>
            <p className="text-[11px] text-slate-500">Define job titles and link them to departmental structures.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="p-3">Job Title</th>
                <th className="p-3">Code</th>
                <th className="p-3">Department</th>
                <th className="p-3">Job Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {positions.map((pos) => (
                <tr key={pos.id} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-800">{pos.title}</td>
                  <td className="p-3"><Badge variant="neutral">{pos.code}</Badge></td>
                  <td className="p-3 text-slate-600">{pos.department?.name || '—'}</td>
                  <td className="p-3 text-slate-600">{pos.jobGrade?.name ? `${pos.jobGrade.name} (L${pos.jobGrade.level})` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
