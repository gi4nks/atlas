import { getAllApps } from '@/lib/api';
import AppList from '@/components/AppList';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const apps = await getAllApps();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Apps</h1>
        <p className="text-base-content/60">
           Manage and track your {apps.length} applications and projects.
        </p>
      </div>

      <AppList initialApps={apps} />
      
      {apps.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-base-200 rounded-2xl bg-base-100/50">
              <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4 text-3xl">📂</div>
              <h2 className="text-xl font-bold mb-2">Your catalog is empty</h2>
              <p className="text-base-content/60 max-w-md mx-auto mb-6">
                Ready to start? Add your first app YAML configuration in the <code className="bg-base-200 px-1 rounded text-sm">apps/</code> directory.
              </p>
              <a href="https://github.com/gi4nks/atlas" target="_blank" className="btn btn-primary">View Documentation</a>
          </div>
      )}
    </div>
  );
}
