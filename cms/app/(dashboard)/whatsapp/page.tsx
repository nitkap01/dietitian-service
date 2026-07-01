'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { WhatsAppMessage } from '../../server/types';
import { MessageCircle, Send, Phone, ImagePlus, X, CheckCircle, Scale, IndianRupee, Search } from 'lucide-react';

interface ClientSummary {
  id: number;
  name: string;
  phone: string;
  unread: number;
  lastMessage?: string;
  lastTime?: string;
}

export default function WhatsAppPage() {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ClientSummary | null>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [attach, setAttach] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [detection, setDetection] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchClients = useCallback(async () => {
    const [allRes, clientsRes] = await Promise.all([fetch('/api/whatsapp'), fetch('/api/clients')]);
    const allMsgs: (WhatsAppMessage & { client_name: string })[] = await allRes.json();
    const allClients: { id: number; name: string; phone: string }[] = await clientsRes.json();
    const summaries: ClientSummary[] = allClients.map((c) => {
      const cMsgs = allMsgs.filter((m) => m.client_id === c.id);
      const last = cMsgs[cMsgs.length - 1];
      return {
        id: c.id, name: c.name, phone: c.phone,
        unread: cMsgs.filter((m) => m.direction === 'inbound' && !m.is_read).length,
        lastMessage: last?.message, lastTime: last?.received_at,
      };
    }).sort((a, b) => {
      if (a.lastTime && b.lastTime) return new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime();
      if (a.lastTime) return -1;
      if (b.lastTime) return 1;
      return a.name.localeCompare(b.name);
    });
    setClients(summaries);
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  async function refreshMessages(id: number) {
    const res = await fetch(`/api/whatsapp?client_id=${id}`);
    setMessages(await res.json());
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  async function selectClient(client: ClientSummary) {
    setSelected(client);
    setDetection(null);
    await refreshMessages(client.id);
    await fetch('/api/whatsapp', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: client.id }) });
    fetchClients();
  }

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAttach(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function post(direction: 'outbound' | 'inbound') {
    if (!selected || (!draft.trim() && !attach)) return;
    setSending(true);
    setDetection(null);
    const res = await fetch('/api/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: selected.id, direction, message: draft.trim(), phone_number: selected.phone, media: attach }),
    });
    const data = await res.json().catch(() => ({}));
    if (direction === 'inbound' && data.detection) {
      const d = data.detection;
      setDetection(d.type === 'payment'
        ? `💰 Payment detected${d.amount ? ` (₹${d.amount})` : ''}${d.method ? ` via ${d.method}` : ''} — marked paid & diet unlocked.`
        : `⚖️ Weight ${d.weight} kg captured and saved to the profile.`);
    }
    setDraft('');
    setAttach(null);
    if (fileRef.current) fileRef.current.value = '';
    await refreshMessages(selected.id);
    fetchClients();
    setSending(false);
  }

  const filtered = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  return (
    <div className="max-w-5xl">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">WhatsApp Simulator</h2>
        <p className="text-sm text-slate-500 mt-0.5">Simulate client replies (text or a payment screenshot) to test auto payment-detection and weight capture. No WhatsApp account needed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-190px)] min-h-[520px]">
        {/* Client list */}
        <Card className="overflow-hidden p-0 flex flex-col">
          <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clients..."
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
          <ul className="overflow-y-auto flex-1">
            {filtered.map((c) => (
              <li key={c.id}>
                <button onClick={() => selectClient(c)}
                  className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700/50 ${selected?.id === c.id ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold shrink-0">{c.name.charAt(0)}</div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{c.name}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[150px]">{c.lastMessage || c.phone}</p>
                      </div>
                    </div>
                    {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold shrink-0">{c.unread}</span>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {/* Chat area */}
        <div className="md:col-span-2 flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div><MessageCircle size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" /><p className="text-sm text-slate-500">Select a client to start</p></div>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">{selected.name.charAt(0)}</div>
                <div><p className="font-semibold text-sm text-slate-900 dark:text-white">{selected.name}</p><p className="text-xs text-slate-400 flex items-center gap-1"><Phone size={10} />{selected.phone}</p></div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900/50">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm ${msg.direction === 'outbound' ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-bl-sm'}`}>
                      {msg.media_path && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={msg.media_path} alt="attachment" className="rounded-lg mb-1.5 max-h-48 object-cover" />
                      )}
                      {msg.message && <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>}
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {msg.payment_detected ? <span className="inline-flex items-center gap-0.5 text-xs bg-white/20 rounded px-1"><IndianRupee size={10} /> payment</span> : null}
                        {msg.intent === 'weight' ? <span className="inline-flex items-center gap-0.5 text-xs bg-white/20 rounded px-1"><Scale size={10} /> weight {msg.parsed_weight}kg</span> : null}
                        <span className={`text-xs ${msg.direction === 'outbound' ? 'text-emerald-200' : 'text-slate-400'}`}>
                          {new Date(msg.received_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {detection && (
                <div className="mx-3 mb-1 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle size={14} /> {detection}
                </div>
              )}

              <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                {attach && (
                  <div className="mb-2 inline-flex items-center gap-2 text-xs bg-slate-100 dark:bg-slate-700 rounded-lg px-2 py-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={attach} alt="preview" className="w-8 h-8 rounded object-cover" />
                    <span className="text-slate-600 dark:text-slate-300">Screenshot attached</span>
                    <button onClick={() => { setAttach(null); if (fileRef.current) fileRef.current.value = ''; }} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                  </div>
                )}
                <div className="flex gap-2 items-end">
                  <button onClick={() => fileRef.current?.click()} title="Attach payment screenshot"
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0"><ImagePlus size={18} /></button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={onPickFile} className="hidden" />
                  <textarea value={draft} onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); post('inbound'); } }}
                    placeholder="Type a client message, e.g. 'payment done' or '75 kg'..." rows={2}
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <div className="flex flex-col gap-1.5">
                    <button onClick={() => post('inbound')} disabled={sending || (!draft.trim() && !attach)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1 whitespace-nowrap">
                      <Send size={12} /> As client
                    </button>
                    <button onClick={() => post('outbound')} disabled={sending || (!draft.trim() && !attach)}
                      className="px-3 py-1.5 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 disabled:opacity-50 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 whitespace-nowrap">
                      As you
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">&quot;As client&quot; simulates an inbound message → runs payment &amp; weight detection. &quot;As you&quot; logs your reply.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
