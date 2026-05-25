'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { WhatsAppMessage } from '../../server/types';
import { MessageCircle, Send, ChevronRight, Phone } from 'lucide-react';

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
  const [selected, setSelected] = useState<ClientSummary | null>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchClients = useCallback(async () => {
    const [allRes, clientsRes] = await Promise.all([
      fetch('/api/whatsapp'),
      fetch('/api/clients'),
    ]);
    const allMsgs: (WhatsAppMessage & { client_name: string; client_phone: string })[] = await allRes.json();
    const allClients: { id: number; name: string; phone: string }[] = await clientsRes.json();

    const summaries: ClientSummary[] = allClients.map((c) => {
      const cMsgs = allMsgs.filter((m) => m.client_id === c.id);
      const last = cMsgs[cMsgs.length - 1];
      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        unread: cMsgs.filter((m) => m.direction === 'inbound' && !m.is_read).length,
        lastMessage: last?.message,
        lastTime: last?.received_at,
      };
    }).filter((c) => c.lastMessage);

    setClients(summaries);
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  async function selectClient(client: ClientSummary) {
    setSelected(client);
    const res = await fetch(`/api/whatsapp?client_id=${client.id}`);
    const data = await res.json();
    setMessages(data);
    // Mark as read
    await fetch('/api/whatsapp', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: client.id }),
    });
    fetchClients();
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  async function send() {
    if (!draft.trim() || !selected) return;
    setSending(true);
    await fetch('/api/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: selected.id, direction: 'outbound', message: draft.trim(), phone_number: selected.phone }),
    });
    const res = await fetch(`/api/whatsapp?client_id=${selected.id}`);
    setMessages(await res.json());
    setDraft('');
    setSending(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  async function recordInbound() {
    if (!draft.trim() || !selected) return;
    setSending(true);
    await fetch('/api/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: selected.id, direction: 'inbound', message: draft.trim(), phone_number: selected.phone }),
    });
    const res = await fetch(`/api/whatsapp?client_id=${selected.id}`);
    setMessages(await res.json());
    setDraft('');
    setSending(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">WhatsApp Messages</h2>
        <p className="text-sm text-slate-500 mt-0.5">Record and view client WhatsApp conversations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)] min-h-[500px]">
        {/* Client list */}
        <Card className="overflow-y-auto p-0">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Conversations</p>
          </div>
          {clients.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-400">No conversations yet</div>
          ) : (
            <ul>
              {clients.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => selectClient(c)}
                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700/50 ${selected?.id === c.id ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{c.name}</p>
                          {c.lastMessage && (
                            <p className="text-xs text-slate-400 truncate max-w-[140px]">{c.lastMessage}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {c.lastTime && <span className="text-xs text-slate-400">{new Date(c.lastTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
                        {c.unread > 0 && (
                          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold">{c.unread}</span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Chat area */}
        <div className="md:col-span-2 flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <MessageCircle size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">Select a conversation to view messages</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">{selected.name}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1"><Phone size={10} />{selected.phone}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900/50">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm ${
                      msg.direction === 'outbound'
                        ? 'bg-emerald-600 text-white rounded-br-sm'
                        : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-bl-sm'
                    }`}>
                      <p className="leading-relaxed">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.direction === 'outbound' ? 'text-emerald-200' : 'text-slate-400'}`}>
                        {new Date(msg.received_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} · {new Date(msg.received_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <div className="flex gap-2">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                    placeholder="Type a message..."
                    rows={2}
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={send}
                      disabled={sending || !draft.trim()}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <Send size={12} /> Send
                    </button>
                    <button
                      onClick={recordInbound}
                      disabled={sending || !draft.trim()}
                      className="px-3 py-1.5 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 disabled:opacity-50 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <ChevronRight size={12} /> Record reply
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">Press Enter to send · "Record reply" to log a message received on your phone</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
