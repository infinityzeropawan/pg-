// RESPONSIBILITY: Renders the ManagerRoomsKPIs component.
import { Hash, BedDouble, CheckCircle2, AlertCircle } from 'lucide-react';

import type { ManagerRoomData } from '@/app/manager/rooms/ManagerRooms_types/ManagerRooms.types';
interface Props {
  rooms: ManagerRoomData[];
}
export function ManagerRoomsKPIs({ rooms }: Props) {
  const totalRooms = rooms.length;
  const totalBeds = rooms.reduce((acc, r) => acc + r.bedsCount, 0);
  const vacantBeds = rooms.reduce((acc, r) => acc + r.vacantCount, 0);
  const filledBeds = totalBeds - vacantBeds;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm flex items-center justify-between group hover:border-theme-primary transition-colors">
        <div>
          <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-1">Total Rooms</p>
          <p className="text-2xl font-black text-primary">{totalRooms}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-theme-primary/10 flex items-center justify-center text-theme-primary group-hover:scale-110 transition-transform">
          <Hash className="w-6 h-6" />
        </div>
      </div>
      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm flex items-center justify-between group hover:border-info transition-colors">
        <div>
          <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-1">Total Beds</p>
          <p className="text-2xl font-black text-primary">{totalBeds}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-info-bg flex items-center justify-center text-info group-hover:scale-110 transition-transform">
          <BedDouble className="w-6 h-6" />
        </div>
      </div>
      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm flex items-center justify-between group hover:border-success transition-colors">
        <div>
          <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-1">Occupied Beds</p>
          <p className="text-2xl font-black text-primary">{filledBeds}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-success-bg flex items-center justify-center text-success group-hover:scale-110 transition-transform">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>
      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm flex items-center justify-between group hover:border-danger transition-colors">
        <div>
          <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-1">Vacant Beds</p>
          <p className="text-2xl font-black text-primary">{vacantBeds}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-danger-bg flex items-center justify-center text-danger group-hover:scale-110 transition-transform">
          <AlertCircle className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}