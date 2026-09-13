// RESPONSIBILITY: Renders the OwnerRoomsKPIs component. Receives data via props/hooks.

import { Hash, BedDouble, CheckCircle2, AlertCircle } from 'lucide-react';

export interface OwnerRoomsKPIsProps {
  totalRooms: number;
  totalBeds: number;
  filledBeds: number;
  vacantBeds: number;
}

export function OwnerRoomsKPIs({
  totalRooms,
  totalBeds,
  filledBeds,
  vacantBeds
}: OwnerRoomsKPIsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-card border border-border rounded-md p-4 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs text-secondary font-medium">Total Rooms</p>
          <p className="text-xl font-bold text-primary">{totalRooms}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[rgba(99,102,241,0.1)] flex items-center justify-center text-primary">
          <Hash className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-card border border-border rounded-md p-4 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs text-secondary font-medium">Total Beds</p>
          <p className="text-xl font-bold text-primary">{totalBeds}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[rgba(99,102,241,0.1)] flex items-center justify-center text-primary">
          <BedDouble className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-card border border-border rounded-md p-4 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs text-secondary font-medium">Occupied Beds</p>
          <p className="text-xl font-bold text-primary">{filledBeds}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center text-success">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-card border border-border rounded-md p-4 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs text-secondary font-medium">Vacant Beds</p>
          <p className="text-xl font-bold text-primary">{vacantBeds}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[rgba(239,68,68,0.1)] flex items-center justify-center text-danger">
          <AlertCircle className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
