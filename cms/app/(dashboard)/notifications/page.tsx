'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Notification, Client } from '@/lib/types';
import { Plus, Bell, MessageCircle, CreditCard, ToggleLeft, ToggleRight, Smartphone } from 'lucide-react';

const TYPE_OPTIONS = [
  { value: 'health_metric_request', label: 'Health Metric Request' },
  { value: 'payment_reminder', label: 'Payment Reminder' },
  { value: 'whatsapp', label: 'WhatsApp Message' },
];

const FREQ_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom (days)' },
];

const typeIcons = {
  health_metric_request: Bell,
  payment_reminder: CreditCard,
  whatsapp: MessageCircle,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState<Notification | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    client_id: '',
    type: 'health_metric_request',
    frequency: 'weekly',
    custom_days: '',
    message: '',
  });

  async function fetchAll() {
    const [nRes, cRes] = await Promise.all([
      fetch('/api/notifications'),
      fetch('/api/clients'),
    ]);
    const [n, c] = await Promise.all([nRes.json(), cRes.json()]);
    setNotifications(n);
    setClients(c);
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, []);

  async function createNotification() {
    if (!form.client_id || !form.type) return;
    setSaving(true);
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: Number(form.client_id),
        type: form.type,
        frequency: form.frequency,
        custom_days: form.custom_days ? Number(form.custom_days) : undefined,
        message: form.message,
      }),
    });
    await fetchAll();
    setShowCreateModal(false);
    setForm({ client_id: '', type: 'health_metric_request', frequency: 'weekly', custom_days: '', message: '' });
    setSaving(false);
  }

  async function toggleNotification(id: number, current: number) {
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: current ? 0 : 1 }),
    });
    fetchAll();
  }

  function getDefaultMessage(type: string, clientName: string) {
    if (type === 'health_metric_request') return `Hi ${clientName}! Please share your weight for this week. Keep up the great work! 💪`;
    if (type === 'payment_reminder') return `Hi ${clientName}! This is a reminder that your monthly payment is due. Please make the payment to continue your program. Thank you!`;
    return `Hi ${clientName}! `;
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
        <p className="text-sm text-slate-500 dark:text-slate-400">{notifications.length} notifications configured</p>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus size={16} /> Schedule Notification
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 && (
          <Card><p className="text-sm text-slate-500 text-center py-8">No notifications set up yet</p></Card>
        )}
        {notifications.map((n) => {
          const Icon = typeIcons[n.type] || Bell;
          const isActive = n.is_active === 1;
          return (
            <Card key={n.id} padding="sm">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{n.client_name}</p>
                    <Badge variant={n.type === 'health_metric_request' ? 'emerald' : n.type === 'payment_reminder' ? 'yellow' : 'blue'}>
                      {TYPE_OPTIONS.find((o) => o.value === n.type)?.label}
                    </Badge>
                    {n.frequency && <Badge variant="gray">{n.frequency}</Badge>}
                    {!isActive && <Badge variant="red">Paused</Badge>}
                  </div>
                  {n.message && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{n.message}</p>
                  )}
                  {n.next_send_at && (
                    <p className="text-xs text-slate-400 mt-1">
                      Next: {new Date(n.next_send_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {(n.type === 'whatsapp' || n.message) && (
                    <Button size="sm" variant="ghost" onClick={() => setShowWhatsAppModal(n)}>
                      <Smartphone size={14} /> Preview
                    </Button>
                  )}
                  <button
                    onClick={() => toggleNotification(n.id, n.is_active)}
                    className={`p-1 rounded transition-colors ${isActive ? 'text-emerald-500 hover:text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}
                    title={isActive ? 'Pause' : 'Resume'}
                  >
                    {isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Schedule Notification">
        <div className="p-6 space-y-4">
          <Select
            label="Client"
            value={form.client_id}
            onChange={(e) => {
              const client = clients.find((c) => String(c.id) === e.target.value);
              setForm((f) => ({
                ...f,
                client_id: e.target.value,
                message: client ? getDefaultMessage(f.type, client.name) : f.message,
              }));
            }}
            options={[{ value: '', label: 'Select client...' }, ...clients.map((c) => ({ value: String(c.id), label: c.name }))]}
          />
          <Select
            label="Notification Type"
            value={form.type}
            onChange={(e) => {
              const client = clients.find((c) => String(c.id) === form.client_id);
              setForm((f) => ({
                ...f,
                type: e.target.value,
                message: client ? getDefaultMessage(e.target.value, client.name) : f.message,
              }));
            }}
            options={TYPE_OPTIONS}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Frequency"
              value={form.frequency}
              onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))}
              options={FREQ_OPTIONS}
            />
            {form.frequency === 'custom' && (
              <Input
                label="Every N days"
                type="number"
                placeholder="7"
                value={form.custom_days}
                onChange={(e) => setForm((f) => ({ ...f, custom_days: e.target.value }))}
              />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Message to send..."
              rows={3}
              className="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={createNotification} loading={saving}>Schedule</Button>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* WhatsApp Preview Modal */}
      {showWhatsAppModal && (
        <Modal isOpen={!!showWhatsAppModal} onClose={() => setShowWhatsAppModal(null)} title="WhatsApp Message Preview">
          <div className="p-6">
            <div className="bg-[#0d1117] rounded-2xl p-4">
              {/* WhatsApp-like header */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-700">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                  {showWhatsAppModal.client_name?.charAt(0)}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{showWhatsAppModal.client_name}</p>
                  <p className="text-xs text-slate-400">{(showWhatsAppModal as unknown as { client_phone?: string }).client_phone || '+91-XXXXXXXXXX'}</p>
                </div>
              </div>
              {/* Chat bubble */}
              <div className="flex justify-end">
                <div className="max-w-xs bg-emerald-700 text-white text-sm rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                  <p>{showWhatsAppModal.message || 'No message configured'}</p>
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-emerald-300">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} ✓✓</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                This is a preview of what would be sent via WhatsApp. In production, integrate with WhatsApp Business API or Twilio.
              </p>
            </div>
            <Button className="mt-4 w-full" variant="secondary" onClick={() => setShowWhatsAppModal(null)}>Close</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
