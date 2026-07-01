'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CheckCircle, KeyRound, Send } from 'lucide-react';

const GENDER_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
];

const GOAL_OPTIONS = [
  { value: 'weight_management', label: 'Weight Management' },
  { value: 'pcos', label: 'PCOS Management' },
  { value: 'sugar_control', label: 'Sugar / Diabetes Control' },
  { value: 'other', label: 'Other / General Wellness' },
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  health_goal: string;
  address: string;
  weight: string;
  notes: string;
}

interface CreatedClient {
  id: number;
  name: string;
  phone: string;
}

export function ClientForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', age: '', gender: 'female', health_goal: 'weight_management',
    address: '', weight: '', notes: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const [created, setCreated] = useState<CreatedClient | null>(null);
  const [creds, setCreds] = useState<{ username: string; password: string; portal_url: string; sent: boolean } | null>(null);
  const [credLoading, setCredLoading] = useState<'send' | 'only' | null>(null);

  function validate() {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 1) e.age = 'Valid age required';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setErrors({});
    setLoading(true);
    setApiError('');

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });
      if (!res.ok) {
        const data = await res.json();
        setApiError(data.error || 'Failed to create client');
        return;
      }
      const client = await res.json();
      setCreated({ id: client.id, name: client.name, phone: client.phone });
    } catch {
      setApiError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function setupCredentials(send: boolean) {
    if (!created) return;
    setCredLoading(send ? 'send' : 'only');
    try {
      const res = await fetch(`/api/clients/${created.id}/credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ send }),
      });
      const data = await res.json();
      if (res.ok) setCreds(data);
    } finally {
      setCredLoading(null);
    }
  }

  if (created) {
    return (
      <Card>
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
          <CheckCircle size={20} />
          <h2 className="text-base font-semibold">{created.name} onboarded</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          Set up the client&apos;s portal login. Their username is their phone number and a secure
          password is generated automatically. You can send it to them on WhatsApp.
        </p>

        {!creds ? (
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setupCredentials(true)} loading={credLoading === 'send'}>
              <Send size={15} /> Generate &amp; send via WhatsApp
            </Button>
            <Button variant="outline" onClick={() => setupCredentials(false)} loading={credLoading === 'only'}>
              <KeyRound size={15} /> Generate only
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-4 space-y-2">
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Portal credentials</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
              <div><span className="text-slate-500">Username</span><p className="font-mono font-medium text-slate-900 dark:text-white">{creds.username}</p></div>
              <div><span className="text-slate-500">Password</span><p className="font-mono font-medium text-slate-900 dark:text-white">{creds.password}</p></div>
              <div><span className="text-slate-500">Portal</span><p className="font-medium text-slate-900 dark:text-white break-all">{creds.portal_url}</p></div>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              {creds.sent ? '✓ Sent to the client on WhatsApp.' : 'Not sent — copy these or use the client page to send later.'}
              {' '}This password is shown once.
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-5">
          <Link href={`/clients/${created.id}`}>
            <Button variant="secondary">Go to client profile</Button>
          </Link>
          <Link href="/clients">
            <Button variant="ghost">Back to clients</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="Full Name" placeholder="Priya Sharma" value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={errors.name} required />
          <Input label="Email Address" type="email" placeholder="priya@email.com" value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} error={errors.email} required />
          <Input label="Phone Number (portal username)" placeholder="9876543210" value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} error={errors.phone} hint="Also used as the WhatsApp number" required />
          <Input label="Age" type="number" placeholder="30" value={form.age}
            onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} error={errors.age} min="1" max="120" required />
          <Select label="Gender" value={form.gender}
            onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))} options={GENDER_OPTIONS} />
          <Select label="Health Goal" value={form.health_goal}
            onChange={(e) => setForm((f) => ({ ...f, health_goal: e.target.value }))} options={GOAL_OPTIONS} />
          <Input label="Current Weight (kg)" type="number" step="0.1" placeholder="72.5" value={form.weight}
            onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))} hint="Optional — recorded as the first reading" />
          <Input label="Address" placeholder="City / full address" value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes (optional)</label>
          <textarea value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Any relevant health history, dietary restrictions, medications..." rows={3}
            className="px-3 py-2 text-sm rounded-lg border transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
        </div>

        {apiError && (
          <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            {apiError}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>Create Client</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
