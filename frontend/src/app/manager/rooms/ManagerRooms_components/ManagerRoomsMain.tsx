// RESPONSIBILITY: Renders the ManagerRoomsMain component.
'use client';
import { useState } from 'react';
import { BedDouble, ArrowRightLeft, LayoutGrid } from 'lucide-react';

import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';
import { useManagerSession } from '@/app/manager/manager_components/manager_hooks/useManagerSession';
import { useManagerRooms } from '@/app/manager/rooms/ManagerRooms_hooks/useManagerRooms';
import { ManagerRoomsKPIs } from '@/app/manager/rooms/ManagerRooms_components/ManagerRoomsKPIs';
import { ManagerRoomsFilters } from '@/app/manager/rooms/ManagerRooms_components/ManagerRoomsFilters';
import { ManagerRoomsTable } from '@/app/manager/rooms/ManagerRooms_components/ManagerRoomsTable';
export function ManagerRoomsMain() {
  const user = useManagerSession();
  const { selectedPropertyId, loading: ctxLoading } = useManagerPropertyContext();
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 10;
  const { 
    rooms, loading, filteredRooms,
    searchQuery, setSearchQuery,
    filterSharing, setFilterSharing,
    filterStatus, setFilterStatus,
    currentPage, setCurrentPage
  } = useManagerRooms(selectedPropertyId, ctxLoading, user?.id);
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  if (ctxLoading) {
    return <div className="p-6 motion-safe:animate-pulse">Loading rooms...</div>;
  }
  return (
    <div className="space-y-6 pb-20 manager-theme animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-primary flex items-center gap-2 tracking-tight">
            <LayoutGrid className="w-6 h-6 text-theme-primary" />
            Room Allocation & Directory
          </h1>
          <p className="text-sm text-secondary">Manage room structures, allocations, and transfers.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-theme-primary text-white px-4 py-2.5 rounded-[var(--radius-md,8px)] hover:bg-theme-primary-hover font-bold text-sm shadow-sm transition-colors">
            <BedDouble className="w-4 h-4" /> Allocate Room
          </button>
          <button className="flex items-center gap-2 bg-input border hover:border-theme-primary text-primary px-4 py-2.5 rounded-[var(--radius-md,8px)] font-bold text-sm shadow-sm transition-colors">
            <ArrowRightLeft className="w-4 h-4" /> Transfer
          </button>
        </div>
      </div>
      <ManagerRoomsKPIs rooms={rooms} />
      <ManagerRoomsFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filterSharing={filterSharing}
        setFilterSharing={setFilterSharing}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      <ManagerRoomsTable 
        loading={loading}
        filteredRooms={filteredRooms}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}