'use client';

import { useEffect, useState } from 'react';
import { DietView, DietOcr } from '@/components/portal/DietView';
import { getObject } from '@/components/http';
import { Printer } from 'lucide-react';

interface DietResp {
  locked?: boolean;
  plan?: { title: string; issues?: string; published_at?: string };
  versions?: { ocr_data?: string }[];
}

export default function DietPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('');
  const [data, setData] = useState<DietResp | null>(null);

  useEffect(() => { params.then(({ id }) => setId(id)); }, [params]);
  useEffect(() => {
    if (!id) return;
    getObject<DietResp>(`/api/portal/diets/${id}`).then((d) => setData(d ?? {}));
  }, [id]);

  if (!data) return <div className="min-h-screen bg-white flex items-center justify-center text-gray-400">Loading…</div>;
  if (data.locked) return <div className="min-h-screen bg-white flex items-center justify-center text-gray-500">This plan is not available.</div>;

  let ocr: DietOcr = {};
  try { ocr = data.versions?.[0]?.ocr_data ? JSON.parse(data.versions[0].ocr_data) : {}; } catch { ocr = {}; }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto p-8">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <p className="text-sm text-gray-500">Tip: choose &quot;Save as PDF&quot; in the print dialog.</p>
          <button onClick={() => window.print()} className="px-4 py-2.5 rounded-full font-bold text-white flex items-center gap-2 text-sm" style={{ background: 'linear-gradient(135deg, #5C3A9E, #3D2070)' }}>
            <Printer size={15} /> Print / Save PDF
          </button>
        </div>

        <div className="border-b pb-4 mb-6" style={{ borderColor: '#EDE7F6' }}>
          <h1 className="text-2xl font-black text-[#1A1A2E]">Dietician Ritika Bahl&apos;s Portal</h1>
          <p className="text-sm text-gray-500">Personalised Diet Plan</p>
        </div>

        <h2 className="text-xl font-black text-[#1A1A2E] mb-1">{data.plan?.title}</h2>
        {data.plan?.published_at && <p className="text-xs text-gray-400 mb-4">{new Date(data.plan.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
        {data.plan?.issues && <p className="text-sm text-gray-600 mb-5"><strong>Notes:</strong> {data.plan.issues}</p>}

        <DietView ocr={ocr} />

        <p className="text-xs text-gray-400 mt-8 text-center">Generated from Dietician Ritika Bahl&apos;s Portal.</p>
      </div>
    </div>
  );
}
