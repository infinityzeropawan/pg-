import React from 'react';
import { FileText, CheckCircle, PauseCircle, XCircle } from 'lucide-react';

import { StatusBadge } from '@/components/ui/statusBadgeConfig';
import { Pagination } from '@/components/ui/Pagination';

import type { SuperAdminOwnerRequestsTableProps } from '@/app/superadmin/owner-requests/SuperAdminOwnerRequests_types/SuperAdminOwnerRequests.types';

// RESPONSIBILITY: Renders the data table and pagination. Iterates over requests array.

export const SuperAdminOwnerRequestsTable: React.FC<SuperAdminOwnerRequestsTableProps> = ({
  requests,
  loading,
  onApprove,
  onHold,
  onReject,
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div className="bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm">
      <div className="overflow-x-auto max-h-[60vh] custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="bg-card border-b border text-secondary uppercase text-[12px] font-semibold sticky top-0 z-10 shadow-sm shadow-black/5">
            <tr>
              <th className="px-6 py-4">Applicant</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Scale</th>
              <th className="px-6 py-4 text-center w-28">Status</th>
              <th className="px-6 py-4 text-right w-32">Date</th>
              <th className="px-6 py-4 text-right w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-secondary motion-safe:animate-pulse">
                  Loading requests...
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <FileText className="w-12 h-12 text-secondary opacity-50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-primary mb-1">No requests found</h3>
                  <p className="text-secondary text-sm">We couldn't find any owner requests matching your criteria.</p>
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr 
                  key={r.id} 
                  className="h-12 even:bg-black/5 dark:even:bg-white/[0.02] hover:bg-primary-subtle motion-safe:transition-colors group cursor-default"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-primary truncate max-w-[200px]">{r.name}</div>
                    <div className="text-[11px] text-disabled mt-0.5 truncate max-w-[200px]">{r.email} • {r.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-secondary">
                    <div className="font-medium text-primary truncate max-w-[150px]">{r.businessName}</div>
                    <div className="text-[12px] truncate max-w-[150px]">{r.city}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[14px] font-medium text-primary">{r.pgCount} PGs</div>
                    <div className="text-[12px] text-secondary">{r.bedCount} Beds expected</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-6 py-4 text-[12px] text-secondary text-right">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {r.status === 'Pending' && (
                      <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onApprove(r.id); }} 
                          className="p-1.5 text-success hover:bg-success-bg rounded-[var(--radius-md,8px)] motion-safe:transition-colors" 
                          title="Approve & Create Owner"
                          aria-label="Approve Request"
                        >
                          <CheckCircle className="w-[18px] h-[18px] stroke-[2]" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onHold(r.id); }} 
                          className="p-1.5 text-warning hover:bg-warning-bg rounded-[var(--radius-md,8px)] motion-safe:transition-colors" 
                          title="Put on Hold"
                          aria-label="Hold Request"
                        >
                          <PauseCircle className="w-[18px] h-[18px] stroke-[2]" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onReject(r.id); }} 
                          className="p-1.5 text-danger hover:bg-danger-bg rounded-[var(--radius-md,8px)] motion-safe:transition-colors" 
                          title="Reject"
                          aria-label="Reject Request"
                        >
                          <XCircle className="w-[18px] h-[18px] stroke-[2]" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
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
