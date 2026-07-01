'use client';

import { useEffect, useState } from 'react';
import { PortalShell } from '@/components/portal/PortalShell';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Table as TableIcon, LineChart as LineIcon, Scale } from 'lucide-react';

interface Metric { id: number; weight_kg: number; recorded_at: string; source: string }
const PAGE = 5;

export default function PortalWeightPage() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'table' | 'graph'>('table');
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetch('/api/portal/weight').then((r) => r.json()).then((d) => { setMetrics(d); setLoading(false); });
  }, []);

  if (loading) {
    return <PortalShell><div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 rounded-full" style={{ borderColor: '#EDE7F6', borderTopColor: '#5C3A9E' }} /></div></PortalShell>;
  }

  const canGraph = metrics.length >= 5;
  const newestFirst = [...metrics].reverse();
  const pageCount = Math.max(1, Math.ceil(newestFirst.length / PAGE));
  const rows = newestFirst.slice(page * PAGE, page * PAGE + PAGE);

  const chartData = metrics.map((m) => ({
    date: new Date(m.recorded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    weight: Number(m.weight_kg),
  }));
  const weights = metrics.map((m) => Number(m.weight_kg));
  const min = weights.length ? Math.min(...weights) - 1 : 0;
  const max = weights.length ? Math.max(...weights) + 1 : 100;

  return (
    <PortalShell>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A2E]">Weight History</h1>
          <p className="text-gray-500">{metrics.length} reading{metrics.length === 1 ? '' : 's'}</p>
        </div>
        {canGraph && (
          <div className="inline-flex rounded-full border overflow-hidden" style={{ borderColor: '#EDE7F6' }}>
            <button onClick={() => setView('table')} className="px-4 py-2 text-sm font-semibold flex items-center gap-1.5" style={view === 'table' ? { background: '#5C3A9E', color: '#fff' } : { color: '#6B7280' }}><TableIcon size={14} /> Table</button>
            <button onClick={() => setView('graph')} className="px-4 py-2 text-sm font-semibold flex items-center gap-1.5" style={view === 'graph' ? { background: '#5C3A9E', color: '#fff' } : { color: '#6B7280' }}><LineIcon size={14} /> Graph</button>
          </div>
        )}
      </div>

      {metrics.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 text-center text-gray-500" style={{ borderColor: '#EDE7F6' }}>No weight readings yet. Your dietitian will request updates over WhatsApp.</div>
      ) : canGraph && view === 'graph' ? (
        <div className="rounded-2xl border bg-white p-5" style={{ borderColor: '#EDE7F6' }}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE7F6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis domain={[min, max]} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #EDE7F6', fontSize: 12 }} />
              <Line type="monotone" dataKey="weight" stroke="#5C3A9E" strokeWidth={2.5} dot={{ r: 3, fill: '#5C3A9E' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white p-2" style={{ borderColor: '#EDE7F6' }}>
          {rows.map((m) => (
            <div key={m.id} className="flex items-center justify-between px-4 py-3 border-b last:border-0" style={{ borderColor: '#F3F0F9' }}>
              <span className="flex items-center gap-2 font-semibold text-[#1A1A2E]"><Scale size={15} style={{ color: '#5C3A9E' }} /> {m.weight_kg} kg</span>
              <span className="text-sm text-gray-500">{new Date(m.recorded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          ))}
          {pageCount > 1 && (
            <div className="flex items-center justify-between px-4 py-3">
              <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="text-sm font-semibold disabled:opacity-40" style={{ color: '#5C3A9E' }}>Previous</button>
              <span className="text-xs text-gray-400">Page {page + 1} of {pageCount}</span>
              <button disabled={page >= pageCount - 1} onClick={() => setPage((p) => p + 1)} className="text-sm font-semibold disabled:opacity-40" style={{ color: '#5C3A9E' }}>Next</button>
            </div>
          )}
        </div>
      )}
    </PortalShell>
  );
}
