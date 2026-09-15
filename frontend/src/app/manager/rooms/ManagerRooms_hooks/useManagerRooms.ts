// DATA FLOW: [AI_TODO: Document data flow direction for useManagerRooms.ts]
import { useState, useEffect, useCallback } from 'react';

import { useManagerUrlPagination } from '@/app/manager/manager_components/manager_hooks/useManagerUrlPagination';
// [DATA HOOK] useManagerRooms
// Responsibility: Fetches enriched room data (occupancy, beds, tenants) for the selected property.
// Data Flow: ManagerPropertyContext â†’ api â†’ local state â†’ ManagerRoomsMain
import { adminRequest } from '@/app/owner/owner_lib/owner_api/AdminClient';
import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';
import type { ManagerRoomData } from '@/app/manager/rooms/ManagerRooms_types/ManagerRooms.types';

export function useManagerRooms(selectedPropertyId: string | null, ctxLoading: boolean, userId: string | undefined) {
  const [rooms, setRooms] = useState<ManagerRoomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSharing, setFilterSharing] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const { currentPage, setCurrentPage } = useManagerUrlPagination(1);

  const loadData = useCallback(async () => {
    if (!userId || !selectedPropertyId) return;
    setLoading(true);
    try {
      const backendRooms = await adminRequest<any[]>(`/properties/${selectedPropertyId}/rooms`);
      if (Array.isArray(backendRooms) && backendRooms.length > 0) {
        const mapped: ManagerRoomData[] = backendRooms.map((r) => {
          const beds = r.beds || [];
          const vacantCount = beds.filter((b: any) => b.status === 'VACANT' || b.status === 'available').length;
          return {
            id: r.id,
            propertyId: r.propertyId,
            floor: r.floorNumber || r.floor || 1,
            number: r.roomNumber || r.number || '',
            sharing: r.sharingType || r.sharing || 1,
            rentPerBed: r.baseRentMonthly || r.rentPerBed || 0,
            deposit: r.depositAmount || r.deposit || 0,
            amenities: r.amenities ? (typeof r.amenities === 'string' ? JSON.parse(r.amenities) : r.amenities) : [],
            status: r.status?.toLowerCase() === 'full' ? 'full' : 'available',
            photos: r.photos ? (typeof r.photos === 'string' ? JSON.parse(r.photos) : r.photos) : [],
            bedsCount: beds.length || (r.sharingType || 1),
            vacantCount,
            createdAt: r.createdAt || new Date().toISOString(),
            updatedAt: r.updatedAt || new Date().toISOString(),
          };
        });
        setRooms(mapped);
      } else {
        const allRooms = api.rooms.listByProperty(selectedPropertyId);
        const enhanced = allRooms.map((r) => {
          const beds = api.beds.listByRoom(r.id);
          return {
            ...r,
            bedsCount: beds.length,
            vacantCount: beds.filter((b) => (b as Record<string, unknown>).status === 'available').length
          };
        });
        setRooms(enhanced);
      }
    } catch {
      const allRooms = api.rooms.listByProperty(selectedPropertyId);
      const enhanced = allRooms.map((r) => {
        const beds = api.beds.listByRoom(r.id);
        return {
          ...r,
          bedsCount: beds.length,
          vacantCount: beds.filter((b) => (b as Record<string, unknown>).status === 'available').length
        };
      });
      setRooms(enhanced);
    } finally {
      setLoading(false);
    }
  }, [userId, selectedPropertyId]);
  // Re-fetch rooms when property changes, context loading completes, or the acting user identity changes.
  useEffect(() => {
    if (!ctxLoading && selectedPropertyId) {
      loadData();
    }
  }, [selectedPropertyId, ctxLoading, userId, loadData]);
  // Reset pagination to page 1 whenever any filter criterion or the selected property changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterSharing, filterStatus, selectedPropertyId, setCurrentPage]);
  const filteredRooms = rooms.filter(r => {
    const matchesSearch = (r.number || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (r.floor || '').toString().includes(searchQuery);
    let matchesSharing = true;
    if (filterSharing !== 'all') matchesSharing = r.sharing === parseInt(filterSharing);
    let matchesStatus = true;
    if (filterStatus === 'available') matchesStatus = r.vacantCount > 0;
    if (filterStatus === 'occupied') matchesStatus = r.vacantCount === 0;
    return matchesSearch && matchesSharing && matchesStatus;
  });
  return {
    rooms, loading, filteredRooms,
    searchQuery, setSearchQuery,
    filterSharing, setFilterSharing,
    filterStatus, setFilterStatus,
    currentPage, setCurrentPage
  };
}