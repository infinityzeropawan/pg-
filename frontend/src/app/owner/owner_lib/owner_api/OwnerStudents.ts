import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';

export const studentsApi = {
  listByOwner: (ownerId: string) => {
    // Get student profiles from spg_students
    const studentProfiles = db.getAll<any>(STORAGE_KEYS.STUDENTS);
    // Get all users to merge name/phone/email etc
    const users = db.getAll<any>(STORAGE_KEYS.USERS);
    // Get properties for this owner
    const ownerProps = db.getAll<any>(STORAGE_KEYS.PROPERTIES)
      .filter((p: any) => p.ownerId === ownerId)
      .map((p: any) => p.id);
    
    if (ownerProps.length === 0) {
      // Fallback: read from users directly
      return users
        .filter((u: any) => u.role === 'student' && u.ownerId === ownerId && !u.isDeleted)
        .map((u: any) => ({
          user: u,
          profile: {
            id: u.id,
            propertyId: u.propertyId,
            status: u.status === 'Active' ? 'active' : (u.status?.toLowerCase() || 'active'),
            duesAmount: u.duesAmount || 0,
            rentAmount: u.rentAmount || 8000,
            depositAmount: u.depositAmount || 10000,
            bedId: u.bedId || null,
            roomId: u.roomId || null,
            pgScore: u.pgScore || 75,
            moveInDate: u.createdAt?.slice(0,10) || null,
            userId: u.id,
            walletBalance: u.walletBalance || 0,
            createdAt: u.createdAt || new Date().toISOString(),
            updatedAt: u.updatedAt || new Date().toISOString(),
          }
        }));
    }

    return studentProfiles
      .filter((s: any) => ownerProps.includes(s.propertyId) && !s.isDeleted)
      .map((profile: any) => {
        const user = users.find((u: any) => u.id === profile.userId || u.id === profile.id) || {};
        return {
          user: { ...user, id: profile.userId || profile.id },
          profile: {
            id: profile.id,
            propertyId: profile.propertyId,
            status: profile.status || 'active',
            duesAmount: profile.duesAmount || 0,
            rentAmount: profile.rentAmount || 8000,
            depositAmount: profile.depositAmount || 10000,
            bedId: profile.bedId || null,
            roomId: profile.roomId || null,
            pgScore: profile.pgScore || 75,
            moveInDate: profile.moveInDate || profile.createdAt?.slice(0,10) || null,
            userId: profile.userId || profile.id,
            walletBalance: profile.walletBalance || 0,
            createdAt: profile.createdAt || new Date().toISOString(),
            updatedAt: profile.updatedAt || new Date().toISOString(),
          }
        };
      });
  },

  getById: (id: string) => {
    const profile = db.getById<any>(STORAGE_KEYS.STUDENTS, id);
    const user = db.getById<any>(STORAGE_KEYS.USERS, profile?.userId || id) || {};
    return {
      profile: profile || {},
      user,
      documents: []
    };
  },

  seedMocksIfEmpty: (_ownerId: string) => {},

  markNotice: (id: string, _ownerId: string) => {
    const profiles = db.getAll<any>(STORAGE_KEYS.STUDENTS);
    const idx = profiles.findIndex((s: any) => s.id === id);
    if (idx !== -1) {
      profiles[idx].status = 'on_notice';
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(profiles));
    }
  },

  checkout: (id: string, _ownerId: string) => {
    const profiles = db.getAll<any>(STORAGE_KEYS.STUDENTS);
    const idx = profiles.findIndex((s: any) => s.id === id);
    if (idx !== -1) {
      profiles[idx].status = 'checked_out';
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(profiles));
    }
    // Also free the bed
    const beds = db.getAll<any>(STORAGE_KEYS.BEDS);
    const profile = profiles[idx];
    if (profile?.bedId) {
      const bidx = beds.findIndex((b: any) => b.id === profile.bedId);
      if (bidx !== -1) {
        beds[bidx].status = 'Vacant';
        beds[bidx].studentId = null;
        localStorage.setItem(STORAGE_KEYS.BEDS, JSON.stringify(beds));
      }
    }
  }
};
