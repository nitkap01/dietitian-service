'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { WeightChart } from '@/components/charts/WeightChart';
import { StatusBadge, GoalBadge } from '@/components/clients/StatusBadge';
import { DietRecommendations } from '@/components/clients/DietRecommendations';
import { getArray, getObject } from '@/components/http';
import { Client, HealthMetric, DietPlan, DietPlanVersion, Payment, MealItem, Package } from '../../../server/types';
import {
  ChevronLeft, Mail, Phone, MapPin, User, Package as PackageIcon, CreditCard, Activity, FileText, Plus,
  AlertTriangle, Sparkles, Loader2, X, Utensils, KeyRound, Send, Lock, Unlock, Scale,
  TableIcon, LineChart, ClipboardList,
} from 'lucide-react';

type ClientDetail = Client & {
  package_name?: string; package_price?: number; package_id?: number; package_start?: string; package_end?: string;
};
type DietPlanWithVersions = DietPlan & { versions: DietPlanVersion[]; version_count: number };
type MealSlot = { itemId?: number; name: string; calories: number; protein: string; carbs: string; fat: string };
type DietBuilder = { title: string; issues: string; breakfast: MealSlot[]; lunch: MealSlot[]; snacks: MealSlot[]; dinner: MealSlot[] };

const MEAL_TYPES = ['breakfast', 'lunch', 'snacks', 'dinner'] as const;
const MEAL_ICONS: Record<string, string> = { breakfast: '🌅', lunch: '☀️', snacks: '🍎', dinner: '🌙' };
const PAGE = 5;

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>('');
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [dietPlans, setDietPlans] = useState<DietPlanWithVersions[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'diet' | 'payments'>('overview');

  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showDietBuilder, setShowDietBuilder] = useState(false);
  const [showDietDetail, setShowDietDetail] = useState<DietPlanWithVersions | null>(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [inactiveReason, setInactiveReason] = useState('');
  const [saving, setSaving] = useState(false);

  const [dietBuilder, setDietBuilder] = useState<DietBuilder>({ title: '', issues: '', breakfast: [], lunch: [], snacks: [], dinner: [] });
  const [mealLibrary, setMealLibrary] = useState<MealItem[]>([]);
  const [recFilter, setRecFilter] = useState<typeof MEAL_TYPES[number]>('breakfast');
  const [libSearch, setLibSearch] = useState('');

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [aiPlan, setAiPlan] = useState<DietPlanWithVersions | null>(null);

  const [creds, setCreds] = useState<{ username: string; password: string; portal_url: string; sent: boolean } | null>(null);
  const [credLoading, setCredLoading] = useState<'send' | 'only' | null>(null);
  const [assignPkg, setAssignPkg] = useState('');
  const [weightReq, setWeightReq] = useState(false);
  const [toast, setToast] = useState('');

  const [metricsView, setMetricsView] = useState<'table' | 'graph'>('table');
  const [metricsPage, setMetricsPage] = useState(0);

  useEffect(() => { params.then(({ id: paramId }) => setId(paramId)); }, [params]);

  const fetchAll = useCallback(async (clientId: string) => {
    const [c, m, d, p, pk] = await Promise.all([
      getObject<ClientDetail>(`/api/clients/${clientId}`),
      getArray<HealthMetric>(`/api/clients/${clientId}/metrics`),
      getArray<DietPlanWithVersions>(`/api/clients/${clientId}/diet-plans`),
      getArray<Payment>('/api/payments'),
      getArray<Package>('/api/packages'),
    ]);
    setClient(c && typeof c.id === 'number' ? c : null);
    setMetrics(m);
    setDietPlans(d);
    setPayments(p.filter((pay) => pay.client_id === Number(clientId)));
    setPackages(pk);
    setLoading(false);
  }, []);

  useEffect(() => { if (id) fetchAll(id); }, [id, fetchAll]);

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  async function addWeight() {
    if (!weightInput || !id) return;
    setSaving(true);
    await fetch(`/api/clients/${id}/metrics`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ weight_kg: parseFloat(weightInput) }) });
    await fetchAll(id);
    setShowWeightModal(false); setWeightInput(''); setSaving(false);
  }

  async function openDietBuilder() {
    const items = await getArray<MealItem>('/api/meals');
    setMealLibrary(items);
    setDietBuilder({ title: '', issues: '', breakfast: [], lunch: [], snacks: [], dinner: [] });
    setShowDietBuilder(true);
  }

  function addMealToSlot(slot: typeof MEAL_TYPES[number], item: MealItem) {
    setDietBuilder((prev) => ({ ...prev, [slot]: [...prev[slot], { itemId: item.id, name: item.name, calories: item.calories_per_serving || 0, protein: item.protein || '0g', carbs: item.carbs || '0g', fat: item.fat || '0g' }] }));
  }
  function removeFromSlot(slot: typeof MEAL_TYPES[number], idx: number) {
    setDietBuilder((prev) => ({ ...prev, [slot]: prev[slot].filter((_, i) => i !== idx) }));
  }
  function slotCalories(slot: typeof MEAL_TYPES[number]) { return dietBuilder[slot].reduce((sum, m) => sum + m.calories, 0); }
  function totalCalories() { return MEAL_TYPES.reduce((sum, s) => sum + slotCalories(s), 0); }

  async function saveDietPlan() {
    if (!dietBuilder.title || !id) return;
    setSaving(true);
    const meal = (slot: typeof MEAL_TYPES[number]) => ({
      items: dietBuilder[slot].map((m) => m.name), calories: slotCalories(slot),
      protein: dietBuilder[slot].reduce((s, m) => s + parseFloat(m.protein), 0) + 'g',
      carbs: dietBuilder[slot].reduce((s, m) => s + parseFloat(m.carbs), 0) + 'g',
      fat: dietBuilder[slot].reduce((s, m) => s + parseFloat(m.fat), 0) + 'g',
    });
    const ocrData = {
      breakfast: meal('breakfast'), lunch: meal('lunch'), snacks: meal('snacks'), dinner: meal('dinner'),
      totalCalories: totalCalories(), notes: `Created via diet builder. ${new Date().toLocaleDateString('en-IN')}`,
    };
    await fetch(`/api/clients/${id}/diet-plans`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: dietBuilder.title, issues: dietBuilder.issues, ocrData }),
    });
    await fetchAll(id);
    setShowDietBuilder(false); setSaving(false);
    flash('Diet plan saved as draft. Publish it to make it visible to the client.');
  }

  async function togglePublish(plan: DietPlanWithVersions) {
    const action = plan.status === 'published' ? 'unpublish' : 'publish';
    await fetch(`/api/diet-plans/${plan.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }) });
    await fetchAll(id);
    flash(action === 'publish' ? 'Published — client notified on WhatsApp & portal.' : 'Unpublished — hidden from client.');
  }

  async function runAIAnalysis(plan: DietPlanWithVersions) {
    setAiPlan(plan); setAiResult(''); setShowAIModal(true); setAiLoading(true);
    let ocrData = null;
    try { ocrData = plan.versions[0]?.ocr_data ? JSON.parse(plan.versions[0].ocr_data) : null; } catch { /* ignore */ }
    const data = await fetch('/api/diet-plans/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ocrData, clientGoal: client?.health_goal, clientName: client?.name }) }).then((r) => r.json());
    setAiResult(data.analysis || 'Unable to analyze at this time.'); setAiLoading(false);
  }

  async function deactivateClient() {
    if (!id) return;
    setSaving(true);
    await fetch(`/api/clients/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...client, status: 'inactive', inactive_reason: inactiveReason }) });
    await fetchAll(id);
    setShowDeactivateModal(false); setSaving(false);
  }

  async function setupCreds(send: boolean) {
    if (!id) return;
    setCredLoading(send ? 'send' : 'only');
    const data = await fetch(`/api/clients/${id}/credentials`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ send }) }).then((r) => r.json());
    setCreds(data); setCredLoading(null); fetchAll(id);
  }

  async function assignPlan() {
    if (!assignPkg || !id) return;
    setSaving(true);
    await fetch('/api/client-packages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: Number(id), package_id: Number(assignPkg) }) });
    setAssignPkg(''); await fetchAll(id); setSaving(false);
    flash('Plan assigned. A pending payment was created.');
  }

  async function requestWeight() {
    if (!id) return;
    setWeightReq(true);
    const res = await fetch('/api/notifications/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: Number(id) }) });
    const d = await res.json();
    flash(res.ok ? 'Weight request sent on WhatsApp.' : (d.error || 'Failed to request weight.'));
    await fetchAll(id); setWeightReq(false);
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" /></div>;
  }
  if (!client) {
    return <div className="text-center py-12"><p className="text-slate-500">Client not found</p><Link href="/clients" className="text-brand-600 text-sm mt-2 inline-block">Back to clients</Link></div>;
  }

  const totalPaid = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pendingAmount = payments.filter((p) => p.status !== 'paid').reduce((s, p) => s + p.amount, 0);
  const activePkg = packages.find((p) => p.id === client.package_id);

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'metrics', label: `Weight (${metrics.length})` },
    { key: 'diet', label: `Diet Plans (${dietPlans.length})` },
    { key: 'payments', label: `Payments (${payments.length})` },
  ] as const;

  const recItems = mealLibrary.filter((item) => {
    const matchCat = item.category === recFilter || item.category === 'any';
    const matchSearch = item.name.toLowerCase().includes(libSearch.toLowerCase());
    const alreadyAdded = dietBuilder[recFilter].some((s) => s.itemId === item.id);
    return matchCat && matchSearch && !alreadyAdded;
  });

  const sortedMetrics = [...metrics].reverse(); // newest first
  const canGraph = metrics.length >= 5;
  const pageCount = Math.max(1, Math.ceil(sortedMetrics.length / PAGE));
  const pageRows = sortedMetrics.slice(metricsPage * PAGE, metricsPage * PAGE + PAGE);

  return (
    <div className="space-y-5 max-w-5xl">
      {toast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm shadow-lg">{toast}</div>
      )}

      <div className="flex items-center justify-between">
        <Link href="/clients" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
          <ChevronLeft size={16} /> Back to Clients
        </Link>
        <div className="flex gap-2">
          {client.status === 'active' ? (
            <Button variant="danger" size="sm" onClick={() => setShowDeactivateModal(true)}><AlertTriangle size={14} /> Deactivate</Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={async () => {
              await fetch(`/api/clients/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...client, status: 'active', inactive_reason: null }) });
              fetchAll(id);
            }}>Reactivate</Button>
          )}
        </div>
      </div>

      {/* Header card */}
      <Card>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-600 flex items-center justify-center text-white text-xl font-bold shrink-0">{client.name.charAt(0)}</div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{client.name}</h2>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <StatusBadge status={client.status} />
                <GoalBadge goal={client.health_goal} />
                <span className="text-xs text-slate-500">{client.age} yrs • {client.gender}</span>
                {client.has_credentials ? <Badge variant="blue" size="sm"><KeyRound size={10} className="mr-1" />Portal set up</Badge> : <Badge variant="yellow" size="sm">No portal login</Badge>}
              </div>
              {client.inactive_reason && <p className="text-xs text-red-500 mt-1">Reason: {client.inactive_reason}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
            <div><p className="text-xs text-slate-500">Paid</p><p className="text-base sm:text-lg font-bold text-brand-600 dark:text-brand-400">₹{totalPaid.toLocaleString('en-IN')}</p></div>
            <div><p className="text-xs text-slate-500">Pending</p><p className="text-base sm:text-lg font-bold text-yellow-600 dark:text-yellow-400">₹{pendingAmount.toLocaleString('en-IN')}</p></div>
            <div><p className="text-xs text-slate-500">Readings</p><p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{metrics.length}</p></div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-0.5 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-3 sm:px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === tab.key ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><User size={16} className="text-brand-500" /> Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3"><Mail size={14} className="text-slate-400" /><span className="text-slate-600 dark:text-slate-400">{client.email}</span></div>
              <div className="flex items-center gap-3"><Phone size={14} className="text-slate-400" /><span className="text-slate-600 dark:text-slate-400">{client.phone}</span></div>
              {client.address && <div className="flex items-start gap-3"><MapPin size={14} className="text-slate-400 mt-0.5" /><span className="text-slate-600 dark:text-slate-400">{client.address}</span></div>}
            </div>
            {client.notes && <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"><p className="text-xs text-slate-500 mb-1">Notes</p><p className="text-sm text-slate-700 dark:text-slate-300">{client.notes}</p></div>}
            <p className="text-xs text-slate-400 mt-4">Joined {new Date(client.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </Card>

          {/* Portal access */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><KeyRound size={16} className="text-brand-500" /> Portal Access</h3>
            <p className="text-xs text-slate-500 mb-3">
              {client.has_credentials
                ? `Login is set up (username: ${client.phone}). Only you can reset the password.`
                : 'No login yet. Generate a secure password and share it on WhatsApp.'}
            </p>
            {creds ? (
              <div className="rounded-lg border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/20 p-3 space-y-1 text-sm">
                <p><span className="text-slate-500">Username:</span> <span className="font-mono">{creds.username}</span></p>
                <p><span className="text-slate-500">Password:</span> <span className="font-mono">{creds.password}</span></p>
                <p className="text-xs text-brand-700 dark:text-brand-400">{creds.sent ? '✓ Sent on WhatsApp.' : 'Generated (not sent).'} Shown once.</p>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2 mt-3">
              <Button size="sm" onClick={() => setupCreds(true)} loading={credLoading === 'send'}><Send size={13} /> {client.has_credentials ? 'Reset & send' : 'Generate & send'}</Button>
              <Button size="sm" variant="outline" onClick={() => setupCreds(false)} loading={credLoading === 'only'}>Generate only</Button>
            </div>
          </Card>

          {/* Active plan + assign */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><PackageIcon size={16} className="text-brand-500" /> Plan</h3>
            {client.package_name ? (
              <div className="mb-4">
                <p className="font-medium text-slate-900 dark:text-white">{client.package_name}</p>
                <p className="text-2xl font-bold text-brand-600 dark:text-brand-400 mt-1">₹{client.package_price?.toLocaleString('en-IN')}</p>
                <div className="mt-2 space-y-0.5 text-xs text-slate-500">
                  <p>Start: {client.package_start ? new Date(client.package_start).toLocaleDateString('en-IN') : '—'} · End: {client.package_end ? new Date(client.package_end).toLocaleDateString('en-IN') : 'Ongoing'}</p>
                  {activePkg?.request_weights ? <p className="text-blue-500">Weight requests: {activePkg.weight_frequency}</p> : null}
                </div>
              </div>
            ) : <p className="text-sm text-slate-500 mb-4">No active plan.</p>}
            <div className="flex gap-2">
              <Select value={assignPkg} onChange={(e) => setAssignPkg(e.target.value)} className="flex-1"
                options={[{ value: '', label: client.package_name ? 'Change plan...' : 'Assign plan...' }, ...packages.map((p) => ({ value: String(p.id), label: `${p.name} · ₹${p.price}` }))]} />
              <Button size="sm" onClick={assignPlan} disabled={!assignPkg} loading={saving}>Assign</Button>
            </div>
            {activePkg?.request_weights ? (
              <Button size="sm" variant="outline" className="mt-3" onClick={requestWeight} loading={weightReq}><Scale size={13} /> Request weight now</Button>
            ) : null}
          </Card>

          {/* Weight trend */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2"><Activity size={16} className="text-brand-500" /> Weight Trend</h3>
              <Button size="sm" variant="outline" onClick={() => setShowWeightModal(true)}><Plus size={14} /> Add</Button>
            </div>
            <WeightChart metrics={metrics} />
          </Card>
        </div>
      )}

      {/* Metrics: table (default, paginated 5) + graph toggle when >=5 */}
      {activeTab === 'metrics' && (
        <Card>
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Weight History</h3>
            <div className="flex items-center gap-2">
              {canGraph && (
                <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <button onClick={() => setMetricsView('table')} className={`px-3 py-1.5 text-xs flex items-center gap-1 ${metricsView === 'table' ? 'bg-brand-500 text-white' : 'text-slate-500'}`}><TableIcon size={13} /> Table</button>
                  <button onClick={() => setMetricsView('graph')} className={`px-3 py-1.5 text-xs flex items-center gap-1 ${metricsView === 'graph' ? 'bg-brand-500 text-white' : 'text-slate-500'}`}><LineChart size={13} /> Graph</button>
                </div>
              )}
              {activePkg?.request_weights ? <Button size="sm" variant="outline" onClick={requestWeight} loading={weightReq}><Scale size={13} /> Request</Button> : null}
              <Button size="sm" onClick={() => setShowWeightModal(true)}><Plus size={14} /> Add</Button>
            </div>
          </div>

          {metrics.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No weight readings yet.</p>
          ) : canGraph && metricsView === 'graph' ? (
            <WeightChart metrics={metrics} />
          ) : (
            <>
              <div className="space-y-2">
                {pageRows.map((m) => (
                  <div key={m.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{m.weight_kg} kg</span>
                      <Badge variant={m.source === 'whatsapp' ? 'green' : m.source === 'email' ? 'blue' : 'gray'} size="sm">{m.source}</Badge>
                    </div>
                    <span className="text-xs text-slate-500">{new Date(m.recorded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                ))}
              </div>
              {pageCount > 1 && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <Button size="sm" variant="ghost" disabled={metricsPage === 0} onClick={() => setMetricsPage((p) => p - 1)}>Previous</Button>
                  <span className="text-xs text-slate-500">Page {metricsPage + 1} of {pageCount}</span>
                  <Button size="sm" variant="ghost" disabled={metricsPage >= pageCount - 1} onClick={() => setMetricsPage((p) => p + 1)}>Next</Button>
                </div>
              )}
            </>
          )}
        </Card>
      )}

      {/* Diet plans */}
      {activeTab === 'diet' && (
        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <DietRecommendations clientId={id} clientName={client.name} healthGoal={client.health_goal} onSaved={() => fetchAll(id)} />
            <Button size="sm" onClick={openDietBuilder}><Utensils size={14} /> Build Diet Plan</Button>
          </div>
          {dietPlans.length === 0 && <Card><p className="text-sm text-slate-500 text-center py-8">No diet plans yet. Record the client&apos;s issues and build one.</p></Card>}
          {dietPlans.map((plan) => (
            <Card key={plan.id}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText size={16} className="text-brand-500" /> {plan.title}
                    {plan.status === 'published' ? <Badge variant="green" size="sm">Published</Badge> : <Badge variant="yellow" size="sm">Draft</Badge>}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">{plan.version_count} version(s) · Created {new Date(plan.created_at).toLocaleDateString('en-IN')}</p>
                  {plan.issues && <p className="text-xs text-slate-500 mt-1 flex items-start gap-1"><ClipboardList size={12} className="mt-0.5 shrink-0" /> {plan.issues}</p>}
                </div>
                <div className="flex gap-2 shrink-0 flex-wrap">
                  <Button size="sm" variant={plan.status === 'published' ? 'outline' : 'primary'} onClick={() => togglePublish(plan)}>
                    {plan.status === 'published' ? <><Unlock size={13} /> Unpublish</> : <><Lock size={13} /> Publish</>}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => runAIAnalysis(plan)}><Sparkles size={13} /> AI Review</Button>
                  <Button size="sm" variant="outline" onClick={() => setShowDietDetail(plan)}>View</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Payments */}
      {activeTab === 'payments' && (
        <Card>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-slate-500">Total paid: <strong className="text-brand-600 dark:text-brand-400">₹{totalPaid.toLocaleString('en-IN')}</strong></p>
            <Link href="/payments"><Button size="sm" variant="outline"><CreditCard size={14} /> Record Payment</Button></Link>
          </div>
          <div className="space-y-2">
            {payments.length === 0 && <p className="text-sm text-slate-500 text-center py-8">No payments recorded</p>}
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-slate-100 dark:border-slate-700">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">₹{p.amount.toLocaleString('en-IN')} {p.source === 'auto' && <Badge variant="purple" size="sm">auto</Badge>}</p>
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

      {/* Weight Modal */}
      <Modal isOpen={showWeightModal} onClose={() => setShowWeightModal(false)} title="Log Weight Reading">
        <div className="p-6 space-y-4">
          <Input label="Weight (kg)" type="number" step="0.1" placeholder="e.g. 74.5" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} />
          <div className="flex gap-3"><Button onClick={addWeight} loading={saving}>Save</Button><Button variant="outline" onClick={() => setShowWeightModal(false)}>Cancel</Button></div>
        </div>
      </Modal>

      {/* Diet Builder */}
      {showDietBuilder && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3"><Utensils size={20} className="text-brand-500" /><h2 className="text-lg font-semibold text-slate-900 dark:text-white">Build Diet Plan</h2></div>
            <button onClick={() => setShowDietBuilder(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><X size={20} /></button>
          </div>

          <div className="px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-2">
            <input type="text" placeholder="Plan title, e.g. Week 1 Weight Loss Plan" value={dietBuilder.title}
              onChange={(e) => setDietBuilder({ ...dietBuilder, title: e.target.value })}
              className="w-full sm:max-w-md px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <textarea placeholder="Record the patient's issues first (symptoms, complaints, medical notes)..." value={dietBuilder.issues}
              onChange={(e) => setDietBuilder({ ...dietBuilder, issues: e.target.value })} rows={2}
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
          </div>

          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Meal Plan</p>
                <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{totalCalories()} kcal total</span>
              </div>
              {MEAL_TYPES.map((slot) => (
                <div key={slot} className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className={`flex items-center justify-between px-4 py-2.5 cursor-pointer ${slot === recFilter ? 'bg-brand-50 dark:bg-brand-900/20 border-b border-brand-200 dark:border-brand-800' : 'bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700'}`} onClick={() => setRecFilter(slot)}>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{MEAL_ICONS[slot]} {slot.charAt(0).toUpperCase() + slot.slice(1)}</span>
                    <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">{slotCalories(slot)} kcal</span>
                  </div>
                  <div className="p-3 space-y-1.5">
                    {dietBuilder[slot].length === 0 && <p className="text-xs text-slate-400 italic py-1">No items yet. Click a recommendation to add →</p>}
                    {dietBuilder[slot].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 group">
                        <div><span className="text-sm text-slate-900 dark:text-white">{item.name}</span><span className="text-xs text-slate-500 ml-2">{item.calories} kcal · P:{item.protein} C:{item.carbs} F:{item.fat}</span></div>
                        <button onClick={() => removeFromSlot(slot, idx)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 flex flex-col bg-slate-50 dark:bg-slate-800/30">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Recommendations</p>
                <div className="flex gap-1 mb-2 flex-wrap">
                  {MEAL_TYPES.map((t) => (
                    <button key={t} onClick={() => setRecFilter(t)} className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${recFilter === t ? 'bg-brand-500 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600'}`}>{MEAL_ICONS[t]}</button>
                  ))}
                </div>
                <input type="text" placeholder="Search meals..." value={libSearch} onChange={(e) => setLibSearch(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500" />
                {client.health_goal !== 'other' && <p className="text-xs text-brand-600 dark:text-brand-400 mt-1.5">★ Showing items good for {client.health_goal.replace('_', ' ')}</p>}
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {recItems.length === 0 && <p className="text-xs text-slate-400 text-center py-6">All items added, or no matches.</p>}
                {recItems.map((item) => {
                  let tags: string[] = [];
                  try { tags = item.health_tags ? JSON.parse(item.health_tags) : []; } catch { /* ignore */ }
                  const isRecommended = tags.includes(client.health_goal);
                  return (
                    <button key={item.id} onClick={() => addMealToSlot(recFilter, item)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all hover:shadow-sm group ${isRecommended ? 'border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/10 hover:border-brand-400' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                      <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-900 dark:text-white">{item.name}</span><span className="text-xs text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 font-medium">+ Add</span></div>
                      <div className="flex gap-2 mt-0.5 text-xs text-slate-500">{item.calories_per_serving && <span className="text-brand-600 dark:text-brand-400 font-medium">{item.calories_per_serving} kcal</span>}{item.serving_size && <span>{item.serving_size}</span>}</div>
                      {isRecommended && <p className="text-xs text-brand-600 dark:text-brand-400 mt-0.5">★ Good for {client.health_goal.replace('_', ' ')}</p>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between">
            <p className="text-sm text-slate-500">{totalCalories()} kcal · {MEAL_TYPES.reduce((s, t) => s + dietBuilder[t].length, 0)} items · saves as draft</p>
            <div className="flex gap-3"><Button variant="outline" onClick={() => setShowDietBuilder(false)}>Cancel</Button><Button onClick={saveDietPlan} loading={saving} disabled={!dietBuilder.title}>Save Draft</Button></div>
          </div>
        </div>
      )}

      {/* Diet Detail */}
      {showDietDetail && (
        <Modal isOpen={!!showDietDetail} onClose={() => setShowDietDetail(null)} title={showDietDetail.title} size="xl">
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3 flex-wrap">
              {showDietDetail.status === 'published' ? <Badge variant="green">Published</Badge> : <Badge variant="yellow">Draft</Badge>}
              <Button size="sm" variant="outline" onClick={() => { const p = showDietDetail; setShowDietDetail(null); runAIAnalysis(p); }}><Sparkles size={13} /> AI Review</Button>
            </div>
            {showDietDetail.issues && <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-3"><p className="text-xs font-semibold text-slate-500 mb-1">Recorded issues</p><p className="text-sm text-slate-700 dark:text-slate-300">{showDietDetail.issues}</p></div>}
            {showDietDetail.versions.map((v) => {
              let ocr: Record<string, { items?: string[]; calories?: number; protein?: string; carbs?: string; fat?: string }> | null = null;
              try { ocr = v.ocr_data ? JSON.parse(v.ocr_data) : null; } catch { /* ignore */ }
              return (
                <div key={v.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3"><h4 className="font-semibold text-slate-900 dark:text-white">Version {v.version_number}</h4><span className="text-xs text-slate-500">{new Date(v.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                  {ocr && (
                    <div className="space-y-2">
                      {(['breakfast', 'lunch', 'snacks', 'dinner'] as const).map((meal) => ocr![meal] && (
                        <div key={meal} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1"><p className="text-xs font-semibold text-slate-700 dark:text-slate-300 capitalize">{MEAL_ICONS[meal]} {meal}</p><p className="text-xs text-brand-600 dark:text-brand-400">{ocr![meal].calories} kcal</p></div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{ocr![meal].items?.join(', ')}</p>
                          <div className="flex gap-3 mt-1 text-xs text-slate-500"><span>P: {ocr![meal].protein}</span><span>C: {ocr![meal].carbs}</span><span>F: {ocr![meal].fat}</span></div>
                        </div>
                      ))}
                      {'totalCalories' in ocr && <div className="flex items-center justify-between px-3 py-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg"><span className="text-xs font-semibold text-brand-700 dark:text-brand-400">Total Daily Calories</span><span className="text-sm font-bold text-brand-700 dark:text-brand-400">{(ocr as Record<string, unknown>).totalCalories as number} kcal</span></div>}
                      {'notes' in ocr && <p className="text-xs text-slate-500 italic">{(ocr as Record<string, unknown>).notes as string}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Modal>
      )}

      {/* AI Analysis */}
      <Modal isOpen={showAIModal} onClose={() => { setShowAIModal(false); setAiResult(''); }} title={`AI Review — ${aiPlan?.title}`} size="lg">
        <div className="p-6">
          {aiLoading ? (
            <div className="flex flex-col items-center gap-4 py-12"><Loader2 size={32} className="animate-spin text-brand-500" /><p className="text-sm text-slate-500">Analyzing diet plan...</p></div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4"><Sparkles size={16} className="text-brand-500" /><span className="text-sm font-semibold text-brand-700 dark:text-brand-400">AI-Powered Nutritional Analysis</span></div>
              <div className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 space-y-3">
                {aiResult.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-slate-900 dark:text-white mt-4">{line.replace(/\*\*/g, '')}</p>;
                  if (line.startsWith('•')) return <p key={i} className="pl-3 text-sm">{line}</p>;
                  return line.trim() ? <p key={i} className="text-sm">{line}</p> : null;
                })}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Deactivate */}
      <Modal isOpen={showDeactivateModal} onClose={() => setShowDeactivateModal(false)} title="Deactivate Client">
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">Deactivate <strong>{client.name}</strong>? They will no longer be able to log into the portal.</p>
          <Input label="Reason for deactivation" placeholder="e.g. Payment stopped, relocated..." value={inactiveReason} onChange={(e) => setInactiveReason(e.target.value)} />
          <div className="flex gap-3"><Button variant="danger" onClick={deactivateClient} loading={saving}>Deactivate</Button><Button variant="outline" onClick={() => setShowDeactivateModal(false)}>Cancel</Button></div>
        </div>
      </Modal>
    </div>
  );
}
