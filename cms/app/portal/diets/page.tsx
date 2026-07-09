'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { getObject } from '@/components/http';
import { FileText, Lock, ChevronRight, Clock } from 'lucide-react';

interface Diet {
  id: number;
  title: string;
  status: string;
  published_at?: string;
  created_at: string;
  locked: boolean;
  reason: string | null;
  latest: { ocr_data?: string } | null;
}

function previewItems(ocr?: string): string {
  if (!ocr) return '';
  try {
    const o = JSON.parse(ocr);
    const items = [o.breakfast?.items?.[0], o.lunch?.items?.[0], o.dinner?.items?.[0]].filter(Boolean);
    return items.join(' · ');
  } catch { return ''; }
}

export default function PortalDietsPage() {
  const [diets, setDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getObject<{ diets: Diet[] }>('/api/portal/diets')
      .then((d) => setDiets(Array.isArray(d?.diets) ? (d!.diets as Diet[]) : []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <PortalShell><div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 rounded-full" style={{ borderColor: '#EDE7F6', borderTopColor: '#5C3A9E' }} /></div></PortalShell>;
  }

  return (
    <PortalShell>
      <h1 className="text-2xl font-black text-[#1A1A2E] mb-1">My Diet Plans</h1>
      <p className="text-gray-500 mb-6">Plans your dietitian has prepared for you.</p>

      {diets.length === 0 && (
        <div className="rounded-2xl border bg-white p-8 text-center text-gray-500" style={{ borderColor: '#EDE7F6' }}>No diet plans yet.</div>
      )}

      <div className="space-y-4">
        {diets.map((d) => d.locked ? (
          <div key={d.id} className="rounded-2xl border bg-white p-5 relative overflow-hidden" style={{ borderColor: '#EDE7F6' }}>
            <div className="blur-locked">
              <h3 className="font-bold text-[#1A1A2E]">{d.title}</h3>
              <div className="mt-3 space-y-2">
                <div className="h-3 rounded bg-gray-200 w-3/4" />
                <div className="h-3 rounded bg-gray-200 w-2/3" />
                <div className="h-3 rounded bg-gray-200 w-1/2" />
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ background: 'rgba(253,252,247,0.7)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: '#FCE4EC' }}>
                <Lock size={18} style={{ color: '#C2185B' }} />
              </div>
              <p className="font-bold text-[#1A1A2E]">{d.title}</p>
              <p className="text-sm mt-1" style={{ color: '#C2185B' }}>
                {d.reason === 'payment_pending' ? 'Locked — payment not received yet.' : 'Not released yet — your dietitian is finalising it.'}
              </p>
              {d.reason === 'payment_pending' && (
                <p className="text-xs text-gray-500 mt-1">Complete your payment to unlock this plan. Message your dietitian on WhatsApp if you&apos;ve already paid.</p>
              )}
            </div>
          </div>
        ) : (
          <Link key={d.id} href={`/portal/diets/${d.id}`}
            className="block rounded-2xl border bg-white p-5 hover:-translate-y-0.5 transition-transform" style={{ borderColor: '#EDE7F6' }}>
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="font-bold text-[#1A1A2E] flex items-center gap-2"><FileText size={16} style={{ color: '#5C3A9E' }} /> {d.title}</h3>
                <p className="text-sm text-gray-500 mt-1 truncate">{previewItems(d.latest?.ocr_data) || 'View your full plan'}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Clock size={11} /> {d.published_at ? new Date(d.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</p>
              </div>
              <ChevronRight size={20} className="text-gray-400 shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </PortalShell>
  );
}
