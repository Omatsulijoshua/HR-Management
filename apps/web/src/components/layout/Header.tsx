'use client';

import React from 'react';
import { Bell, Search, User, Building2 } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700">
          <Building2 className="w-4 h-4 text-slate-500" />
          <span>Demo Corporation</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search employees, jobs, docs..."
            className="pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>

        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition relative">
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 bg-blue-600 rounded-full absolute top-1.5 right-1.5"></span>
        </button>

        <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center">
            SA
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-800">Super Admin</p>
            <p className="text-[10px] text-slate-500">Platform Owner</p>
          </div>
        </div>
      </div>
    </header>
  );
}
