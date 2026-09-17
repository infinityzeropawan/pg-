import { apiUrl } from '@/lib/config/apiBase';

import type { BaseEntity } from '@/lib/types/models';

export interface OwnerRequest extends BaseEntity {
  name: string;
  fullName?: string;
  businessName: string;
  email: string;
  phone: string;
  city: string;
  pgCount: number;
  bedCount: number;
  planId?: string;
  gst?: string;
  message?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Hold' | 'PENDING' | 'APPROVED' | 'REJECTED';
  [key: string]: unknown;
}

export const ownerRequestsApi = {
  async create(data: Omit<OwnerRequest, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'isDeleted' | 'status'>) {
    try {
      const res = await fetch(apiUrl('/api/v1/superadmin/owner-requests/public'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.name || data.fullName,
          email: data.email,
          phone: data.phone,
          city: data.city,
          propertyCount: data.pgCount,
          totalBeds: data.bedCount,
          notes: data.message,
        }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) return resData.data;
    } catch (error) {
      throw error;
    }
    throw new Error('Unable to submit owner request');
  },
  
  async list(): Promise<OwnerRequest[]> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (token) {
        const res = await fetch(apiUrl('/api/v1/superadmin/owner-requests'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resData = await res.json();
        if (res.ok && resData.success) {
          return resData.data.map((r: any) => ({
            id: r.id,
            name: r.fullName,
            fullName: r.fullName,
            email: r.email,
            phone: r.phone,
            city: r.city,
            pgCount: r.propertyCount,
            bedCount: r.totalBeds,
            status: r.status,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
            isDeleted: false
          }));
        }
      }
    } catch (error) {
      throw error;
    }
    throw new Error('Superadmin authentication is required');
  },
  
  
  async updateStatus(id: string, status: 'Approved' | 'Rejected' | 'Hold' | 'APPROVED' | 'REJECTED', reason?: string) {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (token) {
        const backendStatus = status.toUpperCase() === 'HOLD' ? 'UNDER_REVIEW' : status.toUpperCase();
        const res = await fetch(apiUrl(`/api/v1/superadmin/owner-requests/${id}/status`), {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: backendStatus, reason })
        });
        const resData = await res.json();
        if (res.ok && resData.success) return resData.data;
      }
    } catch (error) {
      throw error;
    }
    throw new Error('Superadmin authentication is required');
  }
};
