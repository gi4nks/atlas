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
      
      // Merge with some defaults if missing
      setAppData({
        ...data,
        id: data.id || path.split('/').pop(),
        version: { current: '0.1.0', strategy: 'none' },
        dates: { 
            created: new Date().toISOString().split('T')[0],
            last_update: new Date().toISOString().split('T')[0]
        },
        repository: { type: 'local', url: null },
        run: { local: 'npm start', docker: null },
        health: { has_tests: false, has_ci: false, has_docker: false, has_readme: true },
        tags: [],
        next_steps: [],
        known_issues: [],
        future_ideas: []
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

  return (
    <>
      <button 
        className="btn btn-primary"
        onClick={() => (document.getElementById('new_app_modal') as any).showModal()}
      >
        + Add New Project
      </button>

      <dialog id="new_app_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Add New Project</h3>
          
          {!appData ? (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Absolute Directory Path</span></label>
                <input 
                  type="text" 
                  placeholder="/Users/me/projects/my-app" 
                  className="input input-bordered" 
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                />
              </div>
              <button 
                className="btn btn-secondary w-full" 
                onClick={handleScan}
                disabled={loading || !path}
              >
                {loading ? <span className="loading loading-spinner"></span> : 'AI Smart Scan'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">ID</span></label>
                  <input type="text" className="input input-sm input-bordered" value={appData.id} onChange={e => setAppData({...appData, id: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Name</span></label>
                  <input type="text" className="input input-sm input-bordered" value={appData.name} onChange={e => setAppData({...appData, name: e.target.value})} />
                </div>
              </div>
              
              <div className="form-control">
                <label className="label"><span className="label-text">Description</span></label>
                <textarea className="textarea textarea-bordered h-20" value={appData.description} onChange={e => setAppData({...appData, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                    <label className="label"><span className="label-text">Status</span></label>
                    <select className="select select-sm select-bordered" value={appData.status} onChange={e => setAppData({...appData, status: e.target.value})}>
                        <option value="idea">Idea</option>
                        <option value="prototype">Prototype</option>
                        <option value="mvp">MVP</option>
                        <option value="production">Production</option>
                    </select>
                </div>
                <div className="form-control">
                    <label className="label"><span className="label-text">Category</span></label>
                    <select className="select select-sm select-bordered" value={appData.category} onChange={e => setAppData({...appData, category: e.target.value})}>
                        <option value="personal">Personal</option>
                        <option value="work">Work</option>
                        <option value="experiment">Experiment</option>
                    </select>
                </div>
              </div>

              <div className="modal-action">
                <button className="btn" onClick={() => setAppData(null)}>Back</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                    {loading ? <span className="loading loading-spinner"></span> : 'Save Project'}
                </button>
              </div>
            </div>
          )}
          
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => { setAppData(null); setPath(''); }}>close</button>
          </form>
        </div>
      </dialog>
    </>
  );
}
