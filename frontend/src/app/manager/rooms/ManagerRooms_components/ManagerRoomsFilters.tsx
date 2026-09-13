// RESPONSIBILITY: Renders the ManagerRoomsFilters component.
import { Search, Filter } from 'lucide-react';
interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filterSharing: string;
  setFilterSharing: (val: string) => void;
  filterStatus: string;
  setFilterStatus: (val: string) => void;
}
export function ManagerRoomsFilters({ 
  searchQuery, setSearchQuery, 
  showFilters, setShowFilters, 
  filterSharing, setFilterSharing, 
  filterStatus, setFilterStatus 
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 border border rounded-[var(--radius-md,8px)] relative">
      <div className="flex-1 relative">
        <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search room number or floor..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-input border border rounded-[var(--radius-md,8px)] text-sm focus:outline-none focus:border-primary text-primary motion-safe:transition-colors"
        />
      </div>
      <button 
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-[var(--radius-md,8px)] text-sm font-medium motion-safe:transition-colors ${
          showFilters || filterSharing !== 'all' || filterStatus !== 'all'
            ? 'border-primary bg-[rgba(99,102,241,0.05)] text-primary' 
            : 'border text-primary hover:bg-input'
        }`}
      >
        <Filter className="w-4 h-4" />
        Filters {(filterSharing !== 'all' || filterStatus !== 'all') && <span className="w-2 h-2 rounded-full bg-primary ml-1"></span>}
      </button>
      {/* Filter Popover */}
      {showFilters && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-card border border rounded-[var(--radius-lg,12px)] shadow-xl z-10 p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border pb-2">
            <h3 className="font-semibold text-primary text-sm">Filter Rooms</h3>
            <button 
              onClick={() => {
                setFilterSharing('all');
                setFilterStatus('all');
              }}
              className="text-xs text-secondary hover:text-primary"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-secondary">Sharing Type</label>
            <select 
              value={filterSharing}
              onChange={(e) => setFilterSharing(e.target.value)}
              className="w-full px-3 py-2 border border rounded-md text-sm text-primary bg-input focus:outline-none focus:border-primary"
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
              className="w-full px-3 py-2 border border rounded-md text-sm text-primary bg-input focus:outline-none focus:border-primary"
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