'use client';

import { useEffect, useState } from 'react';
import { PortalShell } from '@/components/portal/PortalShell';
import { getArray } from '@/components/http';
import { Bell, FileText, Scale, CheckCircle } from 'lucide-react';

interface Note { id: number; type: string; title: string; body?: string; is_read: number; created_at: string }

const ICON: Record<string, typeof Bell> = { diet_published: FileText, weight_requested: Scale, payment_received: CheckCircle, general: Bell };

export default function PortalNotificationsPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArray<Note>('/api/portal/notifications').then((d) => setNotes(d)).finally(() => setLoading(false));
    fetch('/api/portal/notifications', { method: 'PATCH' }).catch(() => {});
  }, []);

  if (loading) {
    return <PortalShell><div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 rounded-full" style={{ borderColor: '#EDE7F6', borderTopColor: '#5C3A9E' }} /></div></PortalShell>;
  }

  return (
    <PortalShell>
      <h1 className="text-2xl font-black text-[#1A1A2E] mb-1">Notifications</h1>
      <p className="text-gray-500 mb-6">Updates from your dietitian.</p>

      {notes.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 text-center text-gray-500" style={{ borderColor: '#EDE7F6' }}>No notifications yet.</div>
      ) : (
        <div className="space-y-3">
          {notes.map((n) => {
            const Icon = ICON[n.type] || Bell;
            return (
              <div key={n.id} className="rounded-2xl border bg-white p-4 flex items-start gap-3" style={{ borderColor: '#EDE7F6' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EDE7F6' }}><Icon size={16} style={{ color: '#5C3A9E' }} /></div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#1A1A2E]">{n.title}</p>
                  {n.body && <p className="text-sm text-gray-500 mt-0.5">{n.body}</p>}
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PortalShell>
  );
}
