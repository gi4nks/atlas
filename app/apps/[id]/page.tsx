import { getAppData, getAllApps } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import CategoryBadge from '@/components/CategoryBadge';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const apps = getAllApps();
  return apps.map((app) => ({
    id: app.id,
  }));
}

export default async function AppDetail({ params }: Props) {
  const { id } = await params;
  const app = getAppData(id);

  if (!app) {
    notFound();
  }

  return (
    <main className="container mx-auto p-4 min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="text-sm breadcrumbs mb-4">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li>{app.name}</li>
        </ul>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{app.name}</h1>
          <p className="text-xl text-base-content/80">{app.description}</p>
        </div>
        <div className="flex gap-2">
            <StatusBadge status={app.status} />
            <CategoryBadge category={app.category} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Stack */}
          <section className="card bg-base-100 shadow border border-base-200">
            <div className="card-body">
              <h2 className="card-title mb-4">Tech Stack</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="stat bg-base-200/50 rounded-box p-4">
                    <div className="stat-title">Frontend</div>
                    <div className="stat-value text-lg">{app.stack.frontend || 'N/A'}</div>
                </div>
                <div className="stat bg-base-200/50 rounded-box p-4">
                    <div className="stat-title">Backend</div>
                    <div className="stat-value text-lg">{app.stack.backend || 'N/A'}</div>
                </div>
                <div className="stat bg-base-200/50 rounded-box p-4">
                    <div className="stat-title">Database</div>
                    <div className="stat-value text-lg">{app.stack.database || 'N/A'}</div>
                </div>
                <div className="stat bg-base-200/50 rounded-box p-4">
                    <div className="stat-title">Infra</div>
                    <div className="stat-value text-lg">{app.stack.infra || 'N/A'}</div>
                </div>
              </div>
            </div>
          </section>

          {/* How to Run */}
          <section className="card bg-base-100 shadow border border-base-200">
            <div className="card-body">
              <h2 className="card-title mb-4">How to Run</h2>
              
              <div className="mb-4">
                  <h3 className="font-bold mb-2">Local</h3>
                  <div className="mockup-code">
                      <pre data-prefix="$"><code>{app.run.local}</code></pre>
                  </div>
              </div>

              {app.run.docker && (
                  <div>
                      <h3 className="font-bold mb-2">Docker</h3>
                      <div className="mockup-code">
                          <pre data-prefix="$"><code>{app.run.docker}</code></pre>
                      </div>
                  </div>
              )}
            </div>
          </section>

          {/* Lists: Known Issues, Next Steps, Ideas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {app.next_steps.length > 0 && (
                  <section className="card bg-base-100 shadow border border-base-200 h-full">
                    <div className="card-body">
                      <h2 className="card-title text-success">Next Steps</h2>
                      <ul className="list-disc list-inside space-y-1">
                          {app.next_steps.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                  </section>
              )}
              
               {app.known_issues.length > 0 && (
                  <section className="card bg-base-100 shadow border border-base-200 h-full">
                    <div className="card-body">
                      <h2 className="card-title text-warning">Known Issues</h2>
                       <ul className="list-disc list-inside space-y-1">
                          {app.known_issues.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                  </section>
              )}
          </div>
          
           {app.future_ideas.length > 0 && (
              <section className="card bg-base-100 shadow border border-base-200">
                <div className="card-body">
                  <h2 className="card-title text-info">Future Ideas</h2>
                   <ul className="list-disc list-inside space-y-1">
                      {app.future_ideas.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              </section>
          )}

        </div>

        {/* Right Column: Meta Info */}
        <div className="space-y-6">
            
            {/* Version & Dates */}
            <section className="card bg-base-100 shadow border border-base-200">
                <div className="card-body">
                    <h2 className="card-title text-sm uppercase text-base-content/60">Metadata</h2>
                    
                    <div className="flex justify-between py-2 border-b border-base-200">
                        <span className="text-base-content/70">Version</span>
                        <span className="font-mono font-bold">{app.version.current}</span>
                    </div>
                     <div className="flex justify-between py-2 border-b border-base-200">
                        <span className="text-base-content/70">Created</span>
                        <span>{app.dates.created}</span>
                    </div>
                     <div className="flex justify-between py-2 border-b border-base-200">
                        <span className="text-base-content/70">Last Update</span>
                        <span>{app.dates.last_update}</span>
                    </div>
                </div>
            </section>

             {/* Repository */}
            <section className="card bg-base-100 shadow border border-base-200">
                <div className="card-body">
                     <h2 className="card-title text-sm uppercase text-base-content/60">Repository</h2>
                     <div className="flex items-center gap-2">
                         <span className="badge badge-lg">{app.repository.type}</span>
                         {app.repository.url ? (
                             <a href={app.repository.url} target="_blank" className="link link-primary truncate">
                                 {app.repository.url}
                             </a>
                         ) : <span className="text-base-content/50 italic">No URL</span>}
                     </div>
                </div>
            </section>
            
            {/* Health */}
            <section className="card bg-base-100 shadow border border-base-200">
                <div className="card-body">
                     <h2 className="card-title text-sm uppercase text-base-content/60">Health Checks</h2>
                     <div className="space-y-2">
                         <div className="flex justify-between items-center">
                             <span>Tests</span>
                             <span className={app.health.has_tests ? "text-success" : "text-error"}>
                                 {app.health.has_tests ? "✓" : "✕"}
                             </span>
                         </div>
                         <div className="flex justify-between items-center">
                             <span>CI/CD</span>
                             <span className={app.health.has_ci ? "text-success" : "text-error"}>
                                 {app.health.has_ci ? "✓" : "✕"}
                             </span>
                         </div>
                         <div className="flex justify-between items-center">
                             <span>Docker</span>
                             <span className={app.health.has_docker ? "text-success" : "text-error"}>
                                 {app.health.has_docker ? "✓" : "✕"}
                             </span>
                         </div>
                         <div className="flex justify-between items-center">
                             <span>README</span>
                             <span className={app.health.has_readme ? "text-success" : "text-error"}>
                                 {app.health.has_readme ? "✓" : "✕"}
                             </span>
                         </div>
                     </div>
                </div>
            </section>

            {/* Tags */}
             {app.tags.length > 0 && (
                <section>
                    <div className="flex flex-wrap gap-2">
                        {app.tags.map(tag => (
                            <span key={tag} className="badge badge-ghost">#{tag}</span>
                        ))}
                    </div>
                </section>
             )}

        </div>
      </div>
    </main>
  );
}
