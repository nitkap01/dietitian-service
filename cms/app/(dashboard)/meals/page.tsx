'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { MealItem } from '../../server/types';
import { Plus, Utensils, Trash2, Edit2, Search, Filter } from 'lucide-react';

const CATEGORIES = ['all', 'breakfast', 'lunch', 'snacks', 'dinner', 'any'] as const;
const HEALTH_TAGS = ['weight_management', 'sugar_control', 'pcos', 'high_protein', 'low_carb'];

const categoryColors: Record<string, string> = {
  breakfast: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  lunch: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  snacks: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  dinner: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  any: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
};

const EMPTY_FORM = {
  name: '', category: 'breakfast' as MealItem['category'],
  calories_per_serving: '', protein: '', carbs: '', fat: '',
  serving_size: '', notes: '', health_tags: [] as string[],
};

export default function MealsPage() {
  const [items, setItems] = useState<MealItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MealItem | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/meals');
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(item: MealItem) {
    setEditing(item);
    let tags: string[] = [];
    try { tags = item.health_tags ? JSON.parse(item.health_tags) : []; } catch { /* ignore */ }
    setForm({
      name: item.name,
      category: item.category,
      calories_per_serving: item.calories_per_serving?.toString() || '',
      protein: item.protein || '',
      carbs: item.carbs || '',
      fat: item.fat || '',
      serving_size: item.serving_size || '',
      notes: item.notes || '',
      health_tags: tags,
    });
    setShowForm(true);
  }

  async function save() {
    if (!form.name || !form.category) return;
    setSaving(true);
    const payload = {
      ...form,
      calories_per_serving: form.calories_per_serving ? parseInt(form.calories_per_serving) : null,
    };
    if (editing) {
      await fetch(`/api/meals/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    await fetchItems();
    setShowForm(false);
    setSaving(false);
  }

  async function deleteItem(id: number) {
    if (!confirm('Delete this meal item?')) return;
    await fetch(`/api/meals/${id}`, { method: 'DELETE' });
    fetchItems();
  }

  function toggleTag(tag: string) {
    setForm((f) => ({
      ...f,
      health_tags: f.health_tags.includes(tag)
        ? f.health_tags.filter((t) => t !== tag)
        : [...f.health_tags, tag],
    }));
  }

  const filtered = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'all' || item.category === filterCategory;
    return matchSearch && matchCat;
  });

  const grouped = CATEGORIES.slice(1).reduce((acc, cat) => {
    acc[cat] = filtered.filter((i) => i.category === cat);
    return acc;
  }, {} as Record<string, MealItem[]>);

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Meal Library</h2>
          <p className="text-sm text-slate-500 mt-0.5">{items.length} items — used as recommendations when building diet plans</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> Add Meal Item
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search meal items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={14} className="text-slate-400 hidden sm:block" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filterCategory === cat
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin w-6 h-6 border-4 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-6">
          {(filterCategory === 'all' ? CATEGORIES.slice(1) : [filterCategory as typeof CATEGORIES[number]]).map((cat) => {
            const catItems = grouped[cat] || filtered.filter((i) => i.category === cat);
            if (catItems.length === 0) return null;
            return (
              <div key={cat}>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${categoryColors[cat]}`}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                  <span className="text-slate-400 font-normal">({catItems.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catItems.map((item) => {
                    let tags: string[] = [];
                    try { tags = item.health_tags ? JSON.parse(item.health_tags) : []; } catch { /* ignore */ }
                    return (
                      <Card key={item.id} className="hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-slate-900 dark:text-white truncate">{item.name}</p>
                            {item.serving_size && (
                              <p className="text-xs text-slate-500 mt-0.5">{item.serving_size}</p>
                            )}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => openEdit(item)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                              <Edit2 size={13} />
                            </button>
                            <button onClick={() => deleteItem(item.id)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {item.calories_per_serving && (
                          <div className="flex gap-3 mt-2 text-xs">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.calories_per_serving} kcal</span>
                            {item.protein && <span className="text-slate-500">P:{item.protein}</span>}
                            {item.carbs && <span className="text-slate-500">C:{item.carbs}</span>}
                            {item.fat && <span className="text-slate-500">F:{item.fat}</span>}
                          </div>
                        )}

                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {tags.map((tag) => (
                              <span key={tag} className="text-xs px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded">
                                {tag.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        )}

                        {item.notes && (
                          <p className="text-xs text-slate-400 mt-2 italic">{item.notes}</p>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Meal Item' : 'Add Meal Item'} size="lg">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Meal Name *"
                placeholder="e.g. Oats Porridge"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as MealItem['category'] })}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CATEGORIES.slice(1).map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <Input
              label="Serving Size"
              placeholder="e.g. 1 bowl (200g)"
              value={form.serving_size}
              onChange={(e) => setForm({ ...form, serving_size: e.target.value })}
            />
            <Input
              label="Calories (kcal)"
              type="number"
              placeholder="e.g. 350"
              value={form.calories_per_serving}
              onChange={(e) => setForm({ ...form, calories_per_serving: e.target.value })}
            />
            <Input
              label="Protein"
              placeholder="e.g. 18g"
              value={form.protein}
              onChange={(e) => setForm({ ...form, protein: e.target.value })}
            />
            <Input
              label="Carbs"
              placeholder="e.g. 42g"
              value={form.carbs}
              onChange={(e) => setForm({ ...form, carbs: e.target.value })}
            />
            <Input
              label="Fat"
              placeholder="e.g. 8g"
              value={form.fat}
              onChange={(e) => setForm({ ...form, fat: e.target.value })}
            />
            <div className="sm:col-span-2">
              <Input
                label="Notes"
                placeholder="e.g. High fiber, good for weight management"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Health Tags</label>
            <div className="flex flex-wrap gap-2">
              {HEALTH_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                    form.health_tags.includes(tag)
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-emerald-400'
                  }`}
                >
                  {tag.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={save} loading={saving}>{editing ? 'Save Changes' : 'Add Item'}</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
