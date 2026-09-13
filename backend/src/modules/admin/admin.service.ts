import bcrypt from 'bcryptjs';
import { prisma } from '../../db';
import { UserRole, BedStatus, StayStatus, ComplaintStatus, PropertyType, RoomType, ComplaintPriority } from '@prisma/client';

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

    const [totalBeds, occupiedBeds, totalTenants, openComplaints, recentGateLogs, recentStays] = await Promise.all([
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
    ]);

    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
    const estimatedMonthlyRevenue = occupiedBeds * 8500;

    return {
      totalProperties: properties.length,
      totalBeds,
      occupiedBeds,
      vacantBeds: Math.max(0, totalBeds - occupiedBeds),
      occupancyRate,
      totalTenants,
      openComplaints,
      estimatedMonthlyRevenue,
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
    const properties = await prisma.property.findMany({
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

    return properties.map(p => {
      let bedCount = 0;
      let occupiedCount = 0;
      let roomCount = 0;

      p.floors.forEach(f => {
        roomCount += f.rooms.length;
        f.rooms.forEach(r => {
          bedCount += r.beds.length;
          occupiedCount += r.beds.filter(b => b.status === BedStatus.OCCUPIED).length;
        });
      });

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        type: p.type,
        address: p.address,
        city: p.city,
        state: p.state,
        pincode: p.pincode,
        contactPhone: p.contactPhone,
        contactEmail: p.contactEmail,
        amenities: typeof p.amenities === 'string' ? JSON.parse(p.amenities || '[]') : p.amenities,
        images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : p.images,
        rules: p.rules,
        totalFloors: p.floors.length,
        totalRooms: roomCount,
        totalBeds: bedCount,
        occupiedBeds: occupiedCount,
        vacantBeds: Math.max(0, bedCount - occupiedCount),
        occupancyRate: bedCount > 0 ? Math.round((occupiedCount / bedCount) * 100) : 0,
        staffCount: p.staff.length,
        createdAt: p.createdAt,
      };
    });
  }

  static async getPropertyDetail(propertyId: string, ownerId: string) {
    const property = await prisma.property.findFirst({
      where: { id: propertyId, ownerId },
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
    });

    if (!property) return null;

    let bedCount = 0;
    let occupiedCount = 0;
    let roomCount = 0;

    property.floors.forEach(f => {
      roomCount += f.rooms.length;
      f.rooms.forEach(r => {
        bedCount += r.beds.length;
        occupiedCount += r.beds.filter(b => b.status === BedStatus.OCCUPIED).length;
      });
    });

    return {
      ...property,
      amenities: typeof property.amenities === 'string' ? JSON.parse(property.amenities || '[]') : property.amenities,
      images: typeof property.images === 'string' ? JSON.parse(property.images || '[]') : property.images,
      totalFloors: property.floors.length,
      totalRooms: roomCount,
      totalBeds: bedCount,
      occupiedBeds: occupiedCount,
      vacantBeds: Math.max(0, bedCount - occupiedCount),
    };
  }

  static async createProperty(data: {
    ownerId: string;
    name: string;
    type: PropertyType;
    address: string;
    city: string;
    state?: string;
    pincode?: string;
    contactPhone: string;
    contactEmail: string;
    amenities?: string[];
    rules?: string;
    floorsCount?: number;
  }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

    const property = await prisma.property.create({
      data: {
        ownerId: data.ownerId,
        name: data.name,
        slug,
        type: data.type || PropertyType.BOYS_PG,
        address: data.address,
        city: data.city,
        state: data.state || 'State',
        pincode: data.pincode || '560001',
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        amenities: JSON.stringify(data.amenities || ['WiFi', 'Power Backup', 'CCTV', 'Meals']),
        images: JSON.stringify([]),
        rules: data.rules || 'Curfew time: 10:00 PM. No smoking on premises.',
      },
    });

    // Auto-create initial floors if specified
    const floorsCount = data.floorsCount || 2;
    for (let i = 1; i <= floorsCount; i++) {
      await prisma.floor.create({
        data: {
          propertyId: property.id,
          floorNumber: i,
          name: `Floor ${i}`,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        actorId: data.ownerId,
        ownerId: data.ownerId,
        propertyId: property.id,
        action: 'PROPERTY_CREATED',
        entityType: 'Property',
        entityId: property.id,
        details: JSON.stringify({ name: property.name, city: property.city }),
      },
    });

    return property;
  }

  static async updateProperty(propertyId: string, ownerId: string, data: Partial<any>) {
    return prisma.property.update({
      where: { id: propertyId },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.type ? { type: data.type } : {}),
        ...(data.address ? { address: data.address } : {}),
        ...(data.city ? { city: data.city } : {}),
        ...(data.contactPhone ? { contactPhone: data.contactPhone } : {}),
        ...(data.contactEmail ? { contactEmail: data.contactEmail } : {}),
        ...(data.amenities ? { amenities: JSON.stringify(data.amenities) } : {}),
        ...(data.rules !== undefined ? { rules: data.rules } : {}),
      },
    });
  }

  static async deleteProperty(propertyId: string, ownerId: string) {
    return prisma.property.delete({
      where: { id: propertyId },
    });
  }

  // ==========================================
  // 3. ROOMS & BEDS
  // ==========================================
  static async listRooms(propertyId: string) {
    const rooms = await prisma.room.findMany({
      where: { floor: { propertyId } },
      include: {
        floor: true,
        beds: {
          include: {
            stays: {
              where: { status: { in: [StayStatus.ACTIVE, StayStatus.CHECKED_IN] } },
              include: {
                tenant: { include: { user: true } },
              },
            },
          },
        },
      },
      orderBy: { roomNumber: 'asc' },
    });

    return rooms.map(r => {
      const totalBeds = r.beds.length;
      const occupiedBeds = r.beds.filter(b => b.status === BedStatus.OCCUPIED).length;

      return {
        id: r.id,
        floorId: r.floorId,
        floorNumber: r.floor.floorNumber,
        floorName: r.floor.name,
        roomNumber: r.roomNumber,
        type: r.type,
        monthlyRent: r.monthlyRent,
        totalBeds,
        occupiedBeds,
        vacantBeds: Math.max(0, totalBeds - occupiedBeds),
        status: occupiedBeds === totalBeds && totalBeds > 0 ? 'Full' : occupiedBeds > 0 ? 'Partial' : 'Available',
        beds: r.beds.map(b => ({
          id: b.id,
          bedNumber: b.bedNumber,
          status: b.status,
          monthlyRent: b.monthlyRent,
          currentTenant: b.stays[0]?.tenant?.user ? {
            id: b.stays[0].tenant.user.id,
            name: b.stays[0].tenant.user.fullName,
            phone: b.stays[0].tenant.user.phone,
          } : null,
        })),
      };
    });
  }

  static async createRoom(data: {
    floorId: string;
    roomNumber: string;
    type: RoomType;
    monthlyRent: number;
    bedCount: number;
  }) {
    const room = await prisma.room.create({
      data: {
        floorId: data.floorId,
        roomNumber: data.roomNumber,
        type: data.type || RoomType.DOUBLE_SHARING,
        monthlyRent: data.monthlyRent || 8500,
      },
    });

    const count = data.bedCount || 2;
    for (let i = 1; i <= count; i++) {
      await prisma.bed.create({
        data: {
          roomId: room.id,
          bedNumber: `B-${i}`,
          status: BedStatus.VACANT,
          monthlyRent: data.monthlyRent || 8500,
        },
      });
    }

    return room;
  }

  static async updateBedStatus(bedId: string, status: BedStatus) {
    return prisma.bed.update({
      where: { id: bedId },
      data: { status },
    });
  }

  // ==========================================
  // 4. STAFF / MANAGERS MANAGEMENT
  // ==========================================
  static async listStaff(ownerId: string) {
    const staff = await prisma.user.findMany({
      where: {
        ownerId,
        role: { in: [UserRole.MANAGER, UserRole.STAFF] },
      },
      include: {
        staffAssignments: {
          include: { property: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return staff.map(s => ({
      id: s.id,
      name: s.fullName,
      email: s.email,
      phone: s.phone,
      role: s.role.toLowerCase(),
      status: s.isSuspended ? 'Suspended' : s.isActive ? 'Active' : 'Inactive',
      assignedProperties: s.staffAssignments.map(a => ({
        id: a.property.id,
        name: a.property.name,
      })),
      createdAt: s.createdAt,
    }));
  }

  static async createStaff(data: {
    ownerId: string;
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    role: UserRole;
    propertyIds?: string[];
  }) {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { phone: data.phone }] },
    });

    if (existing) {
      throw new Error('A user with this email or phone already exists');
    }

    const defaultPass = data.password || 'Staff@123456';
    const passwordHash = await bcrypt.hash(defaultPass, 10);

    const user = await prisma.user.create({
      data: {
        ownerId: data.ownerId,
        fullName: data.fullName,
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        passwordHash,
        role: data.role || UserRole.MANAGER,
        mustChangePassword: true,
      },
    });

    if (data.propertyIds && data.propertyIds.length > 0) {
      for (const propId of data.propertyIds) {
        await prisma.staffAssignment.create({
          data: {
            userId: user.id,
            propertyId: propId,
            permissions: JSON.stringify(['all']),
          },
        });
      }
    }

    return {
      id: user.id,
      name: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role.toLowerCase(),
      tempPassword: defaultPass,
    };
  }

  // ==========================================
  // 5. TENANTS / STUDENTS ONBOARDING
  // ==========================================
  static async listTenants(ownerId: string, propertyId?: string) {
    const stays = await prisma.tenantStay.findMany({
      where: {
        ownerId,
        ...(propertyId ? { propertyId } : {}),
      },
      include: {
        tenant: {
          include: {
            user: true,
            parentProfile: {
              include: { user: true },
            },
          },
        },
        property: true,
        bed: {
          include: { room: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return stays.map(s => ({
      id: s.id,
      tenantProfileId: s.tenantId,
      userId: s.tenant.userId,
      name: s.tenant.user.fullName,
      email: s.tenant.user.email,
      phone: s.tenant.user.phone,
      propertyId: s.propertyId,
      propertyName: s.property.name,
      roomId: s.bed.roomId,
      roomNumber: s.bed.room.roomNumber,
      bedId: s.bedId,
      bedNumber: s.bed.bedNumber,
      rentAmount: s.monthlyRent,
      securityDeposit: s.securityDeposit,
      status: s.status,
      checkInDate: s.startDate,
      parentName: s.tenant.parentProfile?.user?.fullName || 'N/A',
      parentPhone: s.tenant.parentProfile?.user?.phone || 'N/A',
    }));
  }

  static async onboardTenant(data: {
    ownerId: string;
    propertyId: string;
    bedId: string;
    fullName: string;
    email: string;
    phone: string;
    monthlyRent: number;
    securityDeposit: number;
    parentName?: string;
    parentPhone?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    permanentAddress?: string;
    idProofNumber?: string;
    checkInDate?: string;
  }) {
    // 1. Create or Find Tenant User
    let user = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { phone: data.phone }] },
    });

    if (!user) {
      const passwordHash = await bcrypt.hash('Student@123456', 10);
      user = await prisma.user.create({
        data: {
          ownerId: data.ownerId,
          fullName: data.fullName,
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          passwordHash,
          role: UserRole.STUDENT,
          mustChangePassword: true,
        },
      });
    }

    // 2. Create or Find Parent Profile if parent info provided
    let parentProfileId: string | undefined = undefined;
    if (data.parentPhone) {
      let parentUser = await prisma.user.findUnique({ where: { phone: data.parentPhone } });
      if (!parentUser) {
        const parentPass = await bcrypt.hash('Parent@123456', 10);
        parentUser = await prisma.user.create({
          data: {
            ownerId: data.ownerId,
            fullName: data.parentName || 'Parent',
            email: `parent_${data.phone}@smartpg.com`,
            phone: data.parentPhone,
            passwordHash: parentPass,
            role: UserRole.PARENT,
            mustChangePassword: true,
          },
        });
      }

      let parentProfile = await prisma.parentProfile.findUnique({ where: { userId: parentUser.id } });
      if (!parentProfile) {
        parentProfile = await prisma.parentProfile.create({
          data: {
            userId: parentUser.id,
            relation: 'Parent / Guardian',
            address: data.permanentAddress || 'Permanent Address',
          },
        });
      }
      parentProfileId = parentProfile.id;
    }

    // 3. Create Tenant Profile
    let tenantProfile = await prisma.tenantProfile.findUnique({ where: { userId: user.id } });
    if (!tenantProfile) {
      tenantProfile = await prisma.tenantProfile.create({
        data: {
          userId: user.id,
          emergencyContactName: data.emergencyContactName || data.parentName || 'Guardian',
          emergencyContactPhone: data.emergencyContactPhone || data.parentPhone || data.phone,
          permanentAddress: data.permanentAddress || 'Address',
          idProofType: 'AADHAAR',
          idProofNumber: data.idProofNumber || 'NA',
          parentProfileId,
        },
      });
    }

    // 4. Create Tenant Stay
    const stay = await prisma.tenantStay.create({
      data: {
        ownerId: data.ownerId,
        propertyId: data.propertyId,
        tenantId: tenantProfile.id,
        bedId: data.bedId,
        monthlyRent: data.monthlyRent || 8500,
        securityDeposit: data.securityDeposit || 10000,
        startDate: data.checkInDate ? new Date(data.checkInDate) : new Date(),
        status: StayStatus.CHECKED_IN,
      },
    });

    // 5. Update Bed Status to Occupied
    await prisma.bed.update({
      where: { id: data.bedId },
      data: { status: BedStatus.OCCUPIED },
    });

    return stay;
  }

  // ==========================================
  // 6. COMPLAINTS & TICKETS
  // ==========================================
  static async listComplaints(ownerId: string, propertyId?: string) {
    return prisma.complaint.findMany({
      where: {
        ownerId,
        ...(propertyId ? { propertyId } : {}),
      },
      include: {
        property: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updateComplaintStatus(complaintId: string, status: ComplaintStatus, resolutionNotes?: string) {
    return prisma.complaint.update({
      where: { id: complaintId },
      data: {
        status,
        ...(status === ComplaintStatus.RESOLVED ? { resolvedAt: new Date() } : {}),
      },
    });
  }

  // ==========================================
  // 7. GATE LOGS & ATTENDANCE
  // ==========================================
  static async listGateLogs(propertyId: string) {
    return prisma.gateLog.findMany({
      where: { propertyId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  static async addGateLog(data: {
    propertyId: string;
    userId: string;
    studentName?: string;
    roomNumber?: string;
    type: 'ENTRY' | 'EXIT';
    reason?: string;
    destination?: string;
    expectedReturnTime?: string;
    isLate?: boolean;
    loggedBy?: string;
  }) {
    return prisma.gateLog.create({
      data: {
        propertyId: data.propertyId,
        userId: data.userId,
        studentName: data.studentName || 'Resident',
        roomNumber: data.roomNumber || '',
        type: data.type,
        reason: data.reason || (data.type === 'ENTRY' ? 'Returned to PG' : 'Outing'),
        destination: data.destination || '',
        expectedReturnTime: data.expectedReturnTime || '',
        isLate: data.isLate || false,
        loggedBy: data.loggedBy || 'QR Scanner',
      },
    });
  }
}

