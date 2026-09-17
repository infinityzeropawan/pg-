// RESPONSIBILITY: Renders the SuperAdminFeatureFlagsTable component.
import React from 'react';

import type { SuperAdminFeatureFlagsTableProps } from '@/app/superadmin/feature-flags/SuperAdminFeatureFlags_types/SuperAdminFeatureFlags.types';

const SOURCE_LABEL: Record<string, string> = {
  CORE: 'Core',
  OVERRIDE: 'Override',
  PLAN: 'Plan',
  DEFAULT: 'Default',
};

export const SuperAdminFeatureFlagsTable: React.FC<SuperAdminFeatureFlagsTableProps> = ({
  owners,
  features,
  onToggle,
  pendingKey,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-card border-b border text-secondary text-[12px] uppercase">
          <tr>
            <th className="px-6 py-4 font-semibold sticky left-0 bg-card z-10 shadow-[1px_0_0_0_var(--border)]">Owner</th>
            <th className="px-6 py-4 font-semibold text-center">Plan</th>
            {features.map(f => (
              <th key={f.key} className="px-4 py-4 font-semibold text-center border-l border">
                <span className="block">{f.name}</span>
                {!f.enforced && (
                  <span className="mt-1 inline-block text-[10px] font-bold text-amber-600 normal-case">
                    Not live yet
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {owners.map(o => (
            <tr key={o.ownerId} className="hover:bg-[rgba(99,102,241,0.03)] motion-safe:transition-colors">
              <td className="px-6 py-4 sticky left-0 bg-card z-10 shadow-[1px_0_0_var(--border)]">
                <div className="font-bold text-primary line-clamp-1">{o.name}</div>
                <div className="text-[11px] text-secondary">{o.email}</div>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="px-2 py-1 bg-page border border rounded text-[11px] font-bold text-secondary uppercase">
                  {o.plan?.code || 'No plan'}
                </span>
              </td>
              {features.map(f => {
                const effective = o.effective[f.key];
                const enabled = Boolean(effective?.enabled);
                const isPending = pendingKey === `${o.ownerId}:${f.key}`;
                // Core features are locked on; non-enforced features are catalog-only.
                const disabled = f.isCore || !f.enforced || isPending;

                return (
                  <td key={f.key} className="px-4 py-4 text-center border-l border">
                    <input
                      type="checkbox"
                      checked={enabled}
                      disabled={disabled}
                      title={f.enforced ? `Source: ${SOURCE_LABEL[effective?.source || 'DEFAULT'] || effective?.source}` : 'Not wired to a runtime gate yet'}
                      onChange={() => onToggle(o.ownerId, f.key, !enabled)}
                      className="w-4 h-4 text-primary bg-input border rounded cursor-pointer focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <span className="mt-1 block text-[10px] text-secondary">
                      {f.isCore ? 'Core' : f.enforced ? SOURCE_LABEL[effective?.source || 'DEFAULT'] : '—'}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
          {owners.length === 0 && (
            <tr>
              <td colSpan={features.length + 2} className="px-6 py-10 text-center text-secondary">
                No owners found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

