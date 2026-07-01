import { ActivityItem } from '../../app/server/types';
import { Users, CreditCard, FileText, Activity, UserX } from 'lucide-react';

const iconMap = {
  client_added: { icon: Users, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
  payment_received: { icon: CreditCard, color: 'text-brand-500 bg-brand-100 dark:bg-brand-900/30' },
  diet_plan_updated: { icon: FileText, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' },
  metric_recorded: { icon: Activity, color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30' },
  client_deactivated: { icon: UserX, color: 'text-red-500 bg-red-100 dark:bg-red-900/30' },
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="space-y-3">
      {activities.length === 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">No recent activity</p>
      )}
      {activities.map((item) => {
        const config = iconMap[item.type] || iconMap.metric_recorded;
        const Icon = config.icon;
        return (
          <div key={item.id} className="flex items-start gap-3 group">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
              <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">
                <span className="font-medium text-slate-900 dark:text-white">{item.client_name}</span>
                {' — '}
                {item.description}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{formatDate(item.created_at)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
