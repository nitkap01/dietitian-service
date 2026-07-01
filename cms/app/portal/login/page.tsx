'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Loader2 } from 'lucide-react';

export default function PortalLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/portal/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      router.push('/portal');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #F0EBF8 0%, #EBF5F0 60%, #F5F0FA 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3" style={{ background: 'linear-gradient(135deg, #5C3A9E, #3D2070)', boxShadow: '0 6px 25px rgba(92,58,158,0.4)' }}>
            <Leaf size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-[#1A1A2E]">Hale N Hearty</h1>
          <p className="text-sm text-gray-500 mt-1">Your personal diet portal</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-3xl border p-7 shadow-sm" style={{ borderColor: '#EDE7F6' }}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Phone number</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your registered phone"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5C3A9E] focus:ring-2 focus:ring-purple-100 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password from your dietitian"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5C3A9E] focus:ring-2 focus:ring-purple-100 transition-all" />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #5C3A9E, #3D2070)', boxShadow: '0 6px 25px rgba(92,58,158,0.4)' }}>
              {loading && <Loader2 size={16} className="animate-spin" />} Log in
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">Your dietitian shares your login on WhatsApp. Only they can reset your password.</p>
        </form>
      </div>
    </div>
  );
}
