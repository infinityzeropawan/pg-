"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../db");
const client_1 = require("@prisma/client");
class AdminService {
    // ==========================================
    // 1. DASHBOARD & ANALYTICS
    // ==========================================
    static async getDashboardStats(ownerId, propertyId) {
        const whereProp = propertyId ? { id: propertyId, ownerId } : { ownerId };
        const properties = await db_1.prisma.property.findMany({
            where: whereProp,
            select: { id: true, name: true },
        });
        const propertyIds = properties.map(p => p.id);
        const [totalBeds, occupiedBeds, totalTenants, openComplaints, recentGateLogs, recentStays] = await Promise.all([
            db_1.prisma.bed.count({
                where: { room: { floor: { propertyId: { in: propertyIds } } } },
            }),
            db_1.prisma.bed.count({
                where: {
                    status: client_1.BedStatus.OCCUPIED,
                    room: { floor: { propertyId: { in: propertyIds } } },
                },
            }),
            db_1.prisma.tenantStay.count({
                where: {
                    ownerId,
                    status: { in: [client_1.StayStatus.ACTIVE, client_1.StayStatus.CHECKED_IN] },
                    ...(propertyId ? { propertyId } : {}),
                },
            }),
            db_1.prisma.complaint.count({
                where: {
                    propertyId: { in: propertyIds },
                    status: { in: [client_1.ComplaintStatus.OPEN, client_1.ComplaintStatus.IN_PROGRESS] },
                },
            }),
            db_1.prisma.gateLog.findMany({
                where: { propertyId: { in: propertyIds } },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
            db_1.prisma.tenantStay.findMany({
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
    static async listProperties(ownerId) {
        const properties = await db_1.prisma.property.findMany({
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
                    occupiedCount += r.beds.filter(b => b.status === client_1.BedStatus.OCCUPIED).length;
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
    static async getPropertyDetail(propertyId, ownerId) {
        const property = await db_1.prisma.property.findFirst({
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
        if (!property)
            return null;
        let bedCount = 0;
        let occupiedCount = 0;
        let roomCount = 0;
        property.floors.forEach(f => {
            roomCount += f.rooms.length;
            f.rooms.forEach(r => {
                bedCount += r.beds.length;
                occupiedCount += r.beds.filter(b => b.status === client_1.BedStatus.OCCUPIED).length;
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
    static async createProperty(data) {
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
        const property = await db_1.prisma.property.create({
            data: {
                ownerId: data.ownerId,
                name: data.name,
                slug,
                type: data.type || client_1.PropertyType.BOYS_PG,
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
            await db_1.prisma.floor.create({
                data: {
                    propertyId: property.id,
                    floorNumber: i,
                    name: `Floor ${i}`,
                },
            });
        }
        await db_1.prisma.auditLog.create({
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
    static async updateProperty(propertyId, ownerId, data) {
        return db_1.prisma.property.update({
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
    static async deleteProperty(propertyId, ownerId) {
        return db_1.prisma.property.delete({
            where: { id: propertyId },
        });
    }
    // ==========================================
    // 3. ROOMS & BEDS
    // ==========================================
    static async listRooms(propertyId) {
        const rooms = await db_1.prisma.room.findMany({
            where: { floor: { propertyId } },
            include: {
                floor: true,
                beds: {
                    include: {
                        stays: {
                            where: { status: { in: [client_1.StayStatus.ACTIVE, client_1.StayStatus.CHECKED_IN] } },
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
            const occupiedBeds = r.beds.filter(b => b.status === client_1.BedStatus.OCCUPIED).length;
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
    static async createRoom(data) {
        const room = await db_1.prisma.room.create({
            data: {
                floorId: data.floorId,
                roomNumber: data.roomNumber,
                type: data.type || client_1.RoomType.DOUBLE_SHARING,
                monthlyRent: data.monthlyRent || 8500,
            },
        });
        const count = data.bedCount || 2;
        for (let i = 1; i <= count; i++) {
            await db_1.prisma.bed.create({
                data: {
                    roomId: room.id,
                    bedNumber: `B-${i}`,
                    status: client_1.BedStatus.VACANT,
                    monthlyRent: data.monthlyRent || 8500,
                },
            });
        }
        return room;
    }
    static async updateBedStatus(bedId, status) {
        return db_1.prisma.bed.update({
            where: { id: bedId },
            data: { status },
        });
    }
    // ==========================================
    // 4. STAFF / MANAGERS MANAGEMENT
    // ==========================================
    static async listStaff(ownerId) {
        const staff = await db_1.prisma.user.findMany({
            where: {
                ownerId,
                role: { in: [client_1.UserRole.MANAGER, client_1.UserRole.STAFF] },
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
    static async createStaff(data) {
        const existing = await db_1.prisma.user.findFirst({
            where: { OR: [{ email: data.email }, { phone: data.phone }] },
        });
        if (existing) {
            throw new Error('A user with this email or phone already exists');
        }
        const defaultPass = data.password || 'Staff@123456';
        const passwordHash = await bcryptjs_1.default.hash(defaultPass, 10);
        const user = await db_1.prisma.user.create({
            data: {
                ownerId: data.ownerId,
                fullName: data.fullName,
                email: data.email.trim().toLowerCase(),
                phone: data.phone.trim(),
                passwordHash,
                role: data.role || client_1.UserRole.MANAGER,
                mustChangePassword: true,
            },
        });
        if (data.propertyIds && data.propertyIds.length > 0) {
            for (const propId of data.propertyIds) {
                await db_1.prisma.staffAssignment.create({
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
    static async listTenants(ownerId, propertyId) {
        const stays = await db_1.prisma.tenantStay.findMany({
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
    static async onboardTenant(data) {
        // 1. Create or Find Tenant User
        let user = await db_1.prisma.user.findFirst({
            where: { OR: [{ email: data.email }, { phone: data.phone }] },
        });
        if (!user) {
            const passwordHash = await bcryptjs_1.default.hash('Student@123456', 10);
            user = await db_1.prisma.user.create({
                data: {
                    ownerId: data.ownerId,
                    fullName: data.fullName,
                    email: data.email.trim().toLowerCase(),
                    phone: data.phone.trim(),
                    passwordHash,
                    role: client_1.UserRole.STUDENT,
                    mustChangePassword: true,
                },
            });
        }
        // 2. Create or Find Parent Profile if parent info provided
        let parentProfileId = undefined;
        if (data.parentPhone) {
            let parentUser = await db_1.prisma.user.findUnique({ where: { phone: data.parentPhone } });
            if (!parentUser) {
                const parentPass = await bcryptjs_1.default.hash('Parent@123456', 10);
                parentUser = await db_1.prisma.user.create({
                    data: {
                        ownerId: data.ownerId,
                        fullName: data.parentName || 'Parent',
                        email: `parent_${data.phone}@smartpg.com`,
                        phone: data.parentPhone,
                        passwordHash: parentPass,
                        role: client_1.UserRole.PARENT,
                        mustChangePassword: true,
                    },
                });
            }
            let parentProfile = await db_1.prisma.parentProfile.findUnique({ where: { userId: parentUser.id } });
            if (!parentProfile) {
                parentProfile = await db_1.prisma.parentProfile.create({
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
        let tenantProfile = await db_1.prisma.tenantProfile.findUnique({ where: { userId: user.id } });
        if (!tenantProfile) {
            tenantProfile = await db_1.prisma.tenantProfile.create({
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
        const stay = await db_1.prisma.tenantStay.create({
            data: {
                ownerId: data.ownerId,
                propertyId: data.propertyId,
                tenantId: tenantProfile.id,
                bedId: data.bedId,
                monthlyRent: data.monthlyRent || 8500,
                securityDeposit: data.securityDeposit || 10000,
                startDate: data.checkInDate ? new Date(data.checkInDate) : new Date(),
                status: client_1.StayStatus.CHECKED_IN,
            },
        });
        // 5. Update Bed Status to Occupied
        await db_1.prisma.bed.update({
            where: { id: data.bedId },
            data: { status: client_1.BedStatus.OCCUPIED },
        });
        return stay;
    }
    // ==========================================
    // 6. COMPLAINTS & TICKETS
    // ==========================================
    static async listComplaints(ownerId, propertyId) {
        return db_1.prisma.complaint.findMany({
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
    static async updateComplaintStatus(complaintId, status, resolutionNotes) {
        return db_1.prisma.complaint.update({
            where: { id: complaintId },
            data: {
                status,
                ...(status === client_1.ComplaintStatus.RESOLVED ? { resolvedAt: new Date() } : {}),
            },
        });
    }
    // ==========================================
    // 7. GATE LOGS & ATTENDANCE
    // ==========================================
    static async listGateLogs(propertyId) {
        return db_1.prisma.gateLog.findMany({
            where: { propertyId },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
    static async addGateLog(data) {
        return db_1.prisma.gateLog.create({
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
    // ==========================================
    // 8. NOTICES & ANNOUNCEMENTS
    // ==========================================
    static async listNotices(ownerId) {
        return db_1.prisma.notice.findMany({
            where: { ownerId },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async createNotice(data) {
        return db_1.prisma.notice.create({
            data: {
                ownerId: data.ownerId,
                title: data.title,
                content: data.content,
                category: data.category || 'General',
                target: data.target || 'ALL',
                isPinned: data.isPinned || false,
            },
        });
    }
    static async deleteNotice(id, ownerId) {
        return db_1.prisma.notice.deleteMany({
            where: { id, ownerId },
        });
    }
    // ==========================================
    // 9. FOOD MENU
    // ==========================================
    static async getFoodMenu(ownerId) {
        let menu = await db_1.prisma.foodMenu.findUnique({ where: { ownerId } });
        if (!menu) {
            const defaultMenu = JSON.stringify({
                monday: { breakfast: 'Poha & Tea', lunch: 'Dal, Rice, Roti, Sabji', dinner: 'Paneer Butter Masala, Naan' },
                tuesday: { breakfast: 'Idli Sambhar', lunch: 'Rajma Chawal, Roti', dinner: 'Mix Veg, Roti, Rice' },
                wednesday: { breakfast: 'Aloo Paratha', lunch: 'Kadhi Chawal', dinner: 'Egg Curry / Paneer, Roti' },
                thursday: { breakfast: 'Upma & Coffee', lunch: 'Chole Bhature', dinner: 'Dal Tadka, Jeera Rice, Roti' },
                friday: { breakfast: 'Puri Bhaji', lunch: 'Veg Biryani, Raita', dinner: 'Dal Makhani, Naan' },
                saturday: { breakfast: 'Dosa Sambhar', lunch: 'Khichdi, Papad', dinner: 'Aloo Gobi, Roti, Rice' },
                sunday: { breakfast: 'Chana Masala', lunch: 'Special Thali', dinner: 'Chicken / Paneer Special' },
            });
            menu = await db_1.prisma.foodMenu.create({
                data: { ownerId, weekMenuJson: defaultMenu },
            });
        }
        return menu;
    }
    static async updateFoodMenu(ownerId, weekMenuJson) {
        return db_1.prisma.foodMenu.upsert({
            where: { ownerId },
            update: { weekMenuJson },
            create: { ownerId, weekMenuJson },
        });
    }
    // ==========================================
    // 10. MAINTENANCE & AMC CONTRACTS
    // ==========================================
    static async listMaintenance(ownerId) {
        return db_1.prisma.maintenanceContract.findMany({
            where: { ownerId },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async createMaintenance(data) {
        return db_1.prisma.maintenanceContract.create({
            data: {
                ownerId: data.ownerId,
                vendorName: data.vendorName,
                serviceType: data.serviceType,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                cost: data.cost,
                status: data.status || 'ACTIVE',
            },
        });
    }
    // ==========================================
    // 11. FINANCE SUMMARY & DEPOSITS
    // ==========================================
    static async getFinanceSummary(ownerId) {
        const props = await db_1.prisma.property.findMany({
            where: { ownerId },
            select: { id: true },
        });
        const propIds = props.map((p) => p.id);
        const invoices = await db_1.prisma.invoice.findMany({
            where: { propertyId: { in: propIds } },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        const totalCollected = invoices
            .filter((i) => i.status === 'PAID')
            .reduce((sum, i) => sum + i.totalAmount, 0);
        const totalPending = invoices
            .filter((i) => i.status !== 'PAID' && i.status !== 'CANCELLED')
            .reduce((sum, i) => sum + i.totalAmount, 0);
        const expenses = await db_1.prisma.expense.findMany({
            where: { propertyId: { in: propIds } },
        });
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        return {
            totalCollected,
            totalPending,
            totalExpenses,
            netRevenue: totalCollected - totalExpenses,
            invoices,
            expenses,
        };
    }
    // ==========================================
    // 12. CREATE COMPLAINT
    // ==========================================
    static async createComplaint(data) {
        const prop = await db_1.prisma.property.findUnique({
            where: { id: data.propertyId },
            select: { ownerId: true },
        });
        return db_1.prisma.complaint.create({
            data: {
                ownerId: prop?.ownerId || data.userId,
                propertyId: data.propertyId,
                category: data.category,
                title: data.title,
                description: data.description,
                priority: data.priority || client_1.ComplaintPriority.MEDIUM,
                status: client_1.ComplaintStatus.OPEN,
            },
        });
    }
}
exports.AdminService = AdminService;
