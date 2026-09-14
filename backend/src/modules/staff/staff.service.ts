import { prisma } from '../../db';

export class StaffService {
  static async getDashboard(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const property = await prisma.property.findFirst();

    const tasks = property ? await prisma.staffTask.findMany({
      where: { propertyId: property.id, assignedTo: userId },
      orderBy: { createdAt: 'desc' },
    }) : [];

    return {
      staff: user,
      property,
      pendingTasks: tasks.filter(t => t.status === 'PENDING').length,
      tasks,
    };
  }

  static async getStock(propertyId?: string) {
    const prop = propertyId || (await prisma.property.findFirst())?.id;
    if (!prop) return [];

    let items = await prisma.stockItem.findMany({
      where: { propertyId: prop },
      orderBy: { itemName: 'asc' },
    });

    if (items.length === 0) {
      const sampleItems = [
        { itemName: 'Basmati Rice', category: 'Grains', currentQuantity: 45.0, unit: 'kg', minThreshold: 10.0 },
        { itemName: 'Toor Dal', category: 'Pulses', currentQuantity: 18.0, unit: 'kg', minThreshold: 5.0 },
        { itemName: 'Cooking Oil', category: 'Oils', currentQuantity: 12.0, unit: 'liters', minThreshold: 4.0 },
        { itemName: 'Atta (Wheat Flour)', category: 'Flour', currentQuantity: 30.0, unit: 'kg', minThreshold: 10.0 },
      ];
      for (const item of sampleItems) {
        await prisma.stockItem.create({ data: { propertyId: prop, ...item } });
      }
      items = await prisma.stockItem.findMany({ where: { propertyId: prop } });
    }

    return items;
  }

  static async updateStock(id: string, currentQuantity: number) {
    return prisma.stockItem.update({
      where: { id },
      data: { currentQuantity },
    });
  }

  static async listTasks(userId: string) {
    return prisma.staffTask.findMany({
      where: { assignedTo: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updateTaskStatus(id: string, status: string) {
    return prisma.staffTask.update({
      where: { id },
      data: { status },
    });
  }
}
