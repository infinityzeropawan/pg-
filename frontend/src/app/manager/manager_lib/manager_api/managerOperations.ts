// @ts-nocheck
// Backend-backed manager operations. Writes now persist to Postgres and are
// visible to every role/device, instead of being private to one browser.
import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { createId } from '@/lib/utils/id';
import { adminRequest } from '@/app/owner/owner_lib/owner_api/AdminClient';
import { financeApi } from '@/app/owner/owner_lib/owner_api/OwnerFinance';
import { businessDayKey } from '@/lib/utils/datetime';

/** Backend enum value for a UI-facing complaint status. */
function toComplaintStatus(status: string): string {
  switch (String(status || '').toLowerCase()) {
    case 'open': return 'OPEN';
    case 'in progress': return 'IN_PROGRESS';
    case 'resolved': return 'RESOLVED';
    case 'closed': return 'CLOSED';
    case 'rejected': return 'REJECTED';
    default: return 'OPEN';
  }
}

/** Maps a backend ComplaintStatus enum back to the label the UI renders. */
function fromComplaintStatus(status: string): string {
  switch (String(status || '').toUpperCase()) {
    case 'OPEN': return 'Open';
    case 'IN_PROGRESS': return 'In Progress';
    case 'RESOLVED': return 'Resolved';
    case 'CLOSED': return 'Closed';
    case 'REJECTED': return 'Rejected';
    default: return 'Open';
  }
}

