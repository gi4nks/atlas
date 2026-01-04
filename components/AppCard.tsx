import Link from 'next/link';
import { AppData } from '@/types/app';
import StatusBadge from './StatusBadge';
import CategoryBadge from './CategoryBadge';

interface Props {
  app: AppData;
}

export default function AppCard({ app }: Props) {
  return (
    <Link 
      href={`/apps/${app.id}`} 
      className="group block h-full card bg-base-100 shadow-sm hover:shadow-xl transition-all duration-300 border border-base-200 hover:-translate-y-1 overflow-hidden"
    >
      <div className="card-body p-6 flex flex-col h-full">
        <div className="flex justify-between items-start gap-4 mb-2">
           <h2 className="card-title text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
              {app.name}
            </h2>
            <StatusBadge status={app.status} />
        </div>
        
        <p className="text-sm text-base-content/70 line-clamp-2 min-h-[2.5em] mb-4">
          {app.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
            <CategoryBadge category={app.category} />
             {app.tags.slice(0, 2).map(tag => (
                <span key={tag} className="badge badge-sm badge-ghost text-xs font-medium text-base-content/60">
                    #{tag}
                </span>
            ))}
             {app.tags.length > 2 && (
                <span className="badge badge-sm badge-ghost text-xs font-medium text-base-content/60">
                   +{app.tags.length - 2}
                </span>
             )}
        </div>

        <div className="mt-auto pt-4 border-t border-base-100 flex justify-between items-center">
             <div className="flex gap-2">
                <div className="tooltip" data-tip="Frontend">
                    <div className="badge badge-outline badge-xs opacity-70">
                         {app.stack.frontend ? 'FE' : '-'}
                    </div>
                </div>
                 <div className="tooltip" data-tip="Backend">
                    <div className="badge badge-outline badge-xs opacity-70">
                         {app.stack.backend ? 'BE' : '-'}
                    </div>
                </div>
             </div>
             <span className="text-[10px] uppercase font-bold text-base-content/30 tracking-wider">
                View Details &rarr;
             </span>
        </div>
      </div>
    </Link>
  );
}