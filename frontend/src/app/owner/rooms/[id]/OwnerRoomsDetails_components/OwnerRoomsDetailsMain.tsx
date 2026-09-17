// @ts-nocheck
'use client';

// RESPONSIBILITY: Renders the OwnerRoomsDetailsMain component. Receives data via props/hooks.
// DATA FLOW: GET /rooms/:id -> local state -> PATCH bed status / room maintenance -> reload.

import { use, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BedDouble, AlertTriangle, User, Hash, Settings, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { roomsApi } from '@/app/owner/owner_lib/owner_api/OwnerRooms';
import { bedsApi } from '@/app/owner/owner_lib/owner_api/OwnerBeds';

import type { BackendRoom } from '@/app/owner/owner_lib/owner_api/OwnerRooms';

// Values accepted by PATCH /beds/:bedId/status (Prisma BedStatus enum).
const BED_STATUS_OPTIONS = [
  { value: 'VACANT', label: 'Available' },
  { value: 'OCCUPIED', label: 'Occupied' },
  { value: 'RESERVED', label: 'Reserved' },
  { value: 'UNDER_MAINTENANCE', label: 'Maintenance' },
];


export function OwnerRoomsDetailsMain({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [room, setRoom] = useState<BackendRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyBedId, setBusyBedId] = useState('');

  const loadRoom = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');

    try {
      const fetched = await roomsApi.fetchRoomById(id);
      setRoom(fetched);
    } catch (err) {
      // 404 means the room was deleted or belongs to another owner: leave.
      const message = err instanceof Error ? err.message : 'Unable to load room.';
      setRoom(null);
      setError(message);
      if (/not found/i.test(message)) router.replace('/owner/rooms');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    loadRoom();
  }, [loadRoom]);

  const handleBedStatusChange = async (bedId: string, newStatus: string) => {
    setBusyBedId(bedId);
    setError('');
    try {
      await bedsApi.updateBackendBedStatus(bedId, newStatus);
      await loadRoom(); // reload so KPIs reflect the stored status
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bed status.');
    } finally {
      setBusyBedId('');
    }
  };

  // Rooms have no status column: the API moves every vacant bed to
  // UNDER_MAINTENANCE and leaves occupied/reserved beds untouched.
  const handleRoomMaintenance = async (isMaintenance: boolean) => {
    if (!room) return;
    setError('');
    try {
      await roomsApi.setBackendRoomMaintenance(room.id, isMaintenance);
      await loadRoom();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update room maintenance.');
    }
  };

  const handleDeleteRoom = async () => {
    if (!room) return;
    if (!confirm(`Are you sure you want to delete Room ${room.roomNumber}? Its beds are removed too.`)) return;
    setError('');
    try {
      await roomsApi.deleteBackendRoom(room.id);
      router.push('/owner/rooms');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cannot delete room.');
    }
  };

  if (loading && !room) return <div className="p-6 motion-safe:animate-pulse">Loading room details...</div>;

  if (!room) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <div className="p-4 bg-danger-bg border border-danger text-danger rounded-md flex items-center gap-3 text-sm font-medium">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {error || 'Room not found.'}
        </div>
        <Link href="/owner/rooms" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to rooms
        </Link>
      </div>
    );
  }

  const beds = Array.isArray(room.beds) ? room.beds : [];
  const vacantBeds = beds.filter(b => b.status === 'VACANT').length;
  const isMaintenance = beds.some(b => b.status === 'UNDER_MAINTENANCE');
  const propertyName = room.floor?.property?.name || 'Property';
  const sharingTotal = beds.length || 1;
  const rentPerBed = Math.round((room.monthlyRent || 0) / 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/owner/rooms" className="p-2 hover:bg-card rounded-full motion-safe:transition-colors text-secondary hover:text-primary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-[22px] font-bold text-primary flex items-center gap-3">
            Room {room.roomNumber}
            {isMaintenance && (
              <span className="text-[10px] uppercase bg-danger-bg text-danger px-2 py-1 rounded-md tracking-wider">
                Maintenance
              </span>
            )}
          </h1>
          <p className="text-sm text-secondary">{propertyName} • Floor {room.floor?.floorNumber ?? 1}</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-danger-bg border border-danger text-danger rounded-md flex items-center gap-3 text-sm font-medium">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Room Overview & Actions */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border bg-[rgba(99,102,241,0.02)] flex items-center gap-2">
              <Hash className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold text-primary">Room Overview</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <div className="text-xs text-secondary mb-1">Sharing Type</div>
                <div className="text-sm font-semibold text-primary">{sharingTotal} Sharing</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-secondary mb-1">Rent per Bed</div>
                  <div className="text-sm font-semibold text-success">₹{rentPerBed.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-secondary mb-1">Vacant Beds</div>
                  <div className="text-sm font-semibold text-primary">{vacantBeds} / {sharingTotal}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-secondary mb-1">Room Type</div>
                <div className="text-sm font-semibold text-primary">{String(room.type || '').replace(/_/g, ' ').toLowerCase() || 'Not set'}</div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border bg-[rgba(99,102,241,0.02)] flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold text-primary">Room Actions</h2>
            </div>
            <div className="p-4 space-y-3">
              <button 
                onClick={() => handleRoomMaintenance(!isMaintenance)}
                className={`w-full py-2.5 rounded-md text-sm font-medium motion-safe:transition-colors border ${
                  isMaintenance 
                    ? 'bg-success-bg text-success border-success' 
                    : 'bg-warning-bg text-warning border-warning'
                }`}
              >
                {isMaintenance ? 'Remove Maintenance Block' : 'Mark Room under Maintenance'}
              </button>

              <p className="text-[11px] text-secondary leading-relaxed">
                {isMaintenance
                  ? 'Clearing maintenance returns the blocked beds to Available. Occupied and reserved beds are left untouched.'
                  : 'Marking maintenance blocks every currently vacant bed. Occupied and reserved beds are left untouched.'}
              </p>
              
              <button onClick={handleDeleteRoom} className="w-full py-2.5 bg-danger-bg text-danger border border-danger rounded-md text-sm font-medium hover:bg-red-900 motion-safe:transition-colors flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Room
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Beds List */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg overflow-hidden h-full flex flex-col">
            <div className="p-5 border-b border-border flex justify-between items-center bg-[rgba(99,102,241,0.02)]">
              <div className="flex items-center gap-3">
                <BedDouble className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-primary">Beds & Students</h2>
              </div>
              <div className="text-xs font-medium px-3 py-1 bg-input rounded-full text-secondary border border-border">
                <span className="text-primary">{vacantBeds}</span> Vacant / {sharingTotal} Total
              </div>
            </div>

            <div className="p-5 flex-1 space-y-4">
              {beds.map(bed => (
                <div key={bed.id} className="border border-border rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary-subtle motion-safe:transition-colors bg-page">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg border
                      ${(bed.status === 'VACANT') ? 'bg-[rgba(16,185,129,0.1)] text-success border-[rgba(16,185,129,0.2)]' : 
                        bed.status === 'OCCUPIED' ? 'bg-primary-subtle text-primary border-primary' : 
                        'bg-danger-bg text-danger border-danger'}`}
                    >
                      {bed.bedNumber}
                    </div>
                    <div>
                      <div className="font-semibold text-primary mb-1">
                        Bed {room.roomNumber}-{bed.bedNumber}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-secondary">
                        {bed.status === 'OCCUPIED' ? (
                          <>
                            <User className="w-3.5 h-3.5" />
                            <span>Occupied by Student</span> {/* TODO: link to student profile when module is built */}
                          </>
                        ) : bed.status === 'UNDER_MAINTENANCE' ? (
                          <span className="text-danger">Under Maintenance</span>
                        ) : bed.status === 'RESERVED' ? (
                          <span className="text-warning">Reserved</span>
                        ) : (
                          <span className="text-success">Available for Booking</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <select 
                      value={bed.status}
                      disabled={busyBedId === bed.id}
                      onChange={(e) => handleBedStatusChange(bed.id, e.target.value)}
                      className="bg-input border border-border text-primary text-xs rounded-md px-3 py-1.5 outline-none focus:border-primary disabled:opacity-50"
                    >
                      {BED_STATUS_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              {beds.length === 0 && (
                <div className="text-center py-10 text-secondary text-sm">
                  This room has no beds yet. Add beds from the rooms list before assigning students.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
