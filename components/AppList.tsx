'use client';

import { useState, useMemo } from 'react';
import { AppData, AppStatus, AppCategory } from '@/types/app';
import AppCard from './AppCard';
import StatusBadge from './StatusBadge';

interface Props {
  initialApps: AppData[];
}

export default function AppList({ initialApps }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<AppCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    const counts = initialApps.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  }, [initialApps]);

  return (
    <div className="space-y-6">
      {/* Stats Ribbon */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
            onClick={() => setStatusFilter('all')}
            className={`badge badge-lg gap-2 cursor-pointer hover:scale-105 transition-transform ${statusFilter === 'all' ? 'badge-neutral' : 'badge-outline'}`}
        >
            All ({initialApps.length})
        </button>
        {Object.entries(stats).map(([status, count]) => (
            <button 
                key={status}
                onClick={() => setStatusFilter(status as AppStatus)}
                className={`badge badge-lg gap-2 cursor-pointer hover:scale-105 transition-transform ${statusFilter === status ? 'badge-primary' : 'badge-outline'}`}
            >
                <span className="capitalize">{status}</span> ({count})
            </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-base-100 p-4 rounded-box shadow-sm border border-base-200">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, description or tags..."
            className="input input-bordered w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
            <select 
                className="select select-bordered"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
            >
                <option value="all">All Categories</option>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="experiment">Experiment</option>
                <option value="archived">Archived</option>
            </select>

            <div className="join border border-base-300">
                <button 
                    className={`join-item btn btn-sm ${viewMode === 'grid' ? 'btn-active' : ''}`}
                    onClick={() => setViewMode('grid')}
                >
                    Grid
                </button>
                <button 
                    className={`join-item btn btn-sm ${viewMode === 'list' ? 'btn-active' : ''}`}
                    onClick={() => setViewMode('list')}
                >
                    List
                </button>
            </div>
        </div>
      </div>

      {/* Results */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-box border border-base-200">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Category</th>
                <th>Stack</th>
                <th>Last Update</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover">
                  <td className="font-bold">{app.name}</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td className="capitalize">{app.category}</td>
                  <td className="text-sm opacity-70">
                      {app.stack.frontend || app.stack.backend || 'N/A'}
                  </td>
                  <td>{app.dates.last_update}</td>
                  <td>
                      <a href={`/apps/${app.id}`} className="btn btn-ghost btn-xs">View</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredApps.length === 0 && (
        <div className="text-center py-20 bg-base-100 rounded-box border border-dashed border-base-300">
          <h2 className="text-xl font-semibold">No apps match your filters</h2>
          <button 
            className="btn btn-ghost btn-sm mt-2"
            onClick={() => { setSearch(''); setStatusFilter('all'); setCategoryFilter('all'); }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
