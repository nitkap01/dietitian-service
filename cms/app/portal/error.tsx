'use client';

import { AlertTriangle } from 'lucide-react';

export default function PortalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FDFCF7' }}>
      <div className="text-center max-w-md">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#FCE4EC', color: '#C2185B' }}>
          <AlertTriangle size={24} />
        </div>
        <h2 className="text-lg font-black text-[#1A1A2E]">Something went wrong</h2>
        <p className="text-sm text-gray-500 mt-2">We couldn&apos;t load this page. Please try again in a moment.</p>
        <button
          onClick={reset}
          className="mt-5 px-5 py-2.5 rounded-full text-white text-sm font-bold transition-transform hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #5C3A9E, #3D2070)' }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
