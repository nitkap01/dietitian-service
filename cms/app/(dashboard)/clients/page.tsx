'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { StatusBadge, GoalBadge } from '@/components/clients/StatusBadge';
import { Client } from '../../server/types';
import type { HealthGoal, ClientStatus } from '../../server/types';
import { UserPlus, Search } from 'lucide-react';

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<(Client & { package_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetch('/api/clients')
      .then((r) => r.json())
      .then((data) => { setClients(data); setLoading(false); })
      .catch(console.error);
  }, []);

  const filtered = clients.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{clients.length} total clients</p>
        </div>
        <Link href="/clients/new">
          <Button>
            <UserPlus size={16} />
            Add Client
          </Button>
        </Link>
      </div>

      <Card padding="none">
        <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-1">
            {(['all', 'active', 'inactive'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                  filter === f
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin w-6 h-6 border-4 border-emerald-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <Table
            data={filtered as unknown as Record<string, unknown>[]}
            onRowClick={(row) => router.push(`/clients/${row.id}`)}
            columns={[
              {
                key: 'name',
                header: 'Client',
                render: (row) => (
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{row.name as string}</p>
                    <p className="text-xs text-slate-500">{row.email as string}</p>
                  </div>
                ),
              },
              { key: 'phone', header: 'Phone' },
              { key: 'age', header: 'Age', render: (row) => `${row.age} yrs` },
              {
                key: 'health_goal',
                header: 'Goal',
                render: (row) => <GoalBadge goal={row.health_goal as HealthGoal} />,
              },
              {
                key: 'package_name',
                header: 'Package',
                render: (row) => (
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {row.package_name ? `${row.package_name} — ₹${(row.package_price as number)?.toLocaleString('en-IN')}/mo` : '—'}
                  </span>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (row) => <StatusBadge status={row.status as ClientStatus} />,
              },
              {
                key: 'created_at',
                header: 'Joined',
                render: (row) => new Date(row.created_at as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }),
              },
            ]}
            emptyMessage="No clients found"
          />
        )}
      </Card>
    </div>
  );
}
