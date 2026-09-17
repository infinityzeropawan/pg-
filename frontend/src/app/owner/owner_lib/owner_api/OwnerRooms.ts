import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { createId } from '@/lib/utils/id';
import { bedsApi } from '@/app/owner/owner_lib/owner_api/OwnerBeds';

import type { BaseEntity } from '@/lib/types';

export type RoomStatus = 'available' | 'full' | 'maintenance';

/**
 * Legacy localStorage shape. Still used by the manager module; new owner code
 * should read rooms from the backend via `fetchRoomsByProperty` instead.
 */
export interface Room extends BaseEntity {
  propertyId: string;
  floor: number;
  number: string;
  sharing: number;
  rentPerBed: number;
  deposit: number;
  amenities: string[];
  status: RoomStatus;
  photos: string[];
}

/** Bed as returned by the admin API (`GET /properties/:id/rooms`). */
export interface BackendBed {
  id: string;
  bedNumber: string;
  status: string;
  monthlyRent: number;
}

/** Room as returned by the admin API, with `monthlyRent` stored in Paise. */
export interface BackendRoom {
  id: string;
  roomNumber: string;
  type: string;
  monthlyRent: number;
  floorId: string;
  floor: {
    id: string;
    floorNumber: number;
    name: string;
    propertyId: string;
    property?: { id: string; name: string } | null;
  };
  beds: BackendBed[];
}

/** View model the rooms UI renders. Rent is converted back to Rupees. */
export interface OwnerRoomView {
  id: string;
  propertyId: string;
  floor: number;
  number: string;
  sharing: number;
  rentPerBed: number;
  bedsCount: number;
  vacantCount: number;
  status: RoomStatus;
}

const SHARING_BY_ROOM_TYPE: Record<string, number> = {
  SINGLE: 1,
  DOUBLE_SHARING: 2,
  TRIPLE_SHARING: 3,
  FOUR_SHARING: 4,
};

/**
 * Maps an API room onto the table/KPI view model.
 * Sharing comes from the real bed rows (falling back to the enum) so a room
 * always reports the beds that actually exist in the database.
 * Status is derived because `Room` has no status column:
 * every bed under maintenance -> 'maintenance', no vacant bed -> 'full'.
 */
export function mapRoomFromBackend(room: BackendRoom): OwnerRoomView {
  const beds = Array.isArray(room.beds) ? room.beds : [];
  const vacantCount = beds.filter(bed => bed.status === 'VACANT').length;
  const sharing = beds.length || SHARING_BY_ROOM_TYPE[room.type] || 1;

  let status: RoomStatus = 'available';
  if (beds.length > 0 && beds.every(bed => bed.status === 'UNDER_MAINTENANCE')) {
    status = 'maintenance';
  } else if (beds.length > 0 && vacantCount === 0) {
    status = 'full';
  }

  return {
    id: room.id,
    propertyId: room.floor?.propertyId || room.floor?.property?.id || '',
    floor: room.floor?.floorNumber ?? 1,
    number: room.roomNumber || '',
    sharing,
    rentPerBed: Math.round((room.monthlyRent || 0) / 100),
    bedsCount: beds.length,
    vacantCount,
    status,
  };
}

