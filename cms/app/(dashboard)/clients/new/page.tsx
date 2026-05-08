import { ClientForm } from '@/components/clients/ClientForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function NewClientPage() {
  return (
    <div className="max-w-2xl space-y-5">
      <Link href="/clients" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
        <ChevronLeft size={16} />
        Back to Clients
      </Link>
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Onboard New Client</h2>
        <p className="text-sm text-slate-500 mt-1">Fill in the client&apos;s details to add them to the system.</p>
      </div>
      <ClientForm />
    </div>
  );
}
