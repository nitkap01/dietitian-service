'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { getArray, getObject } from '@/components/http';
import { Activity, FileText, ChevronRight, Scale, Lock, CheckCircle, Bell } from 'lucide-react';

interface Me {
  client: { name: string; health_goal: string };
  plan: { name: string; price: number; description?: string; benefits?: string; end_date?: string } | null;
  latestWeight: { weight_kg: number; recorded_at: string } | null;
  metricsCount: number;
  hasPaid: boolean;
  publishedDiets: number;
}
interface Note { id: number; title: string; body?: string; created_at: string; is_read: number }

const GOAL_LABEL: Record<string, string> = { weight_management: 'Weight Management', sugar_control: 'Sugar Control', pcos: 'PCOS Management', other: 'General Wellness' };

function parseBenefits(raw?: string): string[] { if (!raw) return []; try { const a = JSON.parse(raw); return Array.isArray(a) ? a : []; } catch { return []; } }

export default function PortalHome() {
  const [me, setMe] = useState<Me | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getObject<Me>('/api/portal/me'),
      getArray<Note>('/api/portal/notifications'),
    ]).then(([m, n]) => { setMe(m); setNotes(n.slice(0, 4)); }).finally(() => setLoading(false));
  }, []);

  if (loading || !me) {
    return <PortalShell><div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 rounded-full" style={{ borderColor: '#EDE7F6', borderTopColor: '#5C3A9E' }} /></div></PortalShell>;
  }

  const firstName = me.client.name.split(' ')[0];
  const benefits = parseBenefits(me.plan?.benefits);

  return (
    <PortalShell>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-[#1A1A2E]">Hi {firstName} 👋</h1>
        <p className="text-gray-500 mt-1">{GOAL_LABEL[me.client.health_goal] || 'Your health journey'}</p>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border bg-white p-5" style={{ borderColor: '#EDE7F6' }}>
          <Scale size={18} style={{ color: '#5C3A9E' }} />
          <p className="text-2xl font-black text-[#1A1A2E] mt-2">{me.latestWeight ? `${me.latestWeight.weight_kg}` : '—'}<span className="text-sm font-normal text-gray-400"> kg</span></p>
          <p className="text-xs text-gray-500">Latest weight</p>
        </div>
        <div className="rounded-2xl border bg-white p-5" style={{ borderColor: '#EDE7F6' }}>
          <FileText size={18} style={{ color: '#2D6B4F' }} />
          <p className="text-2xl font-black text-[#1A1A2E] mt-2">{me.publishedDiets}</p>
          <p className="text-xs text-gray-500">Diet plans</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 col-span-2 sm:col-span-1" style={{ borderColor: '#EDE7F6' }}>
          {me.hasPaid ? <CheckCircle size={18} style={{ color: '#2D6B4F' }} /> : <Lock size={18} style={{ color: '#C2185B' }} />}
          <p className="text-lg font-black text-[#1A1A2E] mt-2">{me.hasPaid ? 'Active' : 'Payment due'}</p>
          <p className="text-xs text-gray-500">Account status</p>
        </div>
      </div>

      {/* plan */}
      {me.plan && (
        <div className="rounded-3xl border bg-white p-6 mb-6" style={{ borderColor: '#EDE7F6' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#5C3A9E' }}>Your plan</p>
              <h2 className="text-xl font-black text-[#1A1A2E] mt-1">{me.plan.name}</h2>
            </div>
            <p className="text-2xl font-black" style={{ color: '#5C3A9E' }}>₹{me.plan.price.toLocaleString('en-IN')}</p>
          </div>
          {benefits.length > 0 && (
            <ul className="mt-4 grid sm:grid-cols-2 gap-2">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle size={15} style={{ color: '#2D6B4F' }} className="mt-0.5 shrink-0" /> {b}</li>
              ))}
            </ul>
          )}
          {!me.hasPaid && (
            <div className="mt-4 rounded-xl p-3 text-sm" style={{ background: '#FCE4EC', color: '#C2185B' }}>
              Your payment is pending — your diet plans are ready but locked until it&apos;s received.
            </div>
          )}
        </div>
      )}

      {/* quick links */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Link href="/portal/diets" className="rounded-2xl border bg-white p-5 flex items-center justify-between hover:-translate-y-0.5 transition-transform" style={{ borderColor: '#EDE7F6' }}>
          <span className="flex items-center gap-3 font-semibold text-[#1A1A2E]"><FileText size={18} style={{ color: '#5C3A9E' }} /> My diet plans</span>
          <ChevronRight size={18} className="text-gray-400" />
        </Link>
        <Link href="/portal/weight" className="rounded-2xl border bg-white p-5 flex items-center justify-between hover:-translate-y-0.5 transition-transform" style={{ borderColor: '#EDE7F6' }}>
          <span className="flex items-center gap-3 font-semibold text-[#1A1A2E]"><Activity size={18} style={{ color: '#2D6B4F' }} /> Weight history</span>
          <ChevronRight size={18} className="text-gray-400" />
        </Link>
      </div>

      {/* recent alerts */}
      {notes.length > 0 && (
        <div>
          <h3 className="font-bold text-[#1A1A2E] mb-3 flex items-center gap-2"><Bell size={16} style={{ color: '#5C3A9E' }} /> Recent alerts</h3>
          <div className="space-y-2">
            {notes.map((n) => (
              <div key={n.id} className="rounded-xl border bg-white p-3" style={{ borderColor: '#EDE7F6' }}>
                <p className="text-sm font-semibold text-[#1A1A2E]">{n.title}</p>
                {n.body && <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </PortalShell>
  );
}
