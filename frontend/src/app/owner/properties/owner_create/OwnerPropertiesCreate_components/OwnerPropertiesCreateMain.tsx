'use client';

// RESPONSIBILITY: Renders the OwnerPropertiesCreateMain component. Receives data via props/hooks.

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { propertiesApi } from '@/app/owner/owner_lib/owner_api/OwnerProperties';
import { ownersApi } from '@/app/owner/owner_lib/owner_api/owners';
import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';
import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';
import { OwnerPropertiesCreateBasicInfo } from '@/app/owner/properties/owner_create/OwnerPropertiesCreate_components/OwnerPropertiesCreateBasicInfo';
import { OwnerPropertiesCreateLocation } from '@/app/owner/properties/owner_create/OwnerPropertiesCreate_components/OwnerPropertiesCreateLocation';
import { OwnerPropertiesCreateConfig } from '@/app/owner/properties/owner_create/OwnerPropertiesCreate_components/OwnerPropertiesCreateConfig';
import { OwnerPropertiesCreateAmenities } from '@/app/owner/properties/owner_create/OwnerPropertiesCreate_components/OwnerPropertiesCreateAmenities';
import { OwnerPropertiesCreatePhotos } from '@/app/owner/properties/owner_create/OwnerPropertiesCreate_components/OwnerPropertiesCreatePhotos';

export function OwnerPropertiesCreateMain() {
  const router = useRouter();
  
  const { refreshProperties } = useOwnerPropertyContext();
  const user = typeof window !== 'undefined' ? getSession() : null;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.ownerId) {
      try {
        const details = ownersApi.getOwner360(user.ownerId);
        if (!details || !details.subscription || details.subscription.status !== 'active' || details.subscription.planId === 'none') {
          router.push('/owner/subscription');
          toast.error('Please purchase a subscription plan to create a PG.');
        }
      } catch (err: any) {
      }
    }
// @ts-expect-error
  }, [user, router, showToast]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'coed',
    description: '',
    address: '',
    city: '',
    pincode: '',
    landmark: '',
    contactName: '',
    contactPhone: '',
    floorsCount: 1,
    nightEntryTime: '23:00',
    noticePeriodDays: 30,
    messEnabled: false,
    visitorCutoff: '20:00',
    defaultDeposit: 0,
    rentCycleDate: 1,
    photos: '',
    generateRooms: false,
    singleRoomsCount: 0,
    doubleRoomsCount: 0,
    tripleRoomsCount: 0
  });

  const [amenities, setAmenities] = useState<string[]>(['Wifi', 'Power Backup', 'CCTV']);
  const availableAmenities = ['Wifi', 'Power Backup', 'CCTV', 'AC', 'Washing Machine', 'RO Water', 'Parking', 'Gym', 'TV', 'Lounge'];

  const handleToggleAmenity = (am: string) => {
    if (amenities.includes(am)) {
      setAmenities(amenities.filter(a => a !== am));
    } else {
      setAmenities([...amenities, am]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (name === 'name' && !(formData as any).slug) {
        setFormData(prev => ({ ...prev, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-') }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!user) {
      setError('Session expired. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const photosArray = (formData as any).photos.split(',').map((s: any) => s.trim()).filter(Boolean);
      
      const newProp = propertiesApi.create({
        ownerId: user.id,
        name: (formData as any).name,
        slug: (formData as any).slug,
        type: (formData as any).type as 'boys'|'girls'|'coed',
        description: (formData as any).description,
        address: (formData as any).address,
        city: (formData as any).city,
        pincode: (formData as any).pincode,
        landmark: (formData as any).landmark,
        contactName: (formData as any).contactName,
        contactPhone: (formData as any).contactPhone,
        floorsCount: (formData as any).floorsCount,
        nightEntryTime: (formData as any).nightEntryTime,
        noticePeriodDays: (formData as any).noticePeriodDays,
        messEnabled: (formData as any).messEnabled,
        visitorCutoff: (formData as any).visitorCutoff,
        defaultDeposit: (formData as any).defaultDeposit,
        rentCycleDate: (formData as any).rentCycleDate,
        amenities: amenities,
        photos: photosArray,
        generateRooms: (formData as any).generateRooms || (formData as any).singleRoomsCount > 0 || (formData as any).doubleRoomsCount > 0 || (formData as any).tripleRoomsCount > 0,
        singleRoomsCount: (formData as any).singleRoomsCount,
        doubleRoomsCount: (formData as any).doubleRoomsCount,
        tripleRoomsCount: (formData as any).tripleRoomsCount
      });

      toast.success('Property branch created successfully!');
      await new Promise(resolve => setTimeout(resolve, 500));
      refreshProperties();
      router.push(`/owner/properties/${newProp.id}`);
      
    } catch (err: any) {
      setError((err as any).message || 'Failed to create property. Check your subscription limit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/owner/properties" className="p-2 hover:bg-card rounded-full motion-safe:transition-colors text-secondary hover:text-primary border border-transparent hover:border-border">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-[22px] font-bold text-primary">Add New Property</h1>
          <p className="text-sm text-secondary">Set up a new PG branch and its configuration.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-danger-bg border border-danger text-danger rounded-md flex items-center gap-3 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <OwnerPropertiesCreateBasicInfo formData={formData} handleInputChange={handleInputChange} />
        <OwnerPropertiesCreateLocation formData={formData} handleInputChange={handleInputChange} />
        <OwnerPropertiesCreateConfig formData={formData} handleInputChange={handleInputChange} />
        <OwnerPropertiesCreateAmenities amenities={amenities} handleToggleAmenity={handleToggleAmenity} availableAmenities={availableAmenities} />
        <OwnerPropertiesCreatePhotos formData={formData} handleInputChange={handleInputChange} />

        <div className="flex justify-end pt-4 pb-10">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-primary text-white px-8 py-3 rounded-md font-bold hover:bg-primary-hover motion-safe:transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:-translate-y-0.5"
          >
            {loading ? 'Creating...' : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Create Property
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
