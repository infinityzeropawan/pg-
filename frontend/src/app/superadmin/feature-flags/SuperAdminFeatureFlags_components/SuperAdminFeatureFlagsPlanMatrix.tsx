// RESPONSIBILITY: Plan-level feature entitlements ("what each plan pays for").
import React from 'react';

import type { SuperAdminFeatureFlagsPlanMatrixProps } from '@/app/superadmin/feature-flags/SuperAdminFeatureFlags_types/SuperAdminFeatureFlags.types';

export const SuperAdminFeatureFlagsPlanMatrix: React.FC<SuperAdminFeatureFlagsPlanMatrixProps> = ({
  plans,
  features,
  onToggle,
  pendingKey,
}) => {
  if (!plans.length) {
    return <div className="px-6 py-10 text-center text-secondary">No plans configured yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-card border-b border text-secondary text-[12px] uppercase">
          <tr>
            <th className="px-6 py-4 font-semibold sticky left-0 bg-card z-10 shadow-[1px_0_0_0_var(--border)]">Plan</th>
            {features.map(f => (
              <th key={f.key} className="px-4 py-4 font-semibold text-center border-l border">
                <span className="block">{f.name}</span>
                {!f.enforced && (
                  <span className="mt-1 inline-block text-[10px] font-bold text-amber-600 normal-case">Not live yet</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {plans.map(plan => (
            <tr key={plan.id} className="hover:bg-[rgba(99,102,241,0.03)] motion-safe:transition-colors">
              <td className="px-6 py-4 sticky left-0 bg-card z-10 shadow-[1px_0_0_var(--border)]">
                <div className="font-bold text-primary">{plan.name}</div>
                <div className="text-[11px] text-secondary">
                  ₹{(plan.priceMonthly / 100).toLocaleString('en-IN')}/mo · {plan.maxProperties} PG · {plan.maxBeds} beds
                </div>
              </td>
              {features.map(f => {
                const entitlement = plan.entitlements.find(item => item.featureKey === f.key);
                const enabled = f.isCore || Boolean(entitlement?.isEnabled);
                const isPending = pendingKey === `${plan.id}:${f.key}`;

                return (
                  <td key={f.key} className="px-4 py-4 text-center border-l border">
                    <input
                      type="checkbox"
                      checked={enabled}
                      disabled={f.isCore || !f.enforced || isPending}
                      title={f.isCore ? 'Core feature — always included' : f.enforced ? undefined : 'Not wired to a runtime gate yet'}
                      onChange={() => onToggle(plan.id, f.key, !enabled)}
                      className="w-4 h-4 text-primary bg-input border rounded cursor-pointer focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <span className="mt-1 block text-[10px] text-secondary">{f.isCore ? 'Core' : ''}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
