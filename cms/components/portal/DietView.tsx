interface Meal {
  items?: string[];
  calories?: number;
  protein?: string;
  carbs?: string;
  fat?: string;
}
export interface DietOcr {
  breakfast?: Meal;
  lunch?: Meal;
  snacks?: Meal;
  dinner?: Meal;
  totalCalories?: number;
  notes?: string;
}

const MEALS: { key: keyof DietOcr; label: string; icon: string }[] = [
  { key: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { key: 'lunch', label: 'Lunch', icon: '☀️' },
  { key: 'snacks', label: 'Snacks', icon: '🍎' },
  { key: 'dinner', label: 'Dinner', icon: '🌙' },
];

export function DietView({ ocr }: { ocr: DietOcr }) {
  return (
    <div className="space-y-4">
      {MEALS.map(({ key, label, icon }) => {
        const meal = ocr[key] as Meal | undefined;
        if (!meal) return null;
        return (
          <div key={key} className="rounded-2xl border bg-white p-5" style={{ borderColor: '#EDE7F6' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-[#1A1A2E]">{icon} {label}</h3>
              <span className="text-sm font-semibold" style={{ color: '#5C3A9E' }}>{meal.calories} kcal</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{meal.items?.join(' · ')}</p>
            <div className="flex gap-4 mt-3 text-xs text-gray-500">
              <span>Protein {meal.protein}</span><span>Carbs {meal.carbs}</span><span>Fat {meal.fat}</span>
            </div>
          </div>
        );
      })}

      {typeof ocr.totalCalories === 'number' && (
        <div className="rounded-2xl p-5 flex items-center justify-between text-white" style={{ background: 'linear-gradient(135deg, #5C3A9E, #2D6B4F)' }}>
          <span className="font-semibold">Total Daily Calories</span>
          <span className="text-2xl font-black">{ocr.totalCalories} kcal</span>
        </div>
      )}
      {ocr.notes && (
        <div className="rounded-2xl border p-4" style={{ borderColor: '#E8F5E9', background: '#F1F8F4' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: '#2D6B4F' }}>Dietitian&apos;s notes</p>
          <p className="text-sm text-gray-700">{ocr.notes}</p>
        </div>
      )}
    </div>
  );
}
