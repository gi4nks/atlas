import { getAllApps } from '@/lib/api';
import AppList from '@/components/AppList';

export const dynamic = 'force-dynamic';

export default function Home() {
  const apps = getAllApps();

  return (
    <main className="container mx-auto p-4 min-h-screen pb-20">
      <div className="navbar bg-base-100 mb-8 rounded-box shadow-sm border border-base-200">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl font-bold">Atlas</a>
        </div>
        <div className="flex-none gap-2 px-4">
           <span className="text-sm font-medium">{apps.length} Apps</span>
        </div>
      </div>

      <AppList initialApps={apps} />
      
      {apps.length === 0 && (
          <div className="text-center mt-20">
              <h2 className="text-2xl font-bold">Your catalog is empty</h2>
              <p className="py-4">Add your first app YAML in the <code>apps/</code> directory to get started.</p>
          </div>
      )}
    </main>
  );
}
