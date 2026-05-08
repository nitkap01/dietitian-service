'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Database, User, Bell, Palette } from 'lucide-react';

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [reseedLoading, setReseedLoading] = useState(false);
  const [reseedMsg, setReseedMsg] = useState('');
  const [businessForm, setBusinessForm] = useState({
    businessName: 'NutriCare Dietitian Services',
    dietitianName: 'Dr. Priya Iyer',
    email: 'contact@nutricare.in',
    phone: '+91-9876543200',
    whatsappNumber: '+91-9876543200',
  });

  async function reseedDB() {
    setReseedLoading(true);
    setReseedMsg('');
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        setReseedMsg('Database re-seeded successfully! Refresh to see changes.');
      } else {
        setReseedMsg('Failed to re-seed. Check server logs.');
      }
    } finally {
      setReseedLoading(false);
    }
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800)); // Simulate save
    setSaving(false);
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Business Info */}
      <Card>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <User size={16} className="text-emerald-500" /> Business Information
        </h2>
        <form onSubmit={saveSettings} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Business Name"
              value={businessForm.businessName}
              onChange={(e) => setBusinessForm((f) => ({ ...f, businessName: e.target.value }))}
            />
            <Input
              label="Dietitian Name"
              value={businessForm.dietitianName}
              onChange={(e) => setBusinessForm((f) => ({ ...f, dietitianName: e.target.value }))}
            />
            <Input
              label="Contact Email"
              type="email"
              value={businessForm.email}
              onChange={(e) => setBusinessForm((f) => ({ ...f, email: e.target.value }))}
            />
            <Input
              label="Phone"
              value={businessForm.phone}
              onChange={(e) => setBusinessForm((f) => ({ ...f, phone: e.target.value }))}
            />
            <Input
              label="WhatsApp Number"
              value={businessForm.whatsappNumber}
              hint="Used for sending notifications"
              onChange={(e) => setBusinessForm((f) => ({ ...f, whatsappNumber: e.target.value }))}
            />
          </div>
          <Button type="submit" loading={saving}>Save Changes</Button>
        </form>
      </Card>

      {/* Appearance */}
      <Card>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <Palette size={16} className="text-emerald-500" /> Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</p>
            <p className="text-xs text-slate-500">Toggle between light and dark mode</p>
          </div>
          <ThemeToggle />
        </div>
      </Card>

      {/* Notification Defaults */}
      <Card>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <Bell size={16} className="text-emerald-500" /> Notification Defaults
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Weekly weight reminders</p>
              <p className="text-xs text-slate-500">Auto-schedule weekly reminders for active clients</p>
            </div>
            <div className="w-10 h-6 bg-emerald-500 rounded-full flex items-center justify-end pr-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full shadow" />
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Payment reminders</p>
              <p className="text-xs text-slate-500">Send reminders 3 days before payment is due</p>
            </div>
            <div className="w-10 h-6 bg-emerald-500 rounded-full flex items-center justify-end pr-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full shadow" />
            </div>
          </div>
        </div>
      </Card>

      {/* Database */}
      <Card>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <Database size={16} className="text-emerald-500" /> Database
        </h2>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-600 dark:text-slate-400 font-mono">
            DATABASE_URL=./dietitian.db (SQLite via better-sqlite3)
          </div>
          <div className="pt-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reset & Re-seed Database</p>
            <p className="text-xs text-slate-500 mb-3">This will clear all data and insert fresh sample data. Use for demo/testing only.</p>
            <Button variant="danger" onClick={reseedDB} loading={reseedLoading} size="sm">
              Re-seed Sample Data
            </Button>
            {reseedMsg && (
              <p className={`text-xs mt-2 ${reseedMsg.includes('success') ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                {reseedMsg}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
