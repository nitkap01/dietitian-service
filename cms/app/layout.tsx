import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: "Dietician Ritika Bahl's Portal",
  description: "Dietician Ritika Bahl's Portal — client & practice management",
};

// Mobile-first: fit device width and respect notch/home-indicator safe areas.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FDFCF7',
};

// Light-only app (matches the marketing website). No theme library, so nothing
// can ever apply a dark class — the app is always light.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} light`} style={{ colorScheme: 'light' }}>
      <body style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
