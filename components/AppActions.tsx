'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppData } from '@/types/app';
import yaml from 'js-yaml';

export default function AppActions({ app }: { app: AppData }) {
    const [loading, setLoading] = useState(false);
    const [yamlContent, setYamlContent] = useState(yaml.dump(app, { lineWidth: -1 }));
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/apps/${app.id}`, { method: 'DELETE' });
            if (res.ok) router.push('/');
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveYaml = async () => {
        setLoading(true);
        try {
            const parsed = yaml.load(yamlContent);
            const res = await fetch('/api/apps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsed),
            });
            if (res.ok) {
                (document.getElementById('edit_yaml_modal') as any).close();
                router.refresh();
            }
        } catch (e: any) {
            alert('Invalid YAML: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            <button 
                className="btn btn-outline btn-sm"
                onClick={() => (document.getElementById('edit_yaml_modal') as any).showModal()}
            >
                Edit YAML
            </button>
            <button 
                className="btn btn-outline btn-error btn-sm"
                onClick={handleDelete}
                disabled={loading}
            >
                {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Delete'}
            </button>

            <dialog id="edit_yaml_modal" className="modal">
                <div className="modal-box max-w-3xl">
                    <h3 className="font-bold text-lg mb-4">Edit Project YAML</h3>
                    <textarea 
                        className="textarea textarea-bordered w-full h-96 font-mono text-xs"
                        value={yamlContent}
                        onChange={(e) => setYamlContent(e.target.value)}
                    />
                    <div className="modal-action">
                        <button className="btn" onClick={() => (document.getElementById('edit_yaml_modal') as any).close()}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSaveYaml} disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : 'Save Changes'}
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
}
