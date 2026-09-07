'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Clock,
  CalendarDays,
  DollarSign,
  Award,
  BookOpen,
  FolderLock,
  MessageSquare,
  ShieldCheck,
  Settings,
  Activity,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '#', active: true },
  { name: 'People & Employees', icon: Users, href: '#' },
  { name: 'Recruitment (ATS)', icon: Briefcase, href: '#' },
  { name: 'Attendance & Shifts', icon: Clock, href: '#' },
  { name: 'Leave Management', icon: CalendarDays, href: '#' },
  { name: 'Payroll & Compensation', icon: DollarSign, href: '#' },
  { name: 'Performance & OKRs', icon: Award, href: '#' },
  { name: 'Learning & Skills', icon: BookOpen, href: '#' },
  { name: 'Documents & Signatures', icon: FolderLock, href: '#' },
  { name: 'HR Cases & Grievances', icon: MessageSquare, href: '#' },
  { name: 'Super Admin', icon: ShieldCheck, href: '#' },
  { name: 'System Health & Logs', icon: Activity, href: '#' },
  { name: 'Organization Settings', icon: Settings, href: '#' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col flex-shrink-0">
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
          H
        </div>
        <div>
          <h1 className="font-bold text-white text-sm tracking-wide">NexusHCM</h1>
          <p className="text-[10px] text-slate-400">Multi-Tenant Platform</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
              item.active
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.name}</span>
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
        Phase 1 Foundation v1.0.0
      </div>
    </aside>
  );
}
