// RESPONSIBILITY: Operational stat cards for the Owner Dashboard.
'use client';

import { Bed, AlertCircle, DoorOpen, Users } from 'lucide-react';

interface OwnerDashboardStatCardsProps {
  propMetrics: any;
}

export function OwnerDashboardStatCards({ propMetrics }: OwnerDashboardStatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="p-6 bg-card border border-border rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
        <div>
          <div className="text-xs font-bold text-secondary uppercase mb-1">Occupancy</div>
          <div className="text-3xl font-black text-primary">{propMetrics.occupancyPercent}%</div>
          <div className="text-sm font-medium text-secondary mt-1">{propMetrics.occupiedBeds} / {propMetrics.totalBeds} Beds</div>
        </div>
        <div className="w-14 h-14 rounded-full bg-primary-subtle flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <Bed className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="p-6 bg-card border border-border rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
        <div>
          <div className="text-xs font-bold text-secondary uppercase mb-1">Vacant Beds</div>
          <div className="text-3xl font-black text-success">{propMetrics.vacantBeds}</div>
          <div className="text-sm font-medium text-secondary mt-1">Ready to rent</div>
        </div>
        <div className="w-14 h-14 rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <DoorOpen className="w-6 h-6 text-success" />
        </div>
      </div>

      <div className="p-6 bg-card border border-border rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
        <div>
          <div className="text-xs font-bold text-secondary uppercase mb-1">Pending Rent</div>
          <div className="text-3xl font-black text-danger">₹{propMetrics.pendingRent.toLocaleString('en-IN')}</div>
          <div className="text-sm font-medium text-secondary mt-1">To be collected</div>
        </div>
        <div className="w-14 h-14 rounded-full bg-danger-bg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <AlertCircle className="w-6 h-6 text-danger" />
        </div>
      </div>

      <div className="p-6 bg-card border border-border rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
        <div>
          <div className="text-xs font-bold text-secondary uppercase mb-1">Open Issues</div>
          <div className="text-3xl font-black text-warning">{propMetrics.openComplaints}</div>
          <div className="text-sm font-medium text-secondary mt-1">Active complaints</div>
        </div>
        <div className="w-14 h-14 rounded-full bg-warning-bg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <Users className="w-6 h-6 text-warning" />
        </div>
      </div>
    </div>
  );
}
