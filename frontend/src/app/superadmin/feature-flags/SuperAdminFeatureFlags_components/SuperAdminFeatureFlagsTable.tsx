// RESPONSIBILITY: Renders the SuperAdminFeatureFlagsTable component.
import React from 'react';

import type { SuperAdminFeatureFlagsTableProps } from '@/app/superadmin/feature-flags/SuperAdminFeatureFlags_types/SuperAdminFeatureFlags.types';

export const SuperAdminFeatureFlagsTable: React.FC<SuperAdminFeatureFlagsTableProps> = ({ owners, availableFeatures, onToggle }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-card border-b border text-secondary text-[12px] uppercase">
          <tr>
            <th className="px-6 py-4 font-semibold sticky left-0 bg-card z-10 shadow-[1px_0_0_0_var(--border)]">Owner</th>
            <th className="px-6 py-4 font-semibold text-center">Plan</th>
            {availableFeatures.map(f => (
              <th key={f} className="px-6 py-4 font-semibold text-center border-l border">
                {f.replace('_', ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {owners.map(o => (
            <tr key={o.id} className="hover:bg-[rgba(99,102,241,0.03)] motion-safe:transition-colors">
              <td className="px-6 py-4 sticky left-0 bg-card z-10 shadow-[1px_0_0_var(--border)]">
                <div className="font-bold text-primary line-clamp-1">{o.businessName}</div>
                <div className="text-[11px] text-secondary">{o.id}</div>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="px-2 py-1 bg-page border border rounded text-[11px] font-bold text-secondary uppercase">
                  {o.planId}
                </span>
              </td>
              {availableFeatures.map(f => (
                <td key={f} className="px-6 py-4 text-center border-l border">
                  <input 
                    type="checkbox" 
                    onChange={() => onToggle(o.id, f)}
                    defaultChecked={Math.random() > 0.5} // Simulating random state for UI
                    className="w-4 h-4 text-primary bg-input border rounded cursor-pointer focus:ring-primary"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
