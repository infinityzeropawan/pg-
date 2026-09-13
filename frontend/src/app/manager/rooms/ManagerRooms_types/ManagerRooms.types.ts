import type { Room } from '@/app/owner/owner_lib/owner_api/OwnerRooms';
export interface ManagerRoomData extends Room {
  bedsCount: number;
  vacantCount: number;
}