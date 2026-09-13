// RESPONSIBILITY: Renders the SuperAdminTicketsTable component.
import React from 'react';
import { Search } from 'lucide-react';

import { StatusBadge } from '@/components/ui/statusBadgeConfig';
import { Pagination } from '@/components/ui/Pagination';
import { type SuperAdminTicketsTableProps, type SuperAdminTicket } from '@/app/superadmin/tickets/SuperAdminTickets_types/SuperAdminTickets.types';

const PriorityBadge = ({ p }: { p: string }) => {
  const color = p === 'High' ? 'text-danger' : p === 'Medium' ? 'text-warning' : 'text-success';
  return <span className={`text-[12px] font-medium ${color}`}>{p}</span>;
};

export const SuperAdminTicketsTable: React.FC<SuperAdminTicketsTableProps> = ({
  tickets,
  owners,
  loading,
  search,
  setSearch,
  currentPage,
  totalPages,
  onPageChange,
  onStatusChange
}) => {
  return (
    <div className="bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm">
      <div className="p-4 border-b border flex justify-between items-center bg-card rounded-t-[var(--radius-lg,12px)]">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-secondary" />
          <input 
            type="text" 
            placeholder="Search tickets..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-input border border pl-9 pr-4 py-2 rounded-[var(--radius-md,8px)] text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-sm text-left">
          <thead className="bg-card border-b border text-secondary uppercase text-[12px] sticky top-0 z-10 shadow-sm shadow-black/5">
            <tr>
              <th className="px-6 py-4 font-semibold">Issue</th>
              <th className="px-6 py-4 font-semibold">Owner</th>
              <th className="px-6 py-4 font-semibold text-center">Priority</th>
              <th className="px-6 py-4 font-semibold text-center">Date</th>
              <th className="px-6 py-4 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-secondary motion-safe:animate-pulse">
                  Loading tickets...
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-secondary">
                  No tickets found.
                </td>
              </tr>
            ) : (
              tickets.map((t: SuperAdminTicket) => {
                const owner = owners.find(o => o.id === t.ownerId);
                return (
                  <tr key={t.id} className="h-12 even:bg-black/5 dark:even:bg-white/[0.02] hover:bg-primary-subtle motion-safe:transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-primary">{t.title}</div>
                      <div className="text-[11px] text-secondary truncate max-w-[250px]">{t.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-primary">{owner?.name || 'Unknown'}</div>
                      <div className="text-[11px] text-disabled">{owner?.businessName}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <PriorityBadge p={t.priority} />
                    </td>
                    <td className="px-6 py-4 text-center text-[12px] text-secondary">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={t.status} />
                        <select 
                          value={t.status}
                          onChange={(e) => onStatusChange(t.id, e.target.value)}
                          className="bg-transparent border border text-[11px] text-primary rounded-md px-1 py-0.5 focus:outline-none focus:border-primary cursor-pointer"
                        >
                          <option value="Open" className="text-primary bg-card">Open</option>
                          <option value="In Progress" className="text-primary bg-card">In Progress</option>
                          <option value="Resolved" className="text-primary bg-card">Resolved</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={onPageChange} 
        />
      )}
    </div>
  );
};