export const roomsApi = {
  listByProperty: (propertyId: string): Room[] => {
    const OwnerRooms = db.getAll<Room>(STORAGE_KEYS.ROOMS);
    return OwnerRooms.filter(r => r.propertyId === propertyId && !r.isDeleted)
                .sort((a, b) => {
                  if (a.floor !== b.floor) return (a.floor || 0) - (b.floor || 0);
                  return String(a.number || '').localeCompare(String(b.number || ''));
                });
  },

  getById: (id: string): Room | null => {
    return db.getById<Room>(STORAGE_KEYS.ROOMS, id) || null;
  },

  create: (data: Omit<Room, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'isDeleted'> & { actorId: string }): Room => {
// @ts-expect-error
    const newRoom: Room = {
      ...data,
      id: createId('room'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: data.actorId,
      updatedBy: data.actorId,
      isDeleted: false
    };
    db.insert(STORAGE_KEYS.ROOMS, newRoom);

    // Generate Beds automatically based on sharing count
    // A=65, B=66, C=67, etc.
// @ts-expect-error
    for (let i = 0; i < data.sharing; i++) {
      const code = String.fromCharCode(65 + i); // 'A', 'B', 'C', ...
      bedsApi.create({
// @ts-expect-error
        roomId: newRoom.id,
        propertyId: newRoom.propertyId,
        code,
        status: 'available',
        actorId: data.actorId
      });
    }

// @ts-expect-error
    db.insert(STORAGE_KEYS.AUDIT_LOGS, {
      id: createId('aud'),
      action: 'ROOM_CREATED',
      actorId: data.actorId,
      targetId: newRoom.id,
      details: `Created room ${newRoom.number} with ${data.sharing} beds`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: data.actorId,
      updatedBy: data.actorId,
      isDeleted: false
    } as unknown);

    return newRoom;
  },

  updateStatus: (id: string, status: RoomStatus, actorId: string): Room | null => {
    return db.update<Room>(STORAGE_KEYS.ROOMS, id, { 
      status, 
      updatedAt: new Date().toISOString(), 
      updatedBy: actorId 
    });
  },

  delete: (id: string, actorId: string) => {
    // Prevent delete if any bed is occupied
    const beds = bedsApi.listByRoom(id);
    if (beds.some(b => b.status === 'occupied')) {
      throw new Error('Cannot delete room with occupied beds.');
    }
    
    // Mark beds as deleted
    beds.forEach(b => {
      db.update(STORAGE_KEYS.BEDS, b.id, { isDeleted: true, updatedBy: actorId });
    });

    // Mark room as deleted
    db.update(STORAGE_KEYS.ROOMS, id, { isDeleted: true, updatedBy: actorId });

// @ts-expect-error
    db.insert(STORAGE_KEYS.AUDIT_LOGS, {
      id: createId('aud'),
      action: 'ROOM_DELETED',
      actorId,
      targetId: id,
      details: `Deleted room ${id}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: actorId,
      updatedBy: actorId,
      isDeleted: false
    } as unknown);
  },

  // ==========================================
  // Backend API methods (source of truth for the owner module)
  // ==========================================

  /**
   * GET `/properties/:propertyId/rooms`.
   * Errors propagate so pages can show a real failure instead of silently
   * swapping in per-browser localStorage rows.
   */
  fetchRoomsByProperty: async (propertyId: string): Promise<BackendRoom[]> => {
    const { adminRequest } = await import('@/app/owner/owner_lib/owner_api/AdminClient');
    return adminRequest<BackendRoom[]>(`/properties/${propertyId}/rooms`);
  },

  /** Fetches every selected property's rooms in one batch. */
  fetchRoomsForProperties: async (propertyIds: string[]): Promise<BackendRoom[]> => {
    if (propertyIds.length === 0) return [];
    const perProperty = await Promise.all(
      propertyIds.map(propertyId => roomsApi.fetchRoomsByProperty(propertyId))
    );
    return perProperty.flat();
  },

  /** GET `/rooms/:id` — used by the room detail page. */
  fetchRoomById: async (roomId: string): Promise<BackendRoom> => {
    const { adminRequest } = await import('@/app/owner/owner_lib/owner_api/AdminClient');
    return adminRequest<BackendRoom>(`/rooms/${roomId}`);
  },

  /** POST `/rooms` — creates the room and its beds in one backend transaction. */
  createBackendRoom: async (roomData: {
    propertyId: string;
    roomNumber: string;
    floorNumber: number;
    bedCount: number;
    monthlyRent: number;
  }): Promise<BackendRoom> => {
    const { adminRequest } = await import('@/app/owner/owner_lib/owner_api/AdminClient');
    return adminRequest<BackendRoom>('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  },

  /** DELETE `/rooms/:id` — blocked by the API while a bed is occupied. */
  deleteBackendRoom: async (roomId: string): Promise<{ id: string }> => {
    const { adminRequest } = await import('@/app/owner/owner_lib/owner_api/AdminClient');
    return adminRequest<{ id: string }>(`/rooms/${roomId}`, { method: 'DELETE' });
  },

  /**
   * PATCH `/rooms/:id/maintenance`.
   * The API flips every vacant bed to UNDER_MAINTENANCE (or back to VACANT)
   * in one transaction and leaves occupied/reserved beds alone.
   */
  setBackendRoomMaintenance: async (roomId: string, isMaintenance: boolean): Promise<{ id: string; isMaintenance: boolean; updatedBeds: number }> => {
    const { adminRequest } = await import('@/app/owner/owner_lib/owner_api/AdminClient');
    return adminRequest<{ id: string; isMaintenance: boolean; updatedBeds: number }>(`/rooms/${roomId}/maintenance`, {
      method: 'PATCH',
      body: JSON.stringify({ isMaintenance }),
    });
  }
};

