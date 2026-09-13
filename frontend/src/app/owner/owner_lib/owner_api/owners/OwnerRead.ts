
import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';

import type { User } from '@/lib/types/models';

export function listOwners() {
  const owners = db.getAll<any>(STORAGE_KEYS.OWNERS).filter(o => !o.isDeleted);
  const users = db.getAll<User>(STORAGE_KEYS.USERS);
  const subscriptions = db.getAll<any>(STORAGE_KEYS.SUBSCRIPTIONS);
      
  return owners.map(owner => {
    const user = users.find(u => u.ownerId === owner.id);
    const sub = subscriptions.find(s => s.ownerId === owner.id && s.status === 'active');
    
    const hasActivePlan = !!sub && sub.planId !== 'none';
    
    return {
      ...owner,
      status: hasActivePlan ? (user?.status || 'Active') : 'Inactive',
      lastLogin: user?.updatedAt, // simulated
      planId: sub?.planId || 'None',
      // Use real data later, for now 0 if no plan, otherwise simulated or 0
      propertiesCount: hasActivePlan ? (Math.floor(Math.random() * 3) + 1) : 0,
      bedsCount: hasActivePlan ? (Math.floor(Math.random() * 50) + 20) : 0,
      occupancy: hasActivePlan ? (Math.floor(Math.random() * 100)) : 0,
      collectionThisMonth: hasActivePlan ? (Math.floor(Math.random() * 50000)) : 0
    };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getOwner360(id: string) {
  const owner = db.getById<any>(STORAGE_KEYS.OWNERS, id);
  if (!owner) throw new Error('Owner not found');
  
  const user = db.getAll<User>(STORAGE_KEYS.USERS).find(u => u.ownerId === id);
  const sub = db.getAll<any>(STORAGE_KEYS.SUBSCRIPTIONS).find(s => s.ownerId === id);
  
  return {
    owner,
    user,
    subscription: sub,
    // Mock nested data
    properties: [
      { id: 'prop-1', name: 'Elite PG 1', city: owner.city, capacity: 50, occupied: 42, managers: 2 },
      { id: 'prop-2', name: 'Elite PG 2', city: owner.city, capacity: 100, occupied: 98, managers: 3 }
    ],
    managersCount: 5,
    studentsCount: 140,
    recentPayments: [
      { id: 'pay-1', date: new Date().toISOString(), amount: 4999, status: 'Success', mode: 'UPI' },
      { id: 'pay-2', date: new Date(Date.now() - 30*24*60*60*1000).toISOString(), amount: 4999, status: 'Success', mode: 'Card' }
    ],
    tickets: [
      { id: 'tkt-1', issue: 'App not loading on mobile', status: 'Resolved' },
      { id: 'tkt-2', issue: 'Feature request: Export PDF', status: 'Open' }
    ]
  };
}
