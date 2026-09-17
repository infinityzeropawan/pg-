import { prisma } from '../../db';

export class StaffAccessError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 403) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class StaffService {
  // Resolve the visible property scope from current database assignments.
  // OWNER sees all owned properties; STAFF/MANAGER only properties they are
  // assigned to via StaffAssignment. Never falls back to "first property in DB".
  static async visiblePropertyIds(userId: string): Promise<string[]> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive || user.isSuspended) {
      throw new StaffAccessError('Account is inactive or suspended');
    }

    if (user.role === 'OWNER') {
      const props = await prisma.property.findMany({ where: { ownerId: user.id }, select: { id: true } });
      return props.map(p => p.id);
    }

    if (user.role === 'SUPERADMIN') {
      const props = await prisma.property.findMany({ select: { id: true } });
      return props.map(p => p.id);
    }

    const assignments = await prisma.staffAssignment.findMany({
      where: { userId },
      select: { propertyId: true },
    });
    return assignments.map(a => a.propertyId);
  }

  static async assertPropertyAccess(userId: string, propertyId?: string) {
    const allowed = await StaffService.visiblePropertyIds(userId);
    if (propertyId && !allowed.includes(propertyId)) {
      throw new StaffAccessError('Property is not assigned to you', 403);
    }
    return propertyId ? [propertyId] : allowed;
  }

  static async getDashboard(userId: string) {
    const [user, propertyIds, tasks] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, fullName: true, email: true, phone: true, role: true, avatarUrl: true },
      }),
      StaffService.visiblePropertyIds(userId),
      StaffService.listTasks(userId),
    ]);

    const properties = propertyIds.length
      ? await prisma.property.findMany({ where: { id: { in: propertyIds } }, orderBy: { name: 'asc' } })
      : [];

    return {
      staff: user,
      property: properties[0] || null,
      properties,
      assignedPropertyIds: propertyIds,
      pendingTasks: tasks.filter(t => t.status === 'PENDING').length,
      tasks,
    };
  }

  static async getStock(userId: string, propertyId?: string) {
    const ids = await StaffService.assertPropertyAccess(userId, propertyId);
    if (!ids.length) return [];

    // Reads must never create stock. Empty inventory stays empty until entered by an administrator.
    return prisma.stockItem.findMany({
      where: { propertyId: { in: ids } },
      orderBy: { itemName: 'asc' },
    });
  }

  static async updateStock(userId: string, id: string, currentQuantity: number) {
    if (!Number.isFinite(currentQuantity) || currentQuantity < 0) {
      throw new StaffAccessError('Quantity must be a non-negative number', 400);
    }
    const ids = await StaffService.visiblePropertyIds(userId);
    const result = await prisma.stockItem.updateMany({
      where: { id, propertyId: { in: ids } },
      data: { currentQuantity },
    });
    if (!result.count) throw new StaffAccessError('Stock item not found in your assigned properties', 404);
    return prisma.stockItem.findFirst({ where: { id } });
  }

  static async listTasks(userId: string) {
    const ids = await StaffService.visiblePropertyIds(userId);
    return prisma.staffTask.findMany({
      where: { assignedTo: userId, propertyId: { in: ids } },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updateTaskStatus(userId: string, id: string, status: string) {
    const allowedStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
    if (!allowedStatuses.includes(status)) {
      throw new StaffAccessError(`Invalid status. Allowed: ${allowedStatuses.join(', ')}`, 400);
    }
    const ids = await StaffService.visiblePropertyIds(userId);
    const result = await prisma.staffTask.updateMany({
      where: { id, assignedTo: userId, propertyId: { in: ids } },
      data: { status },
    });
    if (!result.count) throw new StaffAccessError('Task not found among your assigned tasks', 404);
    return prisma.staffTask.findFirst({ where: { id } });
  }
}
