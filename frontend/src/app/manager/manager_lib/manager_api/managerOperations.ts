// @ts-nocheck
import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { createId } from '@/lib/utils/id';
import { financeApi } from '@/app/owner/owner_lib/owner_api/OwnerFinance';

import type { BaseEntity } from '@/lib/storage/db';
export const managerOperationsApi = {
  // Visitors
  listVisitors: (propertyId: string) => {
    if (!propertyId) return [];
    return db.getAll<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.VISITORS || 'spg_visitors').filter(v => v.propertyId === propertyId && !v.isDeleted).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
                  updateVisitorStatus: (id: string, status: 'approved' | 'rejected' | 'checked_in' | 'checked_out', managerId: string) => {
                                const data: unknown = { status, updatedBy: managerId as string | undefined as string | undefined, updatedAt: new Date().toISOString() };
    if (status === 'checked_in') (data as Record<string, unknown>).checkInTime = new Date().toISOString();
    if (status === 'checked_out') (data as Record<string, unknown>).checkOutTime = new Date().toISOString();
    db.update<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.VISITORS, id, data);
                  },
            // Attendance (Students)
                          listStudents: (propertyId: string) => {
                                if (!propertyId) return [];
                                type StudentEntity = BaseEntity & { propertyId: string; isDeleted: boolean; status: string; userId: string; roomId: string; duesAmount: number; pgScore: number; rentAmount: number };
                                const profiles = db.getAll<StudentEntity>(STORAGE_KEYS.STUDENTS).filter(s => s.propertyId === propertyId && s.status === 'active' && !s.isDeleted);
                                            const users = db.getAll<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.USERS);
                                const rooms = db.getAll<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.ROOMS);
                                        return profiles.map(p => {
                                          const user = users.find(u => u.id === p.userId);
                                    const room = rooms.find(r => r.id === p.roomId);
                                                      return { profile: p, user: { id: user?.id || '', name: (user?.name as string) || 'Unknown', phone: (user?.phone as string) || '', email: (user?.email as string) || '' }, roomNumber: (room?.number as string) || (room?.roomNumber as string) || '' };
                                    });
                },
                      listStudentAttendanceToday: (propertyId: string) => {
                                            const today = new Date().toISOString().split('T')[0];
                    return db.getAll<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>('spg_student_attendance').filter(a => a.propertyId === propertyId && a.date === today && !a.isDeleted);
                    },
                markStudentAttendance: (studentId: string, propertyId: string, status: 'Present' | 'Absent' | 'On Leave', managerId: string) => {
                                            const today = new Date().toISOString().split('T')[0];
                                    const existing = db.getAll<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>('spg_student_attendance').find(a => a.studentId === studentId && a.date === today && !a.isDeleted);
                                        if (existing) {
                        db.update<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>('spg_student_attendance', existing.id, { status, updatedBy: managerId as string | undefined as string | undefined, updatedAt: new Date().toISOString() });
                                } else {
                                                                  db.insert('spg_student_attendance', {
                                                                        id: createId('att'), studentId, propertyId, date: today, status,
                                                        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: managerId as string | undefined as string | undefined, updatedBy: managerId as string | undefined as string | undefined, isDeleted: false
                                                      });
                                            }
                      },
                // Gate Logs
                    listGateLogs: (propertyId: string) => {
                      const logs = db.getAll<BaseEntity & { propertyId?: string; studentId?: string; studentName?: string; roomNumber?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.GATE_LOGS).filter(g => g.propertyId === propertyId && !g.isDeleted);
                      const students = db.getAll<any>(STORAGE_KEYS.STUDENTS);
                      const users = db.getAll<any>(STORAGE_KEYS.USERS);
                      const rooms = db.getAll<any>(STORAGE_KEYS.ROOMS);

                      const enriched = logs.map(log => {
                        if (log.studentName && log.roomNumber) return log;
                        const student = students.find(s => s.id === log.studentId || s.userId === log.studentId);
                        const user = users.find(u => u.id === (student?.userId || log.studentId));
                        const room = rooms.find(r => r.id === student?.roomId);
                        return {
                          ...log,
                          studentName: log.studentName || user?.name || 'Resident',
                          roomNumber: log.roomNumber || room?.number || student?.roomNumber || 'N/A'
                        };
                      });

                      return enriched.sort((a,b) => new Date((b.timestamp || b.createdAt) as string).getTime() - new Date((a.timestamp || a.createdAt) as string).getTime());
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
              // Complaints
                listComplaints: (propertyId: string) => {
                                    return db.getAll<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.COMPLAINTS).filter(c => c.propertyId === propertyId && !c.isDeleted).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                  },
                  updateComplaintStatus: (id: string, status: string, managerId: string) => {
                            db.update<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.COMPLAINTS, id, { status, updatedAt: new Date().toISOString(), updatedBy: managerId as string | undefined });
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
          assignComplaint: (id: string, staffId: string, managerId: string) => {
                            db.update<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.COMPLAINTS, id, { assignedTo: staffId, updatedAt: new Date().toISOString(), updatedBy: managerId as string | undefined });
                }
};