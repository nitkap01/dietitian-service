'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { WeightChart } from '@/components/charts/WeightChart';
import { StatusBadge, GoalBadge } from '@/components/clients/StatusBadge';
import { Client, HealthMetric, DietPlan, DietPlanVersion, Payment, MealItem, WhatsAppMessage } from '@/lib/types';
import {
  ChevronLeft, Mail, Phone, User, Package, CreditCard, Activity, FileText, Plus,
  AlertTriangle, Sparkles, Loader2, X, Send, ChevronRight, MessageCircle, Utensils,
} from 'lucide-react';

type ClientDetail = Client & {
  package_name?: string;
  package_price?: number;
  package_id?: number;
  package_start?: string;
  package_end?: string;
};
type DietPlanWithVersions = DietPlan & { versions: DietPlanVersion[]; version_count: number };

type MealSlot = { itemId?: number; name: string; calories: number; protein: string; carbs: string; fat: string; custom?: boolean };
type DietBuilder = { title: string; breakfast: MealSlot[]; lunch: MealSlot[]; snacks: MealSlot[]; dinner: MealSlot[] };

const MEAL_TYPES = ['breakfast', 'lunch', 'snacks', 'dinner'] as const;
const MEAL_ICONS: Record<string, string> = { breakfast: '🌅', lunch: '☀️', snacks: '🍎', dinner: '🌙' };

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>('');
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [dietPlans, setDietPlans] = useState<DietPlanWithVersions[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [waMessages, setWaMessages] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'diet' | 'payments' | 'whatsapp'>('overview');

  // Modals
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showDietBuilder, setShowDietBuilder] = useState(false);
  const [showDietDetail, setShowDietDetail] = useState<DietPlanWithVersions | null>(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [inactiveReason, setInactiveReason] = useState('');
  const [saving, setSaving] = useState(false);

  // Diet builder state
  const [dietBuilder, setDietBuilder] = useState<DietBuilder>({ title: '', breakfast: [], lunch: [], snacks: [], dinner: [] });
  const [mealLibrary, setMealLibrary] = useState<MealItem[]>([]);
  const [recFilter, setRecFilter] = useState<typeof MEAL_TYPES[number]>('breakfast');
  const [libSearch, setLibSearch] = useState('');

  // AI analysis state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [aiPlan, setAiPlan] = useState<DietPlanWithVersions | null>(null);

  // WhatsApp
  const [waDraft, setWaDraft] = useState('');
  const [waSending, setWaSending] = useState(false);

  useEffect(() => {
    params.then(({ id: paramId }) => setId(paramId));
  }, [params]);

  const fetchAll = useCallback(async (clientId: string) => {
    const [clientRes, metricsRes, dietRes, paymentsRes, waRes] = await Promise.all([
      fetch(`/api/clients/${clientId}`),
      fetch(`/api/clients/${clientId}/metrics`),
      fetch(`/api/clients/${clientId}/diet-plans`),
      fetch('/api/payments'),
      fetch(`/api/whatsapp?client_id=${clientId}`),
    ]);
    const [c, m, d, p, wa] = await Promise.all([
      clientRes.json(), metricsRes.json(), dietRes.json(), paymentsRes.json(), waRes.json(),
    ]);
    setClient(c);
    setMetrics(m);
    setDietPlans(d);
    setPayments(p.filter((pay: Payment) => pay.client_id === Number(clientId)));
    setWaMessages(wa);
    setLoading(false);
  }, []);

  useEffect(() => { if (id) fetchAll(id); }, [id, fetchAll]);

  async function addWeight() {
    if (!weightInput || !id) return;
    setSaving(true);
    await fetch(`/api/clients/${id}/metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weight_kg: parseFloat(weightInput) }),
    });
    await fetchAll(id);
    setShowWeightModal(false);
    setWeightInput('');
    setSaving(false);
  }

  async function openDietBuilder() {
    const res = await fetch(`/api/meals`);
    const items: MealItem[] = await res.json();
    setMealLibrary(items);
    setDietBuilder({ title: '', breakfast: [], lunch: [], snacks: [], dinner: [] });
    setShowDietBuilder(true);
  }

  function addMealToSlot(slot: typeof MEAL_TYPES[number], item: MealItem) {
    const entry: MealSlot = {
      itemId: item.id,
      name: item.name,
      calories: item.calories_per_serving || 0,
      protein: item.protein || '0g',
      carbs: item.carbs || '0g',
      fat: item.fat || '0g',
    };
    setDietBuilder((prev) => ({ ...prev, [slot]: [...prev[slot], entry] }));
  }

  function removeFromSlot(slot: typeof MEAL_TYPES[number], idx: number) {
    setDietBuilder((prev) => ({ ...prev, [slot]: prev[slot].filter((_, i) => i !== idx) }));
  }

  function slotCalories(slot: typeof MEAL_TYPES[number]) {
    return dietBuilder[slot].reduce((sum, m) => sum + m.calories, 0);
  }

  function totalCalories() {
    return MEAL_TYPES.reduce((sum, s) => sum + slotCalories(s), 0);
  }

  async function saveDietPlan() {
    if (!dietBuilder.title || !id) return;
    setSaving(true);
    const ocrData = {
      breakfast: { items: dietBuilder.breakfast.map((m) => m.name), calories: slotCalories('breakfast'), protein: dietBuilder.breakfast.reduce((s, m) => s + parseFloat(m.protein), 0) + 'g', carbs: dietBuilder.breakfast.reduce((s, m) => s + parseFloat(m.carbs), 0) + 'g', fat: dietBuilder.breakfast.reduce((s, m) => s + parseFloat(m.fat), 0) + 'g' },
      lunch: { items: dietBuilder.lunch.map((m) => m.name), calories: slotCalories('lunch'), protein: dietBuilder.lunch.reduce((s, m) => s + parseFloat(m.protein), 0) + 'g', carbs: dietBuilder.lunch.reduce((s, m) => s + parseFloat(m.carbs), 0) + 'g', fat: dietBuilder.lunch.reduce((s, m) => s + parseFloat(m.fat), 0) + 'g' },
      snacks: { items: dietBuilder.snacks.map((m) => m.name), calories: slotCalories('snacks'), protein: dietBuilder.snacks.reduce((s, m) => s + parseFloat(m.protein), 0) + 'g', carbs: dietBuilder.snacks.reduce((s, m) => s + parseFloat(m.carbs), 0) + 'g', fat: dietBuilder.snacks.reduce((s, m) => s + parseFloat(m.fat), 0) + 'g' },
      dinner: { items: dietBuilder.dinner.map((m) => m.name), calories: slotCalories('dinner'), protein: dietBuilder.dinner.reduce((s, m) => s + parseFloat(m.protein), 0) + 'g', carbs: dietBuilder.dinner.reduce((s, m) => s + parseFloat(m.carbs), 0) + 'g', fat: dietBuilder.dinner.reduce((s, m) => s + parseFloat(m.fat), 0) + 'g' },
      totalCalories: totalCalories(),
      notes: `Created via diet builder. ${new Date().toLocaleDateString('en-IN')}`,
    };
    await fetch(`/api/clients/${id}/diet-plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: dietBuilder.title, ocrData }),
    });
    await fetchAll(id);
    setShowDietBuilder(false);
    setSaving(false);
  }

  async function runAIAnalysis(plan: DietPlanWithVersions) {
    setAiPlan(plan);
    setAiResult('');
    setShowAIModal(true);
    setAiLoading(true);
    const version = plan.versions[0];
    let ocrData = null;
    try { ocrData = version?.ocr_data ? JSON.parse(version.ocr_data) : null; } catch { /* ignore */ }
    const res = await fetch('/api/diet-plans/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ocrData, clientGoal: client?.health_goal, clientName: client?.name }),
    });
    const data = await res.json();
    setAiResult(data.analysis || 'Unable to analyze at this time.');
    setAiLoading(false);
  }

  async function deactivateClient() {
    if (!id) return;
    setSaving(true);
    await fetch(`/api/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...client, status: 'inactive', inactive_reason: inactiveReason }),
    });
    await fetchAll(id);
    setShowDeactivateModal(false);
    setSaving(false);
  }

  async function sendWA(direction: 'outbound' | 'inbound') {
    if (!waDraft.trim() || !id) return;
    setWaSending(true);
    await fetch('/api/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: id, direction, message: waDraft.trim(), phone_number: client?.phone }),
    });
    const res = await fetch(`/api/whatsapp?client_id=${id}`);
    setWaMessages(await res.json());
    setWaDraft('');
    setWaSending(false);
  }

  const unreadWA = waMessages.filter((m) => m.direction === 'inbound' && !m.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Client not found</p>
        <Link href="/clients" className="text-emerald-600 text-sm mt-2 inline-block">Back to clients</Link>
      </div>
    );
  }

  const totalPaid = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pendingAmount = payments.filter((p) => p.status !== 'paid').reduce((s, p) => s + p.amount, 0);

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'metrics', label: `Metrics (${metrics.length})` },
    { key: 'diet', label: `Diet Plans (${dietPlans.length})` },
    { key: 'payments', label: `Payments (${payments.length})` },
    { key: 'whatsapp', label: `WhatsApp${unreadWA > 0 ? ` (${unreadWA})` : ''}` },
  ] as const;

  const recItems = mealLibrary.filter((item) => {
    const matchCat = item.category === recFilter || item.category === 'any';
    const matchSearch = item.name.toLowerCase().includes(libSearch.toLowerCase());
    const alreadyAdded = dietBuilder[recFilter].some((s) => s.itemId === item.id);
    return matchCat && matchSearch && !alreadyAdded;
  });

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <Link href="/clients" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
          <ChevronLeft size={16} /> Back to Clients
        </Link>
        <div className="flex gap-2">
          {client.status === 'active' ? (
            <Button variant="danger" size="sm" onClick={() => setShowDeactivateModal(true)}>
              <AlertTriangle size={14} /> Deactivate
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={async () => {
              await fetch(`/api/clients/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...client, status: 'active', inactive_reason: null }),
              });
              fetchAll(id);
            }}>
              Reactivate
            </Button>
          )}
        </div>
      </div>

      {/* Header card */}
      <Card>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
              {client.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{client.name}</h2>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <StatusBadge status={client.status} />
                <GoalBadge goal={client.health_goal} />
                <span className="text-xs text-slate-500">{client.age} yrs • {client.gender}</span>
              </div>
              {client.inactive_reason && (
                <p className="text-xs text-red-500 mt-1">Reason: {client.inactive_reason}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
            <div>
              <p className="text-xs text-slate-500">Paid</p>
              <p className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">₹{totalPaid.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Pending</p>
              <p className="text-base sm:text-lg font-bold text-yellow-600 dark:text-yellow-400">₹{pendingAmount.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Metrics</p>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{metrics.length}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-0.5 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 sm:px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <User size={16} className="text-emerald-500" /> Contact Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-slate-400" />
                <span className="text-slate-600 dark:text-slate-400">{client.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-slate-400" />
                <span className="text-slate-600 dark:text-slate-400">{client.phone}</span>
              </div>
            </div>
            {client.notes && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 mb-1">Notes</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{client.notes}</p>
              </div>
            )}
            <p className="text-xs text-slate-400 mt-4">Joined {new Date(client.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Package size={16} className="text-emerald-500" /> Active Package
            </h3>
            {client.package_name ? (
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{client.package_name}</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">₹{client.package_price?.toLocaleString('en-IN')}<span className="text-sm font-normal text-slate-400">/month</span></p>
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <p>Start: {client.package_start ? new Date(client.package_start).toLocaleDateString('en-IN') : '—'}</p>
                  <p>End: {client.package_end ? new Date(client.package_end).toLocaleDateString('en-IN') : 'Ongoing'}</p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <p>No active package</p>
                <Link href="/packages" className="text-emerald-600 text-xs mt-1 inline-block hover:underline">Assign a package →</Link>
              </div>
            )}
          </Card>

          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity size={16} className="text-emerald-500" /> Weight Trend
              </h3>
              <Button size="sm" variant="outline" onClick={() => setShowWeightModal(true)}>
                <Plus size={14} /> Add Reading
              </Button>
            </div>
            <WeightChart metrics={metrics} />
          </Card>
        </div>
      )}

      {/* Metrics tab */}
      {activeTab === 'metrics' && (
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Weight History</h3>
            <Button size="sm" onClick={() => setShowWeightModal(true)}><Plus size={14} /> Add Reading</Button>
          </div>
          <WeightChart metrics={metrics} />
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700 space-y-2">
            {[...metrics].reverse().map((m) => (
              <div key={m.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{m.weight_kg} kg</span>
                  <Badge variant={m.source === 'email' ? 'blue' : 'gray'} size="sm">{m.source}</Badge>
                </div>
                <span className="text-xs text-slate-500">{new Date(m.recorded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Diet Plans tab */}
      {activeTab === 'diet' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={openDietBuilder}>
              <Utensils size={14} /> Build Diet Plan
            </Button>
          </div>
          {dietPlans.length === 0 && (
            <Card><p className="text-sm text-slate-500 text-center py-8">No diet plans yet. Use the builder to create one.</p></Card>
          )}
          {dietPlans.map((plan) => (
            <Card key={plan.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText size={16} className="text-emerald-500" /> {plan.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">{plan.version_count} version(s) · Created {new Date(plan.created_at).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => runAIAnalysis(plan)}>
                    <Sparkles size={13} /> AI Review
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowDietDetail(plan)}>
                    View
                  </Button>
                </div>
              </div>
              {plan.versions[0] && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500">Latest: v{plan.versions[0].version_number} — {plan.versions[0].changelog}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Payments tab */}
      {activeTab === 'payments' && (
        <Card>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-slate-500">Total paid: <strong className="text-emerald-600 dark:text-emerald-400">₹{totalPaid.toLocaleString('en-IN')}</strong></p>
            <Link href="/payments">
              <Button size="sm" variant="outline"><CreditCard size={14} /> Record Payment</Button>
            </Link>
          </div>
          <div className="space-y-2">
            {payments.length === 0 && <p className="text-sm text-slate-500 text-center py-8">No payments recorded</p>}
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-slate-100 dark:border-slate-700">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">₹{p.amount.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-slate-500">{p.package_name || 'Direct payment'} · {p.notes}</p>
                </div>
                <div className="text-right">
                  <Badge variant={p.status === 'paid' ? 'green' : p.status === 'unpaid' ? 'red' : 'yellow'}>{p.status}</Badge>
                  <p className="text-xs text-slate-500 mt-1">{p.due_date ? new Date(p.due_date).toLocaleDateString('en-IN') : '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* WhatsApp tab */}
      {activeTab === 'whatsapp' && (
        <div className="space-y-3">
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden" style={{ height: '480px' }}>
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <MessageCircle size={16} className="text-emerald-500" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">WhatsApp — {client.name}</span>
              <span className="text-xs text-slate-400">{client.phone}</span>
            </div>
            <div className="flex-1 overflow-y-auto px-4 space-y-2.5 bg-slate-50 dark:bg-slate-900/30">
              {waMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-slate-400">No messages yet. Use the input below to log a conversation.</p>
                </div>
              ) : waMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'} py-0.5`}>
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm ${
                    msg.direction === 'outbound'
                      ? 'bg-emerald-600 text-white rounded-br-sm'
                      : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-bl-sm'
                  }`}>
                    <p className="leading-relaxed">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.direction === 'outbound' ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {new Date(msg.received_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} {new Date(msg.received_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700 pt-3 bg-white dark:bg-slate-800">
              <div className="flex gap-2">
                <textarea
                  value={waDraft}
                  onChange={(e) => setWaDraft(e.target.value)}
                  placeholder="Type a message..."
                  rows={2}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex flex-col gap-1.5">
                  <button onClick={() => sendWA('outbound')} disabled={waSending || !waDraft.trim()} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1">
                    <Send size={11} /> Send
                  </button>
                  <button onClick={() => sendWA('inbound')} disabled={waSending || !waDraft.trim()} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 disabled:opacity-50 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1">
                    <ChevronRight size={11} /> Record
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">"Send" = your message · "Record" = log a reply you received on your phone</p>
            </div>
          </div>
        </div>
      )}

      {/* Weight Modal */}
      <Modal isOpen={showWeightModal} onClose={() => setShowWeightModal(false)} title="Log Weight Reading">
        <div className="p-6 space-y-4">
          <Input label="Weight (kg)" type="number" step="0.1" placeholder="e.g. 74.5" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} />
          <div className="flex gap-3">
            <Button onClick={addWeight} loading={saving}>Save</Button>
            <Button variant="outline" onClick={() => setShowWeightModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Diet Builder Modal — full-screen split layout */}
      {showDietBuilder && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <Utensils size={20} className="text-emerald-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Build Diet Plan</h2>
            </div>
            <button onClick={() => setShowDietBuilder(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
              <X size={20} />
            </button>
          </div>

          {/* Plan title */}
          <div className="px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <input
              type="text"
              placeholder="Plan title, e.g. Week 1 Weight Loss Plan"
              value={dietBuilder.title}
              onChange={(e) => setDietBuilder({ ...dietBuilder, title: e.target.value })}
              className="w-full sm:max-w-sm px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Split body */}
          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
            {/* LEFT: Meal slots */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Meal Plan</p>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{totalCalories()} kcal total</span>
              </div>
              {MEAL_TYPES.map((slot) => (
                <div key={slot} className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div
                    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer ${slot === recFilter ? 'bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700'}`}
                    onClick={() => setRecFilter(slot)}
                  >
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{MEAL_ICONS[slot]} {slot.charAt(0).toUpperCase() + slot.slice(1)}</span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{slotCalories(slot)} kcal</span>
                  </div>
                  <div className="p-3 space-y-1.5">
                    {dietBuilder[slot].length === 0 && (
                      <p className="text-xs text-slate-400 italic py-1">No items yet. Click a recommendation to add →</p>
                    )}
                    {dietBuilder[slot].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 group">
                        <div>
                          <span className="text-sm text-slate-900 dark:text-white">{item.name}</span>
                          <span className="text-xs text-slate-500 ml-2">{item.calories} kcal · P:{item.protein} C:{item.carbs} F:{item.fat}</span>
                        </div>
                        <button onClick={() => removeFromSlot(slot, idx)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: Recommendations */}
            <div className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 flex flex-col bg-slate-50 dark:bg-slate-800/30">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Recommendations</p>
                <div className="flex gap-1 mb-2 flex-wrap">
                  {MEAL_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setRecFilter(t)}
                      className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${recFilter === t ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600'}`}
                    >
                      {MEAL_ICONS[t]}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Search meals..."
                  value={libSearch}
                  onChange={(e) => setLibSearch(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                {client.health_goal !== 'other' && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1.5">★ Showing items good for {client.health_goal.replace('_', ' ')}</p>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {recItems.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6">All items for this meal are added, or no matches.</p>
                )}
                {recItems.map((item) => {
                  let tags: string[] = [];
                  try { tags = item.health_tags ? JSON.parse(item.health_tags) : []; } catch { /* ignore */ }
                  const isRecommended = tags.includes(client.health_goal);
                  return (
                    <button
                      key={item.id}
                      onClick={() => addMealToSlot(recFilter, item)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all hover:shadow-sm group ${
                        isRecommended
                          ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10 hover:border-emerald-400'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{item.name}</span>
                        <span className="text-xs text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-medium">+ Add</span>
                      </div>
                      <div className="flex gap-2 mt-0.5 text-xs text-slate-500">
                        {item.calories_per_serving && <span className="text-emerald-600 dark:text-emerald-400 font-medium">{item.calories_per_serving} kcal</span>}
                        {item.serving_size && <span>{item.serving_size}</span>}
                      </div>
                      {isRecommended && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">★ Good for {client.health_goal.replace('_', ' ')}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between">
            <p className="text-sm text-slate-500">{totalCalories()} kcal planned across {MEAL_TYPES.reduce((s, t) => s + dietBuilder[t].length, 0)} items</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDietBuilder(false)}>Cancel</Button>
              <Button onClick={saveDietPlan} loading={saving} disabled={!dietBuilder.title}>Save Plan</Button>
            </div>
          </div>
        </div>
      )}

      {/* Diet Detail Modal */}
      {showDietDetail && (
        <Modal isOpen={!!showDietDetail} onClose={() => setShowDietDetail(null)} title={showDietDetail.title} size="xl">
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-500">{showDietDetail.version_count} version(s)</p>
              <Button size="sm" variant="outline" onClick={() => { setShowDietDetail(null); runAIAnalysis(showDietDetail); }}>
                <Sparkles size={13} /> AI Review
              </Button>
            </div>
            {showDietDetail.versions.map((v) => {
              let ocr: Record<string, { items?: string[]; calories?: number; protein?: string; carbs?: string; fat?: string }> | null = null;
              try { ocr = v.ocr_data ? JSON.parse(v.ocr_data) : null; } catch { /* ignore */ }
              return (
                <div key={v.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-900 dark:text-white">Version {v.version_number}</h4>
                    <span className="text-xs text-slate-500">{new Date(v.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  {v.changelog && <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-3">Change: {v.changelog}</p>}
                  {ocr && (
                    <div className="space-y-2">
                      {(['breakfast', 'lunch', 'snacks', 'dinner'] as const).map((meal) => ocr![meal] && (
                        <div key={meal} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 capitalize">{MEAL_ICONS[meal]} {meal}</p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">{ocr![meal].calories} kcal</p>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{ocr![meal].items?.join(', ')}</p>
                          <div className="flex gap-3 mt-1 text-xs text-slate-500">
                            <span>P: {ocr![meal].protein}</span>
                            <span>C: {ocr![meal].carbs}</span>
                            <span>F: {ocr![meal].fat}</span>
                          </div>
                        </div>
                      ))}
                      {'totalCalories' in ocr && (
                        <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Total Daily Calories</span>
                          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{(ocr as Record<string, unknown>).totalCalories as number} kcal</span>
                        </div>
                      )}
                      {'notes' in ocr && <p className="text-xs text-slate-500 italic">{(ocr as Record<string, unknown>).notes as string}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Modal>
      )}

      {/* AI Analysis Modal */}
      <Modal isOpen={showAIModal} onClose={() => { setShowAIModal(false); setAiResult(''); }} title={`AI Review — ${aiPlan?.title}`} size="lg">
        <div className="p-6">
          {aiLoading ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <Loader2 size={32} className="animate-spin text-emerald-500" />
              <p className="text-sm text-slate-500">Analyzing diet plan with Claude AI...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">AI-Powered Nutritional Analysis</span>
              </div>
              <div className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 space-y-3">
                {aiResult.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={i} className="font-bold text-slate-900 dark:text-white mt-4">{line.replace(/\*\*/g, '')}</p>;
                  }
                  if (line.startsWith('•')) {
                    return <p key={i} className="pl-3 text-sm">{line}</p>;
                  }
                  return line.trim() ? <p key={i} className="text-sm">{line}</p> : null;
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-400">Analysis powered by Claude AI · For professional review only</p>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Deactivate Modal */}
      <Modal isOpen={showDeactivateModal} onClose={() => setShowDeactivateModal(false)} title="Deactivate Client">
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">Are you sure you want to deactivate <strong>{client.name}</strong>?</p>
          <Input label="Reason for deactivation" placeholder="e.g. Payment stopped, relocated..." value={inactiveReason} onChange={(e) => setInactiveReason(e.target.value)} />
          <div className="flex gap-3">
            <Button variant="danger" onClick={deactivateClient} loading={saving}>Deactivate</Button>
            <Button variant="outline" onClick={() => setShowDeactivateModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
