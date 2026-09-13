// @ts-nocheck
'use client';

// RESPONSIBILITY: Renders the OwnerRoomsDetailsMain component. Receives data via props/hooks.

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BedDouble, AlertTriangle, User, Hash, Settings, Edit3, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { roomsApi } from '@/app/owner/owner_lib/owner_api/OwnerRooms';
import { propertiesApi } from '@/app/owner/owner_lib/owner_api/OwnerProperties';
import { bedsApi } from '@/app/owner/owner_lib/owner_api/OwnerBeds';
import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';
import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';

import type { Room } from '@/app/owner/owner_lib/owner_api/OwnerRooms';
import type { Bed } from '@/app/owner/owner_lib/owner_api/OwnerBeds';


export function OwnerRoomsDetailsMain({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const user = typeof window !== 'undefined' ? getSession() : null;
  const { properties } = useOwnerPropertyContext();

  const [room, setRoom] = useState<Room | null>(null);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = () => {
    if (!user || !id) return;
    setLoading(true);
    
    const fetchedRoom = roomsApi.getById(id);
    if (!fetchedRoom) {
      router.replace('/owner/rooms');
      return;
    }
    
    // Safety check: is owner of this property?
    const prop = propertiesApi.getById(fetchedRoom.propertyId);
    if (prop?.ownerId !== user.id) {
      router.replace('/owner/rooms');
      return;
    }

    setRoom(fetchedRoom);
    setBeds(bedsApi.listByRoom(id));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id, user?.id, router]);

  const handleBedStatusChange = (bedId: string, newStatus: unknown) => {
    if (!user) return;
    try {
      bedsApi.updateStatus(bedId, newStatus as any, user.id);
      loadData(); // refresh
    } catch (err: any) {
      alert('Failed to update bed status');
    }
  };

  const handleRoomMaintenance = (isMaintenance: boolean) => {
    if (!user || !room) return;
    roomsApi.updateStatus(room.id, isMaintenance ? 'maintenance' : 'available', user.id);
    loadData();
  };

  const handleDeleteRoom = () => {
    if (!user || !room) return;
    try {
      if (confirm(`Are you sure you want to delete Room ${room.number}?`)) {
        roomsApi.delete(room.id, user.id);
        router.push('/owner/rooms');
      }
    } catch (err: any) {
      setError((err as any).message || 'Cannot delete room.');
    }
  };

  if (loading || !room) return <div className="p-6 motion-safe:animate-pulse">Loading room details...</div>;

  const propertyName = properties.find(p => p.id === room.propertyId)?.name || 'Unknown Property';
  const vacantBeds = beds.filter(b => b.status === 'available').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/owner/rooms" className="p-2 hover:bg-card rounded-full motion-safe:transition-colors text-secondary hover:text-primary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-[22px] font-bold text-primary flex items-center gap-3">
            Room {room.number}
            {room.status === 'maintenance' && (
              <span className="text-[10px] uppercase bg-danger-bg text-danger px-2 py-1 rounded-md tracking-wider">
                Maintenance
              </span>
            )}
          </h1>
          <p className="text-sm text-secondary">{propertyName} • Floor {room.floor}</p>
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
                <div className="text-sm font-semibold text-primary">{room.sharing} Sharing</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-secondary mb-1">Rent per Bed</div>
                  <div className="text-sm font-semibold text-success">₹{(room.rentPerBed || 0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-secondary mb-1">Deposit</div>
                  <div className="text-sm font-semibold text-primary">₹{(room.deposit || 0).toLocaleString()}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-secondary mb-1">Amenities</div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(room.amenities || []).map(am => (
                    <span key={am} className="text-[10px] bg-input text-secondary border border-border px-2 py-0.5 rounded-full">
                      {am}
                    </span>
                  ))}
                  {(room.amenities || []).length === 0 && <span className="text-xs text-secondary italic">None</span>}
                </div>
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
                onClick={() => handleRoomMaintenance(room.status !== 'maintenance')}
                className={`w-full py-2.5 rounded-md text-sm font-medium motion-safe:transition-colors border ${
                  room.status === 'maintenance' 
                    ? 'bg-success-bg text-success border-success' 
                    : 'bg-warning-bg text-warning border-warning'
                }`}
              >
                {room.status === 'maintenance' ? 'Remove Maintenance Block' : 'Mark Room under Maintenance'}
              </button>
              
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
                <span className="text-primary">{vacantBeds}</span> Vacant / {room.sharing} Total
              </div>
            </div>

            <div className="p-5 flex-1 space-y-4">
              {beds.map(bed => (
                <div key={bed.id} className="border border-border rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary-subtle motion-safe:transition-colors bg-page">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg border
                      ${(bed.status === 'available') ? 'bg-[rgba(16,185,129,0.1)] text-success border-[rgba(16,185,129,0.2)]' : 
                        bed.status === 'occupied' ? 'bg-primary-subtle text-primary border-primary' : 
                        'bg-danger-bg text-danger border-danger'}`}
                    >
                      {bed.code}
                    </div>
                    <div>
                      <div className="font-semibold text-primary mb-1">
                        Bed {room.number}-{bed.code}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-secondary">
                        {bed.status === 'occupied' ? (
                          <>
                            <User className="w-3.5 h-3.5" />
                            <span>Occupied by Student</span> {/* TODO: link to student profile when module is built */}
                          </>
                        ) : bed.status === 'maintenance' ? (
                          <span className="text-danger">Under Maintenance</span>
                        ) : bed.status === 'reserved' ? (
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
                      onChange={(e) => handleBedStatusChange(bed.id, e.target.value)}
                      className="bg-input border border-border text-primary text-xs rounded-md px-3 py-1.5 outline-none focus:border-primary"
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="reserved">Reserved</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </div>
              ))}

              {beds.length === 0 && (
                <div className="text-center py-10 text-secondary text-sm">
                  No beds found. Something went wrong during room creation.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
