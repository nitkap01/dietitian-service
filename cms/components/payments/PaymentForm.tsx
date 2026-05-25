'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Client, Package } from '../../app/server/types';

interface PaymentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentForm({ onSuccess, onCancel }: PaymentFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [form, setForm] = useState({
    client_id: '',
    package_id: '',
    amount: '',
    status: 'paid',
    notes: '',
    due_date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/clients').then((r) => r.json()),
      fetch('/api/packages').then((r) => r.json()),
    ]).then(([c, p]) => {
      setClients(c);
      setPackages(p);
    });
  }, []);

  // Auto-fill price from package
  const selectedPackage = packages.find((p) => String(p.id) === form.package_id);
  useEffect(() => {
    if (selectedPackage && !form.amount) {
      setForm((f) => ({ ...f, amount: String(selectedPackage.price) }));
    }
  }, [selectedPackage, form.amount]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.client_id || !form.amount) { setError('Client and amount are required'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: Number(form.client_id),
          package_id: form.package_id ? Number(form.package_id) : undefined,
          amount: Number(form.amount),
          status: form.status,
          notes: form.notes,
          due_date: form.due_date,
        }),
      });
      if (!res.ok) { setError('Failed to record payment'); return; }
      onSuccess();
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <Select
        label="Client"
        value={form.client_id}
        onChange={(e) => setForm((f) => ({ ...f, client_id: e.target.value }))}
        options={[{ value: '', label: 'Select client...' }, ...clients.map((c) => ({ value: String(c.id), label: c.name }))]}
      />
      <Select
        label="Package (optional)"
        value={form.package_id}
        onChange={(e) => setForm((f) => ({ ...f, package_id: e.target.value, amount: '' }))}
        options={[{ value: '', label: 'No package / direct payment' }, ...packages.map((p) => ({ value: String(p.id), label: `${p.name} — ₹${p.price.toLocaleString('en-IN')}` }))]}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Amount (₹)"
          type="number"
          placeholder="5000"
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          required
        />
        <Select
          label="Status"
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          options={[
            { value: 'paid', label: 'Paid' },
            { value: 'pending', label: 'Pending' },
            { value: 'unpaid', label: 'Unpaid' },
          ]}
        />
      </div>
      <Input
        label="Due Date"
        type="date"
        value={form.due_date}
        onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          placeholder="Payment method, transaction ID, etc."
          rows={2}
          className="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>Record Payment</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
