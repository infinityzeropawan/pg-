// RESPONSIBILITY: Renders the OwnerRoomsTable component. Receives data via props/hooks.

import { ChevronRight, User, Users, BedDouble } from 'lucide-react';
import Link from 'next/link';

export interface OwnerRoomsTableProps {
  loading: boolean;
  filteredRooms: unknown[];
  paginatedRooms: unknown[];
  properties: unknown[];
  selectedPropertyId: string;
  setShowAddModal: (show: boolean) => void;
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  totalPages: number;
  itemsPerPage: number;
}

export function OwnerRoomsTable({
  loading,
  filteredRooms,
  paginatedRooms,
  properties,
  selectedPropertyId,
  setShowAddModal,
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage
}: OwnerRoomsTableProps) {
  if (loading) {
    return <div className="motion-safe:animate-pulse h-64 bg-card border border-border rounded-lg"></div>;
  }

  if (filteredRooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-lg text-center">
        <BedDouble className="w-12 h-12 text-secondary opacity-50 mb-4" />
        <h3 className="text-lg font-semibold text-primary mb-1">No Rooms Found</h3>
        <p className="text-secondary text-sm max-w-sm mb-6">
          {selectedPropertyId === 'all' 
            ? "You haven't added any rooms across your properties yet." 
            : "No rooms exist for this property. Add one to get started."}
        </p>
        <button onClick={() => setShowAddModal(true)} className="text-primary text-sm font-medium hover:underline">
          + Create First Room
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-card text-[11px] uppercase tracking-wider text-secondary border-b border-border sticky top-0 z-10 shadow-sm shadow-black/5">
            <tr>
              <th className="px-6 py-4 font-semibold">Room Identity</th>
              <th className="px-6 py-4 font-semibold">Configuration</th>
              <th className="px-6 py-4 font-semibold">Rent (Per Bed)</th>
              <th className="px-6 py-4 font-semibold">Vacancy Status</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {paginatedRooms.map((room: any) => {
    // @ts-expect-error - unresolved TS error
              const propName = properties.find((p: any) => p.id === room.propertyId)?.name || 'Unknown';
              const safeSharing = room.sharing || 1;
              const occupiedBeds = safeSharing - room.vacantCount;
              const percent = Math.round((occupiedBeds / safeSharing) * 100);
              
              return (
                <tr key={room.id} className="hover:bg-[rgba(99,102,241,0.02)] motion-safe:transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-md bg-input border border-border flex items-center justify-center shrink-0 shadow-sm">
                        <span className="font-bold text-primary text-lg">{room.number || '-'}</span>
                      </div>
                      <div>
                        <div className="font-bold text-primary text-base">
                          Room {room.number || 'Unnamed'}
                        </div>
                        <div className="text-[11px] text-secondary mt-0.5 flex flex-col gap-0.5">
                          {selectedPropertyId === 'all' && <span>🏢 {propName}</span>}
                          <span>📍 Floor {room.floor}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[rgba(99,102,241,0.1)] text-primary flex items-center justify-center shrink-0">
                        {room.sharing === 1 ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                      </div>
                      <span className="text-primary font-medium text-sm">
                        {room.sharing === 1 ? 'Single Bed' : room.sharing === 2 ? 'Double Sharing' : room.sharing === 3 ? 'Triple Sharing' : `${room.sharing} Sharing`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-primary font-bold text-sm">
                      ₹{(room.rentPerBed || 0).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-secondary mt-0.5">/ month</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 w-36">
                      <div className="flex items-center justify-between">
                        {room.status === 'maintenance' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-danger-bg text-danger border border-[rgba(239,68,68,0.2)] uppercase tracking-wider">Maint.</span>
                        ) : room.vacantCount > 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-success-bg text-success border border-[rgba(16,185,129,0.2)] uppercase tracking-wider">Available</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-danger-bg text-danger border border-[rgba(239,68,68,0.2)] uppercase tracking-wider">Occupied</span>
                        )}
                        <span className="text-[10px] text-secondary font-medium">{occupiedBeds}/{safeSharing} beds</span>
                      </div>
                      <div className="w-full bg-input rounded-full h-1.5 overflow-hidden border border-border">
                        <div className={`h-full rounded-full motion-safe:transition-all duration-500 ${percent === 100 ? 'bg-danger' : 'bg-primary'}`} style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/owner/rooms/${room.id}`}
                      className="inline-flex items-center justify-center p-2 rounded-md hover:bg-primary-subtle text-secondary hover:text-primary motion-safe:transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border bg-[rgba(99,102,241,0.01)] flex items-center justify-between">
          <span className="text-sm text-secondary">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredRooms.length)} of {filteredRooms.length}
          </span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-3 py-1.5 text-sm font-medium border border-border rounded-md hover:bg-input disabled:opacity-50 disabled:cursor-not-allowed text-primary motion-safe:transition-colors"
            >
              Previous
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-3 py-1.5 text-sm font-medium border border-border rounded-md hover:bg-input disabled:opacity-50 disabled:cursor-not-allowed text-primary motion-safe:transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
