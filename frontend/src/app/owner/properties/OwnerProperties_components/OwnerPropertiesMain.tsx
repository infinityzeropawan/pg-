'use client';
import Image from 'next/image';

// RESPONSIBILITY: Renders the OwnerPropertiesMain component. Receives data via props/hooks.

import { Building2, Plus, Bed, IndianRupee, MapPin, Users, Activity } from 'lucide-react';
import Link from 'next/link';
import { propertiesApi } from '@/app/owner/owner_lib/owner_api/OwnerProperties';
import { useState, useEffect } from 'react';

import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';
import { dashboardApi } from '@/app/owner/owner_lib/owner_api/OwnerDashboard';
import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';


import type { Property } from '@/app/owner/owner_lib/owner_api/OwnerProperties';

export function OwnerPropertiesMain() {
  const user = typeof window !== 'undefined' ? getSession() : null;
  const [localProps, setLocalProps] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Force a fresh fetch specifically for this page instead of relying on context
      const allProps = propertiesApi.listByOwner(user.id);
      setLocalProps(allProps);
    }
    setLoading(false);
  }, [user?.id]);

  if (loading) {
    return <div className="p-6 motion-safe:animate-pulse">Loading properties...</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-primary">Properties</h1>
          <p className="text-sm text-secondary">Manage your PG branches and buildings.</p>
        </div>
        <Link 
          href="/owner/properties/create"
          className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-hover motion-safe:transition-colors flex items-center gap-2 text-sm shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Property</span>
        </Link>
      </div>

      {localProps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-lg">
          <div className="w-16 h-16 bg-page rounded-full flex items-center justify-center mb-4 border border-border">
            <Building2 className="w-8 h-8 text-secondary" />
          </div>
          <h2 className="text-lg font-bold text-primary mb-1">No Properties Found</h2>
          <p className="text-secondary text-sm mb-6 max-w-md">
            You haven't added any properties yet. Click the button below to set up your first PG.
          </p>
          <Link 
            href="/owner/properties/create"
            className="bg-primary text-white px-5 py-2.5 rounded-md font-medium hover:bg-primary-hover motion-safe:transition-colors inline-block text-sm"
          >
            Add Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localProps.map((property) => {
            // Get stats for this property (using the dashboard API logic scoped to this property)
            const stats = dashboardApi.getOwnerMetrics(user!.id, property.id);
            const coverPhoto = property.photos?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop';
            
            return (
              <Link 
                key={property.id} 
                href={`/owner/properties/${property.id}`}
                className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl motion-safe:transition-all block"
              >
                {/* Photo Gradient Header */}
                <div className="relative h-40 w-full bg-page">
                  { }
                  <Image src={coverPhoto} alt={property.name} fill className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-md">
                    {property.type || 'coed'}
                  </div>
                  
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg font-bold text-white mb-0.5 leading-tight">{property.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-gray-300 font-medium">
                      <MapPin className="w-3 h-3" />
                      {property.city || 'Unknown City'}
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-[10px] font-medium text-secondary uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Bed className="w-3 h-3" /> Occupancy
                      </div>
                      <div className="text-sm font-bold text-primary">
                        {stats.occupancyPercent}%
                        <span className="text-xs font-normal text-secondary ml-1">
                          ({stats.occupiedBeds}/{stats.totalBeds})
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-[10px] font-medium text-secondary uppercase tracking-wider mb-1 flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" /> Revenue
                      </div>
                      <div className="text-sm font-bold text-success">
                        ₹{stats.thisMonthCollection.toLocaleString()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-[10px] font-medium text-secondary uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Activity className="w-3 h-3" /> Hygiene / Rating
                      </div>
                      <div className="text-sm font-bold text-primary">
                        4.8 / 5.0
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-medium text-secondary uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Users className="w-3 h-3" /> Manager
                      </div>
                      <div className="text-sm font-bold text-primary truncate">
                        {property.contactName || 'Unassigned'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-border bg-[rgba(99,102,241,0.02)] p-3 text-center text-xs font-medium text-primary group-hover:bg-[rgba(99,102,241,0.05)] motion-safe:transition-colors">
                  View Property Details &rarr;
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
