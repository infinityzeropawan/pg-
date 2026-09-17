import bcrypt from 'bcryptjs';
import { prisma } from '../../db';
import { UserRole, BedStatus, StayStatus, ComplaintStatus, PropertyType, RoomType, ComplaintPriority, VerificationStatus, InvoiceStatus, PaymentMethod, PaymentStatus, AttendanceStatus } from '@prisma/client';
import { gateScanPath, signGateToken } from '../../utils/gateQr';
import { attendanceDateFromKey } from '../../utils/datetime';

/** Error carrying the HTTP status the admin controller should return. */
export class AdminRequestError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

/** Minimal actor shape needed to scope property and room access. */
export interface AdminActor {
  userId: string;
  ownerId?: string;
  role: string;
}

export class AdminService {
  // ==========================================
  // 1. DASHBOARD & ANALYTICS
  // ==========================================
  static async getDashboardStats(ownerId: string, propertyId?: string) {
    const whereProp = propertyId ? { id: propertyId, ownerId } : { ownerId };
    const properties = await prisma.property.findMany({
      where: whereProp,
      select: { id: true, name: true },
    });

    const propertyIds = properties.map(p => p.id);

    const [
      totalRooms,
      totalBeds,
      occupiedBeds,
      totalTenants,
      openComplaints,
      staffPresent,
      recentGateLogs,
      recentStays,
      expensesAggregate,
      expensesByCategory,
      latestEnquiriesRaw,
      vacantBedsRaw,
      defaulterInvoices
    ] = await Promise.all([
      prisma.room.count({
        where: { floor: { propertyId: { in: propertyIds } } },
      }),
      prisma.bed.count({
        where: { room: { floor: { propertyId: { in: propertyIds } } } },
      }),
      prisma.bed.count({
        where: {
          status: BedStatus.OCCUPIED,
          room: { floor: { propertyId: { in: propertyIds } } },
        },
      }),
      prisma.tenantStay.count({
        where: {
          ownerId,
          status: { in: [StayStatus.ACTIVE, StayStatus.CHECKED_IN] },
          ...(propertyId ? { propertyId } : {}),
        },
      }),
      prisma.complaint.count({
        where: {
          propertyId: { in: propertyIds },
          status: { in: [ComplaintStatus.OPEN, ComplaintStatus.IN_PROGRESS] },
        },
      }),
      prisma.staffAssignment.count({
        where: { propertyId: { in: propertyIds } },
      }),
      prisma.gateLog.findMany({
        where: { propertyId: { in: propertyIds } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.tenantStay.findMany({
        where: { ownerId, ...(propertyId ? { propertyId } : {}) },
        include: {
          tenant: { include: { user: true } },
          bed: { include: { room: true } },
          property: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.expense.aggregate({
        where: { propertyId: { in: propertyIds } },
        _sum: { amount: true },
      }),
      prisma.expense.groupBy({
        by: ['category'],
        where: { propertyId: { in: propertyIds } },
        _sum: { amount: true },
      }),
      prisma.enquiry.findMany({
        where: { propertyId: { in: propertyIds } },
        include: { property: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.bed.findMany({
        where: {
          status: BedStatus.VACANT,
          room: { floor: { propertyId: { in: propertyIds } } },
        },
        include: {
          room: {
            include: {
              floor: {
                include: { property: true },
              },
            },
          },
        },
        take: 10,
      }),
      prisma.invoice.findMany({
        where: {
          ownerId,
          ...(propertyId ? { propertyId } : {}),
          status: { in: ['ISSUED', 'OVERDUE', 'PARTIALLY_PAID'] as any },
        },
        include: {
          stay: {
            include: {
              tenant: { include: { user: true } },
              bed: { include: { room: true } },
              property: true,
            },
          },
        },
        take: 10,
      }),
    ]);

    // Calculate monthly revenue from active stays
    const activeStays = await prisma.tenantStay.findMany({
      where: {
        ownerId,
        status: { in: [StayStatus.ACTIVE, StayStatus.CHECKED_IN, StayStatus.NOTICE_PERIOD] },
        ...(propertyId ? { propertyId } : {}),
      },
      select: { monthlyRent: true },
    });

    const estimatedMonthlyRevenue = activeStays.reduce((sum, s) => sum + (s.monthlyRent || 0), 0);

    // Invoices breakdown
    const invoices = await prisma.invoice.findMany({
      where: {
        ownerId,
        ...(propertyId ? { propertyId } : {}),
      },
      select: { totalAmount: true, paidAmount: true, status: true, billingMonth: true, dueDate: true },
    });

    const totalCollected = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
    const pendingRent = invoices.reduce((sum, inv) => sum + Math.max(0, inv.totalAmount - (inv.paidAmount || 0)), 0);
    const rentTarget = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const totalExpenses = (expensesAggregate._sum.amount || 0) / 100; // In Rupees

    // Real-time operational counters scoped to the selected property / owner
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const [todayCheckins, todayCheckouts, pendingVisitors, activeSos, maintenanceOpen, maintenanceTotal] = await Promise.all([
      prisma.tenantStay.count({
        where: {
          ownerId,
          ...(propertyId ? { propertyId } : {}),
          status: { in: [StayStatus.ACTIVE, StayStatus.CHECKED_IN] },
          startDate: { gte: todayStart },
        },
      }),
      prisma.tenantStay.count({
        where: {
          ownerId,
          ...(propertyId ? { propertyId } : {}),
          status: StayStatus.CHECKED_OUT,
          actualEndDate: { gte: todayStart },
        },
      }),
      prisma.visitorLog.count({
        where: {
          propertyId: { in: propertyIds },
          checkOutTime: null,
        },
      }),
      prisma.sOSAlert.count({
        where: {
          propertyId: { in: propertyIds },
          status: { in: ['TRIGGERED', 'ACKNOWLEDGED'] as any },
        },
      }),
      prisma.maintenanceContract.count({
        where: { ownerId, status: 'ACTIVE' },
      }),
      prisma.maintenanceContract.count({
        where: { ownerId },
      }),
    ]);

    // Real housekeeping counters derived from staff tasks (clean / sanitize / housekeep / hygiene)
    const staffTasksRaw = await prisma.staffTask.findMany({
      where: { propertyId: { in: propertyIds } },
      select: { title: true, description: true, status: true },
    });
    const HK_PATTERN = /clean|sanitiz|housekeep|hygiene/i;
    const hkTasks = staffTasksRaw.filter(
      t => HK_PATTERN.test(t.title || '') || HK_PATTERN.test(t.description || '')
    );
    const housekeepingTotal = hkTasks.length;
    const housekeepingDone = hkTasks.filter(t => String(t.status).toUpperCase() === 'COMPLETED').length;

    // Real monthly collection vs pending series derived from invoice billing months
    const monthOrder: string[] = [];
    const monthSeries = new Map<string, { collected: number; pending: number }>();
    invoices.forEach(inv => {
      const month = inv.billingMonth || (inv.dueDate ? inv.dueDate.toISOString().slice(0, 7) : '');
      if (!month) return;
      if (!monthSeries.has(month)) {
        monthSeries.set(month, { collected: 0, pending: 0 });
        monthOrder.push(month);
      }
      const agg = monthSeries.get(month)!;
      agg.collected += inv.paidAmount || 0;
      agg.pending += Math.max(0, inv.totalAmount - (inv.paidAmount || 0));
    });
    const collectionVsPending = monthOrder.slice(-6).map(month => {
      const agg = monthSeries.get(month)!;
      const parts = month.split('-');
      const shortMonth = parts[0] && parts[1] ? new Date(Number(parts[0]), Number(parts[1]) - 1, 1).toLocaleString('en', { month: 'short' }) : month;
      return { month: shortMonth, collected: Math.round(agg.collected / 100), pending: Math.round(agg.pending / 100) };
    });

    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    // Occupancy per property
    const occupancyByProperty = await Promise.all(
      properties.map(async p => {
        const bedsInProp = await prisma.bed.count({
          where: { room: { floor: { propertyId: p.id } } },
        });
        const occupiedInProp = await prisma.bed.count({
          where: { status: BedStatus.OCCUPIED, room: { floor: { propertyId: p.id } } },
        });
        return {
          name: p.name,
          occupied: occupiedInProp,
          total: bedsInProp,
        };
      })
    );

    return {
      totalProperties: properties.length,
      totalRooms,
      totalBeds,
      occupiedBeds,
      vacantBeds: Math.max(0, totalBeds - occupiedBeds),
      occupancyRate,
      totalTenants,
      openComplaints,
      staffPresent,
      messRevenue: 0,
      estimatedMonthlyRevenue,
      thisMonthCollection: totalCollected / 100, // In Rupees
      totalCollected: totalCollected / 100,
      pendingRent: pendingRent / 100,
      totalExpenses,
      netProfit: (totalCollected / 100) - totalExpenses,
      expenseBreakdown: expensesByCategory.map(e => ({
        category: e.category,
        amount: (e._sum.amount || 0) / 100,
      })),
      occupancyByProperty,
      collectionVsPending,
      todayCheckins,
      todayCheckouts,
      pendingVisitors,
      activeSos,
      maintenanceOpen,
      maintenanceTotal,
      housekeepingDone,
      housekeepingTotal,
      rentTarget: rentTarget / 100,
      defaulters: defaulterInvoices.map(inv => ({
        name: inv.stay?.tenant?.user?.fullName || 'Tenant',
        room: inv.stay?.bed?.room?.roomNumber || 'N/A',
        amount: (inv.totalAmount - inv.paidAmount) / 100,
        property: inv.stay?.property?.name || 'PG',
      })),
      vacantBedsList: vacantBedsRaw.map(b => ({
        property: b.room?.floor?.property?.name || 'PG',
        room: b.room?.roomNumber || 'N/A',
        bed: b.bedNumber,
      })),
      latestEnquiries: latestEnquiriesRaw.map(e => ({
        name: e.name,
        date: e.createdAt.toISOString().split('T')[0],
        status: e.isResolved ? 'Resolved' : 'Pending',
        property: e.property?.name || 'PG',
      })),
      recentGateLogs,
      recentStays: recentStays.map(s => ({
        id: s.id,
        tenantName: s.tenant?.user?.fullName || 'Resident',
        propertyName: s.property?.name || 'PG',
        roomNumber: s.bed?.room?.roomNumber || 'N/A',
        bedNumber: s.bed?.bedNumber || 'N/A',
        status: s.status,
        checkInDate: s.startDate,
      })),
    };
  }

  // ==========================================
  // 2. PROPERTIES CRUD
  // ==========================================
  static async listProperties(ownerId: string) {
    return prisma.property.findMany({
      where: { ownerId },
      include: {
        floors: {
          include: {
            rooms: {
              include: {
                beds: true,
              },
            },
          },
        },
        staff: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getPropertyDetail(id: string, ownerId: string) {
    return prisma.property.findFirst({
      where: { id, ownerId },
      include: {
        floors: {
          include: {
            rooms: {
              include: { beds: true },
            },
          },
        },
        staff: { include: { user: true } },
      },
    });
  }

  static async createProperty(ownerId: string, data: {
    name: string;
    type?: PropertyType;
    address: string;
    city: string;
    state?: string;
    pincode?: string;
    contactPhone: string;
    contactEmail: string;
    floorsCount?: number;
    amenities?: string[];
    rules?: string;
    defaultDeposit?: number;
    bedRent?: number;
    generateRooms?: boolean;
    singleRoomsCount?: number;
    doubleRoomsCount?: number;
    tripleRoomsCount?: number;
  }) {
    const slug = `${data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    const floorsCount = Math.max(1, Number(data.floorsCount) || 2);

    const property = await prisma.property.create({
      data: {
        ownerId,
        name: data.name,
        slug,
        type: data.type || PropertyType.BOYS_PG,
        address: data.address,
        city: data.city,
        state: data.state || 'Karnataka',
        pincode: data.pincode || '560001',
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        amenities: JSON.stringify(data.amenities || ['WiFi', 'Housekeeping', 'CCTV']),
        images: JSON.stringify([]),
        rules: data.rules || null,
      },
    });

    // Automatically create Floors, Rooms, and Beds.
    // If the UI requested a custom room mix (single/double/triple), distribute it across floors;
    // otherwise fall back to the legacy 2 double-sharing rooms per floor.
    const singles = Math.max(0, Number(data.singleRoomsCount) || 0);
    const doubles = Math.max(0, Number(data.doubleRoomsCount) || 0);
    const triples = Math.max(0, Number(data.tripleRoomsCount) || 0);
    const wantsCustomRooms = Boolean(data.generateRooms) && (singles + doubles + triples > 0);

    const roomPlan: { type: RoomType; capacity: number }[] = [];
    if (wantsCustomRooms) {
      for (let i = 0; i < singles; i++) roomPlan.push({ type: RoomType.SINGLE, capacity: 1 });
      for (let i = 0; i < doubles; i++) roomPlan.push({ type: RoomType.DOUBLE_SHARING, capacity: 2 });
      for (let i = 0; i < triples; i++) roomPlan.push({ type: RoomType.TRIPLE_SHARING, capacity: 3 });
    }

    const roomsPerFloor = wantsCustomRooms ? Math.ceil(roomPlan.length / floorsCount) : 2;
    const rentBase = Number(data.bedRent) || Number(data.defaultDeposit) || 8500;
    const rentPaise = Math.max(0, rentBase) * 100; // Rupees -> Paise

    for (let f = 1; f <= floorsCount; f++) {
      const floor = await prisma.floor.create({
        data: {
          propertyId: property.id,
          floorNumber: f,
          name: `Floor ${f}`,
        },
      });

      const roomsThisFloor = wantsCustomRooms
        ? roomPlan.slice((f - 1) * roomsPerFloor, f * roomsPerFloor)
        : Array.from({ length: 2 }, () => ({ type: RoomType.DOUBLE_SHARING, capacity: 2 }));

      let rIdx = 1;
      for (const plan of roomsThisFloor) {
        const roomNumber = `${f}${String(rIdx).padStart(2, '0')}`;
        const room = await prisma.room.create({
          data: {
            floorId: floor.id,
            roomNumber,
            type: plan.type,
            monthlyRent: rentPaise,
          },
        });
        rIdx++;

        for (let b = 1; b <= plan.capacity; b++) {
          await prisma.bed.create({
            data: {
              roomId: room.id,
              bedNumber: `B-${b}`,
              status: BedStatus.VACANT,
              monthlyRent: rentPaise,
            },
          });
        }
      }
    }

    await prisma.auditLog.create({
      data: {
        actorId: ownerId,
        ownerId,
        propertyId: property.id,
        action: 'PROPERTY_CREATED',
        entityType: 'Property',
        entityId: property.id,
        details: JSON.stringify({ name: property.name }),
      },
    });

    return property;
  }

  static async updateProperty(id: string, ownerId: string, data: any) {
    const property = await prisma.property.updateMany({
      where: { id, ownerId },
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        rules: data.rules,
        ...(data.amenities ? { amenities: JSON.stringify(data.amenities) } : {}),
      },
    });

    return property;
  }

  static async deleteProperty(id: string, ownerId: string) {
    return prisma.property.deleteMany({
      where: { id, ownerId },
    });
  }

  // ==========================================
  // 3. ROOMS & BEDS
  // ==========================================
  /**
   * Confirms the actor may manage rooms for this property.
   * OWNER must own the property, MANAGER must be assigned to it, SUPERADMIN may reach any.
   */
  static async assertRoomAccess(propertyId: string, actor: AdminActor) {
    if (!propertyId) throw new AdminRequestError('Property ID required', 400);

    const property = await prisma.property.findFirst({
      where: actor.role === 'SUPERADMIN'
        ? { id: propertyId }
        : { id: propertyId, ownerId: actor.ownerId || actor.userId },
      select: { id: true },
    });
    if (!property) throw new AdminRequestError('Property not found', 404);

    if (actor.role === 'MANAGER') {
      const assignment = await prisma.staffAssignment.findFirst({
        where: { propertyId, userId: actor.userId },
        select: { id: true },
      });
      if (!assignment) throw new AdminRequestError('This property is not assigned to you', 403);
    }

    return property.id;
  }

  static async listRooms(propertyId: string, actor: AdminActor) {
    await AdminService.assertRoomAccess(propertyId, actor);
    return prisma.room.findMany({
      where: { floor: { propertyId } },
      include: {
        beds: true,
        floor: true,
      },
      orderBy: { roomNumber: 'asc' },
    });
  }

  static async getRoom(roomId: string, actor: AdminActor) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        beds: true,
        floor: { include: { property: { select: { id: true, name: true, ownerId: true } } } },
      },
    });
    if (!room) throw new AdminRequestError('Room not found', 404);

    await AdminService.assertRoomAccess(room.floor.propertyId, actor);
    return room;
  }

  /**
   * Creates a room together with its beds in one transaction.
   * `monthlyRent` arrives in Rupees (from the UI) and is stored in Paise.
   * The sharing count maps onto RoomType so rows stay consistent with seeded data.
   */
  static async createRoom(data: {
    propertyId: string;
    roomNumber: string;
    floorNumber: number;
    bedCount: number;
    monthlyRent: number;
  }, actor: AdminActor) {
    if (!data.propertyId) throw new AdminRequestError('Property ID is required', 400);
    if (!data.roomNumber) throw new AdminRequestError('Room number is required', 400);
    if (!Number.isInteger(data.floorNumber) || data.floorNumber < 0 || data.floorNumber > 200) {
      throw new AdminRequestError('Floor must be a whole number between 0 and 200', 400);
    }
    if (!Number.isInteger(data.bedCount) || data.bedCount < 1 || data.bedCount > 100) {
      throw new AdminRequestError('Sharing count must be a whole number between 1 and 100', 400);
    }
    if (!Number.isFinite(data.monthlyRent) || data.monthlyRent < 0) {
      throw new AdminRequestError('Rent per bed must be a non-negative number', 400);
    }

    const rentPaise = Math.round(data.monthlyRent * 100);
    if (rentPaise > 2147483647) throw new AdminRequestError('Rent per bed is too large', 400);

    await AdminService.assertRoomAccess(data.propertyId, actor);

    const typeMap: Record<number, RoomType> = {
      1: RoomType.SINGLE,
      2: RoomType.DOUBLE_SHARING,
      3: RoomType.TRIPLE_SHARING,
      4: RoomType.FOUR_SHARING,
    };

    try {
      const room = await prisma.$transaction(async (tx) => {
        const floor = await tx.floor.upsert({
          where: { propertyId_floorNumber: { propertyId: data.propertyId, floorNumber: data.floorNumber } },
          update: {},
          create: {
            propertyId: data.propertyId,
            floorNumber: data.floorNumber,
            name: `Floor ${data.floorNumber}`,
          },
        });

        return tx.room.create({
          data: {
            floorId: floor.id,
            roomNumber: data.roomNumber,
            type: typeMap[data.bedCount] || RoomType.DORMITORY,
            monthlyRent: rentPaise,
            beds: {
              create: Array.from({ length: data.bedCount }, (_, index) => ({
                bedNumber: `B-${index + 1}`,
                status: BedStatus.VACANT,
                monthlyRent: rentPaise,
              })),
            },
          },
          include: { beds: true, floor: true },
        });
      });

      await prisma.auditLog.create({
        data: {
          actorId: actor.userId,
          ownerId: actor.ownerId || actor.userId,
          propertyId: data.propertyId,
          action: 'ROOM_CREATED',
          entityType: 'Room',
          entityId: room.id,
          details: JSON.stringify({ roomNumber: room.roomNumber, bedCount: data.bedCount, monthlyRent: data.monthlyRent }),
        },
      });

      return room;
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new AdminRequestError('This room number already exists on this floor', 409);
      }
      throw error;
    }
  }

  /** Deletes a room and its beds. Refuses while any bed is still occupied. */
  static async deleteRoom(roomId: string, actor: AdminActor) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { beds: true, floor: true },
    });
    if (!room) throw new AdminRequestError('Room not found', 404);

    await AdminService.assertRoomAccess(room.floor.propertyId, actor);

    if (room.beds.some(bed => bed.status === BedStatus.OCCUPIED)) {
      throw new AdminRequestError('Cannot delete a room while a bed is occupied. Check the tenant out first.', 409);
    }

    await prisma.room.delete({ where: { id: roomId } });

    await prisma.auditLog.create({
      data: {
        actorId: actor.userId,
        ownerId: actor.ownerId || actor.userId,
        propertyId: room.floor.propertyId,
        action: 'ROOM_DELETED',
        entityType: 'Room',
        entityId: roomId,
        details: JSON.stringify({ roomNumber: room.roomNumber, bedCount: room.beds.length }),
      },
    });

    return { id: roomId };
  }

  /**
   * Rooms have no status column, so "under maintenance" lives on the beds:
   * vacant beds flip to UNDER_MAINTENANCE and back to VACANT in one update.
   * Beds that are occupied or reserved are never touched.
   */
  static async setRoomMaintenance(roomId: string, isMaintenance: boolean, actor: AdminActor) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { beds: { select: { id: true, status: true } }, floor: true },
    });
    if (!room) throw new AdminRequestError('Room not found', 404);

    await AdminService.assertRoomAccess(room.floor.propertyId, actor);

    const from = isMaintenance ? BedStatus.VACANT : BedStatus.UNDER_MAINTENANCE;
    const to = isMaintenance ? BedStatus.UNDER_MAINTENANCE : BedStatus.VACANT;
    const bedIds = room.beds.filter(bed => bed.status === from).map(bed => bed.id);

    if (bedIds.length === 0) {
      throw new AdminRequestError(
        isMaintenance ? 'No vacant beds to block' : 'No beds are under maintenance',
        409
      );
    }

    await prisma.bed.updateMany({ where: { id: { in: bedIds } }, data: { status: to } });

    await prisma.auditLog.create({
      data: {
        actorId: actor.userId,
        ownerId: actor.ownerId || actor.userId,
        propertyId: room.floor.propertyId,
        action: isMaintenance ? 'ROOM_MAINTENANCE_STARTED' : 'ROOM_MAINTENANCE_ENDED',
        entityType: 'Room',
        entityId: roomId,
        details: JSON.stringify({ roomNumber: room.roomNumber, beds: bedIds.length }),
      },
    });

    return { id: roomId, isMaintenance, updatedBeds: bedIds.length };
  }

  static async updateBedStatus(bedId: string, status: BedStatus, actor: AdminActor) {
    if (!Object.values(BedStatus).includes(status)) {
      throw new AdminRequestError(`Unsupported bed status: ${status}`, 400);
    }

    const bed = await prisma.bed.findUnique({
      where: { id: bedId },
      include: { room: { include: { floor: true } } },
    });
    if (!bed) throw new AdminRequestError('Bed not found', 404);

    await AdminService.assertRoomAccess(bed.room.floor.propertyId, actor);

    return prisma.bed.update({
      where: { id: bedId },
      data: { status },
    });
  }

  // ==========================================
  // 4. TENANTS & ONBOARDING
  // ==========================================
  static async listTenants(ownerId: string, propertyId?: string) {
    const stays = await prisma.tenantStay.findMany({
      where: {
        ownerId,
        ...(propertyId ? { propertyId } : {}),
      },
      include: {
        tenant: {
          include: { user: true, parentProfile: { include: { user: true } } },
        },
        bed: { include: { room: true } },
        property: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return stays.map(s => ({
      id: s.tenant.id,
      userId: s.tenant.userId,
      stayId: s.id,
      name: s.tenant.user.fullName,
      email: s.tenant.user.email,
      phone: s.tenant.user.phone,
      propertyId: s.propertyId,
      propertyName: s.property.name,
      roomNumber: s.bed.room.roomNumber,
      bedNumber: s.bed.bedNumber,
      monthlyRent: s.monthlyRent / 100,
      securityDeposit: s.securityDeposit / 100,
      status: s.status,
      startDate: s.startDate,
      emergencyContactName: s.tenant.emergencyContactName,
      emergencyContactPhone: s.tenant.emergencyContactPhone,
    }));
  }

  static async onboardTenant(ownerId: string, data: {
    fullName: string;
    email: string;
    phone: string;
    propertyId: string;
    bedId: string;
    monthlyRent: number;
    securityDeposit: number;
    startDate: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    permanentAddress?: string;
    idProofType?: string;
    idProofNumber?: string;
  }) {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { phone: data.phone }] },
    });

    if (existingUser) {
      throw new Error('Email or Phone is already registered');
    }

    const passwordHash = await bcrypt.hash('Student@123456', 10);

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        passwordHash,
        role: UserRole.STUDENT,
        ownerId,
        mustChangePassword: true,
      },
    });

    const tenantProfile = await prisma.tenantProfile.create({
      data: {
        userId: user.id,
        emergencyContactName: data.emergencyContactName || 'Parent',
        emergencyContactPhone: data.emergencyContactPhone || data.phone,
        permanentAddress: data.permanentAddress || 'Address',
        idProofType: data.idProofType || 'AADHAAR',
        idProofNumber: data.idProofNumber || '123456789012',
      },
    });

    const stay = await prisma.tenantStay.create({
      data: {
        ownerId,
        propertyId: data.propertyId,
        tenantId: tenantProfile.id,
        bedId: data.bedId,
        monthlyRent: data.monthlyRent * 100,
        securityDeposit: data.securityDeposit * 100,
        startDate: new Date(data.startDate || Date.now()),
        status: StayStatus.ACTIVE,
      },
    });

    await prisma.bed.update({
      where: { id: data.bedId },
      data: { status: BedStatus.OCCUPIED },
    });

    await prisma.auditLog.create({
      data: {
        actorId: ownerId,
        ownerId,
        propertyId: data.propertyId,
        action: 'TENANT_ONBOARDED',
        entityType: 'TenantStay',
        entityId: stay.id,
        details: JSON.stringify({ name: user.fullName, email: user.email }),
      },
    });

    return { user, tenantProfile, stay };
  }

  // ==========================================
  // 5. STAFF & TEAM
  // ==========================================
  static async listStaff(ownerId: string) {
    const staffAssignments = await prisma.staffAssignment.findMany({
      where: { property: { ownerId } },
      include: {
        user: true,
        property: true,
      },
    });

    return staffAssignments.map(s => ({
      id: s.id,
      userId: s.userId,
      name: s.user.fullName,
      email: s.user.email,
      phone: s.user.phone,
      role: s.user.role,
      propertyId: s.propertyId,
      propertyName: s.property.name,
      createdAt: s.createdAt,
    }));
  }

  static async createStaff(ownerId: string, data: {
    fullName: string;
    email: string;
    phone: string;
    role?: UserRole;
    propertyId: string;
  }) {
    const passwordHash = await bcrypt.hash('Staff@123456', 10);
    const role = data.role || UserRole.MANAGER;

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        passwordHash,
        role,
        ownerId,
        mustChangePassword: true,
      },
    });

    const assignment = await prisma.staffAssignment.create({
      data: {
        userId: user.id,
        propertyId: data.propertyId,
        permissions: JSON.stringify(['all']),
      },
    });

    return { user, assignment };
  }

  // ==========================================
  // 6. COMPLAINTS
  // ==========================================
  static async listComplaints(ownerId: string, propertyId?: string) {
    return prisma.complaint.findMany({
      where: {
        ownerId,
        ...(propertyId ? { propertyId } : {}),
      },
      include: { property: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createComplaint(ownerId: string, data: {
    propertyId: string;
    title: string;
    description: string;
    category?: string;
    priority?: ComplaintPriority;
  }) {
    return prisma.complaint.create({
      data: {
        ownerId,
        propertyId: data.propertyId,
        title: data.title,
        description: data.description,
        category: data.category || 'GENERAL',
        priority: data.priority || ComplaintPriority.MEDIUM,
        status: ComplaintStatus.OPEN,
      },
    });
  }

  static async updateComplaintStatus(id: string, status: ComplaintStatus) {
    return prisma.complaint.update({
      where: { id },
      data: {
        status,
        ...(status === ComplaintStatus.RESOLVED ? { resolvedAt: new Date() } : {}),
      },
    });
  }

  // ==========================================
  // 7. GATE LOGS & NOTICES & MAINTENANCE & FOOD & FINANCE
  // ==========================================
  static async listGateLogs(propertyId: string, ownerId: string, managerId?: string) {
    await this.requireGateProperty(propertyId, ownerId, managerId);
    return prisma.gateLog.findMany({
      where: { propertyId },
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Everything the printed gate QR poster needs.
   *
   * The poster used to be drawn from a hash of the property name, which no scanner
   * could ever decode, and it carried no verifiable token — so attendance could be
   * recorded from anywhere. This returns a real, signed token plus the real
   * property details (the curfew is no longer a hardcoded "10:00 PM").
   */
  static async getPropertyGateQr(propertyId: string, actor: AdminActor) {
    await AdminService.assertRoomAccess(propertyId, actor);

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, name: true, address: true, contactPhone: true, curfewTime: true },
    });
    if (!property) throw new AdminRequestError('Property not found', 404);

    const token = signGateToken(property.id);
    return {
      propertyId: property.id,
      propertyName: property.name,
      address: property.address,
      contactPhone: property.contactPhone,
      curfewTime: property.curfewTime,
      token,
      /** Route the QR deep-links to; the browser prepends its own origin. */
      scanPath: gateScanPath(token),
    };
  }

  private static async requireGateProperty(propertyId: string, ownerId: string, managerId?: string) {
    const property = await prisma.property.findFirst({ where: { id: propertyId, ownerId }, select: { id: true } });
    if (!property) throw new Error('Property not found');
    if (managerId) {
      const assignment = await prisma.staffAssignment.findFirst({ where: { propertyId, userId: managerId } });
      if (!assignment) throw new Error('Property is not assigned to this manager');
    }
  }

  static async addGateLog(ownerId: string, actorId: string, data: {
    propertyId: string;
    studentId: string;
    type: string;
    reason?: string;
    destination?: string;
    expectedReturnTime?: string;
    isLate?: boolean;
  }, managerId?: string) {
    await this.requireGateProperty(data.propertyId, ownerId, managerId);
    const type = data.type.toUpperCase();
    if (!['ENTRY', 'EXIT'].includes(type)) throw new Error('Movement must be ENTRY or EXIT');
    const stay = await prisma.tenantStay.findFirst({
      where: {
        ownerId, propertyId: data.propertyId,
        status: { in: [StayStatus.ACTIVE, StayStatus.CHECKED_IN, StayStatus.NOTICE_PERIOD] },
        OR: [{ tenantId: data.studentId }, { tenant: { userId: data.studentId } }],
      },
      include: { tenant: { include: { user: { select: { fullName: true } } } }, bed: { include: { room: true } } },
      orderBy: { startDate: 'desc' },
    });
    if (!stay) throw new Error('Active resident not found in this property');
    return prisma.gateLog.create({
      data: {
        propertyId: data.propertyId,
        userId: stay.tenant.userId,
        studentName: stay.tenant.user.fullName,
        roomNumber: stay.bed.room.roomNumber,
        type, entryType: type,
        reason: data.reason,
        destination: data.destination,
        expectedReturnTime: type === 'EXIT' ? data.expectedReturnTime : null,
        isLate: type === 'ENTRY' && data.isLate === true,
        loggedBy: actorId,
      },
    });
  }

  static async listNotices(ownerId: string) {
    return prisma.auditLog.findMany({
      where: { ownerId, action: 'NOTICE_BROADCAST' },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createNotice(ownerId: string, data: { title: string; message: string; propertyId?: string }) {
    return prisma.auditLog.create({
      data: {
        ownerId,
        propertyId: data.propertyId,
        action: 'NOTICE_BROADCAST',
        entityType: 'Notice',
        entityId: ownerId,
        details: JSON.stringify({ title: data.title, message: data.message }),
      },
    });
  }

  static async deleteNotice(id: string) {
    return prisma.auditLog.delete({ where: { id } });
  }

  static async getFoodMenu(ownerId: string) {
    const menu = await prisma.foodMenu.findUnique({
      where: { ownerId },
    });
    return menu ? JSON.parse(menu.weekMenuJson) : null;
  }

  static async updateFoodMenu(ownerId: string, weekMenuJson: string) {
    return prisma.foodMenu.upsert({
      where: { ownerId },
      update: { weekMenuJson },
      create: { ownerId, weekMenuJson },
    });
  }

  static async listMaintenance(ownerId: string) {
    return prisma.expense.findMany({
      where: { ownerId, category: 'REPAIR' },
      orderBy: { expenseDate: 'desc' },
    });
  }

  static async createMaintenance(ownerId: string, data: { propertyId: string; title: string; amount: number }) {
    return prisma.expense.create({
      data: {
        ownerId,
        propertyId: data.propertyId,
        category: 'REPAIR',
        title: data.title,
        amount: data.amount * 100,
        expenseDate: new Date(),
      },
    });
  }

  static async getFinanceSummary(ownerId: string) {
    const invoices = await prisma.invoice.findMany({ where: { ownerId } });
    const expenses = await prisma.expense.findMany({ where: { ownerId } });

    const totalInvoiced = invoices.reduce((sum, i) => sum + i.totalAmount, 0) / 100;
    const totalCollected = invoices.reduce((sum, i) => sum + i.paidAmount, 0) / 100;
    const pendingRent = Math.max(0, totalInvoiced - totalCollected);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0) / 100;

    return {
      totalInvoiced,
      totalCollected,
      pendingRent,
      totalExpenses,
      netProfit: totalCollected - totalExpenses,
    };
  }

  static async listExpenses(ownerId: string, propertyId?: string) {
    return prisma.expense.findMany({
      where: { ownerId, ...(propertyId ? { propertyId } : {}) },
      include: { property: true },
      orderBy: { expenseDate: 'desc' },
    });
  }

  static async createExpense(ownerId: string, data: { propertyId: string; category: string; title: string; amount: number; expenseDate?: Date }) {
    return prisma.expense.create({
      data: {
        ownerId,
        propertyId: data.propertyId,
        category: data.category || 'OPERATIONAL',
        title: data.title,
        amount: Math.round(data.amount * 100),
        expenseDate: data.expenseDate || new Date(),
      },
    });
  }

  static async listEnquiries(ownerId: string, propertyId?: string) {
    const props = await prisma.property.findMany({ where: { ownerId }, select: { id: true } });
    const propertyIds = props.map(p => p.id);
    return prisma.enquiry.findMany({
      where: { propertyId: propertyId ? propertyId : { in: propertyIds } },
      include: { property: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createEnquiry(data: { propertyId: string; name: string; phone: string; email?: string; message?: string }) {
    return prisma.enquiry.create({
      data: {
        propertyId: data.propertyId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        message: data.message,
      },
    });
  }

  static async resolveEnquiry(id: string) {
    return prisma.enquiry.update({
      where: { id },
      data: { isResolved: true },
    });
  }

  static async listStaffAttendance(ownerId: string, propertyId?: string, date?: string) {
    const props = await prisma.property.findMany({ where: { ownerId }, select: { id: true } });
    const scopedIds = propertyId ? [propertyId] : props.map(p => p.id);
    if (scopedIds.length === 0) return [];

    // Attendance rows are shared with residents, so scope to users that actually
    // hold a staff/manager role under this owner. Without this the owner's staff
    // register used to be filled with student rows.
    const staffUsers = await prisma.user.findMany({
      where: { ownerId, role: { in: [UserRole.MANAGER, UserRole.STAFF] } },
      select: { id: true },
    });
    if (staffUsers.length === 0) return [];

    // The `?date=` filter used to be dropped on the floor by the controller, so the
    // date picker in the UI did nothing. Compare on the canonical day key.
    const day = date ? attendanceDateFromKey(date) : undefined;

    return prisma.attendance.findMany({
      where: {
        propertyId: { in: scopedIds },
        userId: { in: staffUsers.map(u => u.id) },
        ...(day ? { date: day } : {}),
      },
      orderBy: { date: 'desc' },
      take: 100,
    });
  }

  static async recordStaffAttendance(data: { propertyId: string; userId: string; date: Date; status: any; remarks?: string }) {
    const targetDate = attendanceDateFromKey(data.date.toISOString());
    return prisma.attendance.upsert({
      where: { propertyId_userId_date: { propertyId: data.propertyId, userId: data.userId, date: targetDate } },
      update: { status: data.status, remarks: data.remarks },
      create: { propertyId: data.propertyId, userId: data.userId, date: targetDate, status: data.status, remarks: data.remarks },
    });
  }

  // ==========================================
  // VISITORS
  // ==========================================
  /** Owner-scoped visitor logs. A visitor is "inside" while checkOutTime is null. */
  static async listVisitors(ownerId: string, propertyId?: string) {
    const props = await prisma.property.findMany({ where: { ownerId }, select: { id: true } });
    const scopedIds = propertyId ? [propertyId] : props.map(p => p.id);
    if (scopedIds.length === 0) return [];

    return prisma.visitorLog.findMany({
      where: { propertyId: { in: scopedIds } },
      orderBy: { checkInTime: 'desc' },
      take: 200,
    });
  }

  /**
   * Marks a visitor as checked out. The schema has no approve/reject concept —
   * presence inside the property is modelled purely by checkOutTime being null.
   */
  static async checkoutVisitor(id: string) {
    const visitor = await prisma.visitorLog.findUnique({ where: { id } });
    if (!visitor) throw new Error('Visitor log not found');
    if (visitor.checkOutTime) return visitor;
    return prisma.visitorLog.update({ where: { id }, data: { checkOutTime: new Date() } });
  }

  // ==========================================
  // LEAVE REQUESTS
  // ==========================================
  static async listLeaves(ownerId: string, propertyId?: string, status?: string) {
    const props = await prisma.property.findMany({ where: { ownerId }, select: { id: true } });
    const scopedIds = propertyId ? [propertyId] : props.map(p => p.id);
    if (scopedIds.length === 0) return [];

    return prisma.leaveRequest.findMany({
      where: {
        propertyId: { in: scopedIds },
        ...(status ? { status: status.toUpperCase() } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  static async updateLeaveStatus(id: string, status: string, approvedBy: string) {
    const leave = await prisma.leaveRequest.findUnique({ where: { id } });
    if (!leave) throw new Error('Leave request not found');

    const normalized = status.toUpperCase();
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(normalized)) {
      throw new Error('Status must be PENDING, APPROVED or REJECTED');
    }

    return prisma.leaveRequest.update({
      where: { id },
      data: { status: normalized, approvedBy: normalized === 'APPROVED' ? approvedBy : null },
    });
  }

  // ==========================================
  // STUDENT ATTENDANCE
  // ==========================================
  static async listAttendance(ownerId: string, propertyId?: string, date?: string) {
    const props = await prisma.property.findMany({ where: { ownerId }, select: { id: true } });
    const scopedIds = propertyId ? [propertyId] : props.map(p => p.id);
    if (scopedIds.length === 0) return [];

    // Mirror of the staff register: this endpoint is the *resident* register, so it
    // must not return staff/manager rows out of the shared Attendance table.
    const residents = await prisma.user.findMany({
      where: { ownerId, role: UserRole.STUDENT },
      select: { id: true },
    });
    if (residents.length === 0) return [];

    // Canonical day comparison. A raw UTC-midnight equality check used to miss the
    // rows written by the student gate flow (which stored local midnight).
    const day = date ? attendanceDateFromKey(date) : undefined;

    return prisma.attendance.findMany({
      where: {
        propertyId: { in: scopedIds },
        userId: { in: residents.map(u => u.id) },
        ...(day ? { date: day } : {}),
      },
      orderBy: { date: 'desc' },
      take: 300,
    });
  }

  /**
   * Records (or updates) a student's attendance for a given day.
   * Reuses the shared Attendance table, keyed by the student's userId, and always
   * writes the canonical day value so it can never duplicate a gate-log row.
   */
  static async recordStudentAttendance(data: { propertyId: string; userId: string; date: Date; status: string; remarks?: string }) {
    const targetDate = attendanceDateFromKey(data.date.toISOString());
    const status = data.status.toUpperCase() as AttendanceStatus;

    return prisma.attendance.upsert({
      where: { propertyId_userId_date: { propertyId: data.propertyId, userId: data.userId, date: targetDate } },
      update: { status, remarks: data.remarks },
      create: { propertyId: data.propertyId, userId: data.userId, date: targetDate, status, remarks: data.remarks },
    });
  }

  // ==========================================
  // INVENTORY / STOCK
  // ==========================================
  static async listInventory(ownerId: string, propertyId?: string) {
    const props = await prisma.property.findMany({ where: { ownerId }, select: { id: true } });
    const scopedIds = propertyId ? [propertyId] : props.map(p => p.id);
    if (scopedIds.length === 0) return [];

    return prisma.stockItem.findMany({
      where: { propertyId: { in: scopedIds } },
      orderBy: { itemName: 'asc' },
    });
  }

  static async createInventoryItem(data: {
    propertyId: string;
    itemName: string;
    category: string;
    currentQuantity: number;
    unit?: string;
    minThreshold?: number;
  }) {
    return prisma.stockItem.create({
      data: {
        propertyId: data.propertyId,
        itemName: data.itemName,
        category: data.category,
        currentQuantity: Number(data.currentQuantity) || 0,
        unit: data.unit || 'kg',
        minThreshold: data.minThreshold !== undefined ? Number(data.minThreshold) : 5,
      },
    });
  }

  static async updateInventoryItem(id: string, data: { currentQuantity?: number; minThreshold?: number; unit?: string; category?: string }) {
    const item = await prisma.stockItem.findUnique({ where: { id } });
    if (!item) throw new Error('Stock item not found');

    return prisma.stockItem.update({
      where: { id },
      data: {
        ...(data.currentQuantity !== undefined ? { currentQuantity: Number(data.currentQuantity) } : {}),
        ...(data.minThreshold !== undefined ? { minThreshold: Number(data.minThreshold) } : {}),
        ...(data.unit ? { unit: data.unit } : {}),
        ...(data.category ? { category: data.category } : {}),
      },
    });
  }

  // ==========================================
  // STAFF TASKS (housekeeping / maintenance work orders)
  // ==========================================
  static async listStaffTasks(ownerId: string, propertyId?: string, status?: string) {
    const props = await prisma.property.findMany({ where: { ownerId }, select: { id: true } });
    const scopedIds = propertyId ? [propertyId] : props.map(p => p.id);
    if (scopedIds.length === 0) return [];

    return prisma.staffTask.findMany({
      where: {
        propertyId: { in: scopedIds },
        ...(status ? { status: status.toUpperCase() } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 300,
    });
  }

  static async createStaffTask(data: {
    propertyId: string;
    assignedTo: string;
    title: string;
    description: string;
    priority?: string;
    dueDate?: string;
  }) {
    return prisma.staffTask.create({
      data: {
        propertyId: data.propertyId,
        assignedTo: data.assignedTo,
        title: data.title,
        description: data.description,
        priority: (data.priority || 'MEDIUM').toUpperCase(),
        status: 'PENDING',
        ...(data.dueDate ? { dueDate: new Date(data.dueDate) } : {}),
      },
    });
  }

  static async updateStaffTaskStatus(id: string, status: string) {
    const task = await prisma.staffTask.findUnique({ where: { id } });
    if (!task) throw new Error('Task not found');

    const normalized = status.toUpperCase();
    if (!['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(normalized)) {
      throw new Error('Status must be PENDING, IN_PROGRESS, COMPLETED or CANCELLED');
    }

    return prisma.staffTask.update({ where: { id }, data: { status: normalized } });
  }

  // ==========================================
  // INVOICES & PAYMENTS
  // Amounts are stored in paise (Int); the API returns rupees for display.
  // ==========================================
  static async listInvoices(ownerId: string, propertyId?: string, status?: string) {
    const invoices = await prisma.invoice.findMany({
      where: {
        ownerId,
        ...(propertyId ? { propertyId } : {}),
        ...(status ? { status: status.toUpperCase() as InvoiceStatus } : {}),
      },
      include: {
        stay: {
          include: {
            tenant: { include: { user: true } },
            bed: { include: { room: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 300,
    });

    return invoices.map(inv => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      propertyId: inv.propertyId,
      stayId: inv.stayId,
      billingMonth: inv.billingMonth,
      dueDate: inv.dueDate,
      status: inv.status,
      totalAmount: inv.totalAmount / 100,
      paidAmount: inv.paidAmount / 100,
      balance: (inv.totalAmount - inv.paidAmount) / 100,
      studentName: inv.stay?.tenant?.user?.fullName || 'Resident',
      roomNumber: inv.stay?.bed?.room?.roomNumber || 'N/A',
      bedNumber: inv.stay?.bed?.bedNumber || 'N/A',
      createdAt: inv.createdAt,
    }));
  }

  /**
   * Records a payment against an invoice and advances its status.
   * Wrapped in a transaction so the ledger and the invoice can never diverge.
   */
  static async recordInvoicePayment(params: { ownerId: string; invoiceId: string; amount: number; method?: string }) {
    const invoice = await prisma.invoice.findUnique({ where: { id: params.invoiceId } });
    if (!invoice) throw new Error('Invoice not found');
    if (invoice.ownerId !== params.ownerId) throw new Error('Invoice does not belong to this owner');

    const amountPaise = Math.round(params.amount * 100);
    if (!Number.isFinite(amountPaise) || amountPaise <= 0) throw new Error('Payment amount must be greater than zero');

    const outstanding = invoice.totalAmount - invoice.paidAmount;
    if (outstanding <= 0) throw new Error('Invoice is already fully paid');
    if (amountPaise > outstanding) throw new Error('Payment exceeds the outstanding balance');

    const method = (params.method || 'CASH').toUpperCase() as PaymentMethod;
    const newPaid = invoice.paidAmount + amountPaise;
    const newStatus = newPaid >= invoice.totalAmount ? InvoiceStatus.PAID : InvoiceStatus.PARTIALLY_PAID;

    return prisma.$transaction(async tx => {
      const payment = await tx.payment.create({
        data: {
          ownerId: params.ownerId,
          invoiceId: invoice.id,
          transactionRef: `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          amount: amountPaise,
          method,
          status: PaymentStatus.COMPLETED,
        },
      });

      const updated = await tx.invoice.update({
        where: { id: invoice.id },
        data: { paidAmount: newPaid, status: newStatus },
      });

      return {
        payment: { ...payment, amount: payment.amount / 100 },
        invoice: { ...updated, totalAmount: updated.totalAmount / 100, paidAmount: updated.paidAmount / 100 },
      };
    });
  }

  // ==========================================
  // DOCUMENTS
  // Documents belong to a tenant, so they are scoped through the owner's
  // properties -> stays -> tenants.
  // ==========================================
  static async listDocuments(ownerId: string, propertyId?: string) {
    const props = await prisma.property.findMany({ where: { ownerId }, select: { id: true } });
    const scopedIds = propertyId ? [propertyId] : props.map(p => p.id);
    if (scopedIds.length === 0) return [];

    const stays = await prisma.tenantStay.findMany({
      where: { ownerId, propertyId: { in: scopedIds } },
      select: {
        id: true,
        propertyId: true,
        bed: { select: { room: { select: { roomNumber: true } } } },
        tenant: {
          select: {
            id: true,
            user: { select: { fullName: true } },
            documents: { select: { id: true, type: true, fileUrl: true, fileName: true, fileSize: true, uploadedAt: true } },
          },
        },
      },
    });

    return stays.flatMap(stay =>
      (stay.tenant.documents || []).map(doc => ({
        id: doc.id,
        tenantId: stay.tenant.id,
        tenantName: stay.tenant.user?.fullName || 'Resident',
        propertyId: stay.propertyId,
        roomNumber: stay.bed?.room?.roomNumber || 'N/A',
        type: doc.type,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        fileSize: doc.fileSize,
        uploadedAt: doc.uploadedAt,
      }))
    );
  }
}
