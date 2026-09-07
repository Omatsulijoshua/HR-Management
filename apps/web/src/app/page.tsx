'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Activity, Server, Database, Layers, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface HealthData {
  status: string;
  info: {
    database: { status: string };
    redis: { status: string };
    uptime: number;
  };
  timestamp: string;
}

export default function DashboardPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await apiClient.get('/health');
      setHealth(res.data || res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch API health status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Platform Foundation & Infrastructure</h1>
          <p className="text-xs text-slate-500 mt-1">
            Phase 1 Baseline System Overview, API Verification, and Microservice Diagnostics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">Phase 1 Complete</Badge>
          <button
            onClick={fetchHealth}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
          >
            Re-verify Health
          </button>
        </div>
      </div>

      {/* System Status Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">NestJS API Gateway</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">v1.0.0 (Port 4000)</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">PostgreSQL Database</p>
            <div className="mt-0.5">
              {loading ? (
                <Skeleton className="h-4 w-16" />
              ) : health?.info?.database?.status === 'up' ? (
                <Badge variant="success">Connected</Badge>
              ) : (
                <Badge variant="error">Disconnected</Badge>
              )}
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Redis Cache Service</p>
            <div className="mt-0.5">
              {loading ? (
                <Skeleton className="h-4 w-16" />
              ) : health?.info?.redis?.status === 'up' ? (
                <Badge variant="success">Connected</Badge>
              ) : (
                <Badge variant="warning">Deferred / Down</Badge>
              )}
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Multi-Tenancy Guard</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">Strict Isolation</p>
          </div>
        </Card>
      </div>

      {/* System Health Diagnostics & Architecture Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Live API Health Check Diagnostic" subtitle="GET /api/v1/health status readout">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                API Connection Failed
              </div>
              <p>{error}</p>
              <p className="text-[10px] text-slate-500">
                Ensure backend API is running on <code>http://localhost:4000</code> with Docker PostgreSQL container started.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] overflow-x-auto">
                <pre>{JSON.stringify(health, null, 2)}</pre>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Backend API responding correctly with standardized JSON payload wrapper.
              </div>
            </div>
          )}
        </Card>

        <Card title="Phase 1 Architectural Foundations" subtitle="Completed Core Architecture Verification">
          <ul className="space-y-3 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800">Monorepo Setup:</strong> Isolated <code>apps/api</code> (NestJS) and <code>apps/web</code> (Next.js) with root scripts.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800">Prisma ORM & PostgreSQL Schema:</strong> Defined core models (PlatformUser, Organization, User, Role, AuditLog, SystemHealth).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800">API Standard Response & Exception Filters:</strong> Global response interceptors and standardized error handlers active.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800">Docker & Redis Integration:</strong> Docker Compose file with PostgreSQL 16 and Redis services.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800">Swagger API Documentation:</strong> Interactive API specs configured under <code>/api/docs</code>.
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
