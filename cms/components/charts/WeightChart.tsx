'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { HealthMetric } from '@/lib/types';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface WeightChartProps {
  metrics: HealthMetric[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { source: string } }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  const source = payload[0].payload.source;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg text-sm">
      <p className="font-medium text-slate-900 dark:text-white">{label}</p>
      <p className="text-emerald-600 dark:text-emerald-400 font-bold">{value} kg</p>
      <p className="text-xs text-slate-500 capitalize">{source}</p>
    </div>
  );
}

export function WeightChart({ metrics }: WeightChartProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (metrics.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 dark:text-slate-400 text-sm">
        No weight data recorded yet
      </div>
    );
  }

  const data = metrics.map((m) => ({
    date: formatDate(m.recorded_at),
    weight: m.weight_kg,
    source: m.source,
  }));

  const isDark = mounted && resolvedTheme === 'dark';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const weights = metrics.map((m) => m.weight_kg);
  const minW = Math.min(...weights) - 1;
  const maxW = Math.max(...weights) + 1;
  const avgW = weights.reduce((a, b) => a + b, 0) / weights.length;

  return (
    <div>
      <div className="flex items-center gap-6 mb-4 text-xs text-slate-500 dark:text-slate-400">
        <span>Start: <strong className="text-slate-700 dark:text-slate-300">{weights[0]} kg</strong></span>
        <span>Current: <strong className="text-emerald-600 dark:text-emerald-400">{weights[weights.length - 1]} kg</strong></span>
        <span>Change: <strong className={weights[weights.length - 1] < weights[0] ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}>{(weights[weights.length - 1] - weights[0]).toFixed(1)} kg</strong></span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: textColor }} tickLine={false} />
          <YAxis domain={[minW, maxW]} tick={{ fontSize: 11, fill: textColor }} tickLine={false} tickFormatter={(v) => `${v}`} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={avgW} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: `avg ${avgW.toFixed(1)}`, fontSize: 10, fill: '#f59e0b' }} />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#059669' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
