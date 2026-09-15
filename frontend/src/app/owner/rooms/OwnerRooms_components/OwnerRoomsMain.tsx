'use client';

// RESPONSIBILITY: Renders the OwnerRoomsMain component. Receives data via props/hooks.

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';
import { roomsApi } from '@/app/owner/owner_lib/owner_api/OwnerRooms';
import { bedsApi } from '@/app/owner/owner_lib/owner_api/OwnerBeds';
import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';
import { OwnerRoomsKPIs } from '@/app/owner/rooms/OwnerRooms_components/OwnerRoomsKPIs';
import { OwnerRoomsFilters } from '@/app/owner/rooms/OwnerRooms_components/OwnerRoomsFilters';
import { OwnerRoomsTable } from '@/app/owner/rooms/OwnerRooms_components/OwnerRoomsTable';
import { OwnerRoomsAddModal } from '@/app/owner/rooms/OwnerRooms_components/OwnerRoomsAddModal';

import type { Room } from '@/app/owner/owner_lib/owner_api/OwnerRooms';

export function OwnerRoomsMain() {
  const user = typeof window !== 'undefined' ? getSession() : null;
  const { properties, selectedPropertyId, setSelectedPropertyId } = useOwnerPropertyContext();
  
  const [rooms, setRooms] = useState<(Room & { bedsCount: number; vacantCount: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Advanced Filters & Pagination
  const [showFilters, setShowFilters] = useState(false);
  const [filterSharing, setFilterSharing] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Modal State
  const [formData, setFormData] = useState({
    propertyId: '',
    floor: 1,
    number: '',
    sharing: 2,
    rentPerBed: 5000,
    deposit: 5000,
    amenities: 'AC, Attached Washroom, Balcony'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let backendRooms: any[] = [];
      if (selectedPropertyId === 'all') {
        const results = await Promise.all(
          properties.map(p => roomsApi.fetchRoomsByProperty(p.id).catch(() => []))
        );
        backendRooms = results.flat();
      } else {
        backendRooms = await roomsApi.fetchRoomsByProperty(selectedPropertyId).catch(() => []);
      }

      if (Array.isArray(backendRooms) && backendRooms.length > 0) {
        const enhanced = backendRooms.map((r: any) => {
          const beds = r.beds || [];
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
            vacantCount: beds.filter((b: any) => b.status === 'VACANT' || b.status === 'available').length,
            createdAt: r.createdAt || new Date().toISOString(),
            updatedAt: r.updatedAt || new Date().toISOString(),
          };
        });
        setRooms(enhanced as any);
        setLoading(false);
        return;
      }
    } catch {
      // Fallback
    }

    let allRooms: Room[] = [];
    if (selectedPropertyId === 'all') {
      properties.forEach(p => {
        allRooms = [...allRooms, ...roomsApi.listByProperty(p.id)];
      });
    } else {
      allRooms = roomsApi.listByProperty(selectedPropertyId);
    }

    const enhanced = allRooms.map(r => {
      const beds = bedsApi.listByRoom(r.id);
      return {
        ...r,
        bedsCount: beds.length,
        vacantCount: beds.filter((b: any) => b.status === 'available').length
      };
    });

    setRooms(enhanced);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    if (selectedPropertyId !== 'all') {
      setFormData(prev => ({ ...prev, propertyId: selectedPropertyId }));
    } else if (properties.length > 0) {
// @ts-expect-error
      setFormData(prev => ({ ...prev, propertyId: properties[0].id }));
    }
  }, [selectedPropertyId, properties, user?.id]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError('');
    setSubmitting(true);

    try {
      if (!(formData as any).propertyId) throw new Error('Please select a property.');
      
      try {
        await roomsApi.createBackendRoom({
          propertyId: (formData as any).propertyId,
          roomNumber: String((formData as any).number),
          floorNumber: Number((formData as any).floor),
          sharingType: Number((formData as any).sharing),
          baseRentMonthly: Number((formData as any).rentPerBed),
          depositAmount: Number((formData as any).deposit),
        });
      } catch {
        roomsApi.create({
          propertyId: (formData as any).propertyId,
          floor: (formData as any).floor,
          number: (formData as any).number,
          sharing: (formData as any).sharing,
          rentPerBed: (formData as any).rentPerBed,
          deposit: (formData as any).deposit,
          amenities: (formData as any).amenities.split(',').map((s: any) => s.trim()).filter(Boolean),
          status: 'available',
          photos: [],
          actorId: user.id
        });
      }
      
      setShowAddModal(false);
      loadData();
    } catch (err: any) {
      setError((err as any).message || 'Failed to create room.');
    } finally {
      setSubmitting(false);
    }
  };

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

  const totalRooms = rooms.length;
  const totalBeds = rooms.reduce((acc, r) => acc + r.bedsCount, 0);
  const vacantBeds = rooms.reduce((acc, r) => acc + r.vacantCount, 0);
  const filledBeds = totalBeds - vacantBeds;

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const paginatedRooms = filteredRooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterSharing, filterStatus, selectedPropertyId]);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-primary">Rooms Management</h1>
          <p className="text-sm text-secondary">View and manage rooms across your properties.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-hover motion-safe:transition-colors flex items-center gap-2 text-sm shadow-md w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room</span>
        </button>
      </div>

      <OwnerRoomsKPIs 
        totalRooms={totalRooms}
        totalBeds={totalBeds}
        filledBeds={filledBeds}
        vacantBeds={vacantBeds}
      />

      <OwnerRoomsFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filterSharing={filterSharing}
        setFilterSharing={setFilterSharing}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        selectedPropertyId={selectedPropertyId}
        setSelectedPropertyId={setSelectedPropertyId}
        properties={properties}
      />

      <OwnerRoomsTable 
        loading={loading}
        filteredRooms={filteredRooms}
        paginatedRooms={paginatedRooms}
        properties={properties}
        selectedPropertyId={selectedPropertyId}
        setShowAddModal={setShowAddModal}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
      />

      <OwnerRoomsAddModal 
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        formData={formData}
        setFormData={setFormData}
        properties={properties}
        error={error}
        submitting={submitting}
        handleCreateRoom={handleCreateRoom}
      />
    </div>
  );
}
