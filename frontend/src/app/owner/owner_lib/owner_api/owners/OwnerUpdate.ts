
import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { createId } from '@/lib/utils/id';

import type { User } from '@/lib/types/models';

export function upgradePlan(ownerId: string, newPlanId: string) {
  const subs = db.getAll<any>(STORAGE_KEYS.SUBSCRIPTIONS);
  
  // Find active subscription for this owner
  const activeSub = subs.find(s => s.ownerId === ownerId && s.status === 'active');
  
  // Fetch the new plan details
// @ts-expect-error
  const plans = db.getAll<any>('spg_plans' as unknown);
  const newPlan = plans.find(p => p.id === newPlanId);
  
  if (!newPlan) throw new Error('Selected plan not found in database');

  const now = new Date().toISOString();

  // Mark current as expired if exists
  if (activeSub) {
// @ts-expect-error
    db.OwnerUpdate(STORAGE_KEYS.SUBSCRIPTIONS, activeSub.id, { 
      status: 'expired',
      updatedAt: now
    });
  }

  // Create new subscription
  const newSub = {
    id: createId('sub'),
    ownerId,
    planId: newPlanId,
    billingCycle: 'monthly', // default
    maxProperties: newPlan.maxProperties,
    maxBeds: newPlan.maxBeds,
    maxStaff: newPlan.maxStaff,
    features: newPlan.features,
    status: 'active',
    startDate: now,
    endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
    createdAt: now,
    updatedAt: now,
    createdBy: ownerId,
    updatedBy: ownerId,
    isDeleted: false
  };
  db.insert(STORAGE_KEYS.SUBSCRIPTIONS, newSub);

  // Audit log
  db.insert(STORAGE_KEYS.AUDIT_LOGS, {
    id: createId('aud'),
    action: 'PLAN_UPGRADED_SELF_SERVE',
    actorId: ownerId,
    targetId: ownerId,
    details: `Owner self-upgraded to ${newPlan.name} plan`,
    createdAt: now,
    updatedAt: now,
    createdBy: ownerId,
    updatedBy: ownerId,
    isDeleted: false
  });
}

export function updateStatus(id: string, status: 'Active' | 'Pending' | 'Suspended') {
  const user = db.getAll<User>(STORAGE_KEYS.USERS).find(u => u.ownerId === id);
  if (user) {
// @ts-expect-error
    db.OwnerUpdate<User>(STORAGE_KEYS.USERS, user.id, { status });
    db.insert(STORAGE_KEYS.AUDIT_LOGS, {
      id: createId('aud'),
      action: 'OWNER_STATUS_CHANGED',
      actorId: 'superadmin',
      targetId: id,
      details: `Status changed to ${status}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'superadmin',
      updatedBy: 'superadmin',
      isDeleted: false
    });
  }
}

export function resetPassword(id: string, newPassword: string) {
  const user = db.getAll<User>(STORAGE_KEYS.USERS).find(u => u.ownerId === id);
  if (user) {
// @ts-expect-error
    db.OwnerUpdate<User>(STORAGE_KEYS.USERS, user.id, { password: newPassword, mustChangePassword: true });
    db.insert(STORAGE_KEYS.AUDIT_LOGS, {
      id: createId('aud'),
      action: 'PASSWORD_RESET',
      actorId: 'superadmin',
      targetId: id,
      details: 'SuperAdmin reset owner password',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'superadmin',
      updatedBy: 'superadmin',
      isDeleted: false
    });
  }
}

export function addInternalNote(id: string, note: string) {
  db.insert(STORAGE_KEYS.AUDIT_LOGS, {
    id: createId('aud'),
    action: 'INTERNAL_NOTE',
    actorId: 'superadmin',
    targetId: id,
    details: note,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'superadmin',
    updatedBy: 'superadmin',
    isDeleted: false
  });
}
