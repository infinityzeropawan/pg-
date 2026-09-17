import { prisma } from '../../db';
import { StayStatus, SOSStatus, BedStatus, InvoiceStatus, PaymentMethod, PaymentStatus, ComplaintStatus, AttendanceStatus } from '@prisma/client';
import { extractGateToken, verifyGateToken } from '../../utils/gateQr';
import {
  BUSINESS_TZ_OFFSET_MINUTES,
  DUPLICATE_GATE_LOG_WINDOW_MS,
  attendanceDate,
  dayKey,
  isLateEntry,
  monthRangeUtc,
} from '../../utils/datetime';

export class StudentService {
  /**
   * Writes a real NotificationLog row for the parent account linked to a student's
   * TenantProfile (`TenantProfile.parentProfileId`). This backs the "Parent Alert"
   * indicators shown on the student's Gate Attendance screen and makes
   * `GET /api/v1/parent/notifications` return genuine, persisted records instead of
   * always being empty.
   *
   * Never throws — a notification failure must not fail the student's action.
   * Returns the number of parents notified.
   */
  static async notifyLinkedParents(
    tenantProfileId: string | null | undefined,
    payload: { type: string; title: string; message: string }
  ): Promise<number> {
    if (!tenantProfileId) return 0;
    try {
      const tenantProfile = await prisma.tenantProfile.findUnique({
        where: { id: tenantProfileId },
        include: { parentProfile: { select: { userId: true } } },
      });
      const parentUserId = tenantProfile?.parentProfile?.userId;
      if (!parentUserId) return 0;

      await prisma.notificationLog.create({
        data: {
          userId: parentUserId,
          type: payload.type,
          title: payload.title,
          message: payload.message,
          isRead: false,
        },
      });
      return 1;
    } catch (error) {
      console.error('[StudentService.notifyLinkedParents] Failed to notify parent:', error);
      return 0;
    }
  }

  // ============================================================
  // PROFILE & ROOM
  // ============================================================

  static async getProfile(userId: string) {
    const student = await prisma.user.findUnique({
      where: { id: userId },
      include: { tenantProfile: true },
    });
    if (!student) throw new Error('Student not found');

    const activeStay = await prisma.tenantStay.findFirst({
      where: {
        tenantId: student.tenantProfile?.id,
        status: { in: [StayStatus.ACTIVE, StayStatus.CHECKED_IN, StayStatus.NOTICE_PERIOD] },
      },
      include: {
        property: true,
        bed: { include: { room: { include: { floor: true } } } },
      },
    });

    // Get roommates (other tenants in same room, active)
    let roommates: any[] = [];
    if (activeStay?.bed?.roomId) {
      const bedsInRoom = await prisma.bed.findMany({
        where: { roomId: activeStay.bed.roomId, id: { not: activeStay.bedId } },
        include: {
          stays: {
            where: { status: { in: [StayStatus.ACTIVE, StayStatus.CHECKED_IN] } },
            include: { tenant: { include: { user: { select: { fullName: true, phone: true } } } } },
          },
        },
      });
      roommates = bedsInRoom
        .flatMap(b => b.stays)
        .map(s => ({
          name: s.tenant?.user?.fullName || 'Roommate',
          phone: s.tenant?.user?.phone || '',
          bedNumber: bedsInRoom.find(b => b.stays.some(st => st.id === s.id))?.bedNumber || '',
        }));
    }

    // Get security deposit info
    const deposit = activeStay
      ? await prisma.securityDeposit.findFirst({ where: { stayId: activeStay.id } })
      : null;

    // Get police verification
    const policeVerification = student.tenantProfile
      ? await prisma.policeVerification.findUnique({ where: { tenantId: student.tenantProfile.id } })
      : null;

    // Outstanding dues across ALL of the student's stays (real invoice data)
    const allStays = student.tenantProfile
      ? await prisma.tenantStay.findMany({
          where: { tenantId: student.tenantProfile.id },
          select: { id: true },
        })
      : [];
    const allStayIds = allStays.map(s => s.id);
    const unpaidInvoices = allStayIds.length
      ? await prisma.invoice.findMany({
          where: {
            stayId: { in: allStayIds },
            status: { notIn: [InvoiceStatus.PAID, InvoiceStatus.CANCELLED] },
          },
        })
      : [];
    const outstandingDues = unpaidInvoices.reduce(
      (sum, inv) => sum + (inv.totalAmount - inv.paidAmount),
      0
    );

    // Linked parent account (created during onboarding, if any)
    const linkedParent = student.tenantProfile?.parentProfileId
      ? await prisma.parentProfile.findUnique({
          where: { id: student.tenantProfile.parentProfileId },
          include: { user: { select: { fullName: true, phone: true, email: true } } },
        })
      : null;

    // Mess facility is derived from real menu configuration, never guessed client-side.
    // A facility exists when the owning PG has published a weekly FoodMenu or the
    // property has structured MessMenu rows.
    let hasMessFacility = false;
    if (activeStay) {
      const [ownerFoodMenu, propertyMessMenuCount] = await Promise.all([
        activeStay.property?.ownerId
          ? prisma.foodMenu.findUnique({ where: { ownerId: activeStay.property.ownerId } })
          : Promise.resolve(null),
        prisma.messMenu.count({ where: { propertyId: activeStay.propertyId } }),
      ]);
      hasMessFacility = Boolean(ownerFoodMenu) || propertyMessMenuCount > 0;
    }

    return {
      student: {
        id: student.id,
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
        avatarUrl: student.avatarUrl,
        role: student.role,
        ownerId: student.ownerId,
        mustChangePassword: student.mustChangePassword,
        createdAt: student.createdAt,
      },
      profile: student.tenantProfile,
      stay: activeStay,
      property: activeStay?.property || null,
      room: activeStay?.bed?.room || null,
      floor: activeStay?.bed?.room?.floor || null,
      bed: activeStay?.bed || null,
      roommates,
      deposit,
      policeVerification,
      outstandingDues,
      unpaidInvoicesCount: unpaidInvoices.length,
      hasMessFacility,
      linkedParent,
    };
  }

