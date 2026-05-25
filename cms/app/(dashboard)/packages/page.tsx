'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Package } from '../../server/types';
import { Plus, Package as PackageIcon, IndianRupee, Users, Clock } from 'lucide-react';

const CATEGORY_OPTIONS = [
  { value: 'weight_management', label: 'Weight Management' },
  { value: 'pcos', label: 'PCOS Management' },
  { value: 'sugar_control', label: 'Sugar / Diabetes Control' },
  { value: 'other', label: 'Other' },
];

const categoryColors: Record<string, 'emerald' | 'purple' | 'blue' | 'gray'> = {
  weight_management: 'emerald',
  pcos: 'purple',
  sugar_control: 'blue',
  other: 'gray',
};

type PackageWithClients = Package & { active_clients: number };

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageWithClients[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', category: 'weight_management', price: '', duration_months: '1' });

  async function fetchPackages() {
    const res = await fetch('/api/packages');
    const data = await res.json();
    setPackages(data);
    setLoading(false);
  }

  useEffect(() => { fetchPackages(); }, []);

  async function createPackage() {
    if (!form.name || !form.price) return;
    setSaving(true);
    await fetch('/api/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price), duration_months: Number(form.duration_months) }),
    });
    await fetchPackages();
    setShowModal(false);
    setForm({ name: '', description: '', category: 'weight_management', price: '', duration_months: '1' });
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{packages.length} packages available</p>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} /> Create Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                <PackageIcon size={18} />
              </div>
              <Badge variant={categoryColors[pkg.category] || 'gray'}>
                {CATEGORY_OPTIONS.find((o) => o.value === pkg.category)?.label || pkg.category}
              </Badge>
            </div>

            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{pkg.name}</h3>
            {pkg.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{pkg.description}</p>
            )}

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-3 text-center">
              <div>
                <IndianRupee size={14} className="mx-auto text-emerald-500 mb-1" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">₹{pkg.price.toLocaleString('en-IN')}</p>
                <p className="text-xs text-slate-500">per month</p>
              </div>
              <div>
                <Clock size={14} className="mx-auto text-blue-500 mb-1" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">{pkg.duration_months}</p>
                <p className="text-xs text-slate-500">month(s)</p>
              </div>
              <div>
                <Users size={14} className="mx-auto text-purple-500 mb-1" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">{pkg.active_clients}</p>
                <p className="text-xs text-slate-500">active</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Package">
        <div className="p-6 space-y-4">
          <Input
            label="Package Name"
            placeholder="e.g. Weight Management Premium"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            options={CATEGORY_OPTIONS}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (₹ per month)"
              type="number"
              placeholder="5000"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              required
            />
            <Input
              label="Duration (months)"
              type="number"
              placeholder="1"
              value={form.duration_months}
              onChange={(e) => setForm((f) => ({ ...f, duration_months: e.target.value }))}
              min="1"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe what this package includes..."
              rows={3}
              className="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={createPackage} loading={saving}>Create Package</Button>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
