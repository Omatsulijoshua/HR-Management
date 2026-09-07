'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface Branch {
  id: string;
  name: string;
  code: string;
  city?: string;
  country: string;
  isHeadquarters: boolean;
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res: any = await apiClient.get('/organizations/branches');
      setBranches(res.data || res || []);
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
          <h1 className="text-xl font-bold text-slate-900">Branches & Locations</h1>
          <p className="text-xs text-slate-500 mt-1">Manage physical offices, headquarters, and branch operational hubs</p>
        </div>
        <Badge variant="info">Multi-Tenant</Badge>
      </div>

      <Card>
        {loading ? (
          <Skeleton className="h-24 w-full" />
        ) : branches.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No Branches Registered</p>
            <p className="text-[11px] text-slate-500">Configure headquarters and company branch locations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branches.map((b) => (
              <div key={b.id} className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-800">{b.name}</h3>
                    {b.isHeadquarters && <Badge variant="success">HQ</Badge>}
                  </div>
                  <p className="text-[11px] text-slate-500">{b.code} • {b.city || 'Default Location'}, {b.country}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
