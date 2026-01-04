import Link from 'next/link';
import { AppData } from '@/types/app';
import StatusBadge from './StatusBadge';
import CategoryBadge from './CategoryBadge';

interface Props {
  app: AppData;
}

export default function AppCard({ app }: Props) {
  return (
    <Link href={`/apps/${app.id}`} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow border border-base-200">
      <div className="card-body">
        <h2 className="card-title justify-between">
          {app.name}
        </h2>
        <div className="flex gap-2 mb-2">
            <StatusBadge status={app.status} />
            <CategoryBadge category={app.category} />
        </div>
        <p className="line-clamp-3 text-sm text-base-content/70 flex-grow">{app.description}</p>
        {app.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
                {app.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="badge badge-ghost badge-xs text-[10px] uppercase font-bold text-base-content/50">
                        {tag}
                    </span>
                ))}
                {app.tags.length > 3 && (
                    <span className="badge badge-ghost badge-xs text-[10px] font-bold text-base-content/50">
                        +{app.tags.length - 3}
                    </span>
                )}
            </div>
        )}
        <div className="card-actions justify-end mt-4">
          <div className="badge badge-outline">{app.stack.frontend || 'No FE'}</div>
          <div className="badge badge-outline">{app.stack.backend || 'No BE'}</div>
        </div>
      </div>
    </Link>
  );
}
