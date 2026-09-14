import { prisma } from '../../db';
import { StayStatus, SOSStatus, BedStatus, InvoiceStatus, PaymentMethod, PaymentStatus, ComplaintStatus, AttendanceStatus } from '@prisma/client';

export class StudentService {
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

    return {
      student: {
        id: student.id,
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
        avatarUrl: student.avatarUrl,
        role: student.role,
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
        .flatMap(b => b.stays)
        .map(s => ({
          name: s.tenant?.user?.fullName || 'Roommate',
          phone: s.tenant?.user?.phone || '',
        })),
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

    return prisma.complaint.findMany({
      where: { propertyId: stay.propertyId, ownerId: stay.ownerId },
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

    return prisma.complaint.create({
      data: {
        ownerId: stay.ownerId,
        propertyId: stay.propertyId,
        category: data.category,
        title: data.title,
        description: data.description,
        priority,
        status: ComplaintStatus.OPEN,
      },
    });
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

    return prisma.visitorLog.create({
      data: {
        propertyId: stay.propertyId,
        tenantId: student.tenantProfile.id,
        visitorName: data.visitorName.trim(),
        visitorPhone: data.visitorPhone.trim(),
        purpose: data.purpose.trim(),
        checkInTime: new Date(),
      },
    });
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

    return prisma.leaveRequest.create({
      data: {
        studentId: userId,
        propertyId: stay.propertyId,
        startDate: start,
        endDate: end,
        reason: data.reason.trim(),
        status: 'PENDING',
      },
    });
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

  static async recordGateAttendance(userId: string, data: {
    type: string;
    reason?: string;
    destination?: string;
    expectedReturnTime?: string;
  }) {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    if (!user?.tenantProfile) throw new Error('Profile not found');

    const stay = await prisma.tenantStay.findFirst({
      where: { tenantId: user.tenantProfile.id, status: { in: [StayStatus.ACTIVE, StayStatus.CHECKED_IN] } },
      include: { bed: { include: { room: true } } },
    });
    if (!stay) throw new Error('No active stay found');

    const entryType = (data.type || 'ENTRY').toUpperCase();
    const now = new Date();
    const hour = now.getHours();
    const isLate = entryType === 'ENTRY' && (hour >= 22 || hour < 5);

    const gateLog = await prisma.gateLog.create({
      data: {
        propertyId: stay.propertyId,
        userId,
        studentName: user.fullName,
        roomNumber: stay.bed?.room?.roomNumber || '',
        type: entryType,
        entryType: entryType,
        reason: data.reason || 'General',
        destination: data.destination || '',
        expectedReturnTime: data.expectedReturnTime || null,
        isLate,
        loggedBy: 'Student App',
        timestamp: now,
      },
    });

    // Update daily attendance record
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        propertyId: stay.propertyId,
        userId,
        date: { gte: today, lt: tomorrow },
      },
    });

    if (!existingAttendance) {
      await prisma.attendance.create({
        data: {
          propertyId: stay.propertyId,
          userId,
          date: today,
          status: AttendanceStatus.PRESENT,
          remarks: `Gate ${entryType.toLowerCase()} recorded at ${now.toLocaleTimeString()}`,
        },
      }).catch(() => {}); // Silently handle unique constraint
    }

    return gateLog;
  }

  static async getGateLogs(userId: string) {
    return prisma.gateLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  // ============================================================
  // ATTENDANCE
  // ============================================================

  static async getAttendance(userId: string, month?: string) {
    const student = await prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true } });
    const stay = student?.tenantProfile
      ? await prisma.tenantStay.findFirst({ where: { tenantId: student.tenantProfile.id } })
      : null;

    // Build date filter for the month
    let dateFilter: any = {};
    if (month) {
      const [year, mon] = month.split('-').map(Number);
      const start = new Date(year, mon - 1, 1);
      const end = new Date(year, mon, 0, 23, 59, 59);
      dateFilter = { gte: start, lte: end };
    } else {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      dateFilter = { gte: start, lte: end };
    }

    const records = await prisma.attendance.findMany({
      where: {
        userId,
        propertyId: stay?.propertyId || undefined,
        date: dateFilter,
      },
      orderBy: { date: 'asc' },
    });

    const present = records.filter(r => r.status === AttendanceStatus.PRESENT).length;
    const absent = records.filter(r => r.status === AttendanceStatus.ABSENT).length;
    const onLeave = records.filter(r => r.status === AttendanceStatus.ON_LEAVE).length;

    // Get gate logs for the same period
    const gateLogs = stay
      ? await prisma.gateLog.findMany({
          where: { userId, createdAt: dateFilter },
          orderBy: { createdAt: 'desc' },
          take: 200,
        })
      : [];

    return { records, gateLogs, summary: { present, absent, onLeave, total: records.length } };
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
      prisma.complaint.findMany({ where: { ownerId: student.ownerId || undefined }, orderBy: { createdAt: 'desc' }, take: 20 }),
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
