'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuOpen={() => setMobileOpen(true)} />
      {/* pb clears the fixed mobile bottom nav; md removes it */}
      <main className="md:ml-64 pt-16 min-h-screen pb-24 md:pb-6">
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
      <BottomNav onMore={() => setMobileOpen(true)} />
    </div>
  );
}
