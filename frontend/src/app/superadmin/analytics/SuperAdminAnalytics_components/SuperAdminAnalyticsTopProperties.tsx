// RESPONSIBILITY: Renders the SuperAdminAnalyticsTopProperties component.
import React from 'react';
import { Building2 } from 'lucide-react';

import type { SuperAdminAnalyticsTopPropertiesProps } from '@/app/superadmin/analytics/SuperAdminAnalytics_types/SuperAdminAnalytics.types';

export const SuperAdminAnalyticsTopProperties: React.FC<SuperAdminAnalyticsTopPropertiesProps> = () => {
  return (
    <div className="bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm overflow-hidden">
      <div className="p-4 border-b border bg-card">
        <h2 className="font-bold text-primary flex items-center gap-2">
          <Building2 className="w-4 h-4"/> Top Performing Properties (Simulated)
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-card border-b border text-secondary text-[12px] uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Property Name</th>
              <th className="px-6 py-4 font-semibold">Owner</th>
              <th className="px-6 py-4 font-semibold text-center">Beds</th>
              <th className="px-6 py-4 font-semibold text-center">Occupancy</th>
              <th className="px-6 py-4 font-semibold text-right">Revenue (MTD)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {[1,2,3,4,5].map(i => (
              <tr key={`fallback-${i}`} className="h-12 even:bg-black/5 dark:even:bg-white/[0.02] hover:bg-primary-subtle motion-safe:transition-colors">
                <td className="px-6 py-4 font-medium text-primary">Elite PG {i}</td>
                <td className="px-6 py-4 text-secondary">Owner {i}</td>
                <td className="px-6 py-4 text-center font-medium text-primary">{i * 20 + 50}</td>
                <td className="px-6 py-4 text-center">
                  <div className="w-full bg-page border border rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: `${90 - i*5}%` }}></div>
                  </div>
                  <div className="text-[10px] text-secondary mt-1">{90 - i*5}%</div>
                </td>
                <td className="px-6 py-4 text-right font-medium text-success">₹{(i*150000).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
