import type { Metadata } from 'next';
import { Geist } from 'next/font/google';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: "Dietician Ritika Bahl's Portal",
  description: 'View your diet plans, weight history and notifications.',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`portal-root ${geist.variable}`} style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}>
      {children}
    </div>
  );
}
