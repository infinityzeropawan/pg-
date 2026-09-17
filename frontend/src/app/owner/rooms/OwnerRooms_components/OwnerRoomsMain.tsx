'use client';

// RESPONSIBILITY: Renders the OwnerRoomsMain component. Receives data via props/hooks.

import { useState, useEffect } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';

import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';
import { roomsApi, mapRoomFromBackend } from '@/app/owner/owner_lib/owner_api/OwnerRooms';
import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';
import { OwnerRoomsKPIs } from '@/app/owner/rooms/OwnerRooms_components/OwnerRoomsKPIs';
import { OwnerRoomsFilters } from '@/app/owner/rooms/OwnerRooms_components/OwnerRoomsFilters';
import { OwnerRoomsTable } from '@/app/owner/rooms/OwnerRooms_components/OwnerRoomsTable';
import { OwnerRoomsAddModal } from '@/app/owner/rooms/OwnerRooms_components/OwnerRoomsAddModal';

import type { OwnerRoomView } from '@/app/owner/owner_lib/owner_api/OwnerRooms';

export function OwnerRoomsMain() {
  const user = typeof window !== 'undefined' ? getSession() : null;
  const { properties, selectedPropertyId, setSelectedPropertyId } = useOwnerPropertyContext();
  
  const [rooms, setRooms] = useState<OwnerRoomView[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Advanced Filters & Pagination
  const [showFilters, setShowFilters] = useState(false);
  const [filterSharing, setFilterSharing] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Modal State — mirrors what POST /rooms persists (rent and beds are per room).
  const [formData, setFormData] = useState({
    propertyId: '',
    floor: 1,
    number: '',
    sharing: 2,
    rentPerBed: 5000
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedPropertyIds = selectedPropertyId === 'all'
    ? properties.map(p => p.id)
    : [selectedPropertyId];

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    setLoadError('');
    try {
      // The backend is the single source of truth: rooms and their beds are
      // created together there. There is deliberately no localStorage fallback,
      // because browser-local rows would hide real API failures and show rooms
      // that do not exist in the database.
      const backendRooms = await roomsApi.fetchRoomsForProperties(selectedPropertyIds);
      setRooms(backendRooms.map(mapRoomFromBackend));
    } catch (err) {
      setRooms([]);
      setLoadError(err instanceof Error ? err.message : 'Unable to load rooms.');
    } finally {
      setLoading(false);
    }
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
      const propertyId = formData.propertyId;
      if (!propertyId) throw new Error('Please select a property.');
      if (!String(formData.number).trim()) throw new Error('Room number is required.');

      // One API call: the backend creates the room and its beds in a single
      // transaction, so a room can never end up without beds.
      await roomsApi.createBackendRoom({
        propertyId,
        roomNumber: String(formData.number).trim(),
        floorNumber: Number(formData.floor),
        bedCount: Number(formData.sharing),
        monthlyRent: Number(formData.rentPerBed),
      });

      setShowAddModal(false);
      await loadData();
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

      {loadError && (
        <div className="p-4 bg-danger-bg border border-danger text-danger rounded-md flex items-start justify-between gap-3 text-sm font-medium">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {loadError}
          </span>
          <button onClick={loadData} className="text-xs underline shrink-0">Retry</button>
        </div>
      )}

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
