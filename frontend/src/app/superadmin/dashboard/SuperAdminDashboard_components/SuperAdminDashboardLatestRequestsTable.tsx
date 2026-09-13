// RESPONSIBILITY: Renders the SuperAdminDashboardLatestRequestsTable component.
import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import type { SuperAdminDashboardLatestRequestsTableProps } from '@/app/superadmin/dashboard/SuperAdminDashboard_types/SuperAdminDashboard.types';

export const SuperAdminDashboardLatestRequestsTable: React.FC<SuperAdminDashboardLatestRequestsTableProps> = ({ requests }) => {
  return (
    <div className="bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border flex justify-between items-center">
        <h3 className="font-semibold text-primary">Latest Owner Requests</h3>
        <Link href="/superadmin/owner-requests" className="text-sm text-primary hover:underline flex items-center">
          View All <ArrowUpRight className="w-4 h-4 ml-1"/>
        </Link>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="bg-primary-subtle text-secondary uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {requests.map((r) => (
              <tr key={r.id} className="h-12 even:bg-black/5 dark:even:bg-white/[0.02] hover:bg-primary-subtle motion-safe:transition-colors">
                <td className="px-4 py-3 font-medium text-primary">{r.name}</td>
                <td className="px-4 py-3 text-secondary">{r.businessName}</td>
                <td className="px-4 py-3 text-secondary">{r.city}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${r.status === 'Pending' ? 'bg-warning-bg text-warning border border-warning' : r.status === 'Hold' ? 'bg-info-bg text-info border border-info' : r.status === 'Rejected' ? 'bg-danger-bg text-danger border border-danger' : 'bg-success-bg text-success border border-success'}`}>
                    {r.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-secondary h-12">No requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
