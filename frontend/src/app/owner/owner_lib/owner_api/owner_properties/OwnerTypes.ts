import type { BaseEntity } from '@/lib/types';

export interface Property extends BaseEntity {
  ownerId: string;
  name: string;
  slug: string;
  type: 'boys' | 'girls' | 'coed';
  address: string;
  city: string;
  pincode: string;
  landmark: string;
  description: string;
  contactName: string;
  contactPhone: string;
  floorsCount: number;
  amenities: string[];
  nightEntryTime: string;
  noticePeriodDays: number;
  messEnabled: boolean;
  visitorCutoff: string;
  defaultDeposit: number;
  rentCycleDate: number;
  photos: string[];
  bedsPlanned: number; // Keep for backward compatibility/dashboard stats
}
