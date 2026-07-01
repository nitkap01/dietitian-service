'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, FileText, Activity, Bell, User, LogOut, Leaf } from 'lucide-react';

const links = [
  { href: '/portal', label: 'Home', icon: LayoutDashboard },
  { href: '/portal/diets', label: 'Diets', icon: FileText },
  { href: '/portal/weight', label: 'Weight', icon: Activity },
  { href: '/portal/notifications', label: 'Alerts', icon: Bell },
  { href: '/portal/profile', label: 'Profile', icon: User },
];

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetch('/api/portal/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setUnread(d.unread); })
      .catch(() => {});
  }, [pathname]);

  async function logout() {
    await fetch('/api/portal/auth', { method: 'DELETE' });
    router.push('/portal/login');
    router.refresh();
  }

  return (
    <div>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b" style={{ borderColor: '#EDE7F6' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between gap-3">
            <Link href="/portal" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5C3A9E, #3D2070)' }}>
                <Leaf size={16} className="text-white" />
              </div>
              <span className="font-black text-[#1A1A2E] hidden sm:block">Hale N Hearty</span>
            </Link>

            <nav className="flex items-center gap-1 overflow-x-auto">
              {links.map(({ href, label, icon: Icon }) => {
                const active = href === '/portal' ? pathname === '/portal' : pathname.startsWith(href);
                return (
                  <Link key={href} href={href}
                    className="relative px-3 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                    style={active ? { background: '#EDE7F6', color: '#5C3A9E' } : { color: '#6B7280' }}>
                    <Icon size={15} /> <span className="hidden sm:inline">{label}</span>
                    {href === '/portal/notifications' && unread > 0 && (
                      <span className="ml-0.5 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center" style={{ background: '#C2185B' }}>{unread}</span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <button onClick={logout} title="Log out" className="shrink-0 p-2 rounded-full text-gray-400 hover:text-[#5C3A9E] hover:bg-purple-50 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
