'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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
  notes: string;
}

export function ClientForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', age: '', gender: 'female', health_goal: 'weight_management', notes: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

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
      setSuccess(true);
      setTimeout(() => router.push(`/clients/${client.id}`), 1000);
    } catch {
      setApiError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Full Name"
            placeholder="Priya Sharma"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            error={errors.name}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="priya@email.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            error={errors.email}
            required
          />
          <Input
            label="Phone Number"
            placeholder="+91-9876543210"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            error={errors.phone}
            required
          />
          <Input
            label="Age"
            type="number"
            placeholder="30"
            value={form.age}
            onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
            error={errors.age}
            min="1"
            max="120"
            required
          />
          <Select
            label="Gender"
            value={form.gender}
            onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
            options={GENDER_OPTIONS}
          />
          <Select
            label="Health Goal"
            value={form.health_goal}
            onChange={(e) => setForm((f) => ({ ...f, health_goal: e.target.value }))}
            options={GOAL_OPTIONS}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Any relevant health history, dietary restrictions, medications..."
            rows={3}
            className="px-3 py-2 text-sm rounded-lg border transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        {apiError && (
          <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            {apiError}
          </div>
        )}

        {success && (
          <div className="px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm">
            Client created successfully! Redirecting...
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading} disabled={success}>
            Create Client
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
