'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Package, CreditCard, Menu } from 'lucide-react';

// App-like bottom tab bar for phones. The primary destinations live here; the
// rest of the menu (Meals, WhatsApp, Notifications, Settings) opens via "More".
const tabs = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/packages', label: 'Plans', icon: Package },
  { href: '/payments', label: 'Pay', icon: CreditCard },
];

interface BottomNavProps {
  onMore?: () => void;
}

export function BottomNav({ onMore }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-5">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${
                active ? 'text-brand-600' : 'text-slate-500'
              }`}
            >
              <Icon size={20} className={active ? 'text-brand-600' : 'text-slate-400'} />
              {label}
            </Link>
          );
        })}
        <button
          onClick={onMore}
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium text-slate-500"
        >
          <Menu size={20} className="text-slate-400" />
          More
        </button>
      </div>
    </nav>
  );
}
