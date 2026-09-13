
import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { createId } from '@/lib/utils/id';
import { ownerRequestsApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminOwnerRequests';

import type { User } from '@/lib/types/models';

export function createOwner(data: unknown) {
  // 1. Validate unique email in users
// @ts-expect-error
  const existingUser = db.query<User>(STORAGE_KEYS.USERS, (u: any) => u.email === data.email && !u.isDeleted);
  if (existingUser.length > 0) {
    throw new Error('Email is already in use by another user.');
  }

  const now = new Date().toISOString();
  const adminId = 'superadmin'; // hardcoded for backend simulation

  // 2. Create User record
  const user: User = {
    id: createId('usr'),
    role: 'owner',
// @ts-expect-error
    name: data.name,
// @ts-expect-error
    email: data.email,
// @ts-expect-error
    phone: data.phone,
// @ts-expect-error
    password: data.temporaryPassword,
    status: 'Active',
// @ts-expect-error
    mustChangePassword: data.mustChangePassword ?? true,
    createdAt: now,
    updatedAt: now,
    createdBy: adminId,
    updatedBy: adminId,
    isDeleted: false
  };
  const createdUser = db.insert(STORAGE_KEYS.USERS, user);

  // 3. Create Owner Profile
  const ownerProfile = {
    id: createId('own'),
    userId: createdUser.id,
// @ts-expect-error
    name: data.name,
// @ts-expect-error
    businessName: data.businessName,
// @ts-expect-error
    email: data.email,
// @ts-expect-error
    phone: data.phone,
// @ts-expect-error
    city: data.city,
// @ts-expect-error
    address: data.address,
// @ts-expect-error
    gst: data.gst,
// @ts-expect-error
    pan: data.pan,
// @ts-expect-error
    expectedPgs: data.expectedPgs,
// @ts-expect-error
    expectedBeds: data.expectedBeds,
    createdAt: now,
    updatedAt: now,
    createdBy: adminId,
    updatedBy: adminId,
    isDeleted: false
  };
  const createdOwner = db.insert(STORAGE_KEYS.OWNERS, ownerProfile);

  // Link user to ownerId
  db.update<User>(STORAGE_KEYS.USERS, createdUser.id, { ownerId: createdOwner.id });

  // 4. Create Subscription (Only if planId is selected)
// @ts-expect-error
  if (data.planId && data.planId !== 'none') {
    const subscription = {
      id: createId('sub'),
      ownerId: createdOwner.id,
// @ts-expect-error
      planId: data.planId,
// @ts-expect-error
      billingCycle: data.billingCycle,
// @ts-expect-error
      maxProperties: data.maxProperties,
// @ts-expect-error
      maxBeds: data.maxBeds,
// @ts-expect-error
      maxStaff: data.maxStaff,
// @ts-expect-error
      features: data.features,
      status: 'active',
      startDate: now,
// @ts-expect-error
      endDate: data.billingCycle === 'yearly' ? new Date(Date.now() + 365*24*60*60*1000).toISOString() : new Date(Date.now() + 30*24*60*60*1000).toISOString(),
      createdAt: now,
      updatedAt: now,
      createdBy: adminId,
      updatedBy: adminId,
      isDeleted: false
    };
    db.insert(STORAGE_KEYS.SUBSCRIPTIONS, subscription);
  }

  // 5. Audit Log
  db.insert(STORAGE_KEYS.AUDIT_LOGS, {
    id: createId('aud'),
    action: 'OWNER_CREATED',
    actorId: adminId,
    targetId: createdOwner.id,
// @ts-expect-error
    details: `Created owner ${data.businessName} (${data.email})`,
    createdAt: now,
    updatedAt: now,
    createdBy: adminId,
    updatedBy: adminId,
    isDeleted: false
  });

  // 6. Update Request if linked
// @ts-expect-error
  if (data.requestId) {
// @ts-expect-error
    ownerRequestsApi.updateStatus(data.requestId, 'Approved');
  }

  return { user: createdUser, owner: createdOwner };
}
