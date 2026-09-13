// RESPONSIBILITY: Renders the SuperAdminOwnerProfileHeader component.
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

import type { Owner360Data } from '@/app/superadmin/owners/SuperAdminOwners_types/SuperAdminOwners.types';

export const SuperAdminOwnerProfileHeader: React.FC<{ data: Owner360Data }> = ({ data }) => {
  const { owner, user, subscription } = data;
  
  return (
    <>
      <div className="flex items-center gap-4 border-b border pb-4">
        <Link href="/superadmin/owners" className="p-2 hover:bg-card rounded-[var(--radius-md,8px)] motion-safe:transition-colors border border-transparent hover:border">
          <ArrowLeft className="w-5 h-5 text-secondary" />
        </Link>
        <div>
          <h1 className="text-[22px] font-bold text-primary">{owner.businessName}</h1>
          <p className="text-secondary text-sm">{owner.name} • {owner.city} • Joined {new Date(owner.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="ml-auto flex gap-3">
          <span className={`px-3 py-1 rounded-[var(--radius-full,999px)] text-[11px] font-semibold border ${
            user?.status === 'Active' ? 'bg-success-bg text-success border-success' : 'bg-danger-bg text-danger border-danger'
          }`}>
            {(user?.status || 'UNKNOWN').toUpperCase()}
          </span>
          <span className="px-3 py-1 bg-primary-subtle text-primary border border-primary rounded-[var(--radius-full,999px)] text-[11px] font-semibold capitalize">
            {((subscription as Record<string, unknown>)?.planId as string) || 'No Plan'} Plan
          </span>
        </div>
      </div>

      <div className="bg-warning-bg border border-warning p-4 rounded-[var(--radius-lg,12px)] flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-primary text-sm">CRITICAL: SuperAdmin does NOT create properties here.</div>
          <div className="text-secondary text-xs mt-1">PGs owner khud create karega apni dashboard se. You can only monitor their usage and manage their account.</div>
        </div>
      </div>
    </>
  );
};
