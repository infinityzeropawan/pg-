'use client';

// RESPONSIBILITY: Renders the OwnerTeamMain component. Receives data via props/hooks.

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, ShieldCheck, Wrench, Utensils, Shield, Sparkles, Building2, UserPlus } from 'lucide-react';
import Link from 'next/link';

import { teamApi as api } from '@/app/owner/owner_lib/owner_api/OwnerTeam';
import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';
import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';
import { OWNER_URLS } from '@/app/owner/owner_url_config';
import { Pagination } from '@/components/ui/Pagination';
import { useTableSync } from '@/lib/hooks/useTableSync';

import type { TeamMember, StaffRoleType } from '@/app/owner/owner_lib/owner_api/OwnerTeam';

const ROLE_ICONS: Record<StaffRoleType, any> = {
  manager: ShieldCheck,
  cook: Utensils,
  guard: Shield,
  cleaner: Sparkles
};

const ROLE_COLORS: Record<StaffRoleType, string> = {
  manager: 'text-primary bg-primary-subtle border-primary',
  cook: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  guard: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  cleaner: 'text-teal-500 bg-teal-500/10 border-teal-500/20'
};

export function OwnerTeamMain() {
  const user = typeof window !== 'undefined' ? getSession() : null;
  const { properties, selectedPropertyId, setSelectedPropertyId } = useOwnerPropertyContext();

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { page: currentPage, setPage: setCurrentPage, search: searchQuery, setSearch: setSearchQuery, debouncedSearch } = useTableSync();
  const [roleFilter, setRoleFilter] = useState<StaffRoleType | 'all'>('all');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const members = api.listByOwner(user.id);
    setTeam(members);
    setLoading(false);
  }, [user?.id]);

  const filteredTeam = team.filter(member => {
    // Search match
    const matchSearch = member.user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                        member.user.phone?.includes(debouncedSearch);
    
    // Role match
    const matchRole = roleFilter === 'all' || member.profile.staffType === roleFilter;
    
    // Property match (if 'all', ignore. Else check if assignedPropertyIds includes selectedPropertyId)
    const matchProperty = selectedPropertyId === 'all' || member.user.assignedPropertyIds?.includes(selectedPropertyId);

    return matchSearch && matchRole && matchProperty;
  });

  // Pagination
  const itemsPerPage = 9;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, selectedPropertyId]);

  const totalPages = Math.ceil(filteredTeam.length / itemsPerPage);
  const paginatedData = filteredTeam.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-primary">Team Directory</h1>
          <p className="text-sm text-secondary">Manage your PG managers and cooks.</p>
        </div>
        <Link 
          href={OWNER_URLS.TEAM_CREATE}
          className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-hover motion-safe:transition-colors flex items-center gap-2 text-sm shadow-md justify-center"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Team Member</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 border border-border rounded-md">
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
        
        <div className="flex gap-4">
          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
          >
            <option value="all">All Properties</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{(p as any).name}</option>
            ))}
          </select>
          
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
          >
            <option value="all">All Roles</option>
            <option value="manager">Managers</option>
            <option value="cook">Cooks</option>
            <option value="guard">Guards</option>
            <option value="cleaner">Cleaners</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={`fallback-${i}`} className="h-48 bg-card border border-border rounded-lg motion-safe:animate-pulse"></div>)}
        </div>
      ) : filteredTeam.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-lg text-center">
          <UserPlus className="w-12 h-12 text-secondary opacity-50 mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-1">No Team Members Found</h3>
          <p className="text-secondary text-sm max-w-sm mb-6">
            You don't have any staff matching these filters. Add a manager or staff member to get started.
          </p>
          <Link href={OWNER_URLS.TEAM_CREATE} className="text-primary text-sm font-medium hover:underline">
            + Create Profile
          </Link>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.map(member => {
            const Icon = ROLE_ICONS[member.profile.staffType];
            const colorClass = ROLE_COLORS[member.profile.staffType];
            const propsAssigned = member.user.assignedPropertyIds?.length || 0;
            const initials = member.user.name.substring(0, 2).toUpperCase();

            return (
              <div key={member.user.id} className="bg-card border border-border rounded-lg p-5 hover:border-primary-subtle motion-safe:transition-colors shadow-sm flex flex-col group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold tracking-wider border text-sm ${colorClass}`}>
                      {initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-primary text-base truncate pr-2" title={member.user.name}>
                        {member.user.name}
                      </h3>
                      <div className="text-xs text-secondary">{member.user.phone}</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
                    <Icon className="w-3 h-3 shrink-0" />
                    <span>{member.profile.staffType}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Properties</span>
                    <span className="font-medium text-primary">{propsAssigned} Assigned</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Shift</span>
                    <span className="font-medium text-primary">{member.profile.shift}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Joined</span>
                    <span className="font-medium text-primary">{new Date(member.profile.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border mt-auto">
                  <Link 
                    href={`/owner/team/${member.user.id}`} 
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-transform w-fit"
                  >
                    View Profile &rarr;
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
