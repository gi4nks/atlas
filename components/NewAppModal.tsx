'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewAppModal() {
  const [path, setPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [appData, setAppData] = useState<any>(null);
  const router = useRouter();

  const handleScan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/apps/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setAppData({
        ...data,
        id: data.id || path.split('/').pop()?.replace(/[^a-z0-9]/gi, '-').toLowerCase(),
        version: data.version || { current: '0.1.0', strategy: 'none' },
        dates: data.dates || { 
            created: new Date().toISOString().split('T')[0],
            last_update: new Date().toISOString().split('T')[0]
        },
        repository: data.repository || { type: 'local', url: null },
        run: data.run || { local: 'npm start', docker: null },
        health: data.health || { has_tests: false, has_ci: false, has_docker: false, has_readme: true },
        tags: data.tags || [],
        next_steps: data.next_steps || [],
        known_issues: data.known_issues || [],
        future_ideas: data.future_ideas || []
      });
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appData),
      });
      if (res.ok) {
        (document.getElementById('new_app_modal') as any).close();
        router.refresh();
        setAppData(null);
        setPath('');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setAppData(null);
    setPath('');
    (document.getElementById('new_app_modal') as any).close();
  };

  return (
    <>
      <button 
        className="btn btn-primary shadow-lg shadow-primary/20 gap-2"
        onClick={() => (document.getElementById('new_app_modal') as any).showModal()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        New Project
      </button>

      <dialog id="new_app_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-2xl border border-base-300 p-0 overflow-hidden bg-base-100">
          
          {/* Header */}
          <div className="bg-base-200/50 p-6 border-b border-base-300">
            <h3 className="font-extrabold text-2xl tracking-tight flex items-center gap-3">
              {appData ? "✨ Review Analysis" : "🚀 Import Project"}
            </h3>
            <p className="text-sm text-base-content/60 mt-1">
              {appData ? "Confirm the details discovered by Gemini AI" : "Enter the local path to automatically catalog your app"}
            </p>
          </div>

          <div className="p-6">
            {!appData ? (
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-xs uppercase tracking-widest opacity-70">Project Location</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="/Users/gianluca/projects/my-cool-app" 
                      className="input input-bordered w-full pr-10 bg-base-200/30 focus:bg-base-100 transition-all" 
                      value={path}
                      onChange={(e) => setPath(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none opacity-40">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                    </div>
                  </div>
                  <label className="label">
                    <span className="label-text-alt opacity-50 italic">The scanner will look for README, package.json or go.mod</span>
                  </label>
                </div>

                <button 
                  className={`btn btn-primary w-full h-14 text-lg ${loading ? 'btn-disabled' : ''} bg-gradient-to-r from-primary to-secondary border-none text-white`} 
                  onClick={handleScan}
                  disabled={loading || !path}
                >
                  {loading ? (
                    <><span className="loading loading-spinner"></span> Analyzing Project...</>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="text-xl">✨</span> AI Smart Scan
                    </span>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Project Identity Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control w-full">
                    <label className="label"><span className="label-text font-bold text-[10px] uppercase">ID (Slug)</span></label>
                    <input type="text" className="input input-bordered input-sm font-mono" value={appData.id} onChange={e => setAppData({...appData, id: e.target.value})} />
                  </div>
                  <div className="form-control w-full">
                    <label className="label"><span className="label-text font-bold text-[10px] uppercase">Display Name</span></label>
                    <input type="text" className="input input-bordered input-sm" value={appData.name} onChange={e => setAppData({...appData, name: e.target.value})} />
                  </div>
                </div>
                
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold text-[10px] uppercase">Description</span></label>
                  <textarea className="textarea textarea-bordered h-20 text-sm leading-relaxed" value={appData.description} onChange={e => setAppData({...appData, description: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                      <label className="label"><span className="label-text font-bold text-[10px] uppercase">Status</span></label>
                      <select className="select select-bordered select-sm" value={appData.status} onChange={e => setAppData({...appData, status: e.target.value})}>
                          <option value="idea">💡 Idea</option>
                          <option value="prototype">🧪 Prototype</option>
                          <option value="mvp">🚀 MVP</option>
                          <option value="beta">🛠 Beta</option>
                          <option value="production">✅ Production</option>
                      </select>
                  </div>
                  <div className="form-control">
                      <label className="label"><span className="label-text font-bold text-[10px] uppercase">Category</span></label>
                      <select className="select select-bordered select-sm" value={appData.category} onChange={e => setAppData({...appData, category: e.target.value})}>
                          <option value="personal">🏠 Personal</option>
                          <option value="work">💼 Work</option>
                          <option value="experiment">🧪 Experiment</option>
                      </select>
                  </div>
                </div>

                <div className="divider opacity-50 my-2">Tech Stack</div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['frontend', 'backend', 'database', 'infra'].map((field) => (
                        <div key={field} className="form-control">
                            <label className="label"><span className="label-text text-[9px] font-bold uppercase opacity-50">{field}</span></label>
                            <input 
                                type="text" 
                                className="input input-bordered input-xs h-8" 
                                value={appData.stack[field] || ''} 
                                placeholder="None"
                                onChange={e => setAppData({...appData, stack: {...appData.stack, [field]: e.target.value || null}})} 
                            />
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 justify-end mt-8">
                  <button className="btn btn-ghost btn-sm" onClick={() => setAppData(null)}>Back</button>
                  <button className="btn btn-primary btn-sm px-6" onClick={handleSave} disabled={loading}>
                      {loading ? <span className="loading loading-spinner"></span> : 'Save Project'}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="modal-action absolute top-2 right-4 mt-0">
            <form method="dialog">
              <button className="btn btn-circle btn-ghost btn-xs" onClick={closeModal}>✕</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop bg-base-900/40 backdrop-blur-sm">
          <button onClick={closeModal}>close</button>
        </form>
      </dialog>
    </>
  );
}