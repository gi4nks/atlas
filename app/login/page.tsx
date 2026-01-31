'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || 'Invalid credentials. Access denied.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4 border border-primary/20">
                <span className="text-4xl">🗺️</span>
            </div>
            <h1 className="text-4xl font-black text-base-content tracking-tighter uppercase mb-2">Atlas</h1>
            <p className="text-base-content/60 text-xs font-bold uppercase tracking-[0.3em]">Project Catalog</p>
        </div>

        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-[10px] font-black uppercase tracking-widest">Agent ID</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-[10px] font-black uppercase tracking-widest">Access Code</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="alert alert-error text-xs font-bold py-2">
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full uppercase tracking-widest text-xs"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <>Authorize Access</>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center">
            <p className="text-base-content/40 text-[9px] uppercase tracking-widest font-mono">Secured local catalog | forensic-encryption-v1</p>
        </div>
      </div>
    </div>
  );
}
