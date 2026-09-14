'use client';

// RESPONSIBILITY: Renders the Student Room & Accommodation UI.
// DATA FLOW: GET /api/v1/student/room -> useStudentRoom -> StudentRoomMain

import { MapPin, Users, IndianRupee, Bed, Wind, Wifi, Droplet, Sun, CheckCircle2, XCircle, ArrowRightLeft } from 'lucide-react';
import { useStudentRoom } from '@/app/student/room/StudentRoom_hooks/useStudentRoom';

const AMENITY_ICON: Record<string, React.ReactNode> = {
  AC: <Wind className="w-4 h-4 text-primary" />,
  WiFi: <Wifi className="w-4 h-4 text-primary" />,
  'Hot Water': <Droplet className="w-4 h-4 text-primary" />,
  Balcony: <Sun className="w-4 h-4 text-primary" />,
  Cupboard: <Bed className="w-4 h-4 text-primary" />,
  'Study Table': <CheckCircle2 className="w-4 h-4 text-success" />,
  'Attached Bathroom': <Droplet className="w-4 h-4 text-primary" />,
  Fan: <Wind className="w-4 h-4 text-primary" />,
  TV: <CheckCircle2 className="w-4 h-4 text-success" />,
  CCTV: <CheckCircle2 className="w-4 h-4 text-success" />,
};

export function StudentRoomMain() {
  const { room, loading, error } = useStudentRoom();

  if (loading) {
    return <div className="space-y-6 w-full"><div className="p-4 motion-safe:animate-pulse text-secondary">Loading room details...</div></div>;
  }

  if (error || !room) {
    return (
      <div className="space-y-6 w-full">
        <h1 className="text-[24px] font-black text-primary flex items-center gap-2">🏠 My Room & Accommodation</h1>
        <div className="p-6 bg-danger-bg border border-danger/20 rounded-[var(--radius-lg)] text-danger">
          {error ?? 'No room allocation found.'}
        </div>
      </div>
    );
  }

  const { property, room: roomData, floor, bed, roommates } = room;
  const amenities = property?.amenities ?? [];

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-[24px] font-black text-primary flex items-center gap-2">🏠 My Room & Accommodation</h1>
        <p className="text-sm text-secondary mt-1">View your room details, roommates, facilities, and inventory.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location Details */}
        <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
          <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
            <MapPin className="w-5 h-5 text-secondary" /> Location Details
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-secondary font-bold uppercase">PG Name</span>
              <span className="font-medium text-primary">{property?.name || '—'}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-secondary font-bold uppercase">Address</span>
              <span className="font-medium text-primary text-right max-w-[200px]">{property?.address || '—'}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-secondary font-bold uppercase">Building</span>
              <span className="font-medium text-primary">{property?.name || '—'}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-secondary font-bold uppercase">Floor</span>
              <span className="font-medium text-primary">{floor?.floorNumber != null ? `${floor.floorNumber} Floor` : '—'}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-secondary font-bold uppercase">Room</span>
              <span className="font-medium text-primary font-bold">{roomData?.roomNumber || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary font-bold uppercase">Bed</span>
              <span className="font-medium text-primary font-bold">{bed?.bedNumber || '—'}</span>
            </div>
          </div>
        </div>

        {/* Room Type & Rent Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary-subtle border border-primary/20 rounded-[var(--radius-lg)] p-5 flex flex-col justify-center items-center text-center">
            <div className="text-xs font-bold text-primary/70 uppercase mb-2">Room Type</div>
            <Bed className="w-8 h-8 text-primary mb-2" />
            <div className="font-black text-primary text-lg">{roomData?.roomType || '—'}</div>
          </div>
          <div className="bg-success-bg border border-success/20 rounded-[var(--radius-lg)] p-5 flex flex-col justify-center items-center text-center">
            <div className="text-xs font-bold text-success/70 uppercase mb-2">Sharing With</div>
            <Users className={`w-8 h-8 ${roommates?.length > 0 ? 'text-success mb-2' : 'text-secondary mb-2'}`} />
            <div className="font-black text-primary text-lg">
              {roommates?.length > 0 ? `Roommate${roommates.length > 1 ? 's' : ''}: ${roommates.length}` : 'No roommates'}
            </div>
          </div>

          {/* Monthly Rent */}
          <div className="col-span-2 bg-info-bg border border-info/20 rounded-[var(--radius-lg)] p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-info/70 uppercase">Monthly Rent</div>
              <div className="font-black text-primary text-2xl">
                ₹{roomData?.monthlyRent ? Math.round(roomData.monthlyRent / 100).toLocaleString('en-IN') : '—'}
              </div>
            </div>
            <IndianRupee className="w-8 h-8 text-info" />
          </div>

          {/* Roommates List */}
          <div className="col-span-2 bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
            <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
              👥 Roommates ({roommates?.length || 0})
            </h3>
            {roommates && roommates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roommates.map((r, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-input rounded-[var(--radius-md)] border border-border">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                      {r.name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-primary text-sm truncate">{r.name || 'Roommate'}</div>
                      {r.phone && <div className="text-xs text-secondary">{r.phone}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-secondary">You are the only resident in this room.</div>
            )}
          </div>

          {/* Room Transfer */}
          <div className="col-span-2 bg-gradient-to-r from-primary/5 to-purple/5 border border-primary/20 rounded-[var(--radius-lg)] p-6 shadow-sm relative overflow-hidden">
            <ArrowRightLeft className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/10" />
            <h3 className="font-black text-primary text-lg mb-2 relative z-10">🔄 Room Transfer</h3>
            <p className="text-xs text-secondary mb-4 relative z-10">Want to switch your room? Contact the PG Manager to submit a transfer request.</p>
            <div className="relative z-10">
              <span className="text-xs text-secondary font-medium">📧 Contact: {property?.name || 'PG Manager'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
        <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
          🏨 Property Amenities
        </h3>
        {amenities.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {amenities.map((amenity: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 p-3 rounded-[var(--radius-md)] border bg-input border-border">
                {AMENITY_ICON[amenity] || <CheckCircle2 className="w-4 h-4 text-success" />}
                <span className="text-sm font-medium text-primary">{amenity}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-secondary">No amenities listed for this property.</div>
        )}
      </div>
    </div>
  );
}
