'use client';

import React from 'react';

import { SuperadminUseSuperAdminFeatureFlagsData } from '@/app/superadmin/feature-flags/SuperAdminFeatureFlags_hooks/SuperadminUseSuperAdminFeatureFlagsData';
import { SuperAdminFeatureFlagsHeader } from '@/app/superadmin/feature-flags/SuperAdminFeatureFlags_components/SuperAdminFeatureFlagsHeader';
import { SuperAdminFeatureFlagsToolbar } from '@/app/superadmin/feature-flags/SuperAdminFeatureFlags_components/SuperAdminFeatureFlagsToolbar';
import { SuperAdminFeatureFlagsTable } from '@/app/superadmin/feature-flags/SuperAdminFeatureFlags_components/SuperAdminFeatureFlagsTable';
import { SuperAdminFeatureFlagsPlanMatrix } from '@/app/superadmin/feature-flags/SuperAdminFeatureFlags_components/SuperAdminFeatureFlagsPlanMatrix';

export default function FeatureFlagsPage() {
  const {
    filtered,
    features,
    plans,
    loading,
    error,
    search,
    setSearch,
    pendingKey,
    handleOwnerToggle,
    handlePlanToggle,
  } = SuperadminUseSuperAdminFeatureFlagsData();

  if (loading) return null; // Let loading.tsx handle it

  return (
    <div className="space-y-8 pb-20">
      <SuperAdminFeatureFlagsHeader />

      {error && (
        <div className="rounded-[var(--radius-lg,12px)] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-bold text-primary">Plan entitlements</h2>
          <p className="text-xs text-secondary">
            What each subscription plan includes. Every owner on the plan inherits these unless an override is set below.
          </p>
        </div>
        <div className="bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm">
          <SuperAdminFeatureFlagsPlanMatrix
            plans={plans}
            features={features}
            onToggle={handlePlanToggle}
            pendingKey={pendingKey}
          />
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-bold text-primary">Per-owner access</h2>
          <p className="text-xs text-secondary">
            Effective access for each owner. A checkbox labelled “Override” was set manually and wins over the plan.
          </p>
        </div>
        <div className="bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm">
          <SuperAdminFeatureFlagsToolbar
            search={search}
            setSearch={setSearch}
          />

          <SuperAdminFeatureFlagsTable
            owners={filtered}
            features={features}
            onToggle={handleOwnerToggle}
            pendingKey={pendingKey}
          />
        </div>
      </section>
    </div>
  );
}