import bcrypt from 'bcryptjs';
import { prisma } from '../../db';
import { UserRole, OwnerRequestStatus } from '@prisma/client';

export class SuperadminService {
  // Dashboard metrics
  static async getDashboardStats() {
    const totalOwners = await prisma.user.count({ where: { role: UserRole.OWNER, isActive: true, isSuspended: false } });
    const totalProperties = await prisma.property.count();
    const totalBeds = await prisma.bed.count();
    const occupiedBeds = await prisma.bed.count({ where: { status: 'OCCUPIED' } });
    const pendingRequests = await prisma.ownerRequest.count({ where: { status: 'PENDING' } });
    
    // MRR calculation based on active subscriptions
    const subscriptions = await prisma.subscription.findMany({
      where: { isActive: true, endDate: { gte: new Date() } },
      include: { plan: true },
    });
    
    const mrr = subscriptions.reduce((acc, sub) => acc + (sub.plan.priceMonthly || 0), 0);

    const [latestRequests, recentAuditLogs, openTicketsCount, expiringPlansCount] = await Promise.all([
      prisma.ownerRequest.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.supportTicket.count({ where: { status: { notIn: ['RESOLVED', 'CLOSED'] } } }),
      prisma.subscription.count({ where: { isActive: true, endDate: { gte: new Date(), lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } } }),
    ]);

    return {
      totalOwners,
      totalProperties,
      totalBeds,
      occupiedBeds,
      occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
      mrr: mrr / 100, // Convert Paise to Rupees for UI display
      pendingRequests,
      activeSubscriptions: subscriptions.length,
      latestRequests,
      recentAuditLogs,
      openTicketsCount,
      expiringPlansCount,
    };
  }

  // Analytics stats
  static async getAnalyticsData() {
    const dashboardStats = await this.getDashboardStats();
    
    const plansBreakdown = await prisma.subscription.groupBy({
      by: ['planId'],
      _count: { id: true },
    });

    const plans = await prisma.platformPlan.findMany();

    const planStats = plans.map(plan => {
      const found = plansBreakdown.find(p => p.planId === plan.id);
      return {
        planId: plan.id,
        planName: plan.name,
        subscriberCount: found ? found._count.id : 0,
      };
    });

    return {
      stats: dashboardStats,
      planStats,
    };
  }

