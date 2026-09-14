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
        const [totalRooms, totalBeds, occupiedBeds, totalTenants, openComplaints, staffPresent, recentGateLogs, recentStays, expensesAggregate, expensesByCategory, latestEnquiriesRaw, vacantBedsRaw, defaulterInvoices] = await Promise.all([
            db_1.prisma.room.count({
                where: { floor: { propertyId: { in: propertyIds } } },
            }),
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
            db_1.prisma.staffAssignment.count({
                where: { propertyId: { in: propertyIds } },
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
            db_1.prisma.expense.aggregate({
                where: { propertyId: { in: propertyIds } },
                _sum: { amount: true },
            }),
            db_1.prisma.expense.groupBy({
                by: ['category'],
                where: { propertyId: { in: propertyIds } },
                _sum: { amount: true },
            }),
            db_1.prisma.enquiry.findMany({
                where: { propertyId: { in: propertyIds } },
                include: { property: true },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
            db_1.prisma.bed.findMany({
                where: {
                    status: client_1.BedStatus.VACANT,
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
            db_1.prisma.invoice.findMany({
                where: {
                    ownerId,
                    ...(propertyId ? { propertyId } : {}),
                    status: { in: ['ISSUED', 'OVERDUE', 'PARTIALLY_PAID'] },
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
        const activeStays = await db_1.prisma.tenantStay.findMany({
            where: {
                ownerId,
                status: { in: [client_1.StayStatus.ACTIVE, client_1.StayStatus.CHECKED_IN, client_1.StayStatus.NOTICE_PERIOD] },
                ...(propertyId ? { propertyId } : {}),
            },
            select: { monthlyRent: true },
        });
        const estimatedMonthlyRevenue = activeStays.reduce((sum, s) => sum + (s.monthlyRent || 0), 0);
        // Invoices breakdown
        const invoices = await db_1.prisma.invoice.findMany({
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
            db_1.prisma.tenantStay.count({
                where: {
                    ownerId,
                    ...(propertyId ? { propertyId } : {}),
                    status: { in: [client_1.StayStatus.ACTIVE, client_1.StayStatus.CHECKED_IN] },
                    startDate: { gte: todayStart },
                },
            }),
            db_1.prisma.tenantStay.count({
                where: {
                    ownerId,
                    ...(propertyId ? { propertyId } : {}),
                    status: client_1.StayStatus.CHECKED_OUT,
                    actualEndDate: { gte: todayStart },
                },
            }),
            db_1.prisma.visitorLog.count({
                where: {
                    propertyId: { in: propertyIds },
                    checkOutTime: null,
                },
            }),
            db_1.prisma.sOSAlert.count({
                where: {
                    propertyId: { in: propertyIds },
                    status: { in: ['TRIGGERED', 'ACKNOWLEDGED'] },
                },
            }),
            db_1.prisma.maintenanceContract.count({
                where: { ownerId, status: 'ACTIVE' },
            }),
            db_1.prisma.maintenanceContract.count({
                where: { ownerId },
            }),
        ]);
        // Real housekeeping counters derived from staff tasks (clean / sanitize / housekeep / hygiene)
        const staffTasksRaw = await db_1.prisma.staffTask.findMany({
            where: { propertyId: { in: propertyIds } },
            select: { title: true, description: true, status: true },
        });
        const HK_PATTERN = /clean|sanitiz|housekeep|hygiene/i;
        const hkTasks = staffTasksRaw.filter(t => HK_PATTERN.test(t.title || '') || HK_PATTERN.test(t.description || ''));
        const housekeepingTotal = hkTasks.length;
        const housekeepingDone = hkTasks.filter(t => String(t.status).toUpperCase() === 'COMPLETED').length;
        // Real monthly collection vs pending series derived from invoice billing months
        const monthOrder = [];
        const monthSeries = new Map();
        invoices.forEach(inv => {
            const month = inv.billingMonth || (inv.dueDate ? inv.dueDate.toISOString().slice(0, 7) : '');
            if (!month)
                return;
            if (!monthSeries.has(month)) {
                monthSeries.set(month, { collected: 0, pending: 0 });
                monthOrder.push(month);
            }
            const agg = monthSeries.get(month);
            agg.collected += inv.paidAmount || 0;
            agg.pending += Math.max(0, inv.totalAmount - (inv.paidAmount || 0));
        });
        const collectionVsPending = monthOrder.slice(-6).map(month => {
            const agg = monthSeries.get(month);
            const parts = month.split('-');
            const shortMonth = parts[0] && parts[1] ? new Date(Number(parts[0]), Number(parts[1]) - 1, 1).toLocaleString('en', { month: 'short' }) : month;
            return { month: shortMonth, collected: Math.round(agg.collected / 100), pending: Math.round(agg.pending / 100) };
        });
        const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
        // Occupancy per property
        const occupancyByProperty = await Promise.all(properties.map(async (p) => {
            const bedsInProp = await db_1.prisma.bed.count({
                where: { room: { floor: { propertyId: p.id } } },
            });
            const occupiedInProp = await db_1.prisma.bed.count({
                where: { status: client_1.BedStatus.OCCUPIED, room: { floor: { propertyId: p.id } } },
            });
            return {
                name: p.name,
                occupied: occupiedInProp,
                total: bedsInProp,
            };
        }));
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
    static async listProperties(ownerId) {
        return db_1.prisma.property.findMany({
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
    static async getPropertyDetail(id, ownerId) {
        return db_1.prisma.property.findFirst({
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
    static async createProperty(ownerId, data) {
        const slug = `${data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
        const floorsCount = Math.max(1, Number(data.floorsCount) || 2);
        const property = await db_1.prisma.property.create({
            data: {
                ownerId,
                name: data.name,
                slug,
                type: data.type || client_1.PropertyType.BOYS_PG,
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
        const roomPlan = [];
        if (wantsCustomRooms) {
            for (let i = 0; i < singles; i++)
                roomPlan.push({ type: client_1.RoomType.SINGLE, capacity: 1 });
            for (let i = 0; i < doubles; i++)
                roomPlan.push({ type: client_1.RoomType.DOUBLE_SHARING, capacity: 2 });
            for (let i = 0; i < triples; i++)
                roomPlan.push({ type: client_1.RoomType.TRIPLE_SHARING, capacity: 3 });
        }
        const roomsPerFloor = wantsCustomRooms ? Math.ceil(roomPlan.length / floorsCount) : 2;
        const rentBase = Number(data.bedRent) || Number(data.defaultDeposit) || 8500;
        const rentPaise = Math.max(0, rentBase) * 100; // Rupees -> Paise
        for (let f = 1; f <= floorsCount; f++) {
            const floor = await db_1.prisma.floor.create({
                data: {
                    propertyId: property.id,
                    floorNumber: f,
                    name: `Floor ${f}`,
                },
            });
            const roomsThisFloor = wantsCustomRooms
                ? roomPlan.slice((f - 1) * roomsPerFloor, f * roomsPerFloor)
                : Array.from({ length: 2 }, () => ({ type: client_1.RoomType.DOUBLE_SHARING, capacity: 2 }));
            let rIdx = 1;
            for (const plan of roomsThisFloor) {
                const roomNumber = `${f}${String(rIdx).padStart(2, '0')}`;
                const room = await db_1.prisma.room.create({
                    data: {
                        floorId: floor.id,
                        roomNumber,
                        type: plan.type,
                        monthlyRent: rentPaise,
                    },
                });
                rIdx++;
                for (let b = 1; b <= plan.capacity; b++) {
                    await db_1.prisma.bed.create({
                        data: {
                            roomId: room.id,
                            bedNumber: `B-${b}`,
                            status: client_1.BedStatus.VACANT,
                            monthlyRent: rentPaise,
                        },
                    });
                }
            }
        }
        await db_1.prisma.auditLog.create({
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
    static async updateProperty(id, ownerId, data) {
        const property = await db_1.prisma.property.updateMany({
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
    static async deleteProperty(id, ownerId) {
        return db_1.prisma.property.deleteMany({
            where: { id, ownerId },
        });
    }
    // ==========================================
    // 3. ROOMS & BEDS
    // ==========================================
    static async listRooms(propertyId) {
        return db_1.prisma.room.findMany({
            where: { floor: { propertyId } },
            include: {
                beds: true,
                floor: true,
            },
            orderBy: { roomNumber: 'asc' },
        });
    }
    static async createRoom(data) {
        let floor = await db_1.prisma.floor.findFirst({
            where: { propertyId: data.propertyId, floorNumber: data.floorNumber || 1 },
        });
        if (!floor) {
            floor = await db_1.prisma.floor.create({
                data: {
                    propertyId: data.propertyId,
                    floorNumber: data.floorNumber || 1,
                    name: `Floor ${data.floorNumber || 1}`,
                },
            });
        }
        const room = await db_1.prisma.room.create({
            data: {
                floorId: floor.id,
                roomNumber: data.roomNumber,
                type: data.type || client_1.RoomType.DOUBLE_SHARING,
                monthlyRent: (data.monthlyRent || 8500) * 100, // convert to Paise
            },
        });
        const bedCount = data.bedCount || 2;
        for (let b = 1; b <= bedCount; b++) {
            await db_1.prisma.bed.create({
                data: {
                    roomId: room.id,
                    bedNumber: `B-${b}`,
                    status: client_1.BedStatus.VACANT,
                    monthlyRent: (data.monthlyRent || 8500) * 100,
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
    // 4. TENANTS & ONBOARDING
    // ==========================================
    static async listTenants(ownerId, propertyId) {
        const stays = await db_1.prisma.tenantStay.findMany({
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
    static async onboardTenant(ownerId, data) {
        const existingUser = await db_1.prisma.user.findFirst({
            where: { OR: [{ email: data.email }, { phone: data.phone }] },
        });
        if (existingUser) {
            throw new Error('Email or Phone is already registered');
        }
        const passwordHash = await bcryptjs_1.default.hash('Student@123456', 10);
        const user = await db_1.prisma.user.create({
            data: {
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                passwordHash,
                role: client_1.UserRole.STUDENT,
                ownerId,
                mustChangePassword: true,
            },
        });
        const tenantProfile = await db_1.prisma.tenantProfile.create({
            data: {
                userId: user.id,
                emergencyContactName: data.emergencyContactName || 'Parent',
                emergencyContactPhone: data.emergencyContactPhone || data.phone,
                permanentAddress: data.permanentAddress || 'Address',
                idProofType: data.idProofType || 'AADHAAR',
                idProofNumber: data.idProofNumber || '123456789012',
            },
        });
        const stay = await db_1.prisma.tenantStay.create({
            data: {
                ownerId,
                propertyId: data.propertyId,
                tenantId: tenantProfile.id,
                bedId: data.bedId,
                monthlyRent: data.monthlyRent * 100,
                securityDeposit: data.securityDeposit * 100,
                startDate: new Date(data.startDate || Date.now()),
                status: client_1.StayStatus.ACTIVE,
            },
        });
        await db_1.prisma.bed.update({
            where: { id: data.bedId },
            data: { status: client_1.BedStatus.OCCUPIED },
        });
        await db_1.prisma.auditLog.create({
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
    static async listStaff(ownerId) {
        const staffAssignments = await db_1.prisma.staffAssignment.findMany({
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
    static async createStaff(ownerId, data) {
        const passwordHash = await bcryptjs_1.default.hash('Staff@123456', 10);
        const role = data.role || client_1.UserRole.MANAGER;
        const user = await db_1.prisma.user.create({
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
        const assignment = await db_1.prisma.staffAssignment.create({
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
    static async listComplaints(ownerId, propertyId) {
        return db_1.prisma.complaint.findMany({
            where: {
                ownerId,
                ...(propertyId ? { propertyId } : {}),
            },
            include: { property: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async createComplaint(ownerId, data) {
        return db_1.prisma.complaint.create({
            data: {
                ownerId,
                propertyId: data.propertyId,
                title: data.title,
                description: data.description,
                category: data.category || 'GENERAL',
                priority: data.priority || client_1.ComplaintPriority.MEDIUM,
                status: client_1.ComplaintStatus.OPEN,
            },
        });
    }
    static async updateComplaintStatus(id, status) {
        return db_1.prisma.complaint.update({
            where: { id },
            data: {
                status,
                ...(status === client_1.ComplaintStatus.RESOLVED ? { resolvedAt: new Date() } : {}),
            },
        });
    }
    // ==========================================
    // 7. GATE LOGS & NOTICES & MAINTENANCE & FOOD & FINANCE
    // ==========================================
    static async listGateLogs(propertyId) {
        return db_1.prisma.gateLog.findMany({
            where: { propertyId },
            orderBy: { timestamp: 'desc' },
            take: 50,
        });
    }
    static async addGateLog(data) {
        return db_1.prisma.gateLog.create({
            data: {
                propertyId: data.propertyId,
                userId: data.userId,
                entryType: data.entryType,
                passCode: data.passCode,
            },
        });
    }
    static async listNotices(ownerId) {
        return db_1.prisma.auditLog.findMany({
            where: { ownerId, action: 'NOTICE_BROADCAST' },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async createNotice(ownerId, data) {
        return db_1.prisma.auditLog.create({
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
    static async deleteNotice(id) {
        return db_1.prisma.auditLog.delete({ where: { id } });
    }
    static async getFoodMenu(ownerId) {
        const menu = await db_1.prisma.foodMenu.findUnique({
            where: { ownerId },
        });
        return menu ? JSON.parse(menu.weekMenuJson) : null;
    }
    static async updateFoodMenu(ownerId, weekMenuJson) {
        return db_1.prisma.foodMenu.upsert({
            where: { ownerId },
            update: { weekMenuJson },
            create: { ownerId, weekMenuJson },
        });
    }
    static async listMaintenance(ownerId) {
        return db_1.prisma.expense.findMany({
            where: { ownerId, category: 'REPAIR' },
            orderBy: { expenseDate: 'desc' },
        });
    }
    static async createMaintenance(ownerId, data) {
        return db_1.prisma.expense.create({
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
    static async getFinanceSummary(ownerId) {
        const invoices = await db_1.prisma.invoice.findMany({ where: { ownerId } });
        const expenses = await db_1.prisma.expense.findMany({ where: { ownerId } });
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
}
exports.AdminService = AdminService;
