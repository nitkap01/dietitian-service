'use client';

import { useEffect, useState } from 'react';
import { PortalShell } from '@/components/portal/PortalShell';
import { getObject } from '@/components/http';
import { Mail, Phone, MapPin, User } from 'lucide-react';

interface Me {
  client: { name: string; email: string; phone: string; age: number; gender: string; health_goal: string; address?: string };
  plan: { name: string; price: number; end_date?: string } | null;
  latestWeight: { weight_kg: number } | null;
  metricsCount: number;
}
const GOAL_LABEL: Record<string, string> = { weight_management: 'Weight Management', sugar_control: 'Sugar Control', pcos: 'PCOS Management', other: 'General Wellness' };

export default function PortalProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getObject<Me>('/api/portal/me').then((d) => setMe(d)).finally(() => setLoading(false)); }, []);

  if (loading || !me) {
    return <PortalShell><div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 rounded-full" style={{ borderColor: '#EDE7F6', borderTopColor: '#5C3A9E' }} /></div></PortalShell>;
  }

  const c = me.client;
  return (
    <PortalShell>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black" style={{ background: 'linear-gradient(135deg, #5C3A9E, #3D2070)' }}>{c.name.charAt(0)}</div>
        <div>
          <h1 className="text-2xl font-black text-[#1A1A2E]">{c.name}</h1>
          <p className="text-gray-500">{GOAL_LABEL[c.health_goal]} · {c.age} yrs · {c.gender}</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 mb-5 space-y-3" style={{ borderColor: '#EDE7F6' }}>
        <div className="flex items-center gap-3 text-sm"><Mail size={15} className="text-gray-400" /><span className="text-gray-700">{c.email}</span></div>
        <div className="flex items-center gap-3 text-sm"><Phone size={15} className="text-gray-400" /><span className="text-gray-700">{c.phone}</span></div>
        {c.address && <div className="flex items-start gap-3 text-sm"><MapPin size={15} className="text-gray-400 mt-0.5" /><span className="text-gray-700">{c.address}</span></div>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <div className="rounded-2xl border bg-white p-5" style={{ borderColor: '#EDE7F6' }}>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#5C3A9E' }}>Current Plan</p>
          <p className="font-black text-[#1A1A2E] mt-1">{me.plan?.name || 'No active plan'}</p>
          {me.plan && <p className="text-sm text-gray-500">₹{me.plan.price.toLocaleString('en-IN')}{me.plan.end_date ? ` · until ${new Date(me.plan.end_date).toLocaleDateString('en-IN')}` : ''}</p>}
        </div>
        <div className="rounded-2xl border bg-white p-5" style={{ borderColor: '#EDE7F6' }}>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#2D6B4F' }}>Weight</p>
          <p className="font-black text-[#1A1A2E] mt-1">{me.latestWeight ? `${me.latestWeight.weight_kg} kg` : '—'}</p>
          <p className="text-sm text-gray-500">{me.metricsCount} reading{me.metricsCount === 1 ? '' : 's'} on record</p>
        </div>
      </div>

      <div className="rounded-2xl p-4 text-sm flex items-center gap-2" style={{ background: '#EDE7F6', color: '#5C3A9E' }}>
        <User size={15} /> To update your details or reset your password, contact your dietitian.
      </div>
    </PortalShell>
  );
}
