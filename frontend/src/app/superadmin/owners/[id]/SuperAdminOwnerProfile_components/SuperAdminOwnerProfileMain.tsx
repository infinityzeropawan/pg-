// RESPONSIBILITY: Renders the SuperAdminOwnerProfileMain component.
import React from 'react';
import { Building2, FileText, Ticket } from 'lucide-react';

import type { Owner360Data } from '@/app/superadmin/owners/SuperAdminOwners_types/SuperAdminOwners.types';

export const SuperAdminOwnerProfileMain: React.FC<{ data: Owner360Data }> = ({ data }) => {
  const { subscription, properties, recentPayments, tickets } = data;

  return (
    <div className="space-y-6">
      {/* Plan Usage KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm text-center flex flex-col justify-center">
          <div className="text-[11px] font-medium text-secondary uppercase tracking-wider mb-2">Properties</div>
          <div className="text-[28px] font-bold text-primary">
            {properties.length} <span className="text-lg text-disabled">/ {((subscription as Record<string, unknown>)?.maxProperties as number) || 0}</span>
          </div>
        </div>
        <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm text-center flex flex-col justify-center">
          <div className="text-[11px] font-medium text-secondary uppercase tracking-wider mb-2">Total Students</div>
          <div className="text-[28px] font-bold text-primary">
            {data.studentsCount} <span className="text-lg text-disabled">/ {((subscription as Record<string, unknown>)?.maxBeds as number) || 0}</span>
          </div>
        </div>
        <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm text-center flex flex-col justify-center">
          <div className="text-[11px] font-medium text-secondary uppercase tracking-wider mb-2">Staff/Managers</div>
          <div className="text-[28px] font-bold text-primary">
            {data.managersCount} <span className="text-lg text-disabled">/ {((subscription as Record<string, unknown>)?.maxStaff as number) || 0}</span>
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div className="bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm overflow-hidden">
        <div className="bg-page border-b border p-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-primary text-[14px]">Owner's PGs</h2>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {properties.length === 0 ? (
            <div className="p-6 text-center text-secondary text-sm">No properties created yet.</div>
          ) : (
            (properties as unknown as import('@/lib/storage/db').BaseEntity[]).map((p: any) => (
              <div key={p.id as string} className="p-4 flex items-center justify-between hover:bg-primary-subtle motion-safe:transition-colors">
                <div>
                  <div className="font-medium text-primary">{(p as any).name as string}</div>
                  <div className="text-[12px] text-secondary">{p.city as string} • {p.managers as number} Staff</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{p.occupied as number} / {p.capacity as number}</div>
                  <div className="text-[11px] text-success">Occupied</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm overflow-hidden flex flex-col">
          <div className="bg-page border-b border p-4 flex items-center gap-2 shrink-0">
            <FileText className="w-4 h-4 text-success" />
            <h2 className="font-semibold text-primary text-[14px]">Platform Payments</h2>
          </div>
          <div className="divide-y divide-[var(--border)] flex-1 overflow-y-auto max-h-[300px] custom-scrollbar">
            {recentPayments.length === 0 ? (
              <div className="p-6 text-center text-secondary text-sm">No payments recorded.</div>
            ) : (
              (recentPayments as unknown as import('@/lib/storage/db').BaseEntity[]).map((p: any) => (
                <div key={p.id as string} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[12px] text-secondary">{new Date(p.date as string).toLocaleDateString()}</div>
                    <div className="text-[11px] font-medium text-primary">{p.mode as string}</div>
                  </div>
                  <div className="font-medium text-success">₹{(p.amount as number).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tickets */}
        <div className="bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm overflow-hidden flex flex-col">
          <div className="bg-page border-b border p-4 flex items-center gap-2 shrink-0">
            <Ticket className="w-4 h-4 text-danger" />
            <h2 className="font-semibold text-primary text-[14px]">Support Tickets</h2>
          </div>
          <div className="divide-y divide-[var(--border)] flex-1 overflow-y-auto max-h-[300px] custom-scrollbar">
            {tickets.length === 0 ? (
              <div className="p-6 text-center text-secondary text-sm">No support tickets found.</div>
            ) : (
              (tickets as unknown as import('@/lib/storage/db').BaseEntity[]).map((t) => (
                <div key={t.id as string} className="p-4 flex flex-col gap-1">
                  <div className="font-medium text-primary text-sm line-clamp-1" title={t.issue as string}>{t.issue as string}</div>
                  <div>
                    {t.status === 'Resolved' ? (
                      <span className="text-[10px] bg-success-bg text-success px-2 py-0.5 rounded-full font-bold uppercase border border-success">Resolved</span>
                    ) : (
                      <span className="text-[10px] bg-warning-bg text-warning px-2 py-0.5 rounded-full font-bold uppercase border border-warning">Open</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
