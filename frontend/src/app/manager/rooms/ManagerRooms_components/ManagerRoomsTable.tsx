// RESPONSIBILITY: Renders the ManagerRoomsTable component.
import { BedDouble, ChevronRight, User, Users, MapPin } from 'lucide-react';
import Link from 'next/link';

import type { ManagerRoomData } from '@/app/manager/rooms/ManagerRooms_types/ManagerRooms.types';
interface Props {
  loading: boolean;
  filteredRooms: ManagerRoomData[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}
export function ManagerRoomsTable({ 
  loading, filteredRooms, currentPage, itemsPerPage, totalPages, setCurrentPage 
}: Props) {
  if (loading) {
    return <div className="motion-safe:animate-pulse h-64 bg-card border border rounded-[var(--radius-lg,12px)]"></div>;
  }
  if (filteredRooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-card border border rounded-[var(--radius-lg,12px)] text-center">
        <BedDouble className="w-12 h-12 text-secondary opacity-50 mb-4" />
        <h3 className="text-lg font-semibold text-primary mb-1">No Rooms Found</h3>
        <p className="text-secondary text-sm max-w-sm">
          No rooms match your criteria. Wait for the owner to add some or adjust filters.
        </p>
      </div>
    );
  }
  const paginatedRooms = filteredRooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  return (
    <>
      <div className="space-y-8">
        {Array.from(new Set(paginatedRooms.map(r => r.floor || 'Unknown'))).sort().map(floor => (
        <div key={floor} className="bg-card border border rounded-[var(--radius-xl,16px)] overflow-hidden shadow-sm">
          <div className="bg-input/50 px-6 py-3 border-b border flex items-center gap-2">
            <MapPin className="w-4 h-4 text-theme-primary" />
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Floor {floor}</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedRooms.filter(r => (r.floor || 'Unknown') === floor).map((room) => {
              const safeSharing = room.sharing || 1;
              const occupiedBeds = safeSharing - room.vacantCount;
              const percent = Math.round((occupiedBeds / safeSharing) * 100);
              const isMaintenance = room.status === 'maintenance';
              
              return (
                <div key={room.id} className={`border rounded-[var(--radius-lg,12px)] p-4 relative group hover:shadow-md transition-all ${isMaintenance ? 'bg-danger-bg border-danger/20' : 'bg-page hover:border-theme-primary'}`}>
                  {isMaintenance && (
                    <div className="absolute -top-2 -right-2 bg-danger text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">Maintenance</div>
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-[var(--radius-md,8px)] flex items-center justify-center font-bold text-lg shadow-sm border ${isMaintenance ? 'bg-danger/10 text-danger border-danger/20' : 'bg-card text-theme-primary border-border'}`}>
                        {room.number}
                      </div>
                      <div>
                        <div className="font-bold text-primary">Room {room.number}</div>
                        <div className="text-xs text-secondary flex items-center gap-1">
                          {safeSharing === 1 ? <User className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                          {safeSharing} Sharing • ₹{(room.rentPerBed || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Link 
                      href={`/manager/rooms/${room.id}`}
                      className="text-secondary hover:text-theme-primary bg-input hover:bg-theme-primary/10 p-1.5 rounded-md transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-dashed">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-secondary">Occupancy</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${isMaintenance ? 'bg-danger-bg text-danger' : room.vacantCount > 0 ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'}`}>
                        {occupiedBeds}/{safeSharing} Beds
                      </span>
                    </div>
                    <div className="w-full bg-input rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${isMaintenance ? 'bg-danger' : percent === 100 ? 'bg-danger' : 'bg-theme-primary'}`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
      {totalPages > 1 && (
        <div className="p-4 border-t border bg-[rgba(99,102,241,0.01)] flex items-center justify-between">
          <span className="text-sm text-secondary">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredRooms.length)} of {filteredRooms.length}
          </span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-3 py-1.5 text-sm font-medium border border rounded-md hover:bg-input disabled:opacity-50 disabled:cursor-not-allowed text-primary motion-safe:transition-colors"
            >
              Previous
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-3 py-1.5 text-sm font-medium border border rounded-md hover:bg-input disabled:opacity-50 disabled:cursor-not-allowed text-primary motion-safe:transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}