  static async updateProfile(userId: string, data: {
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    permanentAddress?: string;
    collegeOrCompany?: string;
    idProofType?: string;
    idProofNumber?: string;
  }) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    if (!student?.tenantProfile) throw new Error('Tenant profile not found');

    return prisma.tenantProfile.update({
      where: { id: student.tenantProfile.id },
      data: {
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        permanentAddress: data.permanentAddress,
        collegeOrCompany: data.collegeOrCompany,
        idProofType: data.idProofType,
        idProofNumber: data.idProofNumber,
      },
    });
  }

  static async getRoomDetails(userId: string) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    if (!student?.tenantProfile) throw new Error('Profile not found');

    const activeStay = await prisma.tenantStay.findFirst({
      where: {
        tenantId: student.tenantProfile.id,
        status: { in: [StayStatus.ACTIVE, StayStatus.CHECKED_IN, StayStatus.NOTICE_PERIOD] },
      },
      include: {
        property: true,
        bed: {
          include: {
            room: {
              include: {
                floor: true,
                beds: { include: { stays: { where: { status: StayStatus.ACTIVE }, include: { tenant: { include: { user: true } } } } } },
              },
            },
          },
        },
      },
    });
    if (!activeStay) return null;

    const amenities = activeStay.property?.amenities ? JSON.parse(activeStay.property.amenities) : [];
    const images = activeStay.property?.images ? JSON.parse(activeStay.property.images) : [];

    return {
      property: {
        ...activeStay.property,
        amenities,
        images,
      },
      room: activeStay.bed?.room,
      floor: activeStay.bed?.room?.floor,
      bed: activeStay.bed,
      stay: {
        id: activeStay.id,
        startDate: activeStay.startDate,
        expectedEndDate: activeStay.expectedEndDate,
        monthlyRent: activeStay.monthlyRent,
        securityDeposit: activeStay.securityDeposit,
        status: activeStay.status,
      },
      roommates: (activeStay.bed?.room?.beds || [])
        .filter(b => b.id !== activeStay.bedId)
        .flatMap(b => b.stays.map(s => ({
          name: s.tenant?.user?.fullName || 'Roommate',
          phone: s.tenant?.user?.phone || '',
          bedNumber: b.bedNumber,
          roomNumber: activeStay.bed?.room?.roomNumber ?? null,
        }))),
    };
  }

  // ============================================================
  // FINANCE — INVOICES & PAYMENTS
  // ============================================================

  static async getInvoices(userId: string) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    if (!student?.tenantProfile) return [];

    const stays = await prisma.tenantStay.findMany({ where: { tenantId: student.tenantProfile.id } });
    if (stays.length === 0) return [];

    const stayIds = stays.map(s => s.id);
    return prisma.invoice.findMany({
      where: { stayId: { in: stayIds } },
      include: { items: true, payments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getRentHistory(userId: string) {
    const invoices = await StudentService.getInvoices(userId);
    const paid = invoices.filter(i => i.status === InvoiceStatus.PAID);
    const unpaid = invoices.filter(i => i.status !== InvoiceStatus.PAID && i.status !== InvoiceStatus.CANCELLED);
    const totalPaid = paid.reduce((sum, i) => sum + i.paidAmount, 0);
    const totalDue = unpaid.reduce((sum, i) => sum + (i.totalAmount - i.paidAmount), 0);
    return { invoices, totalPaid, totalDue, paid, unpaid };
  }

  static async payInvoice(userId: string, invoiceId: string, paymentMethod: string) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    if (!student?.tenantProfile) throw new Error('Student profile not found');

    const inv = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { stay: true } });
    if (!inv) throw new Error('Invoice not found');
    if (inv.stay?.tenantId !== student.tenantProfile.id) throw new Error('Forbidden: This invoice does not belong to you');
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
    const method = methodMap[paymentMethod?.toUpperCase()] || PaymentMethod.UPI;
    const amountDue = inv.totalAmount - inv.paidAmount;
    const transactionRef = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const idempotencyKey = `IDEM-${invoiceId}-${Date.now()}`;

    const [updatedInvoice, payment] = await prisma.$transaction([
      prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: InvoiceStatus.PAID,
          paidAmount: inv.totalAmount,
          updatedAt: new Date(),
        },
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
  // COMPLAINTS
  // ============================================================

  static async getComplaints(userId: string) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    if (!student?.tenantProfile) return [];

    const stay = await prisma.tenantStay.findFirst({
      where: { tenantId: student.tenantProfile.id },
      orderBy: { createdAt: 'desc' },
    });
    if (!stay) return [];

    // SECURITY: a student must only ever see their OWN complaints. Previously this
    // query was scoped only by property/owner, which leaked every other resident's
    // complaints in the same PG.
    return prisma.complaint.findMany({
      where: { createdByUserId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createComplaint(userId: string, data: {
    category: string;
    title: string;
    description: string;
    priority?: string;
  }) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    if (!student?.tenantProfile) throw new Error('Student profile not found');

    const stay = await prisma.tenantStay.findFirst({
      where: { tenantId: student.tenantProfile.id, status: { in: [StayStatus.ACTIVE, StayStatus.CHECKED_IN, StayStatus.NOTICE_PERIOD] } },
    });
    if (!stay) throw new Error('No active stay found. Cannot raise a complaint.');

    const priorityMap: Record<string, any> = { LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH', URGENT: 'URGENT' };
    const priority = priorityMap[(data.priority || 'MEDIUM').toUpperCase()] || 'MEDIUM';

    const complaint = await prisma.complaint.create({
      data: {
        ownerId: stay.ownerId,
        propertyId: stay.propertyId,
        createdByUserId: userId,
        category: data.category,
        title: data.title,
        description: data.description,
        priority,
        status: ComplaintStatus.OPEN,
      },
    });

    await StudentService.notifyLinkedParents(student.tenantProfile.id, {
      type: 'COMPLAINT',
      title: '📝 Complaint Raised',
      message: `${student.fullName} raised a ${priority.toLowerCase()} priority complaint: "${data.title}".`,
    });

    return complaint;
  }

  // ============================================================
  // MESS & FOOD
  // ============================================================

  static async getMess(userId: string) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });

    const stay = student?.tenantProfile
      ? await prisma.tenantStay.findFirst({ where: { tenantId: student.tenantProfile.id } })
      : null;

    let menu: any = null;
    let messMenuItems: any[] = [];
    if (stay) {
      // Get FoodMenu (owner-wide weekly menu)
      const property = await prisma.property.findUnique({ where: { id: stay.propertyId } });
      if (property) {
        const foodMenu = await prisma.foodMenu.findUnique({ where: { ownerId: property.ownerId } });
        if (foodMenu?.weekMenuJson) {
          try {
            const weekMenu = JSON.parse(foodMenu.weekMenuJson);
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const todayKey = days[new Date().getDay()];
            menu = weekMenu[todayKey] || null;
            // Provide full week menu
            menu = { today: weekMenu[todayKey] || null, week: weekMenu };
          } catch { menu = null; }
        }

        // Get MessMenu (structured per day/mealType)
        messMenuItems = await prisma.messMenu.findMany({
          where: { propertyId: stay.propertyId },
        });
      }
    }

    // Get or create mess wallet
    let wallet = await prisma.messWallet.findUnique({ where: { tenantId: userId } });
    if (!wallet) {
      wallet = await prisma.messWallet.create({ data: { tenantId: userId, balance: 0 } });
    }

    // Get recent meal orders
    const recentOrders = await prisma.mealOrder.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return { menu, messMenuItems, wallet, recentOrders };
  }

  static async rechargeMessWallet(userId: string, amount: number) {
    if (amount <= 0) throw new Error('Recharge amount must be positive');
    if (amount > 5000000) throw new Error('Maximum recharge amount is ₹50,000');

    return prisma.messWallet.upsert({
      where: { tenantId: userId },
      update: { balance: { increment: amount } },
      create: { tenantId: userId, balance: amount },
    });
  }

  static async orderMeal(userId: string, mealType: string, propertyId?: string) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    const stay = student?.tenantProfile
      ? await prisma.tenantStay.findFirst({ where: { tenantId: student.tenantProfile.id } })
      : null;

    const resolvedPropertyId = propertyId || stay?.propertyId;
    if (!resolvedPropertyId) throw new Error('No property found');

    const mealTypeEnum: Record<string, any> = {
      BREAKFAST: 'BREAKFAST', LUNCH: 'LUNCH', SNACKS: 'SNACKS', DINNER: 'DINNER',
    };
    const mealTypeVal = mealTypeEnum[(mealType || '').toUpperCase()] || 'LUNCH';

    return prisma.mealOrder.create({
      data: {
        propertyId: resolvedPropertyId,
        userId,
        mealType: mealTypeVal,
        date: new Date(),
      },
    });
  }

  static async rateMeal(userId: string, orderId: string, rating: number, feedback?: string) {
    if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5');
    const order = await prisma.mealOrder.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Meal order not found');
    if (order.userId !== userId) throw new Error('Forbidden');

    return prisma.mealOrder.update({
      where: { id: orderId },
      data: { rating, feedback },
    });
  }

  // ============================================================
  // NOTICES
  // ============================================================

  static async getNotices(userId: string) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    const stay = student?.tenantProfile
      ? await prisma.tenantStay.findFirst({ where: { tenantId: student.tenantProfile.id } })
      : null;
    if (!stay) return [];

    return prisma.notice.findMany({
      where: { ownerId: stay.ownerId },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      take: 50,
    });
  }

  static async submitNoticePeriod(userId: string, data: {
    moveOutDate: string;
    reason: string;
  }) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    if (!student?.tenantProfile) throw new Error('Profile not found');

    const stay = await prisma.tenantStay.findFirst({
      where: { tenantId: student.tenantProfile.id, status: StayStatus.ACTIVE },
    });
    if (!stay) throw new Error('No active stay found');

    // Update stay status to NOTICE_PERIOD
    const updatedStay = await prisma.tenantStay.update({
      where: { id: stay.id },
      data: {
        status: StayStatus.NOTICE_PERIOD,
        expectedEndDate: new Date(data.moveOutDate),
      },
    });

    // Create a notification log for the owner
    await prisma.notificationLog.create({
      data: {
        userId,
        type: 'NOTICE_PERIOD',
        title: 'Notice Period Submitted',
        message: `Tenant ${student.fullName} has submitted a notice to vacate by ${data.moveOutDate}. Reason: ${data.reason}`,
        isRead: false,
      },
    });

    return updatedStay;
  }

  // ============================================================
  // VISITORS
  // ============================================================

  static async getVisitors(userId: string) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    if (!student?.tenantProfile) return [];
    const stay = await prisma.tenantStay.findFirst({ where: { tenantId: student.tenantProfile.id } });
    if (!stay) return [];

    return prisma.visitorLog.findMany({
      where: { propertyId: stay.propertyId, tenantId: student.tenantProfile.id },
      orderBy: { checkInTime: 'desc' },
      take: 50,
    });
  }

  static async addVisitor(userId: string, data: {
    visitorName: string;
    visitorPhone: string;
    purpose: string;
  }) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    if (!student?.tenantProfile) throw new Error('Profile not found');

    const stay = await prisma.tenantStay.findFirst({
      where: { tenantId: student.tenantProfile.id, status: { in: [StayStatus.ACTIVE, StayStatus.CHECKED_IN] } },
    });
    if (!stay) throw new Error('No active stay to log a visitor for');

    if (!data.visitorName?.trim()) throw new Error('Visitor name is required');
    if (!data.visitorPhone?.trim()) throw new Error('Visitor phone is required');
    if (!data.purpose?.trim()) throw new Error('Visit purpose is required');

    const visitor = await prisma.visitorLog.create({
      data: {
        propertyId: stay.propertyId,
        tenantId: student.tenantProfile.id,
        visitorName: data.visitorName.trim(),
        visitorPhone: data.visitorPhone.trim(),
        purpose: data.purpose.trim(),
        checkInTime: new Date(),
      },
    });

    await StudentService.notifyLinkedParents(student.tenantProfile.id, {
      type: 'VISITOR',
      title: '👥 Visitor Logged at PG',
      message: `${student.fullName} registered a visitor: ${data.visitorName.trim()} (${data.visitorPhone.trim()}). Purpose: ${data.purpose.trim()}`,
    });

    return visitor;
  }

  static async checkOutVisitor(userId: string, visitorLogId: string) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    const log = await prisma.visitorLog.findUnique({ where: { id: visitorLogId } });
    if (!log) throw new Error('Visitor log not found');
    if (log.tenantId !== student?.tenantProfile?.id) throw new Error('Forbidden');

    return prisma.visitorLog.update({
      where: { id: visitorLogId },
      data: { checkOutTime: new Date() },
    });
  }

  // ============================================================
  // LEAVES
  // ============================================================

  static async getLeaves(userId: string) {
    return prisma.leaveRequest.findMany({
      where: { studentId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async requestLeave(userId: string, data: {
    startDate: string;
    endDate: string;
    reason: string;
  }) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    if (!student?.tenantProfile) throw new Error('Profile not found');

    const stay = await prisma.tenantStay.findFirst({
      where: { tenantId: student.tenantProfile.id, status: { in: [StayStatus.ACTIVE, StayStatus.CHECKED_IN] } },
    });
    if (!stay) throw new Error('No active stay to submit leave for');

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (isNaN(start.getTime())) throw new Error('Invalid start date');
    if (isNaN(end.getTime())) throw new Error('Invalid end date');
    if (end < start) throw new Error('End date cannot be before start date');
    if (!data.reason?.trim()) throw new Error('Reason is required');

    const leave = await prisma.leaveRequest.create({
      data: {
        studentId: userId,
        propertyId: stay.propertyId,
        startDate: start,
        endDate: end,
        reason: data.reason.trim(),
        status: 'PENDING',
      },
    });

    await StudentService.notifyLinkedParents(student.tenantProfile.id, {
      type: 'LEAVE_REQUEST',
      title: ' Leave / Outing Request Submitted',
      message: `${student.fullName} requested leave from ${start.toLocaleDateString('en-IN')} to ${end.toLocaleDateString('en-IN')}. Reason: ${data.reason.trim()}`,
    });

    return leave;
  }

  static async cancelLeave(userId: string, leaveId: string) {
    const leave = await prisma.leaveRequest.findUnique({ where: { id: leaveId } });
    if (!leave) throw new Error('Leave request not found');
    if (leave.studentId !== userId) throw new Error('Forbidden');
    if (leave.status !== 'PENDING') throw new Error('Can only cancel PENDING leave requests');

    return prisma.leaveRequest.update({
      where: { id: leaveId },
      data: { status: 'CANCELLED' },
    });
  }

  // ============================================================
  // SOS
  // ============================================================

  static async triggerSOS(userId: string, coords?: { latitude?: number; longitude?: number }) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    if (!student?.tenantProfile) throw new Error('Profile not found');

    const stay = await prisma.tenantStay.findFirst({
      where: { tenantId: student.tenantProfile.id, status: { in: [StayStatus.ACTIVE, StayStatus.CHECKED_IN, StayStatus.NOTICE_PERIOD] } },
    });
    if (!stay) throw new Error('No active stay to trigger SOS from');

    const sos = await prisma.sOSAlert.create({
      data: {
        ownerId: stay.ownerId,
        propertyId: stay.propertyId,
        userId,
        status: SOSStatus.TRIGGERED,
        latitude: coords?.latitude || null,
        longitude: coords?.longitude || null,
      },
    });

    // Log a notification for the owner/manager
    await prisma.notificationLog.create({
      data: {
        userId,
        type: 'SOS_ALERT',
        title: '🚨 Emergency SOS Triggered',
        message: `Student ${student.fullName} has triggered an SOS alert from ${stay.propertyId}.`,
        isRead: false,
      },
    });

    // Escalate to the linked parent account as well
    await StudentService.notifyLinkedParents(student.tenantProfile.id, {
      type: 'SOS_ALERT',
      title: '🚨 Emergency SOS Triggered',
      message: `Your child ${student.fullName} has triggered an emergency SOS alert. The PG management team has been alerted.`,
    });

    return sos;
  }

  static async resolveSOS(userId: string, sosId: string) {
    const sos = await prisma.sOSAlert.findUnique({ where: { id: sosId } });
    if (!sos) throw new Error('SOS alert not found');
    if (sos.userId !== userId) throw new Error('Forbidden');

    return prisma.sOSAlert.update({
      where: { id: sosId },
      data: { status: SOSStatus.RESOLVED, resolvedAt: new Date() },
    });
  }

  static async getSOSHistory(userId: string) {
    return prisma.sOSAlert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  // ============================================================
  // GATE ATTENDANCE
  // ============================================================

  /**
   * Records a gate movement (check-in / check-out) for the signed-in resident.
   *
   * `data.gateToken` is the value the camera read off the printed gate poster. It
   * must carry a valid signature *and* belong to the property this resident
   * actually lives in — until now the "scan" was purely cosmetic, so attendance
   * could be recorded from anywhere, for any property, at any time.
   */
  static async recordGateAttendance(userId: string, data: {
    type: string;
    reason?: string;
    destination?: string;
    expectedReturnTime?: string;
    gateToken?: string;
  }) {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    if (!user?.tenantProfile) throw new Error('Profile not found');

    const stay = await prisma.tenantStay.findFirst({
      where: { tenantId: user.tenantProfile.id, status: { in: [StayStatus.ACTIVE, StayStatus.CHECKED_IN, StayStatus.NOTICE_PERIOD] } },
      include: { bed: { include: { room: true } } },
      orderBy: { startDate: 'desc' },
    });
    if (!stay) throw new Error('No active stay found');

    // ── Verify the scanned poster ───────────────────────────────
    const token = extractGateToken(data.gateToken);
    if (!token) throw new Error('Scan the gate QR poster to mark this movement.');
    const tokenPropertyId = verifyGateToken(token);
    if (!tokenPropertyId) throw new Error('This gate QR code is not valid.');
    if (tokenPropertyId !== stay.propertyId) throw new Error('This gate QR code belongs to a different property.');

    const entryType = String(data.type || 'ENTRY').toUpperCase();
    if (!['ENTRY', 'EXIT'].includes(entryType)) throw new Error('Gate movement must be ENTRY or EXIT');

    const now = new Date();
    const property = await prisma.property.findUnique({ where: { id: stay.propertyId }, select: { curfewTime: true } });
    // The curfew now comes from the property record instead of a hardcoded 22:00.
    const isLate = entryType === 'ENTRY' && isLateEntry(now, property?.curfewTime);

    // ── Idempotency: a double tap or re-scan must not spam the register ──────
    const duplicate = await prisma.gateLog.findFirst({
      where: { userId, type: entryType, timestamp: { gte: new Date(now.getTime() - DUPLICATE_GATE_LOG_WINDOW_MS) } },
      orderBy: { timestamp: 'desc' },
    });
    if (duplicate) {
      return { ...duplicate, parentNotified: Boolean(duplicate.parentNotifiedAt), duplicate: true };
    }

    const gateLog = await prisma.gateLog.create({
      data: {
        propertyId: stay.propertyId,
        userId,
        studentName: user.fullName,
        roomNumber: stay.bed?.room?.roomNumber || '',
        type: entryType,
        entryType,
        reason: data.reason || 'General',
        destination: data.destination || '',
        expectedReturnTime: entryType === 'EXIT' ? data.expectedReturnTime || null : null,
        isLate,
        loggedBy: 'Gate QR Scan',
        passCode: token,
        timestamp: now,
      },
    });

    // ── Daily attendance row (canonical day, genuinely updated) ─────────────
    await StudentService.applyGateAttendance(stay.propertyId, userId, now, entryType);

    // Notify the linked parent account so the "Parent Alert" column on the student
    // screen reflects a real, persisted notification rather than a UI claim.
    const parentNotified = await StudentService.notifyLinkedParents(user.tenantProfile.id, {
      type: 'GATE_ATTENDANCE',
      title: entryType === 'ENTRY' ? '🟢 Checked In at PG' : '🔴 Left PG Campus',
      message:
        entryType === 'ENTRY'
          ? `${user.fullName} checked in${isLate ? ' (after curfew)' : ''}. ${data.reason ? `Reason: ${data.reason}` : ''}`.trim()
          : `${user.fullName} checked out. ${data.reason ? `Reason: ${data.reason}` : ''}${data.destination ? ` Destination: ${data.destination}.` : ''}${data.expectedReturnTime ? ` Expected return: ${data.expectedReturnTime}.` : ''}`.trim(),
    });

    const notifiedAt = parentNotified > 0 ? new Date() : null;
    if (notifiedAt) {
      await prisma.gateLog.update({ where: { id: gateLog.id }, data: { parentNotifiedAt: notifiedAt } });
    }

    return { ...gateLog, parentNotifiedAt: notifiedAt, parentNotified: parentNotified > 0 };
  }

  /**
   * When the resident appears at the gate they are present for that day.
   *
   * BUG HISTORY: this used to be `findFirst` + `create({...}).catch(() => {})`, so an
   * existing row was *never* updated (an approved leave stayed on the calendar even
   * after the resident scanned in) and real database errors were swallowed.
   */
  private static async applyGateAttendance(propertyId: string, userId: string, now: Date, entryType: string) {
    const day = attendanceDate(now);
    const local = new Date(now.getTime() + BUSINESS_TZ_OFFSET_MINUTES * 60_000);
    const hh = String(local.getUTCHours()).padStart(2, '0');
    const mm = String(local.getUTCMinutes()).padStart(2, '0');
    const remarks = `Gate ${entryType.toLowerCase()} at ${hh}:${mm}`;

    const key = { propertyId, userId, date: day };
    const existing = await prisma.attendance.findUnique({ where: { propertyId_userId_date: key } });

    if (!existing) {
      try {
        return await prisma.attendance.create({ data: { ...key, status: AttendanceStatus.PRESENT, remarks } });
      } catch {
        // Lost a race against a concurrent scan — the winner's row is updated below.
      }
    }

    const current = await prisma.attendance.findUnique({ where: { propertyId_userId_date: key } });
    if (!current) throw new Error('Could not record attendance for this movement');

    // An approved leave is deliberate: keep the status and only refresh the remark.
    const status = current.status === AttendanceStatus.ON_LEAVE ? current.status : AttendanceStatus.PRESENT;
    return prisma.attendance.update({ where: { id: current.id }, data: { status, remarks } });
  }

  static async getGateLogs(userId: string) {
    const logs = await prisma.gateLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    // Per-log truth: `parentNotifiedAt` is stamped only when a NotificationLog row
    // was actually written for this movement.
    return logs.map((log) => ({ ...log, parentNotified: Boolean(log.parentNotifiedAt) }));
  }

  // ============================================================
  // ATTENDANCE
  // ============================================================

  static async getAttendance(userId: string, month?: string) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    // Most recent stay (any status) so a past resident keeps their history.
    const stay = student?.tenantProfile
      ? await prisma.tenantStay.findFirst({
          where: { tenantId: student.tenantProfile.id },
          orderBy: { startDate: 'desc' },
        })
      : null;

    // No stay -> no attendance to show. The old filter fell back to
    // `propertyId: undefined`, which returned this user's rows from *every* property.
    if (!stay) {
      return {
        records: [],
        gateLogs: [],
        summary: { present: 0, absent: 0, onLeave: 0, total: 0 },
        noStay: true,
      };
    }

    // The month is read in the business timezone and compared against the canonical
    // day values every writer stores; the old local-midnight bounds straddled days.
    const currentMonth = dayKey(new Date()).slice(0, 7);
    const range = monthRangeUtc(month ?? '') ?? monthRangeUtc(currentMonth)!;

    const [records, gateLogs] = await Promise.all([
      prisma.attendance.findMany({
        where: { userId, propertyId: stay.propertyId, date: range },
        orderBy: { date: 'asc' },
      }),
      prisma.gateLog.findMany({
        where: { userId, propertyId: stay.propertyId, timestamp: range },
        orderBy: { timestamp: 'desc' },
        take: 200,
      }),
    ]);

    const present = records.filter(r => r.status === AttendanceStatus.PRESENT).length;
    const absent = records.filter(r => r.status === AttendanceStatus.ABSENT).length;
    const onLeave = records.filter(r => r.status === AttendanceStatus.ON_LEAVE).length;

    return { records, gateLogs, summary: { present, absent, onLeave, total: records.length }, noStay: false };
  }

  // ============================================================
  // DOCUMENTS
  // ============================================================

  static async getDocuments(userId: string) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    if (!student?.tenantProfile) return { documents: [], agreements: [] };

    const [documents, agreements] = await Promise.all([
      prisma.document.findMany({ where: { tenantId: student.tenantProfile.id }, orderBy: { uploadedAt: 'desc' } }),
      prisma.rentAgreement.findMany({ where: { tenantId: student.tenantProfile.id }, orderBy: { createdAt: 'desc' } }),
    ]);

    return { documents, agreements };
  }

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  static async getNotifications(userId: string) {
    return prisma.notificationLog.findMany({
      where: { userId },
      orderBy: { sentAt: 'desc' },
      take: 50,
    });
  }

  static async markNotificationRead(userId: string, notifId: string) {
    const notif = await prisma.notificationLog.findUnique({ where: { id: notifId } });
    if (!notif) throw new Error('Notification not found');
    if (notif.userId !== userId) throw new Error('Forbidden');
    return prisma.notificationLog.update({ where: { id: notifId }, data: { isRead: true } });
  }

  // ============================================================
  // HISTORY / TIMELINE
  // ============================================================

  static async getHistory(userId: string) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    if (!student?.tenantProfile) return [];

    // Fetch stays first so stayIds are available for invoice query
    const stays = await prisma.tenantStay.findMany({ where: { tenantId: student.tenantProfile.id }, orderBy: { createdAt: 'desc' } });
    const stayIds = stays.map((s: { id: string }) => s.id);

    const [complaints, leaves, gateLogs, sos, invoices] = await Promise.all([
      prisma.complaint.findMany({ where: { createdByUserId: userId }, orderBy: { createdAt: 'desc' }, take: 20 }),
      prisma.leaveRequest.findMany({ where: { studentId: userId }, orderBy: { createdAt: 'desc' }, take: 20 }),
      prisma.gateLog.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 30 }),
      prisma.sOSAlert.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 10 }),
      stayIds.length ? prisma.invoice.findMany({ where: { stayId: { in: stayIds } }, orderBy: { createdAt: 'desc' }, take: 20 }) : Promise.resolve([]),
    ]);

    const timeline: any[] = [];

    stays.forEach((s: any) => timeline.push({ type: 'STAY', action: `Stay ${s.status}`, date: s.createdAt, data: s }));
    complaints.forEach((c: any) => timeline.push({ type: 'COMPLAINT', action: `Complaint: ${c.title}`, date: c.createdAt, data: c }));
    leaves.forEach((l: any) => timeline.push({ type: 'LEAVE', action: `Leave Request (${l.status})`, date: l.createdAt, data: l }));
    gateLogs.forEach((g: any) => timeline.push({ type: 'GATE', action: `Gate ${g.type}${g.isLate ? ' (LATE)' : ''}`, date: g.createdAt, data: g }));
    sos.forEach((s: any) => timeline.push({ type: 'SOS', action: `SOS Alert (${s.status})`, date: s.createdAt, data: s }));
    invoices.forEach((i: any) => timeline.push({ type: 'INVOICE', action: `Invoice ${i.invoiceNumber} (${i.status})`, date: i.createdAt, data: i }));

    return timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // ============================================================
  // FEEDBACK / SUPPORT
  // ============================================================

  static async submitFeedback(userId: string, data: { title: string; description: string; priority?: string }) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    const stay = student?.tenantProfile
      ? await prisma.tenantStay.findFirst({ where: { tenantId: student.tenantProfile.id } })
      : null;

    return prisma.supportTicket.create({
      data: {
        ownerId: stay?.ownerId || null,
        title: data.title,
        description: data.description,
        priority: data.priority || 'MEDIUM',
        status: 'OPEN',
        createdBy: userId,
      },
    });
  }
}
