'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { DietView, DietOcr } from '@/components/portal/DietView';
import { getObject } from '@/components/http';
import { ChevronLeft, Download, Lock, ClipboardList } from 'lucide-react';

interface DietResp {
  locked?: boolean;
  reason?: string;
  title?: string;
  plan?: { id: number; title: string; issues?: string; published_at?: string };
  versions?: { id: number; version_number: number; ocr_data?: string }[];
}

export default function PortalDietDetail({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('');
  const [data, setData] = useState<DietResp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { params.then(({ id }) => setId(id)); }, [params]);
  useEffect(() => {
    if (!id) return;
    getObject<DietResp>(`/api/portal/diets/${id}`).then((d) => setData(d ?? {})).finally(() => setLoading(false));
  }, [id]);

  if (loading || !data) {
    return <PortalShell><div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 rounded-full" style={{ borderColor: '#EDE7F6', borderTopColor: '#5C3A9E' }} /></div></PortalShell>;
  }

  const back = <Link href="/portal/diets" className="inline-flex items-center gap-1 text-sm font-semibold mb-4" style={{ color: '#5C3A9E' }}><ChevronLeft size={16} /> All plans</Link>;

  if (data.locked) {
    return (
      <PortalShell>
        {back}
        <div className="rounded-3xl border bg-white p-10 text-center" style={{ borderColor: '#EDE7F6' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#FCE4EC' }}><Lock size={22} style={{ color: '#C2185B' }} /></div>
          <h1 className="text-xl font-black text-[#1A1A2E]">{data.title}</h1>
          <p className="text-sm mt-2" style={{ color: '#C2185B' }}>
            {data.reason === 'payment_pending' ? 'This plan is locked until your payment is received.' : 'This plan has not been released yet.'}
          </p>
          {data.reason === 'payment_pending' && (
            <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto">Complete your payment to unlock the full plan. If you&apos;ve already paid, message your dietitian on WhatsApp and it&apos;ll be unlocked.</p>
          )}
        </div>
      </PortalShell>
    );
  }

  let ocr: DietOcr = {};
  const latest = data.versions?.[0];
  try { ocr = latest?.ocr_data ? JSON.parse(latest.ocr_data) : {}; } catch { ocr = {}; }

  return (
    <PortalShell>
      {back}
      <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A2E]">{data.plan?.title}</h1>
          {data.plan?.published_at && <p className="text-xs text-gray-400 mt-1">Published {new Date(data.plan.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
        </div>
        <Link href={`/portal/diets/${id}/print`} target="_blank"
          className="px-4 py-2.5 rounded-full font-bold text-white flex items-center gap-2 text-sm"
          style={{ background: 'linear-gradient(135deg, #5C3A9E, #3D2070)', boxShadow: '0 6px 25px rgba(92,58,158,0.4)' }}>
          <Download size={15} /> Download PDF
        </Link>
      </div>

      {data.plan?.issues && (
        <div className="rounded-2xl border p-4 mb-5" style={{ borderColor: '#EDE7F6', background: '#F5F0FA' }}>
          <p className="text-xs font-semibold mb-1 flex items-center gap-1" style={{ color: '#5C3A9E' }}><ClipboardList size={13} /> Notes from your consultation</p>
          <p className="text-sm text-gray-700">{data.plan.issues}</p>
        </div>
      )}

      <DietView ocr={ocr} />
    </PortalShell>
  );
}
