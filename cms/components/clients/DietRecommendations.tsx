'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getObject } from '@/components/http';
import { Sparkles, Loader2, ArrowRight, User, Utensils } from 'lucide-react';

interface Meal { items?: string[]; calories?: number; protein?: string; carbs?: string; fat?: string }
interface Ocr { breakfast?: Meal; lunch?: Meal; snacks?: Meal; dinner?: Meal; totalCalories?: number; notes?: string }
interface Reco {
  diet_id: number;
  title: string;
  issues: string;
  source: { name: string; age: number; gender: string; health_goal: string; status: string };
  score: number;
  reason: string;
  scored_by: string;
  ocr: Ocr | null;
}

type EditMeal = { items: string; calories: string; protein: string; carbs: string; fat: string };
type Review = { title: string; issues: string; breakfast: EditMeal; lunch: EditMeal; snacks: EditMeal; dinner: EditMeal; notes: string };

const MEALS = ['breakfast', 'lunch', 'snacks', 'dinner'] as const;
const MEAL_ICONS: Record<string, string> = { breakfast: '🌅', lunch: '☀️', snacks: '🍎', dinner: '🌙' };
const GOAL_LABEL: Record<string, string> = { weight_management: 'Weight Loss', sugar_control: 'Sugar Control', pcos: 'PCOS', other: 'Wellness' };

function scoreColor(s: number): 'green' | 'yellow' | 'gray' { return s >= 70 ? 'green' : s >= 40 ? 'yellow' : 'gray'; }

function toEditMeal(m?: Meal): EditMeal {
  return { items: (m?.items || []).join(', '), calories: String(m?.calories ?? ''), protein: m?.protein || '', carbs: m?.carbs || '', fat: m?.fat || '' };
}

export function DietRecommendations({ clientId, clientName, healthGoal, onSaved, onBuildFromScratch, triggerLabel }: { clientId: string; clientName: string; healthGoal: string; onSaved: () => void; onBuildFromScratch: () => void; triggerLabel?: string }) {
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recos, setRecos] = useState<Reco[]>([]);
  const [review, setReview] = useState<Review | null>(null);
  const [saving, setSaving] = useState(false);

  async function open() {
    setShowList(true);
    setLoading(true);
    try {
      const data = await getObject<{ recommendations: Reco[] }>(`/api/clients/${clientId}/recommendations`);
      setRecos(Array.isArray(data?.recommendations) ? (data!.recommendations as Reco[]) : []);
    } finally {
      setLoading(false);
    }
  }

  function useReco(r: Reco) {
    const o = r.ocr || {};
    setReview({
      title: `${clientName.split(' ')[0]} ${GOAL_LABEL[healthGoal] || ''} Plan`.trim(),
      issues: r.issues || '',
      breakfast: toEditMeal(o.breakfast), lunch: toEditMeal(o.lunch), snacks: toEditMeal(o.snacks), dinner: toEditMeal(o.dinner),
      notes: o.notes || '',
    });
    setShowList(false);
  }

  async function saveReview() {
    if (!review) return;
    setSaving(true);
    const buildMeal = (m: EditMeal): Meal => ({
      items: m.items.split(',').map((s) => s.trim()).filter(Boolean),
      calories: Number(m.calories) || 0, protein: m.protein, carbs: m.carbs, fat: m.fat,
    });
    const meals = { breakfast: buildMeal(review.breakfast), lunch: buildMeal(review.lunch), snacks: buildMeal(review.snacks), dinner: buildMeal(review.dinner) };
    const totalCalories = MEALS.reduce((s, k) => s + (meals[k].calories || 0), 0);
    const ocrData = { ...meals, totalCalories, notes: review.notes };
    await fetch(`/api/clients/${clientId}/diet-plans`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: review.title, issues: review.issues, ocrData, changelog: 'Created from a similar-client recommendation' }),
    });
    setSaving(false);
    setReview(null);
    onSaved();
  }

  function setMeal(slot: typeof MEALS[number], field: keyof EditMeal, value: string) {
    setReview((r) => (r ? { ...r, [slot]: { ...r[slot], [field]: value } } : r));
  }

  return (
    <>
      <Button size="sm" onClick={open}><Sparkles size={14} /> {triggerLabel || 'Suggest from similar clients'}</Button>

      {/* Recommendations list */}
      <Modal isOpen={showList} onClose={() => setShowList(false)} title="Create a diet plan" size="lg">
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-10"><Loader2 size={28} className="animate-spin text-brand-500" /><p className="text-sm text-slate-500">Finding similar clients...</p></div>
          ) : recos.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No similar past clients with a diet yet — start from scratch below.</p>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Similar clients found — reuse a plan, or start from scratch. Ranked by similarity (goal, age, gender, described problems){recos[0]?.scored_by === 'ai' ? ' · refined by AI' : ''}.</p>
              {recos.map((r) => (
                <div key={r.diet_id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-slate-900 dark:text-white">{r.title}</h4>
                        <Badge variant={scoreColor(r.score)} size="sm">{r.score}% match</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><User size={11} /> {r.source.name} · {r.source.age} yrs · {r.source.gender}</p>
                      <p className="text-xs text-slate-500 mt-1">{r.reason}</p>
                      {r.ocr?.totalCalories ? <p className="text-xs text-brand-600 dark:text-brand-400 mt-1">{r.ocr.totalCalories} kcal/day</p> : null}
                    </div>
                    <Button size="sm" onClick={() => useReco(r)}>Use &amp; review <ArrowRight size={13} /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && (
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <Button variant="outline" onClick={() => { setShowList(false); onBuildFromScratch(); }}>
                <Utensils size={14} /> Start from scratch
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Review & finalise */}
      <Modal isOpen={!!review} onClose={() => setReview(null)} title="Review recommended plan" size="xl">
        {review && (
          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-500">Edit anything before saving. It saves as a draft — publish it when ready.</p>
            <input value={review.title} onChange={(e) => setReview({ ...review, title: e.target.value })} placeholder="Plan title"
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <textarea value={review.issues} onChange={(e) => setReview({ ...review, issues: e.target.value })} placeholder="Patient's issues / notes" rows={2}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />

            {MEALS.map((slot) => (
              <div key={slot} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">{MEAL_ICONS[slot]} {slot.charAt(0).toUpperCase() + slot.slice(1)}</p>
                <textarea value={review[slot].items} onChange={(e) => setMeal(slot, 'items', e.target.value)} placeholder="Items (comma separated)" rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none mb-2" />
                <div className="grid grid-cols-4 gap-2">
                  <input value={review[slot].calories} onChange={(e) => setMeal(slot, 'calories', e.target.value)} placeholder="kcal" className="px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500" />
                  <input value={review[slot].protein} onChange={(e) => setMeal(slot, 'protein', e.target.value)} placeholder="protein" className="px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500" />
                  <input value={review[slot].carbs} onChange={(e) => setMeal(slot, 'carbs', e.target.value)} placeholder="carbs" className="px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500" />
                  <input value={review[slot].fat} onChange={(e) => setMeal(slot, 'fat', e.target.value)} placeholder="fat" className="px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500" />
                </div>
              </div>
            ))}

            <textarea value={review.notes} onChange={(e) => setReview({ ...review, notes: e.target.value })} placeholder="Overall notes" rows={2}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />

            <div className="flex gap-3">
              <Button onClick={saveReview} loading={saving}>Save as Draft</Button>
              <Button variant="outline" onClick={() => setReview(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
