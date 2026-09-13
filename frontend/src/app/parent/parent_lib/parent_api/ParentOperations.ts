import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';

export const parentOperationsApi = {
  getLinkedChild: (parentId: string) => {
    const parents = db.getAll<any>(STORAGE_KEYS.PARENTS);
    const p = parents.find(x => x.userId === parentId);
    if (!p) return null;

    const students = db.getAll<any>(STORAGE_KEYS.STUDENTS);
    let child = students.find(t => t.parentEmail === p.email || t.parentId === p.id);
    if (!child) {
      child = students[0];
    }
    
    if (child) {
      const users = db.getAll<any>(STORAGE_KEYS.USERS);
      const user = users.find(u => u.id === child.userId);
      const rooms = db.getAll<any>(STORAGE_KEYS.ROOMS);
      const room = rooms.find(r => r.id === child.roomId);
      const properties = db.getAll<any>(STORAGE_KEYS.PROPERTIES);
      const prop = properties.find(pr => pr.id === child.propertyId);

      return {
        ...child,
        name: child.name || user?.name || 'Student',
        propertyName: prop?.name || 'Sunshine PG',
        roomNumber: room?.number || child.roomNumber || '101'
      };
    }
    return null;
  },

  getChildGateLogs: (studentId: string) => {
    const logs = db.getAll<any>(STORAGE_KEYS.GATE_LOGS).filter(l => l.studentId === studentId && !l.isDeleted);
    return logs.sort((a,b) => new Date((b.timestamp || b.createdAt) as string).getTime() - new Date((a.timestamp || a.createdAt) as string).getTime());
  },

  getChildAlerts: (studentId: string) => {
    const alerts: any[] = [];
    
    // Check SOS
    const sos = db.getAll<any>('spg_sos').filter(s => s.studentId === studentId && s.status === 'active' && !s.isDeleted);
    sos.forEach(s => alerts.push({ id: s.id, type: 'sos', title: '🚨 Emergency SOS Triggered', date: s.createdAt, severity: 'high' }));

    // Check Late Entries
    const late = db.getAll<any>(STORAGE_KEYS.GATE_LOGS).filter(l => l.studentId === studentId && l.isLate && !l.isDeleted);
    late.forEach(l => alerts.push({ 
      id: l.id, 
      type: 'late', 
      title: `⚠️ Late Curfew Entry (${l.reason || 'Returned late'})`, 
      date: l.timestamp || l.createdAt, 
      severity: 'medium' 
    }));

    // Check Recent Gate Movements (Last 3)
    const recentLogs = db.getAll<any>(STORAGE_KEYS.GATE_LOGS)
      .filter(l => l.studentId === studentId && !l.isDeleted)
      .sort((a,b) => new Date((b.timestamp || b.createdAt) as string).getTime() - new Date((a.timestamp || a.createdAt) as string).getTime())
      .slice(0, 3);

    recentLogs.forEach(l => {
      alerts.push({
        id: `gate_${l.id}`,
        type: 'gate',
        title: l.type === 'exit' 
          ? `🔴 Checked Out for ${l.reason || 'Outing'}${l.expectedReturnTime ? ` (Return by ${l.expectedReturnTime})` : ''}`
          : `🟢 Checked In at PG (${l.reason || 'Returned'})`,
        date: l.timestamp || l.createdAt,
        severity: 'info'
      });
    });

    // Check Dues
    const invoices = db.getAll<any>(STORAGE_KEYS.INVOICES).filter(i => i.studentId === studentId && i.status !== 'Paid' && !i.isDeleted);
    invoices.forEach(i => alerts.push({ id: i.id, type: 'due', title: `Rent Due: ₹${i.amount}`, date: i.dueDate, severity: 'low' }));

    return alerts.sort((a,b) => new Date((b.date || b.createdAt) as string).getTime() - new Date((a.date || a.createdAt) as string).getTime());
  },

  getChildInvoices: (studentId: string) => {
    return db.getAll<any>(STORAGE_KEYS.INVOICES).filter(i => i.studentId === studentId && !i.isDeleted).sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  },

  getChildComplaints: (studentId: string) => {
    return db.getAll<any>(STORAGE_KEYS.COMPLAINTS).filter(c => c.studentId === studentId && !c.isDeleted).sort((a,b) => new Date((b as any).createdAt).getTime() - new Date((a as any).createdAt).getTime());
  },

  getWalletBalance: (studentId: string) => {
    const w = db.getAll<any>('spg_wallets').find(w => w.studentId === studentId);
    return w ? w.balance : 0;
  }
};
