import { prisma } from '../../db';
import { StayStatus, SOSStatus, InvoiceStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

export class ParentService {
  /**
   * Resolve the linked student(s) for a given parent user ID.
   * Parents are linked to students via ParentProfile -> TenantProfile.parentProfileId
   */
  private static async getLinkedStudent(parentUserId: string) {
    // Find the parent's profile
    const parentProfile = await prisma.parentProfile.findUnique({
      where: { userId: parentUserId },
    });
    if (!parentProfile) return null;

    // Find the tenant profile linked to this parent
    const tenantProfile = await prisma.tenantProfile.findFirst({
      where: { parentProfileId: parentProfile.id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,
            role: true,
            isActive: true,
            isSuspended: true,
          },
        },
      },
    });
    return { parentProfile, tenantProfile };
  }

  // ============================================================
  // DASHBOARD
  // ============================================================

  static async getDashboard(parentUserId: string) {
    const parentUser = await prisma.user.findUnique({
      where: { id: parentUserId },
      select: { id: true, fullName: true, email: true, phone: true, avatarUrl: true },
    });

    const linked = await ParentService.getLinkedStudent(parentUserId);
    const tenantProfile = linked?.tenantProfile;
    const parentProfile = linked?.parentProfile;

    if (!tenantProfile) {
      return {
        parent: { ...parentUser, parentProfile },
        student: null,
        stay: null,
        property: null,
        room: null,
        bed: null,
        presence: null,
        lastGateEvent: null,
        unpaidInvoicesCount: 0,
        totalDue: 0,
      };
    }

    const studentUser = tenantProfile.user;

    // Get active stay
    const activeStay = await prisma.tenantStay.findFirst({
      where: {
        tenantId: tenantProfile.id,
        status: { in: [StayStatus.ACTIVE, StayStatus.CHECKED_IN, StayStatus.NOTICE_PERIOD] },
      },
      include: {
        property: true,
        bed: { include: { room: { include: { floor: true } } } },
      },
    });

    // Determine live presence from latest gate log
    const lastGateEvent = studentUser
      ? await prisma.gateLog.findFirst({
          where: { userId: studentUser.id },
          orderBy: { createdAt: 'desc' },
        })
      : null;
    const presence = lastGateEvent?.type === 'EXIT' ? 'OUTSIDE' : 'INSIDE';

    // Finance summary
    const stays = await prisma.tenantStay.findMany({ where: { tenantId: tenantProfile.id } });
    const stayIds = stays.map(s => s.id);
    const unpaidInvoices = stayIds.length
      ? await prisma.invoice.findMany({
          where: { stayId: { in: stayIds }, status: { notIn: [InvoiceStatus.PAID, InvoiceStatus.CANCELLED] } },
        })
      : [];
    const totalDue = unpaidInvoices.reduce((sum, i) => sum + (i.totalAmount - i.paidAmount), 0);

    // Recent SOS alerts
    const activeSOS = studentUser
      ? await prisma.sOSAlert.findMany({
          where: { userId: studentUser.id, status: SOSStatus.TRIGGERED },
          orderBy: { createdAt: 'desc' },
          take: 3,
        })
      : [];

    return {
      parent: { ...parentUser, parentProfile },
      student: {
        id: studentUser?.id,
        fullName: studentUser?.fullName,
        email: studentUser?.email,
        phone: studentUser?.phone,
        avatarUrl: studentUser?.avatarUrl,
        tenantProfileId: tenantProfile.id,
        collegeOrCompany: tenantProfile.collegeOrCompany,
        emergencyContactName: tenantProfile.emergencyContactName,
        emergencyContactPhone: tenantProfile.emergencyContactPhone,
      },
      stay: activeStay ? {
        id: activeStay.id,
        status: activeStay.status,
        startDate: activeStay.startDate,
        expectedEndDate: activeStay.expectedEndDate,
        monthlyRent: activeStay.monthlyRent,
        securityDeposit: activeStay.securityDeposit,
      } : null,
      property: activeStay?.property || null,
      room: activeStay?.bed?.room || null,
      floor: activeStay?.bed?.room?.floor || null,
      bed: activeStay?.bed ? {
        id: activeStay.bed.id,
        bedNumber: activeStay.bed.bedNumber,
        status: activeStay.bed.status,
      } : null,
      presence,
      lastGateEvent,
      unpaidInvoicesCount: unpaidInvoices.length,
      totalDue,
      activeSOS,
    };
  }

  // ============================================================
  // PROFILE
  // ============================================================

  static async getProfile(parentUserId: string) {
    const parentUser = await prisma.user.findUnique({
      where: { id: parentUserId },
      select: { id: true, fullName: true, email: true, phone: true, avatarUrl: true },
    });

    const parentProfile = await prisma.parentProfile.findUnique({
      where: { userId: parentUserId },
      include: {
        tenants: { include: { user: { select: { fullName: true, email: true, phone: true } } } },
      },
    });

    return { user: parentUser, profile: parentProfile };
  }

  static async updateProfile(parentUserId: string, data: { relation?: string; address?: string }) {
    const parentProfile = await prisma.parentProfile.findUnique({ where: { userId: parentUserId } });
    if (!parentProfile) throw new Error('Parent profile not found');

    return prisma.parentProfile.update({
      where: { id: parentProfile.id },
      data: {
        relation: data.relation,
        address: data.address,
      },
    });
  }

  // ============================================================
  // GATE LOGS (Child's Movement)
  // ============================================================

  static async getGateLogs(parentUserId: string) {
    const linked = await ParentService.getLinkedStudent(parentUserId);
    if (!linked?.tenantProfile?.user) return [];

    return prisma.gateLog.findMany({
      where: { userId: linked.tenantProfile.user.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  // ============================================================
  // FINANCE — CHILD'S INVOICES & PAYMENTS
  // ============================================================

  static async getInvoices(parentUserId: string) {
    const linked = await ParentService.getLinkedStudent(parentUserId);
    if (!linked?.tenantProfile) return [];

    const stays = await prisma.tenantStay.findMany({ where: { tenantId: linked.tenantProfile.id } });
    if (stays.length === 0) return [];

    return prisma.invoice.findMany({
      where: { stayId: { in: stays.map(s => s.id) } },
      include: { items: true, payments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async payInvoiceForChild(parentUserId: string, invoiceId: string, paymentMethod: string) {
    const linked = await ParentService.getLinkedStudent(parentUserId);
    if (!linked?.tenantProfile) throw new Error('No linked student found');

    const inv = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { stay: true } });
    if (!inv) throw new Error('Invoice not found');
    if (inv.stay?.tenantId !== linked.tenantProfile.id) throw new Error('Forbidden: Invoice does not belong to linked student');
    if (inv.status === InvoiceStatus.PAID) throw new Error('Invoice is already paid');
    if (inv.status === InvoiceStatus.CANCELLED) throw new Error('Invoice is cancelled');

    const methodMap: Record<string, PaymentMethod> = {
      UPI: PaymentMethod.UPI,
      CASH: PaymentMethod.CASH,
      BANK_TRANSFER: PaymentMethod.BANK_TRANSFER,
      CARD: PaymentMethod.CARD,
      RAZORPAY: PaymentMethod.RAZORPAY,
      CASHFREE: PaymentMethod.CASHFREE,
    };
    const method = methodMap[(paymentMethod || 'UPI').toUpperCase()] || PaymentMethod.UPI;
    const amountDue = inv.totalAmount - inv.paidAmount;
    const transactionRef = `TXN-PARENT-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const idempotencyKey = `IDEM-PARENT-${invoiceId}-${Date.now()}`;

    const [updatedInvoice, payment] = await prisma.$transaction([
      prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: InvoiceStatus.PAID, paidAmount: inv.totalAmount, updatedAt: new Date() },
      }),
      prisma.payment.create({
        data: {
          ownerId: inv.ownerId,
          invoiceId: inv.id,
          amount: amountDue,
          status: PaymentStatus.COMPLETED,
          method,
          transactionRef,
          idempotencyKey,
          paidAt: new Date(),
        },
      }),
    ]);

    return { invoice: updatedInvoice, payment };
  }

  // ============================================================
  // COMPLAINTS — CHILD'S COMPLAINTS
  // ============================================================

  static async getComplaints(parentUserId: string) {
    const linked = await ParentService.getLinkedStudent(parentUserId);
    if (!linked?.tenantProfile) return [];

    const stay = await prisma.tenantStay.findFirst({
      where: { tenantId: linked.tenantProfile.id },
      orderBy: { createdAt: 'desc' },
    });
    if (!stay) return [];

    return prisma.complaint.findMany({
      where: { propertyId: stay.propertyId, ownerId: stay.ownerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ============================================================
  // ALERTS — SAFETY & NOTIFICATIONS
  // ============================================================

  static async getAlerts(parentUserId: string) {
    const linked = await ParentService.getLinkedStudent(parentUserId);
    if (!linked?.tenantProfile?.user) return [];

    const studentUserId = linked.tenantProfile.user.id;

    const stays = await prisma.tenantStay.findMany({ where: { tenantId: linked.tenantProfile.id } });
    const stayIds = stays.map(s => s.id);

    // Fetch all alert sources in parallel
    const [sosAlerts, lateGateLogs, allGateLogs, unpaidInvoices, notifications] = await Promise.all([
      prisma.sOSAlert.findMany({
        where: { userId: studentUserId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.gateLog.findMany({
        where: { userId: studentUserId, isLate: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.gateLog.findMany({
        where: { userId: studentUserId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      stayIds.length
        ? prisma.invoice.findMany({
            where: { stayId: { in: stayIds }, status: { notIn: [InvoiceStatus.PAID, InvoiceStatus.CANCELLED] } },
            orderBy: { dueDate: 'asc' },
          })
        : Promise.resolve([]),
      prisma.notificationLog.findMany({
        where: { userId: studentUserId },
        orderBy: { sentAt: 'desc' },
        take: 20,
      }),
    ]);

    const alerts: any[] = [];

    // SOS alerts — highest priority
    sosAlerts.forEach(s => alerts.push({
      id: s.id,
      type: 'sos',
      title: '🚨 Emergency SOS Triggered',
      description: `Your child triggered an emergency SOS alert. Status: ${s.status}`,
      date: s.createdAt,
      severity: 'high',
    }));

    // Late gate entries — medium priority
    lateGateLogs.forEach(l => alerts.push({
      id: `late_${l.id}`,
      type: 'late',
      title: `⚠️ Late Curfew Entry`,
      description: `Checked in late after 10 PM curfew. ${l.reason ? `Reason: ${l.reason}` : ''}`,
      date: l.timestamp || l.createdAt,
      severity: 'medium',
    }));

    // Recent gate movements — informational
    allGateLogs.forEach(l => {
      const isEntry = (l.type || '').toUpperCase() === 'ENTRY';
      alerts.push({
        id: `gate_${l.id}`,
        type: 'gate',
        title: isEntry
          ? `🟢 Checked In at PG`
          : `🔴 Left PG Campus`,
        description: `${l.reason || 'General movement'}${l.destination ? ` — ${l.destination}` : ''}${l.expectedReturnTime ? ` (Return by: ${l.expectedReturnTime})` : ''}`,
        date: l.timestamp || l.createdAt,
        severity: 'info',
      });
    });

    // Unpaid rent dues — low priority
    unpaidInvoices.forEach(i => alerts.push({
      id: `due_${i.id}`,
      type: 'due',
      title: `💰 Rent Due: ₹${Math.round((i.totalAmount - i.paidAmount) / 100).toLocaleString('en-IN')}`,
      description: `Invoice ${i.invoiceNumber} is ${i.status}. Due date: ${new Date(i.dueDate).toLocaleDateString('en-IN')}`,
      date: i.dueDate,
      severity: 'low',
    }));

    // System notifications from the student's notification log
    notifications.forEach(n => {
      if (!sosAlerts.find(s => n.message.includes(s.id))) {
        alerts.push({
          id: `notif_${n.id}`,
          type: 'notification',
          title: n.title,
          description: n.message,
          date: n.sentAt,
          severity: 'info',
        });
      }
    });

    return alerts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  static async getNotifications(parentUserId: string) {
    return prisma.notificationLog.findMany({
      where: { userId: parentUserId },
      orderBy: { sentAt: 'desc' },
      take: 50,
    });
  }
}
