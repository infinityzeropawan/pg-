const { randomBytes } = require('crypto');

const createId = (prefix) => prefix + '_' + randomBytes(4).toString('hex');
const now = new Date().toISOString();
const base = () => ({
  createdAt: now,
  updatedAt: now,
  createdBy: 'system',
  updatedBy: 'system',
  isDeleted: false
});

// Just simulating the generation logic to see if it throws ANY errors
try {
  const superadminId = createId('usr');
  const ownerUserId = createId('usr');
  const ownerProfileId = createId('own');
  const managerId = createId('usr');
  const cookId = createId('usr');
  const guardId = createId('usr');
  const studentId = createId('usr');
  const studentId2 = createId('usr');
  const studentId3 = createId('usr');
  const studentId4 = createId('usr');
  const parentId = createId('usr');

  const users = [
    { id: superadminId, ...base(), role: 'superadmin', name: 'Super Admin', email: 'superadmin@gmail.com', password: 'Super@123', status: 'Active', mustChangePassword: false },
  ];

  // Generate 25 Owner Requests
  const requests = Array.from({length: 25}).map((_, i) => ({
    id: createId('req'),
    ...base(),
    name: `Requesting Owner ${i+1}`,
    businessName: `PG Business ${i+1}`,
    city: ['Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Noida'][i % 5],
    pgCount: (i % 5) + 1,
    beds: (i * 20) + 50,
    email: `req${i+1}@example.com`,
    phone: `99999990${i.toString().padStart(2, '0')}`,
    status: ['Pending', 'Approved', 'Rejected', 'Hold'][i % 4],
    createdAt: new Date(Date.now() - i * 86400000).toISOString()
  }));

  // Generate 22 Owners
  const owners = Array.from({length: 22}).map((_, i) => ({
    id: createId('own'),
    ...base(),
    userId: createId('usr'),
    name: `Owner ${i+1}`,
    businessName: `Stays ${i+1}`,
    email: `owner${i+1}@example.com`,
    phone: `88888880${i.toString().padStart(2, '0')}`,
    status: ['Active', 'Inactive'][i % 2]
  }));
  owners[0] = { id: ownerProfileId, ...base(), userId: ownerUserId, name: 'Owner 3', businessName: 'Owner3 Stays', email: 'owner@gmail.com', phone: '8888888888', status: 'Active' };

  // Generate 35 Tickets
  const tickets = Array.from({length: 35}).map((_, i) => ({
    id: createId('tkt'),
    ...base(),
    title: `Issue with system ${i+1}`,
    description: `I am facing an issue in the platform. Please check.`,
    status: ['Open', 'In Progress', 'Resolved'][i % 3],
    priority: ['High', 'Medium', 'Low'][i % 3],
    reportedBy: owners[i % owners.length]?.userId,
    createdAt: new Date(Date.now() - i * 3600000).toISOString()
  }));

  const subs = owners.map((o, i) => ({
    id: createId('sub'), 
    ...base(), 
    ownerId: o.id, 
    planId: ['plan_basic', 'plan_gold', 'plan_plat'][i % 3], 
    status: o.status === 'Active' ? 'active' : 'expired',
    startDate: new Date(Date.now() - i * 864000000).toISOString(),
    endDate: new Date(Date.now() + 30 * 86400000).toISOString()
  }));

  const propPatna = { id: 'prop_patna', ...base(), ownerId: ownerUserId, name: 'Owner3 PG Patna', city: 'Patna', bedsPlanned: 75 };
  const propDelhi = { id: 'prop_delhi', ...base(), ownerId: ownerUserId, name: 'Owner3 PG Delhi', city: 'Delhi', bedsPlanned: 40 };

  const rooms = Array.from({length: 8}).map((_, i) => ({
    id: `room_${i+1}`, ...base(), propertyId: 'prop_patna', floor: 3, number: `30${i+1}`, sharing: 2, rentPerBed: 5000, deposit: 5000, amenities: ['AC', 'WiFi'], status: 'available'
  }));

  const beds = [
    { id: 'bed_303B', ...base(), roomId: rooms[2]?.id, propertyId: 'prop_patna', code: 'B', status: 'occupied', studentId: studentId },
    { id: 'bed_303A', ...base(), roomId: rooms[2]?.id, propertyId: 'prop_patna', code: 'A', status: 'occupied', studentId: studentId2 },
    { id: 'bed_304A', ...base(), roomId: rooms[3]?.id, propertyId: 'prop_patna', code: 'A', status: 'occupied', studentId: studentId3 },
    { id: 'bed_304B', ...base(), roomId: rooms[3]?.id, propertyId: 'prop_patna', code: 'B', status: 'occupied', studentId: studentId4 }
  ];

  const groceryItems = [
    { name: 'Basmati Rice',     unit: 'Kg',      quantity: 25, lowStockThreshold: 5,  category: 'Groceries', expiryDate: '2026-12-01' },
    { name: 'Onions',           unit: 'Kg',      quantity: 10, lowStockThreshold: 2,  category: 'Groceries' }
  ].map((item) => ({
    id: createId('stk'),
    ...base(),
    propertyId: 'prop_patna',
    ...item
  }));

  const maintenanceItems = Array.from({length: 15}).map((_, i) => ({
    id: createId('stk'),
    ...base(),
    propertyId: 'prop_patna',
    name: ['Light Bulbs (LED)', 'Toilet Cleaner', 'Brooms', 'Mop Set', 'Dish Soap', 'Dustbin Bags', 'Phenyl', 'Room Freshener', 'Extension Cords', 'Screwdrivers Set', 'Spare Fan Regulator', 'Insect Repellent', 'Handwash Soap', 'Tissue Rolls', 'Bleaching Powder'][i],
    unit: ['Pieces', 'Liters', 'Pieces', 'Pieces', 'Liters', 'Packets', 'Liters', 'Pieces', 'Pieces', 'Set', 'Pieces', 'Liters', 'Pieces', 'Rolls', 'Kg'][i],
    quantity: [20, 3, 5, 2, 4, 10, 2, 4, 3, 1, 5, 2, 15, 20, 2][i],
    lowStockThreshold: [5, 1, 2, 1, 1, 3, 1, 1, 1, 1, 2, 1, 5, 5, 1][i],
    category: ['Maintenance', 'Cleaning', 'Cleaning', 'Cleaning', 'Cleaning', 'Cleaning', 'Cleaning', 'Maintenance', 'Maintenance', 'Maintenance', 'Maintenance', 'Maintenance', 'Cleaning', 'Cleaning', 'Cleaning'][i],
  }));

  console.log("SUCCESS");
} catch (e) {
  console.error("ERROR", e);
}
