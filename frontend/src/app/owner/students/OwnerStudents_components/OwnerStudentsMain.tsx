'use client';

// RESPONSIBILITY: Renders the OwnerStudentsMain component. Receives data via props/hooks.

import { propertiesApi } from '@/app/owner/owner_lib/owner_api/OwnerProperties';
import { studentsApi } from '@/app/owner/owner_lib/owner_api/OwnerStudents';
import { useState, useEffect } from 'react';
import { authApi } from '@/app/owner/owner_lib/owner_api/OwnerAuth';

import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';
import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';
import { Search, Users, AlertCircle, Building, Filter } from 'lucide-react';
import Link from 'next/link';
import type { StudentMember } from '@/app/student/student_lib/student_api/StudentStudents';
import { formatINR } from '@/lib/utils/formatters';
import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { Pagination } from '@/components/ui/Pagination';
import { useTableSync } from '@/lib/hooks/useTableSync';

export function OwnerStudentsMain() {
  const user = typeof window !== 'undefined' ? getSession() : null;
  const { properties, selectedPropertyId } = useOwnerPropertyContext();

  const [students, setStudents] = useState<StudentMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { page: currentPage, setPage: setCurrentPage, search: searchQuery, setSearch: setSearchQuery, debouncedSearch } = useTableSync();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'on_notice' | 'checked_out'>('all');
  const [duesFilter, setDuesFilter] = useState<'all' | 'has_dues'>('all');
  const [propertyFilter, setPropertyFilter] = useState('all');

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // Auto seed mocks if empty for demo purposes
    studentsApi.seedMocksIfEmpty(user.id);
    
    const data = studentsApi.listByOwner(user.id);
    setStudents(data);
    setLoading(false);
  }, [user?.id]);

  const filteredStudents = students.filter(t => {
    // Global Property context match
    if (selectedPropertyId !== 'all' && t.profile.propertyId !== selectedPropertyId) return false;
    
    // Local property match
    if (propertyFilter !== 'all' && t.profile.propertyId !== propertyFilter) return false;
    
    // Status match
    if (statusFilter !== 'all' && t.profile.status !== statusFilter) return false;

    // Dues match
    if (duesFilter === 'has_dues' && t.profile.duesAmount <= 0) return false;

    // Search
    if (debouncedSearch) {
      const sq = debouncedSearch.toLowerCase();
      return t.user.name.toLowerCase().includes(sq) || t.user.phone?.includes(sq);
    }
    
    return true;
  });

  // Pagination
  const itemsPerPage = 9;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, duesFilter, propertyFilter, selectedPropertyId]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedData = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleGrantDiscount = (studentProfileId: string) => {
    if (confirm('Grant 5% special discount to this student for next month due to high PG Score?')) {
      const profile = students.find(t => t.profile.id === studentProfileId)?.profile;
      if(profile) {
        db.update<any>(STORAGE_KEYS.STUDENTS, profile.id, { discountApplied: true });
        // update local state
        setStudents(students.map(t => t.profile.id === studentProfileId ? { ...t, profile: { ...t.profile, discountApplied: true } } : t));
      }
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-primary">Students Directory</h1>
          <p className="text-sm text-secondary">Manage your students across all properties.</p>
        </div>
      </div>

      <div className="bg-card p-4 border border-border rounded-md relative">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:border-primary text-primary motion-safe:transition-colors"
            />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium motion-safe:transition-colors ${showFilters ? 'bg-primary-subtle border-primary text-primary' : 'bg-input border-border text-primary hover:border-primary'}`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 motion-safe:duration-200">
            {/* The Property Filter is now handled globally via OwnerPropertyContext, but if they want it specifically here, we can override or just point out the global one. Since the user asked for 3 dropdowns including PG, we'll add it here to filter locally too, but it will be constrained by the global context if set. */}
            <select 
              value={selectedPropertyId} 
              disabled // Keep it disabled as it's controlled globally, or use a local one. Wait, let me add a local one instead.
              className="hidden" 
            />
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-secondary uppercase">Property</label>
              <select 
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value)}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
              >
                <option value="all">All Properties</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{(p as any).name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-secondary uppercase">Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Students</option>
                <option value="on_notice">On Notice</option>
                <option value="checked_out">Checked Out</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-secondary uppercase">Dues</label>
              <select 
                value={duesFilter}
// @ts-expect-error
                onChange={(e) => setDuesFilter(e.target.value as unknown)}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
              >
                <option value="all">All Balances</option>
                <option value="has_dues">Pending Dues Only</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={`fallback-${i}`} className="h-48 bg-card border border-border rounded-lg motion-safe:animate-pulse"></div>)}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-lg text-center">
          <Users className="w-12 h-12 text-secondary opacity-50 mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-1">No Students Found</h3>
          <p className="text-secondary text-sm max-w-sm mb-6">
            We couldn't find any students matching your current filters.
          </p>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.map(t => {
            const property = properties.find(p => p.id === t.profile.propertyId);
            const propName = property?.name || 'Unknown Property';

            return (
              <div key={t.user.id} className="bg-card border border-border rounded-lg p-5 hover:border-primary-subtle motion-safe:transition-colors shadow-sm flex flex-col group relative overflow-hidden">
                {t.profile.status === 'on_notice' && (
                  <div className="absolute top-0 right-0 bg-warning-bg text-warning text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg border-b border-l border-warning">
                    On Notice
                  </div>
                )}
                {t.profile.status === 'checked_out' && (
                  <div className="absolute top-0 right-0 bg-danger-bg text-danger text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg border-b border-l border-danger">
                    Checked Out
                  </div>
                )}

                <div className="flex items-center gap-4 mb-5 mt-2">
                  <div className="w-12 h-12 rounded-full bg-input border border-border flex items-center justify-center text-primary font-bold text-lg">
                    {t.user.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-base truncate pr-2" title={t.user.name}>
                      {t.user.name}
                    </h3>
                    <div className="text-sm text-secondary">{t.user.phone}</div>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <Building className="w-4 h-4" />
                    <span>{propName}</span>
                  </div>
                  
                  {t.profile.duesAmount > 0 ? (
                    <div className="flex items-center gap-2 text-sm font-semibold text-danger">
                      <AlertCircle className="w-4 h-4" />
                      <span>Pending: {formatINR(t.profile.duesAmount)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-success font-medium">
                      <span>No Pending Dues</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-secondary">PG SCORE:</span>
                      <span className={`text-sm font-bold ${t.profile.pgScore > 80 ? 'text-success' : t.profile.pgScore < 50 ? 'text-danger' : 'text-primary'}`}>
                        {t.profile.pgScore}/100
                      </span>
                    </div>
                    {t.profile.pgScore > 90 && !t.profile.discountApplied && (
                      <button onClick={() => handleGrantDiscount(t.profile.id)} className="text-[10px] bg-primary-subtle text-primary px-2 py-1 rounded font-bold hover:bg-primary hover:text-white motion-safe:transition-colors">
                        Give Discount
                      </button>
                    )}
                    {t.profile.discountApplied && (
                      <span className="text-[10px] bg-success-bg text-success px-2 py-1 rounded font-bold">Discounted</span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-border mt-5">
                  <Link 
                    href={`/owner/students/${t.profile.id}`} 
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-transform w-fit"
                  >
                    View Full Profile &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
        </>
      )}
    </div>
  );
}
