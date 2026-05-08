'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { Bell, Menu, LogOut } from 'lucide-react';

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/clients': 'Clients',
  '/clients/new': 'New Client',
  '/packages': 'Packages',
  '/meals': 'Meal Library',
  '/payments': 'Payments',
  '/notifications': 'Notifications',
  '/whatsapp': 'WhatsApp',
  '/settings': 'Settings',
};

interface TopBarProps {
  onMobileMenuOpen?: () => void;
}

export function TopBar({ onMobileMenuOpen }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isClientDetail = pathname.match(/^\/clients\/\d+$/);
  const title = isClientDetail ? 'Client Detail' : (titles[pathname] || 'Dashboard');

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors md:hidden"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>
        <ThemeToggle />
        <div className="ml-1 w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-semibold">
          D
        </div>
        <button
          onClick={logout}
          title="Sign out"
          className="ml-1 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
