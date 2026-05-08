'use client';

import { useEffect, useState } from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Card } from '@/components/ui/Card';
import { Users, UserCheck, UserX, IndianRupee, Clock, TrendingUp } from 'lucide-react';
import { DashboardStats, ActivityItem } from '@/lib/types';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats);
        setActivities(data.activity);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          title="Total Clients"
          value={stats?.total_clients ?? 0}
          icon={Users}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Active"
          value={stats?.active_clients ?? 0}
          subtitle="clients on program"
          icon={UserCheck}
          iconColor="text-emerald-500"
        />
        <StatsCard
          title="Inactive"
          value={stats?.inactive_clients ?? 0}
          subtitle="not on program"
          icon={UserX}
          iconColor="text-red-500"
        />
        <StatsCard
          title="Total Revenue"
          value={`₹${((stats?.total_revenue ?? 0) / 1000).toFixed(0)}k`}
          subtitle="payments received"
          icon={IndianRupee}
          iconColor="text-emerald-500"
        />
        <StatsCard
          title="Pending"
          value={stats?.pending_payments ?? 0}
          subtitle="payments"
          icon={Clock}
          iconColor="text-yellow-500"
        />
        <StatsCard
          title="Due Amount"
          value={`₹${((stats?.pending_amount ?? 0) / 1000).toFixed(1)}k`}
          subtitle="to collect"
          icon={TrendingUp}
          iconColor="text-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
            <span className="text-xs text-slate-500">{activities.length} items</span>
          </div>
          <RecentActivity activities={activities} />
        </Card>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/clients/new"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 transition-colors text-sm font-medium"
            >
              <Users size={16} />
              Add New Client
            </Link>
            <Link
              href="/payments"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors text-sm font-medium"
            >
              <IndianRupee size={16} />
              Record Payment
            </Link>
            <Link
              href="/notifications"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors text-sm font-medium"
            >
              <Clock size={16} />
              Schedule Reminder
            </Link>
            <Link
              href="/packages"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors text-sm font-medium"
            >
              <TrendingUp size={16} />
              Manage Packages
            </Link>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Collected</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">₹{stats?.total_revenue?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Pending</span>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">₹{stats?.pending_amount?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
