import './globals.css';
import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export const metadata = {
  title: 'NexusHCM — Multi-Tenant HR & HCM SaaS Platform',
  description: 'Production-ready Enterprise HR Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 p-6 overflow-y-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
