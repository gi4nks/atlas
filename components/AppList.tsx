'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { AppData, AppStatus, AppCategory } from '@/types/app';
import AppCard from './AppCard';
import StatusBadge from './StatusBadge';

interface Props {
  initialApps: AppData[];
}

export default function AppList({ initialApps }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState<AppStatus | 'all'>((searchParams.get('status') as AppStatus) || 'all');
  const [categoryFilter, setCategoryFilter] = useState<AppCategory | 'all'>((searchParams.get('category') as AppCategory) || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(searchParams.get('view') === 'list' ? 'list' : 'grid');

  // Update URL when filters change
  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      
      Object.entries(params).forEach(([name, value]) => {
        if (value === null || value === 'all' || value === '') {
          newParams.delete(name);
        } else {
          newParams.set(name, value);
        }
      });
 
      return newParams.toString();
    },
    [searchParams]
  );

  const updateFilters = (updates: Record<string, string | null>) => {
    const queryString = createQueryString(updates);
    router.push(`${pathname}${queryString ? '?' + queryString : ''}`, { scroll: false });
  };

  const filteredApps = useMemo(() => {
    return initialApps.filter((app) => {
      const matchesSearch = 
        app.name.toLowerCase().includes(search.toLowerCase()) || 
        app.description.toLowerCase().includes(search.toLowerCase()) ||
        app.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [initialApps, search, statusFilter, categoryFilter]);

  const stats = useMemo(() => {
    return initialApps.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [initialApps]);

  return (
    <div className="space-y-8">
      {/* Controls Section */}
      <div className="bg-base-100 rounded-2xl p-1 md:p-2 border border-base-200 shadow-sm">
         <div className="flex flex-col md:flex-row gap-4 p-2">
             {/* Search */}
             <div className="flex-1 relative">
                <input
                    type="text"
                    placeholder="Search apps..."
                    className="input input-bordered w-full pl-10 bg-base-100 focus:bg-base-100 transition-all"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        updateFilters({ q: e.target.value });
                    }}
                />
                <svg className="absolute left-3 top-3.5 h-5 w-5 text-base-content/40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>

             {/* Filters */}
             <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                <select 
                    className="select select-bordered"
                    value={categoryFilter}
                    onChange={(e) => {
                        const val = e.target.value as any;
                        setCategoryFilter(val);
                        updateFilters({ category: val });
                    }}
                >
                    <option value="all">All Categories</option>
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="experiment">Experiment</option>
                    <option value="archived">Archived</option>
                </select>

                <div className="join border border-base-300 bg-base-200/50 p-1 rounded-lg">
                    <button 
                        className={`join-item btn btn-sm border-0 ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'bg-transparent text-base-content/60'}`}
                        onClick={() => {
                            setViewMode('grid');
                            updateFilters({ view: 'grid' });
                        }}
                    >
                        Grid
                    </button>
                    <button 
                        className={`join-item btn btn-sm border-0 ${viewMode === 'list' ? 'bg-white shadow-sm' : 'bg-transparent text-base-content/60'}`}
                        onClick={() => {
                            setViewMode('list');
                            updateFilters({ view: 'list' });
                        }}
                    >
                        List
                    </button>
                </div>
             </div>
         </div>
         
         {/* Status Tags Row */}
         <div className="flex gap-2 overflow-x-auto px-2 pb-2 md:pb-1 no-scrollbar pt-2 border-t border-base-100">
             <button 
                onClick={() => {
                    setStatusFilter('all');
                    updateFilters({ status: 'all' });
                }}
                className={`btn btn-xs rounded-full normal-case font-medium ${statusFilter === 'all' ? 'btn-neutral' : 'btn-ghost'}`}
             >
                All
                <span className="badge badge-sm badge-ghost ml-1">{initialApps.length}</span>
             </button>
             {Object.entries(stats).map(([status, count]) => (
                <button 
                    key={status}
                    onClick={() => {
                        setStatusFilter(status as AppStatus);
                        updateFilters({ status });
                    }}
                    className={`btn btn-xs rounded-full normal-case font-medium ${statusFilter === status ? 'btn-primary text-primary-content' : 'btn-ghost'}`}
                >
                    <span className="capitalize">{status}</span>
                    <span className={`badge badge-sm ml-1 ${statusFilter === status ? 'badge-ghost' : 'badge-neutral'}`}>{count}</span>
                </button>
             ))}
         </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="overflow-x-auto bg-base-100 rounded-2xl border border-base-200 shadow-sm">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200/50">
              <tr>
                <th>App Name</th>
                <th>Status</th>
                <th>Category</th>
                <th>Stack</th>
                <th>Last Update</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover group cursor-pointer" onClick={() => window.location.href = `/apps/${app.id}`}>
                  <td>
                      <div className="font-bold">{app.name}</div>
                      <div className="text-xs opacity-50 truncate max-w-[200px]">{app.description}</div>
                  </td>
                  <td><StatusBadge status={app.status} /></td>
                  <td className="capitalize"><span className="badge badge-ghost badge-sm">{app.category}</span></td>
                  <td className="text-sm opacity-70 font-mono text-xs">
                      {app.stack.frontend && <span className="mr-2">FE: {app.stack.frontend}</span>}
                      {app.stack.backend && <span>BE: {app.stack.backend}</span>}
                  </td>
                  <td className="text-sm opacity-60 tabular-nums">{app.dates.last_update}</td>
                  <td className="text-right">
                      <span className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredApps.length === 0 && (
        <div className="text-center py-20 bg-base-100 rounded-2xl border border-dashed border-base-300">
          <div className="opacity-20 text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold">No apps match your search</h2>
          <p className="text-base-content/60 mb-4">Try adjusting your filters or search query.</p>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => { setSearch(''); setStatusFilter('all'); setCategoryFilter('all'); }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}