export const managerOperationsApi = {
  // Visitors — served by GET /admin/visitors (owner-scoped VisitorLog rows).
  // Presence is derived from checkOutTime because the schema has no status column.
  async listVisitors(propertyId: string) {
    if (!propertyId) return [];
    const rows = await adminRequest<any[]>(`/visitors?propertyId=${encodeURIComponent(propertyId)}`);
    return (Array.isArray(rows) ? rows : []).map((v: any) => ({
      ...v,
      name: v.visitorName,
      phone: v.visitorPhone,
      status: v.checkOutTime ? 'checked_out' : 'checked_in',
      checkOutTime: v.checkOutTime || undefined,
    }));
  },

  /**
   * Only checkout is backed by the database (it sets checkOutTime). Approve,
   * reject and check-in were localStorage-only concepts with no schema
   * equivalent, so they raise instead of pretending to succeed.
   */
  async updateVisitorStatus(id: string, status: 'approved' | 'rejected' | 'checked_in' | 'checked_out', _managerId: string) {
    if (status !== 'checked_out') {
      throw new Error(`Visitor status "${status}" is not supported yet. Only checkout is available.`);
    }
    await adminRequest(`/visitors/${id}/checkout`, { method: 'PATCH' });
  },
            // Attendance (Students) — served by GET/POST /admin/attendance.
// listStudents returns a superset (flat fields + the legacy profile/user
// nesting) so every existing consumer keeps working.
                          listStudents: async (propertyId: string) => {
                                if (!propertyId) return [];
                const rows = await adminRequest<any[]>(`/tenants?propertyId=${encodeURIComponent(propertyId)}`);
                return (Array.isArray(rows) ? rows : []).map((t: any) => ({
                                  ...t,
                  profile: {
                    id: t.id,
                    userId: t.userId,
                    propertyId: t.propertyId,
                    status: String(t.status || 'ACTIVE').toLowerCase(),
                    rentAmount: t.monthlyRent || 0,
                    depositAmount: t.securityDeposit || 0,
                    duesAmount: t.duesAmount || 0,
                    roomId: null,
                    roomNumber: t.roomNumber,
                  },
                  user: { id: t.userId, name: t.name, phone: t.phone, email: t.email },
                                    roomNumber: t.roomNumber,
                }));
                },
                      listStudentAttendanceToday: async (propertyId: string) => {
                                            if (!propertyId) return [];
                    const today = businessDayKey();
                    const rows = await adminRequest<any[]>(`/attendance?propertyId=${encodeURIComponent(propertyId)}&date=${today}`);
                    return (Array.isArray(rows) ? rows : []).map((a: any) => ({
                      ...a,
                      studentId: a.userId,
                      date: typeof a.date === 'string' ? a.date.split('T')[0] : a.date,
                      status: String(a.status || '').toUpperCase() === 'PRESENT' ? 'Present'
                        : String(a.status || '').toUpperCase() === 'ON_LEAVE' ? 'On Leave' : 'Absent',
                    }));
                    },
                markStudentAttendance: async (studentId: string, propertyId: string, status: 'Present' | 'Absent' | 'On Leave', _managerId: string) => {
                                            const mapped = status === 'Present' ? 'PRESENT' : status === 'On Leave' ? 'ON_LEAVE' : 'ABSENT';
                                            await adminRequest('/attendance', {
                                                method: 'POST',
                                                body: JSON.stringify({
                                                    propertyId,
                                                    userId: studentId,
                                                    date: new Date().toISOString(),
                                                    status: mapped,
                                                }),
                                            });
                      },
                // Gate Logs — served by GET /admin/gate-logs (persisted rows).
                    listGateLogs: async (propertyId: string) => {
                      if (!propertyId) return [];
                      const logs = await adminRequest<any[]>(`/properties/${encodeURIComponent(propertyId)}/gate-logs`);
                      return (Array.isArray(logs) ? logs : []).sort((a, b) =>
                        new Date(b.timestamp || b.createdAt || 0).getTime() - new Date(a.timestamp || a.createdAt || 0).getTime());
          },
              addGateLog: (data: { propertyId: string, studentId: string, type: 'entry' | 'exit', isLate: boolean, reason?: string, destination?: string, expectedReturnTime?: string, managerId: string }) => {
                        const students = db.getAll<any>(STORAGE_KEYS.STUDENTS);
                        const users = db.getAll<any>(STORAGE_KEYS.USERS);
                        const rooms = db.getAll<any>(STORAGE_KEYS.ROOMS);
                        const student = students.find(s => s.id === data.studentId || s.userId === data.studentId);
                        const user = users.find(u => u.id === (student?.userId || data.studentId));
                        const room = rooms.find(r => r.id === student?.roomId);

                        db.insert(STORAGE_KEYS.GATE_LOGS, {
                              id: createId('gat'),
                              ...data,
                              studentName: user?.name || 'Resident',
                              roomNumber: room?.number || student?.roomNumber || '',
                              reason: data.reason || (data.type === 'entry' ? 'Returned to PG' : 'General Outing'),
                              timestamp: new Date().toISOString(),
                              createdAt: new Date().toISOString(), 
                              updatedAt: new Date().toISOString(), 
                              createdBy: data.managerId, 
                              updatedBy: data.managerId, 
                              isDeleted: false
                            });
                   },
            // Broadcasts
              listBroadcasts: (propertyId: string) => {
                        return db.getAll<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.BROADCASTS).filter(b => b.propertyId === propertyId && !b.isDeleted).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              },
                  createBroadcast: (data: { propertyId: string, title: string, message: string, audience: 'all' | 'floor' | 'defaulters', targetFloor?: string, managerId: string }) => {
                            db.insert(STORAGE_KEYS.BROADCASTS, {
                              id: createId('brd'),
                                                      ...data,
                              createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: ((data as Record<string, unknown>).managerId as string | undefined) as string | undefined as string | undefined, updatedBy: ((data as Record<string, unknown>).managerId as string | undefined) as string | undefined as string | undefined, isDeleted: false
                            });
                  },
        // Documents
                listDocuments: (propertyId: string) => {
                            return db.getAll<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.DOCUMENTS).filter(d => d.propertyId === propertyId && !d.isDeleted).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                },
                // Inventory
        listInventory: (propertyId: string) => {
                return db.getAll<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.INVENTORY).filter(i => i.propertyId === propertyId && !i.isDeleted);
              },
                updateInventory: (id: string, qtyDelta: number, managerId: string) => {
                            const item = db.getById<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.INVENTORY, id);
                if (item) {
                                                      db.update<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.INVENTORY, id, { 
                                quantity: Math.max(0, (item.quantity as number) + qtyDelta),
                                                                updatedAt: new Date().toISOString(),
                                                                        updatedBy: managerId
                                          });
                }
                    },
                  addInventoryItem: (data: { propertyId: string, name: string, quantity: number, threshold: number, category: string, managerId: string }) => {
                    db.insert(STORAGE_KEYS.INVENTORY, {
                                          id: createId('inv'),
                        ...data,
                                                createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: ((data as Record<string, unknown>).managerId as string | undefined) as string | undefined as string | undefined, updatedBy: ((data as Record<string, unknown>).managerId as string | undefined) as string | undefined as string | undefined, isDeleted: false
            });
                    },
              // Complaints — served by GET/PATCH /admin/complaints (persisted rows).
                async listComplaints(propertyId: string) {
                                    if (!propertyId) return [];
                    const rows = await adminRequest<any[]>(`/complaints?propertyId=${encodeURIComponent(propertyId)}`);
                    return (Array.isArray(rows) ? rows : []).map((c: any) => ({
                          ...c,
                          category: String(c.category || 'GENERAL').toLowerCase(),
                          status: fromComplaintStatus(c.status),
                          priority: String(c.priority || 'MEDIUM').toUpperCase(),
                          roomNumber: c.roomNumber || '',
                    }));
                  },
                  async updateComplaintStatus(id: string, status: string, _managerId: string) {
                    await adminRequest(`/complaints/${id}/status`, {
                        method: 'PATCH',
                        body: JSON.stringify({ status: toComplaintStatus(status) }),
                    });
          },
                      async resolveComplaintWithCost(id: string, cost: number, notes: string, managerId: string) {
                    await adminRequest(`/complaints/${id}/status`, {
                        method: 'PATCH',
                        body: JSON.stringify({ status: 'RESOLVED' }),
                    });
                    // The repair cost is persisted as a real Expense row so it
                    // flows into the owner's expense totals.
                    if (cost > 0) {
                        const complaint = await adminRequest<any[]>(`/complaints`).then(
                            (rows: any[]) => (Array.isArray(rows) ? rows : []).find((c: any) => c.id === id)
                        );
                        if (complaint) {
                                                      await financeApi.createExpense({
                                                                propertyId: complaint.propertyId,
                                                                                        category: 'maintenance',
                                                        amount: cost,
                                                                        description: `Maintenance: ${complaint.title || complaint.category}${notes ? ' - ' + notes : ''}`
                                          }, managerId);
                                    }
                            }
          },
                      resolveComplaintWithCost: (id: string, cost: number, notes: string, managerId: string) => {
                    const complaint = db.getById<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.COMPLAINTS, id);
                                if (!complaint) return;
                            db.update<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.COMPLAINTS, id, { 
                                          status: 'Resolved', 
                                                                        repairCost: cost, 
                                                      resolutionNotes: notes, 
                                          resolvedAt: new Date().toISOString(),
                                                updatedAt: new Date().toISOString(), 
                                    updatedBy: managerId as string | undefined 
                            });
                            if (cost > 0) {
                                                      financeApi.createExpense({
                                                                                propertyId: complaint.propertyId,
                                                                                        category: 'maintenance',
                                                        amount: cost,
                                                                        description: `Maintenance: ${complaint.title || complaint.category} (Room ${complaint.roomNumber || 'N/A'})${notes ? ' - ' + notes : ''}`
                                          }, managerId);
                                    }
          },
          /**
           * No backend endpoint exists for assigning complaints yet, so this raises
           * instead of writing to localStorage and reporting success.
           */
          assignComplaint: (id: string, staffId: string, managerId: string) => {
                            throw new Error('Assigning complaints is not supported yet.');
                }
};