'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { getArray } from '@/components/http';
import { Payment } from '../../server/types';
import { Plus, CheckCircle, IndianRupee } from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'unpaid'>('all');

  async function fetchPayments() {
    setPayments(await getArray<Payment>('/api/payments'));
    setLoading(false);
  }

  useEffect(() => { fetchPayments(); }, []);

  async function markPaid(id: number) {
    await fetch('/api/payments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'paid' }),
    });
    fetchPayments();
  }

  const filtered = filter === 'all' ? payments : payments.filter((p) => p.status === filter);
  const totalRevenue = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter((p) => p.status !== 'paid').reduce((s, p) => s + p.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
              <IndianRupee size={16} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Collected</p>
              <p className="text-lg font-bold text-brand-600 dark:text-brand-400">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
              <IndianRupee size={16} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Pending / Overdue</p>
              <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">₹{totalPending.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <CheckCircle size={16} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Records</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{payments.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card padding="none">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex gap-1 overflow-x-auto -mx-1 px-1">
            {(['all', 'paid', 'pending', 'unpaid'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize whitespace-nowrap ${
                  filter === f
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <Button size="sm" className="w-full sm:w-auto" onClick={() => setShowModal(true)}>
            <Plus size={14} /> Record Payment
          </Button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {filtered.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-12">No payments found</p>
          )}
          {filtered.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${p.status === 'paid' ? 'bg-brand-500' : p.status === 'unpaid' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">₹{p.amount.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-slate-500 truncate">{p.client_name} {p.package_name ? `• ${p.package_name}` : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden md:block">
                  <p className="text-xs text-slate-500">{p.notes || '—'}</p>
                  <p className="text-xs text-slate-400">Due: {p.due_date ? new Date(p.due_date).toLocaleDateString('en-IN') : '—'}</p>
                </div>
                <Badge variant={p.status === 'paid' ? 'green' : p.status === 'unpaid' ? 'red' : 'yellow'}>
                  {p.status}
                </Badge>
                {p.status !== 'paid' && (
                  <Button size="sm" variant="outline" onClick={() => markPaid(p.id)}>
                    <CheckCircle size={12} /> <span className="hidden sm:inline">Mark Paid</span><span className="sm:hidden">Paid</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Record Payment">
        <PaymentForm
          onSuccess={() => { setShowModal(false); fetchPayments(); }}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}