  // Owner Requests Pipeline
  static async listOwnerRequests() {
    return prisma.ownerRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createOwnerRequest(data: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    propertyCount?: number;
    totalBeds?: number;
    notes?: string;
  }) {
    return prisma.ownerRequest.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        propertyCount: data.propertyCount || 1,
        totalBeds: data.totalBeds || 10,
        notes: data.notes || '',
      },
    });
  }

  static async updateOwnerRequestStatus(
    requestId: string,
    status: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW',
    actorId: string,
    rejectionReason?: string
  ) {
    const dbStatus = status as OwnerRequestStatus;
    const updated = await prisma.ownerRequest.update({
      where: { id: requestId },
      data: {
        status: dbStatus,
        reviewedBy: actorId,
        reviewedAt: new Date(),
        rejectionReason: rejectionReason || null,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId,
        action: `OWNER_REQUEST_${status}`,
        entityType: 'OwnerRequest',
        entityId: requestId,
        details: JSON.stringify({ status, rejectionReason }),
      },
    });

    return updated;
  }

  // Owner Management
  static async listOwners() {
    const [owners, subscriptions] = await Promise.all([prisma.user.findMany({
      where: { role: UserRole.OWNER },
      include: {
        createdProperties: true,
      },
      orderBy: { createdAt: 'desc' },
    }), prisma.subscription.findMany({ where: { isActive: true }, include: { plan: true } })]);

    // Map to expected structure for SuperAdmin Owner table
    return owners.map(o => {
      const subscription = subscriptions.find((item) => item.ownerId === o.id);
      return {
      id: o.id,
      name: o.fullName,
      email: o.email,
      phone: o.phone,
      status: o.isSuspended ? 'Suspended' : o.isActive ? 'Active' : 'Inactive',
      propertyCount: o.createdProperties.length,
      planId: subscription?.plan.code || 'None',
      maxBeds: subscription?.plan.maxBeds || 0,
      createdAt: o.createdAt,
      };
    });
  }

  static async createOwner(
    adminId: string,
    data: {
      fullName: string;
      email: string;
      phone: string;
      temporaryPassword?: string;
      planId?: string;
      requestId?: string;
    }
  ) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (existing) {
      throw new Error('Email or Phone already registered');
    }

    const tempPassword = data.temporaryPassword || 'Owner@123456';
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: { fullName: data.fullName, email: data.email, phone: data.phone, passwordHash, role: UserRole.OWNER, mustChangePassword: true },
      });
      const owner = await tx.user.update({ where: { id: created.id }, data: { ownerId: created.id } });

      if (data.planId) {
        const plan = await tx.platformPlan.findUnique({ where: { id: data.planId } });
        if (!plan) throw new Error('Selected plan not found');
        await tx.subscription.create({ data: { ownerId: owner.id, planId: plan.id, startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), paymentStatus: 'PAID' } });
      }
      if (data.requestId) {
        await tx.ownerRequest.update({ where: { id: data.requestId }, data: { status: OwnerRequestStatus.APPROVED, reviewedBy: adminId, reviewedAt: new Date(), rejectionReason: null } });
      }
      await tx.auditLog.create({ data: { actorId: adminId, action: 'OWNER_CREATED', entityType: 'User', entityId: owner.id, details: JSON.stringify({ email: owner.email, ownerId: owner.id }) } });
      return owner;
    });

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        temporaryPassword: tempPassword,
      },
    };
  }

  static async updateOwnerStatus(ownerId: string, isSuspended: boolean, adminId: string) {
    const updated = await prisma.user.update({
      where: { id: ownerId },
      data: { isSuspended },
    });

    await prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: isSuspended ? 'OWNER_SUSPENDED' : 'OWNER_ACTIVATED',
        entityType: 'User',
        entityId: ownerId,
      },
    });

    return updated;
  }

  // Plans Management
  static async listPlans() {
    const plans = await prisma.platformPlan.findMany({
      orderBy: { priceMonthly: 'asc' },
    });

    return plans.map(p => ({
      ...p,
      features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features,
    }));
  }

  static async createPlan(data: {
    name: string;
    code: string;
    maxProperties: number;
    maxBeds: number;
    priceMonthly: number; // in Rupees
    priceYearly: number;  // in Rupees
    features: string[];
  }, adminId?: string) {
    const plan = await prisma.platformPlan.create({
      data: {
        name: data.name,
        code: data.code.toUpperCase(),
        maxProperties: data.maxProperties,
        maxBeds: data.maxBeds,
        priceMonthly: data.priceMonthly * 100, // convert to Paise
        priceYearly: data.priceYearly * 100,   // convert to Paise
        features: JSON.stringify(data.features),
      },
    });
    if (adminId) await prisma.auditLog.create({ data: { actorId: adminId, action: 'PLAN_CREATED', entityType: 'PlatformPlan', entityId: plan.id } });
    return plan;
  }

  static async updatePlan(
    planId: string,
    data: Partial<{
      name: string;
      maxProperties: number;
      maxBeds: number;
      priceMonthly: number;
      priceYearly: number;
      features: string[];
    }>,
    adminId: string
  ) {
    const updateData: any = { ...data };
    if (data.priceMonthly !== undefined) updateData.priceMonthly = data.priceMonthly * 100;
    if (data.priceYearly !== undefined) updateData.priceYearly = data.priceYearly * 100;
    if (data.features !== undefined) updateData.features = JSON.stringify(data.features);

    const updated = await prisma.platformPlan.update({
      where: { id: planId },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'PLAN_UPDATED',
        entityType: 'PlatformPlan',
        entityId: planId,
        details: JSON.stringify(updateData),
      },
    });

    return updated;
  }

  // Audit Logs
  static async listAuditLogs() {
    return prisma.auditLog.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  static async getOwnerDetail(ownerId: string) {
    const owner = await prisma.user.findFirst({ where: { id: ownerId, role: UserRole.OWNER }, include: { createdProperties: true } });
    if (!owner) throw new Error('Owner not found');
    const [subscription, managersCount, studentsCount, tickets, auditLogs] = await Promise.all([
      prisma.subscription.findFirst({ where: { ownerId, isActive: true }, include: { plan: true }, orderBy: { createdAt: 'desc' } }),
      prisma.user.count({ where: { ownerId, role: { in: [UserRole.MANAGER, UserRole.STAFF] } } }),
      prisma.user.count({ where: { ownerId, role: UserRole.STUDENT } }),
      prisma.supportTicket.findMany({ where: { ownerId }, orderBy: { createdAt: 'desc' }, take: 10 }),
      prisma.auditLog.findMany({ where: { entityId: ownerId }, orderBy: { createdAt: 'desc' }, take: 20 }),
    ]);
    return { owner, subscription, properties: owner.createdProperties, managersCount, studentsCount, tickets, auditLogs, recentPayments: [] };
  }

  static async resetOwnerPassword(ownerId: string, newPassword: string, adminId: string) {
    if (!newPassword || newPassword.length < 6) throw new Error('Password must be at least 6 characters');
    const passwordHash = await bcrypt.hash(newPassword, 10);
    return prisma.$transaction(async (tx) => {
      const owner = await tx.user.update({ where: { id: ownerId }, data: { passwordHash, mustChangePassword: true } });
      await tx.auditLog.create({ data: { actorId: adminId, action: 'OWNER_PASSWORD_RESET', entityType: 'User', entityId: ownerId } });
      return owner;
    });
  }

  static async getSettings() {
    return prisma.platformSetting.upsert({ where: { id: 'platform' }, update: {}, create: { id: 'platform' } });
  }

  static async updateSettings(data: Record<string, unknown>, adminId: string) {
    const allowed = ['otpEnabled', 'defaultNightEntryTime', 'defaultNoticeDays', 'supportPhone', 'maintenanceMode', 'whatsappEnabled'];
    const update = Object.fromEntries(Object.entries(data).filter(([key]) => allowed.includes(key)));
    const settings = await prisma.platformSetting.upsert({ where: { id: 'platform' }, update: { ...update, updatedBy: adminId }, create: { id: 'platform', ...update, updatedBy: adminId } });
    await prisma.auditLog.create({ data: { actorId: adminId, action: 'PLATFORM_SETTINGS_UPDATED', entityType: 'PlatformSetting', entityId: settings.id } });
    return settings;
  }

  static async listFeatureFlags() { return prisma.featureFlag.findMany({ orderBy: [{ key: 'asc' }, { ownerId: 'asc' }] }); }

  static async toggleFeatureFlag(key: string, ownerId: string, isEnabled: boolean, adminId: string, description?: string) {
    const flag = await prisma.featureFlag.upsert({
      where: { key_ownerId: { key, ownerId } },
      update: { isEnabled, description },
      create: { key, ownerId, isEnabled, description },
    });
    await prisma.auditLog.create({ data: { actorId: adminId, action: 'FEATURE_FLAG_UPDATED', entityType: 'FeatureFlag', entityId: flag.id, details: JSON.stringify({ key, ownerId, isEnabled }) } });
    return flag;
  }

  static async listTickets() { return prisma.supportTicket.findMany({ orderBy: { createdAt: 'desc' } }); }

  static async createTicket(data: { ownerId?: string; title: string; description: string; priority?: string }, adminId: string) {
    const ticket = await prisma.supportTicket.create({ data: { ...data, priority: (data.priority || 'MEDIUM').toUpperCase(), createdBy: adminId, updatedBy: adminId } });
    await prisma.auditLog.create({ data: { actorId: adminId, action: 'SUPPORT_TICKET_CREATED', entityType: 'SupportTicket', entityId: ticket.id } });
    return ticket;
  }

  static async updateTicketStatus(ticketId: string, status: string, adminId: string) {
    const ticket = await prisma.supportTicket.update({ where: { id: ticketId }, data: { status: status.toUpperCase().replace(' ', '_'), updatedBy: adminId } });
    await prisma.auditLog.create({ data: { actorId: adminId, action: 'SUPPORT_TICKET_UPDATED', entityType: 'SupportTicket', entityId: ticket.id, details: JSON.stringify({ status: ticket.status }) } });
    return ticket;
  }

  static async createBroadcast(message: string, adminId: string) {
    if (!message.trim()) throw new Error('Broadcast message is required');
    return prisma.$transaction(async (tx) => {
      const broadcast = await tx.platformBroadcast.create({ data: { message: message.trim(), createdBy: adminId } });
      const recipients = await tx.user.findMany({ where: { role: { in: [UserRole.OWNER, UserRole.MANAGER] }, isActive: true, isSuspended: false }, select: { id: true } });
      if (recipients.length) await tx.notificationLog.createMany({ data: recipients.map((user) => ({ userId: user.id, type: 'PLATFORM_BROADCAST', title: 'Platform announcement', message: broadcast.message })) });
      await tx.auditLog.create({ data: { actorId: adminId, action: 'PLATFORM_BROADCAST_SENT', entityType: 'PlatformBroadcast', entityId: broadcast.id, details: JSON.stringify({ recipientCount: recipients.length }) } });
      return { ...broadcast, recipientCount: recipients.length };
    });
  }
}
