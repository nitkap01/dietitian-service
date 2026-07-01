'use client';

import { AlertTriangle } from 'lucide-react';

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Something went wrong loading this page</h2>
        <p className="text-sm text-slate-500 mt-2">
          This usually means the app couldn&apos;t reach the database. Check your <code className="text-xs">DATABASE_URL</code> and that Postgres is running, then try again.
        </p>
        {error?.message && <p className="text-xs text-slate-400 mt-2 break-words">{error.message}</p>}
        <button
          onClick={reset}
          className="mt-5 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
