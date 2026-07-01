'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Package, Client } from '../../server/types';
import { Plus, Package as PackageIcon, IndianRupee, Users, Clock, Scale, Check, Pencil, Trash2, UserPlus } from 'lucide-react';

const CATEGORY_OPTIONS = [
  { value: 'weight_management', label: 'Weight Management' },
  { value: 'pcos', label: 'PCOS Management' },
  { value: 'sugar_control', label: 'Sugar / Diabetes Control' },
  { value: 'other', label: 'Other' },
];

const categoryColors: Record<string, 'emerald' | 'purple' | 'blue' | 'gray'> = {
  weight_management: 'emerald', pcos: 'purple', sugar_control: 'blue', other: 'gray',
};

type PackageWithClients = Package & { active_clients: number };

const emptyForm = {
  id: 0, name: '', description: '', category: 'weight_management', price: '', duration_months: '1',
  benefits: '', request_weights: false, weight_frequency: 'weekly',
};

function parseBenefits(raw?: string): string[] {
  if (!raw) return [];
  try { const a = JSON.parse(raw); return Array.isArray(a) ? a : []; } catch { return []; }
}

export default function PlansPage() {
  const [packages, setPackages] = useState<PackageWithClients[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const [assignFor, setAssignFor] = useState<PackageWithClients | null>(null);
  const [assignClient, setAssignClient] = useState('');
  const [assignMsg, setAssignMsg] = useState('');

  async function fetchAll() {
    const [pRes, cRes] = await Promise.all([fetch('/api/packages'), fetch('/api/clients')]);
    setPackages(await pRes.json());
    setClients(await cRes.json());
    setLoading(false);
  }
  useEffect(() => { fetchAll(); }, []);

  // 1-month plans can only request weekly.
  const freqOptions = Number(form.duration_months) <= 1
    ? [{ value: 'weekly', label: 'Weekly' }]
    : [{ value: 'weekly', label: 'Weekly' }, { value: 'biweekly', label: 'Every 15 days' }, { value: 'monthly', label: 'Monthly' }];

  function openCreate() { setForm({ ...emptyForm }); setShowModal(true); }
  function openEdit(pkg: PackageWithClients) {
    setForm({
      id: pkg.id, name: pkg.name, description: pkg.description || '', category: pkg.category,
      price: String(pkg.price), duration_months: String(pkg.duration_months),
      benefits: parseBenefits(pkg.benefits).join('\n'),
      request_weights: !!pkg.request_weights, weight_frequency: pkg.weight_frequency || 'weekly',
    });
    setShowModal(true);
  }

  async function savePackage() {
    if (!form.name || !form.price) return;
    setSaving(true);
    const payload = {
      name: form.name, description: form.description, category: form.category,
      price: Number(form.price), duration_months: Number(form.duration_months),
      benefits: form.benefits.split('\n').map((s) => s.trim()).filter(Boolean),
      request_weights: form.request_weights,
      weight_frequency: Number(form.duration_months) <= 1 ? 'weekly' : form.weight_frequency,
    };
    const url = form.id ? `/api/packages/${form.id}` : '/api/packages';
    await fetch(url, { method: form.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    await fetchAll();
    setShowModal(false);
    setForm({ ...emptyForm });
    setSaving(false);
  }

  async function deletePackage(pkg: PackageWithClients) {
    if (!confirm(`Delete plan "${pkg.name}"?`)) return;
    const res = await fetch(`/api/packages/${pkg.id}`, { method: 'DELETE' });
    if (!res.ok) { const d = await res.json(); alert(d.error || 'Failed to delete'); return; }
    fetchAll();
  }

  async function assignPlan() {
    if (!assignFor || !assignClient) return;
    setAssignMsg('');
    const res = await fetch('/api/client-packages', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: Number(assignClient), package_id: assignFor.id }),
    });
    if (res.ok) {
      setAssignMsg('Assigned! A pending payment was created and (if enabled) weight requests scheduled.');
      fetchAll();
      setTimeout(() => { setAssignFor(null); setAssignClient(''); setAssignMsg(''); }, 1400);
    } else {
      const d = await res.json();
      setAssignMsg(d.error || 'Failed to assign');
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{packages.length} plans</p>
        <Button onClick={openCreate}><Plus size={16} /> Create Plan</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {packages.map((pkg) => {
          const benefits = parseBenefits(pkg.benefits);
          return (
            <Card key={pkg.id} className="flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"><PackageIcon size={18} /></div>
                <Badge variant={categoryColors[pkg.category] || 'gray'}>{CATEGORY_OPTIONS.find((o) => o.value === pkg.category)?.label || pkg.category}</Badge>
              </div>

              <h3 className="text-base font-semibold text-slate-900 dark:text-white">{pkg.name}</h3>
              {pkg.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{pkg.description}</p>}

              {benefits.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {benefits.slice(0, 4).map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <Check size={13} className="text-brand-500 mt-0.5 shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              )}

              {pkg.request_weights ? (
                <div className="mt-3">
                  <Badge variant="blue"><Scale size={11} className="mr-1" /> Weight requests · {pkg.weight_frequency}</Badge>
                </div>
              ) : null}

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-3 text-center">
                <div><IndianRupee size={14} className="mx-auto text-brand-500 mb-1" /><p className="text-sm font-bold text-slate-900 dark:text-white">₹{pkg.price.toLocaleString('en-IN')}</p><p className="text-xs text-slate-500">total</p></div>
                <div><Clock size={14} className="mx-auto text-blue-500 mb-1" /><p className="text-sm font-bold text-slate-900 dark:text-white">{pkg.duration_months}</p><p className="text-xs text-slate-500">month(s)</p></div>
                <div><Users size={14} className="mx-auto text-purple-500 mb-1" /><p className="text-sm font-bold text-slate-900 dark:text-white">{pkg.active_clients}</p><p className="text-xs text-slate-500">active</p></div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setAssignFor(pkg)}><UserPlus size={13} /> Assign</Button>
                <Button size="sm" variant="ghost" onClick={() => openEdit(pkg)}><Pencil size={13} /></Button>
                <Button size="sm" variant="ghost" onClick={() => deletePackage(pkg)}><Trash2 size={13} className="text-red-500" /></Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create / Edit */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={form.id ? 'Edit Plan' : 'Create New Plan'} size="lg">
        <div className="p-6 space-y-4">
          <Input label="Plan Name" placeholder="e.g. Weight Management Premium" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} options={CATEGORY_OPTIONS} />
            <Select label="Duration" value={form.duration_months}
              onChange={(e) => setForm((f) => ({ ...f, duration_months: e.target.value }))}
              options={[{ value: '1', label: '1 month' }, { value: '2', label: '2 months' }, { value: '3', label: '3 months' }]} />
          </div>
          <Input label="Price (₹, total for the plan)" type="number" placeholder="5000" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Describe this plan..." rows={2}
              className="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Benefits (one per line)</label>
            <textarea value={form.benefits} onChange={(e) => setForm((f) => ({ ...f, benefits: e.target.value }))} placeholder={'Weekly check-ins\nWhatsApp support\nFull meal planning'} rows={3}
              className="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" checked={form.request_weights} onChange={(e) => setForm((f) => ({ ...f, request_weights: e.target.checked }))} className="w-4 h-4 accent-brand-600" />
              Request Weights automatically
            </label>
            {form.request_weights && (
              <div className="mt-3">
                <Select label="Frequency" value={form.weight_frequency} onChange={(e) => setForm((f) => ({ ...f, weight_frequency: e.target.value }))} options={freqOptions} />
                {Number(form.duration_months) <= 1 && <p className="text-xs text-slate-400 mt-1">1-month plans support weekly only.</p>}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={savePackage} loading={saving}>{form.id ? 'Save Changes' : 'Create Plan'}</Button>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Assign */}
      <Modal isOpen={!!assignFor} onClose={() => { setAssignFor(null); setAssignMsg(''); }} title={`Assign: ${assignFor?.name || ''}`}>
        <div className="p-6 space-y-4">
          <Select label="Client" value={assignClient} onChange={(e) => setAssignClient(e.target.value)}
            options={[{ value: '', label: 'Select a client...' }, ...clients.map((c) => ({ value: String(c.id), label: `${c.name} · ${c.phone}` }))]} />
          <p className="text-xs text-slate-500">Assigning creates a pending payment (₹{assignFor?.price.toLocaleString('en-IN')}) and, if the plan requests weights, schedules them.</p>
          {assignMsg && <p className={`text-xs ${assignMsg.includes('Assigned') ? 'text-brand-600' : 'text-red-500'}`}>{assignMsg}</p>}
          <div className="flex gap-3">
            <Button onClick={assignPlan} disabled={!assignClient}>Assign Plan</Button>
            <Button variant="outline" onClick={() => { setAssignFor(null); setAssignMsg(''); }}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
