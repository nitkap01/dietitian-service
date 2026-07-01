import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: { value: number; positive: boolean };
}

export function StatsCard({ title, value, subtitle, icon: Icon, iconColor = 'text-brand-500', trend }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          {trend && (
            <p className={`text-xs mt-1 font-medium ${trend.positive ? 'text-brand-500' : 'text-red-500'}`}>
              {trend.positive ? '▲' : '▼'} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 ${iconColor}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
