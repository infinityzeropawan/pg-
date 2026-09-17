import { describe, expect, it } from 'vitest';

import { mapRoomFromBackend } from '@/app/owner/owner_lib/owner_api/OwnerRooms';

import type { BackendBed, BackendRoom } from '@/app/owner/owner_lib/owner_api/OwnerRooms';

// The API stores money in Paise and beds as rows, so the mapper is the single
// place where a room row becomes something the rooms table can render.
function makeRoom(overrides: Partial<BackendRoom> = {}): BackendRoom {
  const beds: BackendBed[] = [
    { id: 'bed-1', bedNumber: 'B-1', status: 'VACANT', monthlyRent: 850000 },
    { id: 'bed-2', bedNumber: 'B-2', status: 'OCCUPIED', monthlyRent: 850000 },
  ];

  return {
    id: 'room-1',
    roomNumber: '101',
    type: 'DOUBLE_SHARING',
    monthlyRent: 850000, // Paise
    floorId: 'floor-1',
    floor: { id: 'floor-1', floorNumber: 2, name: 'Floor 2', propertyId: 'prop-1' },
    beds,
    ...overrides,
  };
}

describe('mapRoomFromBackend', () => {
  it('maps money from Paise to Rupees and counts real bed rows', () => {
    const view = mapRoomFromBackend(makeRoom());

    expect(view).toEqual({
      id: 'room-1',
      propertyId: 'prop-1',
      floor: 2,
      number: '101',
      sharing: 2,
      rentPerBed: 8500,
      bedsCount: 2,
      vacantCount: 1,
      status: 'available',
    });
  });

  it('reports full when no bed is vacant', () => {
    const view = mapRoomFromBackend(makeRoom({
      beds: [
        { id: 'bed-1', bedNumber: 'B-1', status: 'OCCUPIED', monthlyRent: 850000 },
        { id: 'bed-2', bedNumber: 'B-2', status: 'OCCUPIED', monthlyRent: 850000 },
      ],
    }));

    expect(view.vacantCount).toBe(0);
    expect(view.status).toBe('full');
  });

  it('reports maintenance when every bed is under maintenance', () => {
    const view = mapRoomFromBackend(makeRoom({
      beds: [
        { id: 'bed-1', bedNumber: 'B-1', status: 'UNDER_MAINTENANCE', monthlyRent: 850000 },
        { id: 'bed-2', bedNumber: 'B-2', status: 'UNDER_MAINTENANCE', monthlyRent: 850000 },
      ],
    }));

    expect(view.status).toBe('maintenance');
    expect(view.vacantCount).toBe(0);
  });

  it('falls back to the room type when a room has no bed rows', () => {
    const view = mapRoomFromBackend(makeRoom({ type: 'FOUR_SHARING', beds: [] }));

    // No beds means nothing is bookable yet, so sharing comes from the enum
    // instead of being reported as 1.
    expect(view.sharing).toBe(4);
    expect(view.bedsCount).toBe(0);
    expect(view.vacantCount).toBe(0);
    expect(view.status).toBe('available');
  });

  it('resolves the property from the nested property when floorId link is absent', () => {
    const view = mapRoomFromBackend(makeRoom({
      floor: {
        id: 'floor-9',
        floorNumber: 0,
        name: 'Ground',
        propertyId: '',
        property: { id: 'prop-9', name: 'Sunrise PG' },
      },
    }));

    expect(view.propertyId).toBe('prop-9');
    expect(view.floor).toBe(0);
  });
});