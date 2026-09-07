'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface AssetRecord {
  id: string;
  name: string;
  assetTag: string;
  serialNumber: string;
  category: 'LAPTOP' | 'DESKTOP' | 'MOBILE_DEVICE' | 'MONITOR' | 'PERIPHERAL';
  condition: 'NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'REPAIR_REQUIRED';
  status: 'AVAILABLE' | 'ASSIGNED' | 'UNDER_MAINTENANCE' | 'RETIRED';
  assignedTo?: string;
  assignedDate?: string;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<AssetRecord[]>([
    {
      id: 'ast1',
      name: 'MacBook Pro 16" (M3 Max, 64GB RAM)',
      assetTag: 'TAG-MBP-8821',
      serialNumber: 'C02FX912Q05',
      category: 'LAPTOP',
      condition: 'EXCELLENT',
      status: 'ASSIGNED',
      assignedTo: 'Omatsuli Joshua',
      assignedDate: '2026-01-15',
    },
    {
      id: 'ast2',
      name: 'Dell UltraSharp 27" 4K Monitor',
      assetTag: 'TAG-MON-1049',
      serialNumber: 'CN-0W9210-72',
      category: 'MONITOR',
      condition: 'GOOD',
      status: 'ASSIGNED',
      assignedTo: 'Amina Bello',
      assignedDate: '2026-03-10',
    },
    {
      id: 'ast3',
      name: 'Lenovo ThinkPad X1 Carbon Gen 11',
      assetTag: 'TAG-LNV-3301',
      serialNumber: 'PF-90021A',
      category: 'LAPTOP',
      condition: 'NEW',
      status: 'AVAILABLE',
    },
  ]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [assetTag, setAssetTag] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [category, setCategory] = useState<'LAPTOP' | 'DESKTOP' | 'MOBILE_DEVICE' | 'MONITOR' | 'PERIPHERAL'>('LAPTOP');

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !assetTag) return;

    const created: AssetRecord = {
      id: `ast_${Date.now()}`,
      name,
      assetTag: assetTag.toUpperCase(),
      serialNumber: serialNumber || 'N/A',
      category,
      condition: 'NEW',
      status: 'AVAILABLE',
    };

    setAssets([created, ...assets]);
    setShowModal(false);
    setName('');
    setAssetTag('');
    setSerialNumber('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'AVAILABLE':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'UNDER_MAINTENANCE':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
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
                href="/onboarding"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                &larr; Onboarding & Offboarding
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              IT Logistics & Corporate Asset Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Track hardware inventory, serial numbers, employee allocations, and offboarding asset return clearances.
            </p>
          </div>
          <div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow"
            >
              + Register New Hardware Asset
            </button>
          </div>
        </div>

        {/* Inventory Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Total Registered Assets</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">{assets.length}</div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-medium">Laptops, Monitors & Mobiles</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Currently Assigned</div>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
              {assets.filter((a) => a.status === 'ASSIGNED').length}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">In Active Deployment</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Available In Stock</div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {assets.filter((a) => a.status === 'AVAILABLE').length}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">Ready for New Hires</div>
          </div>
        </div>
      </div>

      {/* Main Assets Table */}
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Asset Inventory Registry & Allocations
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hardware details, unique asset tags, warranty status, and assigned employees.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/50 uppercase text-xs text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">Asset Tag / Code</th>
                <th className="px-6 py-4">Hardware Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Condition</th>
                <th className="px-6 py-4">Assigned Employee</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {assets.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                  <td className="px-6 py-4 font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                    {item.assetTag}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                    {item.name}
                    <div className="text-[11px] font-mono text-slate-400 font-normal">S/N: {item.serialNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                      {item.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                    {item.assignedTo ? (
                      <div>
                        {item.assignedTo}
                        <div className="text-[10px] text-slate-400">Since {item.assignedDate}</div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded font-bold ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Register Asset */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Register New Hardware Asset
            </h3>
            <form onSubmit={handleCreateAsset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Hardware Name / Specification
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. MacBook Pro 14 (M3 Pro)"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Asset Tag Code
                  </label>
                  <input
                    type="text"
                    required
                    value={assetTag}
                    onChange={(e) => setAssetTag(e.target.value)}
                    placeholder="e.g. TAG-MBP-901"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                  >
                    <option value="LAPTOP">LAPTOP</option>
                    <option value="DESKTOP">DESKTOP</option>
                    <option value="MOBILE_DEVICE">MOBILE DEVICE</option>
                    <option value="MONITOR">MONITOR</option>
                    <option value="PERIPHERAL">PERIPHERAL</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Serial Number (Optional)
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="e.g. C02FX912Q05"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Save Asset Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
