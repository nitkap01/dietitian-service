'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Database, User, Sparkles, Palette, MessageCircle } from 'lucide-react';

interface SettingsState {
  ai_provider: string;
  ai_model: string;
  ai_api_key_set: boolean;
  payment_detection_enabled: string;
  weight_capture_enabled: string;
  business_name: string;
  dietitian_name: string;
  whatsapp_number: string;
  whatsapp_provider: string;
  portal_url: string;
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`w-10 h-6 rounded-full flex items-center transition-colors ${on ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'} px-1`}>
      <div className="w-4 h-4 bg-white rounded-full shadow" />
    </button>
  );
}

export default function SettingsPage() {
  const [s, setS] = useState<SettingsState | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [reseedLoading, setReseedLoading] = useState(false);
  const [reseedMsg, setReseedMsg] = useState('');

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then(setS);
  }, []);

  function set<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setS((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function save() {
    if (!s) return;
    setSaving(true);
    setSavedMsg('');
    const payload: Record<string, unknown> = {
      ai_provider: s.ai_provider, ai_model: s.ai_model,
      payment_detection_enabled: s.payment_detection_enabled,
      weight_capture_enabled: s.weight_capture_enabled,
      business_name: s.business_name, dietitian_name: s.dietitian_name,
      whatsapp_number: s.whatsapp_number, whatsapp_provider: s.whatsapp_provider,
      portal_url: s.portal_url,
    };
    if (apiKey.trim()) payload.ai_api_key = apiKey.trim();
    const res = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    setS(data);
    setApiKey('');
    setSavedMsg('Settings saved.');
    setSaving(false);
    setTimeout(() => setSavedMsg(''), 2500);
  }

  async function removeKey() {
    if (!s) return;
    await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ remove_ai_api_key: true }) });
    setS({ ...s, ai_api_key_set: false });
    setApiKey('');
  }

  async function reseedDB() {
    setReseedLoading(true); setReseedMsg('');
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      setReseedMsg(res.ok ? 'Database re-seeded successfully! Refresh to see changes.' : 'Failed to re-seed. Check server logs.');
    } finally { setReseedLoading(false); }
  }

  if (!s) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-2xl space-y-6">
      {/* AI payment detection */}
      <Card>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
          <Sparkles size={16} className="text-emerald-500" /> AI &amp; Automation
        </h2>
        <p className="text-xs text-slate-500 mb-5">Scans WhatsApp chats to auto-detect payments and capture weights. Without a key it uses a free heuristic fallback.</p>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="AI Provider" value={s.ai_provider} onChange={(e) => set('ai_provider', e.target.value)}
              options={[{ value: 'claude', label: 'Claude (Anthropic)' }, { value: 'openai', label: 'OpenAI' }]} />
            <Input label="Model" value={s.ai_model} onChange={(e) => set('ai_model', e.target.value)}
              hint={s.ai_provider === 'openai' ? 'e.g. gpt-4o-mini' : 'e.g. claude-opus-4-8'} />
          </div>
          <div>
            <Input label="API Key" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
              placeholder={s.ai_api_key_set ? '•••••••••• (saved — leave blank to keep)' : 'Paste your API key'} />
            {s.ai_api_key_set && (
              <button onClick={removeKey} className="text-xs text-red-500 mt-1 hover:underline">Remove saved key</button>
            )}
          </div>
          <div className="flex items-center justify-between py-1">
            <div><p className="text-sm font-medium text-slate-700 dark:text-slate-300">Auto-detect payments from chat</p><p className="text-xs text-slate-500">&quot;payment done&quot;, UPI confirmations, screenshots</p></div>
            <Toggle on={s.payment_detection_enabled !== '0'} onClick={() => set('payment_detection_enabled', s.payment_detection_enabled === '0' ? '1' : '0')} />
          </div>
          <div className="flex items-center justify-between py-1">
            <div><p className="text-sm font-medium text-slate-700 dark:text-slate-300">Capture weight replies from chat</p><p className="text-xs text-slate-500">Parses a weight number from inbound messages</p></div>
            <Toggle on={s.weight_capture_enabled !== '0'} onClick={() => set('weight_capture_enabled', s.weight_capture_enabled === '0' ? '1' : '0')} />
          </div>
        </div>
      </Card>

      {/* Business info */}
      <Card>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2"><User size={16} className="text-emerald-500" /> Business Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Business Name" value={s.business_name} onChange={(e) => set('business_name', e.target.value)} />
          <Input label="Dietitian Name" value={s.dietitian_name} onChange={(e) => set('dietitian_name', e.target.value)} />
          <Input label="WhatsApp Number" value={s.whatsapp_number} onChange={(e) => set('whatsapp_number', e.target.value)} />
          <Input label="Portal URL" value={s.portal_url} onChange={(e) => set('portal_url', e.target.value)} hint="Shared with clients in credential messages" />
        </div>
      </Card>

      {/* WhatsApp */}
      <Card>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2"><MessageCircle size={16} className="text-emerald-500" /> WhatsApp</h2>
        <Select label="Provider" value={s.whatsapp_provider} onChange={(e) => set('whatsapp_provider', e.target.value)}
          options={[{ value: 'simulator', label: 'Simulator (local testing, free)' }, { value: 'meta', label: 'Meta Cloud API (wire later)' }, { value: 'twilio', label: 'Twilio (wire later)' }]} />
        <p className="text-xs text-slate-500 mt-2">Simulator records outbound messages in-app so you can test the full flow for free. Real providers need a webhook + credentials.</p>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={save} loading={saving}>Save Settings</Button>
        {savedMsg && <span className="text-xs text-emerald-600 dark:text-emerald-400">{savedMsg}</span>}
      </div>

      {/* Appearance */}
      <Card>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2"><Palette size={16} className="text-emerald-500" /> Appearance</h2>
        <div className="flex items-center justify-between">
          <div><p className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</p><p className="text-xs text-slate-500">Admin panel light/dark mode</p></div>
          <ThemeToggle />
        </div>
      </Card>

      {/* Database */}
      <Card>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2"><Database size={16} className="text-emerald-500" /> Database</h2>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reset &amp; Re-seed Database</p>
        <p className="text-xs text-slate-500 mb-3">Clears all data and inserts fresh demo data (keeps your saved AI key). For demo/testing only.</p>
        <Button variant="danger" onClick={reseedDB} loading={reseedLoading} size="sm">Re-seed Sample Data</Button>
        {reseedMsg && <p className={`text-xs mt-2 ${reseedMsg.includes('success') ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>{reseedMsg}</p>}
      </Card>
    </div>
  );
}
