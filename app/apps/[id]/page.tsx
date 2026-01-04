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
    <div className="bg-base-100 min-h-screen pb-20">
      
      {/* Hero Header */}
      <div className="bg-base-200/30 border-b border-base-200">
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="text-sm breadcrumbs mb-6 text-base-content/60">
                <ul>
                    <li><Link href="/">Atlas</Link></li>
                    <li><Link href="/">Apps</Link></li>
                    <li>{app.name}</li>
                </ul>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
                <div className="flex-1 space-y-4">
                    <div className="flex gap-3 items-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-base-content">{app.name}</h1>
                        <StatusBadge status={app.status} />
                    </div>
                    <p className="text-xl text-base-content/80 max-w-2xl leading-relaxed">
                        {app.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                         <CategoryBadge category={app.category} />
                         {app.tags.map(tag => (
                            <span key={tag} className="badge badge-outline opacity-70">#{tag}</span>
                         ))}
                    </div>
                </div>
                
                <div className="flex flex-col gap-3 min-w-[200px]">
                    <div className="stats shadow bg-base-100 border border-base-200">
                        <div className="stat place-items-center py-2">
                            <div className="stat-title text-xs uppercase font-bold tracking-wider">Version</div>
                            <div className="stat-value text-2xl">{app.version.current}</div>
                            <div className="stat-desc text-xs font-mono">{app.version.strategy}</div>
                        </div>
                    </div>
                    {app.repository.url && (
                        <a href={app.repository.url} target="_blank" className="btn btn-primary w-full gap-2">
                            View Repository
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </a>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Technical Details (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
            
            {/* Tech Stack */}
            <section>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center text-sm">🛠</span>
                    Tech Stack
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {[
                        { label: 'Frontend', value: app.stack.frontend },
                        { label: 'Backend', value: app.stack.backend },
                        { label: 'Database', value: app.stack.database },
                        { label: 'Infrastructure', value: app.stack.infra }
                     ].map((item) => (
                         item.value && (
                             <div key={item.label} className="p-4 rounded-xl border border-base-200 bg-base-50/50 flex flex-col hover:border-primary/20 transition-colors">
                                 <span className="text-xs font-bold text-base-content/40 uppercase tracking-wider mb-1">{item.label}</span>
                                 <span className="font-semibold text-lg">{item.value}</span>
                             </div>
                         )
                     ))}
                </div>
            </section>

            {/* Run Instructions */}
            <section>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded bg-secondary/10 text-secondary flex items-center justify-center text-sm">🚀</span>
                    Quick Start
                </h3>
                <div className="space-y-6">
                    <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg border border-base-content/10">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#3e3e3e]">
                            <span className="text-xs font-mono text-gray-400">Local Development</span>
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                            </div>
                        </div>
                        <div className="p-4 overflow-x-auto">
                             <pre className="text-sm font-mono text-gray-300"><code>{app.run.local}</code></pre>
                        </div>
                    </div>
                    
                    {app.run.docker && (
                         <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg border border-base-content/10">
                            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#3e3e3e]">
                                <span className="text-xs font-mono text-gray-400">Docker</span>
                            </div>
                            <div className="p-4 overflow-x-auto">
                                <pre className="text-sm font-mono text-gray-300"><code>{app.run.docker}</code></pre>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            
            {/* Status Lists */}
            <div className="grid md:grid-cols-2 gap-8">
                {app.next_steps.length > 0 && (
                    <section>
                         <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-success"></div> Next Steps
                         </h3>
                         <ul className="space-y-3">
                             {app.next_steps.map((step, i) => (
                                 <li key={i} className="flex gap-3 text-base-content/80 bg-base-100 p-3 rounded-lg border border-base-200">
                                     <span className="text-success font-bold">•</span>
                                     <span>{step}</span>
                                 </li>
                             ))}
                         </ul>
                    </section>
                )}

                 {app.known_issues.length > 0 && (
                    <section>
                         <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-error"></div> Known Issues
                         </h3>
                         <ul className="space-y-3">
                             {app.known_issues.map((issue, i) => (
                                 <li key={i} className="flex gap-3 text-base-content/80 bg-base-100 p-3 rounded-lg border border-base-200">
                                     <span className="text-error font-bold">!</span>
                                     <span>{issue}</span>
                                 </li>
                             ))}
                         </ul>
                    </section>
                )}
            </div>
             
             {app.future_ideas.length > 0 && (
                <section className="bg-base-200/30 p-6 rounded-2xl border border-dashed border-base-300">
                     <h3 className="text-lg font-bold mb-4 opacity-70">Future Ideas & Roadmap</h3>
                     <ul className="grid md:grid-cols-2 gap-4">
                        {app.future_ideas.map((idea, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="text-info mt-1">💡</span>
                                <span className="text-base-content/70 italic">{idea}</span>
                            </li>
                        ))}
                     </ul>
                </section>
             )}

        </div>

        {/* Right Column: Meta (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
            
            {/* Health Card */}
            <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
                <div className="card-body p-0">
                    <div className="bg-base-200/50 p-4 border-b border-base-200">
                         <h3 className="font-bold text-sm uppercase tracking-wider opacity-60">Project Health</h3>
                    </div>
                    <div className="divide-y divide-base-100">
                        <div className="flex items-center justify-between p-4 hover:bg-base-50 transition-colors">
                            <span className="text-sm">Unit Tests</span>
                            {app.health.has_tests ? <span className="badge badge-success badge-sm">Pass</span> : <span className="badge badge-ghost badge-sm opacity-50">Missing</span>}
                        </div>
                         <div className="flex items-center justify-between p-4 hover:bg-base-50 transition-colors">
                            <span className="text-sm">CI Pipeline</span>
                            {app.health.has_ci ? <span className="badge badge-success badge-sm">Active</span> : <span className="badge badge-ghost badge-sm opacity-50">Missing</span>}
                        </div>
                         <div className="flex items-center justify-between p-4 hover:bg-base-50 transition-colors">
                            <span className="text-sm">Dockerized</span>
                            {app.health.has_docker ? <span className="badge badge-success badge-sm">Yes</span> : <span className="badge badge-ghost badge-sm opacity-50">No</span>}
                        </div>
                         <div className="flex items-center justify-between p-4 hover:bg-base-50 transition-colors">
                            <span className="text-sm">Documentation</span>
                            {app.health.has_readme ? <span className="badge badge-success badge-sm">Yes</span> : <span className="badge badge-ghost badge-sm opacity-50">No</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Dates Card */}
            <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body p-6 text-sm">
                     <h3 className="font-bold uppercase tracking-wider opacity-60 mb-4">Timeline</h3>
                     
                     <div className="relative border-l-2 border-base-200 ml-2 space-y-6">
                        <div className="ml-4 relative">
                             <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-base-100"></div>
                             <p className="font-semibold">Last Updated</p>
                             <p className="text-base-content/60">{app.dates.last_update}</p>
                        </div>
                        <div className="ml-4 relative">
                             <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-base-300 ring-4 ring-base-100"></div>
                             <p className="font-semibold">Created</p>
                             <p className="text-base-content/60">{app.dates.created}</p>
                        </div>
                     </div>
                </div>
            </div>

            {/* Environment Vars Hint */}
             {app.dependencies.env_vars.length > 0 && (
                 <div className="alert bg-base-100 border border-warning/20 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-warning shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <div>
                        <h3 className="font-bold text-xs">Requires Environment Variables</h3>
                        <div className="text-xs opacity-70 mt-1 font-mono">
                            {app.dependencies.env_vars.slice(0, 3).join(', ')}
                            {app.dependencies.env_vars.length > 3 && ` +${app.dependencies.env_vars.length - 3} more`}
                        </div>
                    </div>
                 </div>
             )}

        </div>
      </div>
    </div>
  );
}