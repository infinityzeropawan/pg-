// RESPONSIBILITY: Renders the OwnerRoomsFilters component. Receives data via props/hooks.

import { Search, Filter } from 'lucide-react';

import type { Dispatch, SetStateAction } from 'react';

export interface OwnerRoomsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filterSharing: string;
  setFilterSharing: (val: string) => void;
  filterStatus: string;
  setFilterStatus: (val: string) => void;
  selectedPropertyId: string;
  setSelectedPropertyId?: (id: string) => void;
  properties: unknown[];
}

export function OwnerRoomsFilters({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  filterSharing,
  setFilterSharing,
  filterStatus,
  setFilterStatus,
  selectedPropertyId,
  setSelectedPropertyId,
  properties
}: OwnerRoomsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 border border-border rounded-md relative">
      <div className="flex-1 relative">
        <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search room number or floor..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:border-primary text-primary motion-safe:transition-colors"
        />
      </div>
      <button 
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium motion-safe:transition-colors ${
          showFilters || filterSharing !== 'all' || filterStatus !== 'all' || selectedPropertyId !== 'all'
            ? 'border-primary bg-[rgba(99,102,241,0.05)] text-primary' 
            : 'border-border text-primary hover:bg-input'
        }`}
      >
        <Filter className="w-4 h-4" />
        Filters {(filterSharing !== 'all' || filterStatus !== 'all' || selectedPropertyId !== 'all') && <span className="w-2 h-2 rounded-full bg-primary ml-1"></span>}
      </button>

      {/* Filter Popover */}
      {showFilters && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-xl z-10 p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="font-semibold text-primary text-sm">Filter Rooms</h3>
            <button 
              onClick={() => {
                setFilterSharing('all');
                setFilterStatus('all');
                if (setSelectedPropertyId) setSelectedPropertyId('all');
              }}
              className="text-xs text-secondary hover:text-primary"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-secondary">Property</label>
            <select 
              value={selectedPropertyId}
              onChange={(e) => {
                 if (setSelectedPropertyId) setSelectedPropertyId(e.target.value);
              }}
              className="w-full px-3 py-2 border border-border rounded-md text-sm text-primary bg-input focus:outline-none focus:border-primary"
            >
              <option value="all">All Properties</option>
              {properties.map(p => (
// @ts-expect-error
                <option key={p.id} value={p.id}>{(p as any).name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-secondary">Sharing Type</label>
            <select 
              value={filterSharing}
              onChange={(e) => setFilterSharing(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm text-primary bg-input focus:outline-none focus:border-primary"
            >
              <option value="all">All Sharing</option>
              <option value="1">Single</option>
              <option value="2">Double</option>
              <option value="3">Triple</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-secondary">Vacancy Status</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm text-primary bg-input focus:outline-none focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="available">Available (Has Vacancy)</option>
              <option value="occupied">Fully Occupied</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
