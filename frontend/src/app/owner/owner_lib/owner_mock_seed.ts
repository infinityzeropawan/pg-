/**
 * Owner Module — Comprehensive Mock Data Seed
 * 
 * DATA FLOW: This file seeds localStorage with rich demo data on every owner 
 * page load when no data exists (detected via spg_owner_seeded key).
 * 
 * All IDs are stable so cross-collection references work correctly.
 * Owner ID: 'owner_demo_1'
 * Properties: 'prop_1' (Sunrise PG - Boys), 'prop_2' (Moonlight PG - Girls)
 */

const OWNER_SEED_KEY = 'spg_owner_demo_seeded_v4';

const PROP_1_ID = 'prop_1';
const PROP_2_ID = 'prop_2';

import { getSession } from './owner_auth/OwnerSession';

function seedIfNeeded(): void {
  const currentSession = getSession();
  const OWNER_ID = currentSession && currentSession.role === 'owner' ? currentSession.id : 'owner_demo_1';

  if (typeof window === 'undefined') return;
  
  // Check if properties for THIS owner already exist
  const existingProps = localStorage.getItem('spg_properties');
  if (existingProps) {
    try {
      const props = JSON.parse(existingProps);
      if (Array.isArray(props) && props.some((p: any) => p.ownerId === OWNER_ID)) return;
    } catch (_) {}
  }
  
  const isSeeded = localStorage.getItem(OWNER_SEED_KEY);
  if (isSeeded) {
    // Clear old stale seed for different owner
    localStorage.removeItem(OWNER_SEED_KEY);
  }

  const now = new Date().toISOString();
  const thisMonth = now.slice(0, 7);

  // ─────────────────────────────────────────────────
  // 1. SESSION — Auto-login as owner
  // ─────────────────────────────────────────────────
  if (!currentSession || currentSession.role !== 'owner') {
    const session = {
      id: OWNER_ID,
      role: 'owner',
      name: 'Satya Prakash',
      email: 'owner@gmail.com',
      mustChangePassword: false,
    };
    localStorage.setItem('spg_current_session', JSON.stringify(session));
  }

  // ─────────────────────────────────────────────────
  // 2. PROPERTIES
  // ─────────────────────────────────────────────────
  const properties = [
    {
      id: PROP_1_ID, ownerId: OWNER_ID,
      name: 'Sunrise PG', slug: 'sunrise-pg', type: 'boys',
      address: '12, MG Road', city: 'Bangalore', pincode: '560001',
      landmark: 'Near Metro Station', description: 'Premium boys PG with all amenities.',
      contactName: 'Satya Prakash', contactPhone: '9876543210',
      floorsCount: 3, amenities: ['wifi', 'meals', 'laundry', 'ac', 'parking'],
      nightEntryTime: '22:00', noticePeriodDays: 30,
      messEnabled: true, visitorCutoff: '20:00',
      defaultDeposit: 10000, rentCycleDate: 1, photos: [],
      bedsPlanned: 30, isDeleted: false,
      createdAt: '2023-01-15T00:00:00Z', updatedAt: now,
      createdBy: OWNER_ID, updatedBy: OWNER_ID,
    },
    {
      id: PROP_2_ID, ownerId: OWNER_ID,
      name: 'Moonlight PG', slug: 'moonlight-pg', type: 'girls',
      address: '45, Brigade Road', city: 'Bangalore', pincode: '560025',
      landmark: 'Near City Mall', description: 'Safe and comfortable girls PG.',
      contactName: 'Satya Prakash', contactPhone: '9876543210',
      floorsCount: 2, amenities: ['wifi', 'meals', 'security', 'cctv'],
      nightEntryTime: '21:00', noticePeriodDays: 30,
      messEnabled: true, visitorCutoff: '19:00',
      defaultDeposit: 8000, rentCycleDate: 1, photos: [],
      bedsPlanned: 20,
      createdAt: '2023-03-10T00:00:00Z', updatedAt: now,
      createdBy: OWNER_ID, updatedBy: OWNER_ID,
    },
  ];
  localStorage.setItem('spg_properties', JSON.stringify(properties));

  // ─────────────────────────────────────────────────
  // 3. ROOMS
  // ─────────────────────────────────────────────────
  const rooms = [
    // Sunrise PG
    { id: 'room_1', propertyId: PROP_1_ID, roomNumber: '101', floor: 1, type: 'Double', capacity: 2, rentAmount: 8000, status: 'Occupied', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'room_2', propertyId: PROP_1_ID, roomNumber: '102', floor: 1, type: 'Double', capacity: 2, rentAmount: 8000, status: 'Occupied', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'room_3', propertyId: PROP_1_ID, roomNumber: '103', floor: 1, type: 'Single', capacity: 1, rentAmount: 12000, status: 'Occupied', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'room_4', propertyId: PROP_1_ID, roomNumber: '201', floor: 2, type: 'Triple', capacity: 3, rentAmount: 6000, status: 'Partially Occupied', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'room_5', propertyId: PROP_1_ID, roomNumber: '202', floor: 2, type: 'Double', capacity: 2, rentAmount: 8000, status: 'Vacant', createdAt: now, updatedAt: now, isDeleted: false },
    // Moonlight PG
    { id: 'room_6', propertyId: PROP_2_ID, roomNumber: '101', floor: 1, type: 'Double', capacity: 2, rentAmount: 7500, status: 'Occupied', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'room_7', propertyId: PROP_2_ID, roomNumber: '102', floor: 1, type: 'Single', capacity: 1, rentAmount: 11000, status: 'Occupied', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'room_8', propertyId: PROP_2_ID, roomNumber: '201', floor: 2, type: 'Double', capacity: 2, rentAmount: 7500, status: 'Vacant', createdAt: now, updatedAt: now, isDeleted: false },
  ];
  localStorage.setItem('spg_rooms', JSON.stringify(rooms));

  // ─────────────────────────────────────────────────
  // 4. BEDS
  // ─────────────────────────────────────────────────
  const beds = [
    // Room 101 (Sunrise) — 2 beds both occupied
    { id: 'bed_1', roomId: 'room_1', propertyId: PROP_1_ID, code: 'A', status: 'Occupied', studentId: 'student_1', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'bed_2', roomId: 'room_1', propertyId: PROP_1_ID, code: 'B', status: 'Occupied', studentId: 'student_2', createdAt: now, updatedAt: now, isDeleted: false },
    // Room 102 (Sunrise)
    { id: 'bed_3', roomId: 'room_2', propertyId: PROP_1_ID, code: 'A', status: 'Occupied', studentId: 'student_3', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'bed_4', roomId: 'room_2', propertyId: PROP_1_ID, code: 'B', status: 'Occupied', studentId: 'student_4', createdAt: now, updatedAt: now, isDeleted: false },
    // Room 103 (Sunrise) Single
    { id: 'bed_5', roomId: 'room_3', propertyId: PROP_1_ID, code: 'A', status: 'Occupied', studentId: 'student_5', createdAt: now, updatedAt: now, isDeleted: false },
    // Room 201 (Sunrise) Triple — 2 occupied, 1 vacant
    { id: 'bed_6', roomId: 'room_4', propertyId: PROP_1_ID, code: 'A', status: 'Occupied', studentId: 'student_6', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'bed_7', roomId: 'room_4', propertyId: PROP_1_ID, code: 'B', status: 'Occupied', studentId: 'student_7', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'bed_8', roomId: 'room_4', propertyId: PROP_1_ID, code: 'C', status: 'Vacant', studentId: null, createdAt: now, updatedAt: now, isDeleted: false },
    // Room 202 (Sunrise) Vacant
    { id: 'bed_9',  roomId: 'room_5', propertyId: PROP_1_ID, code: 'A', status: 'Vacant', studentId: null, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'bed_10', roomId: 'room_5', propertyId: PROP_1_ID, code: 'B', status: 'Vacant', studentId: null, createdAt: now, updatedAt: now, isDeleted: false },
    // Moonlight PG
    { id: 'bed_11', roomId: 'room_6', propertyId: PROP_2_ID, code: 'A', status: 'Occupied', studentId: 'student_8', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'bed_12', roomId: 'room_6', propertyId: PROP_2_ID, code: 'B', status: 'Occupied', studentId: 'student_9', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'bed_13', roomId: 'room_7', propertyId: PROP_2_ID, code: 'A', status: 'Occupied', studentId: 'student_10', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'bed_14', roomId: 'room_8', propertyId: PROP_2_ID, code: 'A', status: 'Vacant', studentId: null, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'bed_15', roomId: 'room_8', propertyId: PROP_2_ID, code: 'B', status: 'Vacant', studentId: null, createdAt: now, updatedAt: now, isDeleted: false },
  ];
  localStorage.setItem('spg_beds', JSON.stringify(beds));

  // ─────────────────────────────────────────────────
  // 5. USERS (students + owner user record)
  // ─────────────────────────────────────────────────
  const owners = [
    { id: OWNER_ID, userId: OWNER_ID, name: currentSession?.name || 'Satya Prakash', email: currentSession?.email || 'owner@gmail.com', phone: '9876543210', companyName: 'SmartPG', planId: 'p2', createdAt: now, updatedAt: now, isDeleted: false }
  ];
  localStorage.setItem('spg_owners', JSON.stringify(owners));

  const users = [
    { id: OWNER_ID, role: 'owner', name: 'Satya Prakash', email: 'owner@gmail.com', phone: '9876543210', password: 'Owner3@123', status: 'Active', ownerId: OWNER_ID, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'student_1', role: 'student', name: 'Arjun Mehta', email: 'arjun@example.com', phone: '9001234501', password: 'pass123', status: 'Active', propertyId: PROP_1_ID, ownerId: OWNER_ID, createdAt: '2024-01-01T00:00:00Z', updatedAt: now, isDeleted: false },
    { id: 'student_2', role: 'student', name: 'Rohit Verma', email: 'rohit@example.com', phone: '9001234502', password: 'pass123', status: 'Active', propertyId: PROP_1_ID, ownerId: OWNER_ID, createdAt: '2024-01-15T00:00:00Z', updatedAt: now, isDeleted: false },
    { id: 'student_3', role: 'student', name: 'Karthik Nair', email: 'karthik@example.com', phone: '9001234503', password: 'pass123', status: 'Active', propertyId: PROP_1_ID, ownerId: OWNER_ID, createdAt: '2024-02-01T00:00:00Z', updatedAt: now, isDeleted: false },
    { id: 'student_4', role: 'student', name: 'Vivek Sharma', email: 'vivek@example.com', phone: '9001234504', password: 'pass123', status: 'Active', propertyId: PROP_1_ID, ownerId: OWNER_ID, createdAt: '2024-02-10T00:00:00Z', updatedAt: now, isDeleted: false },
    { id: 'student_5', role: 'student', name: 'Anand Patel', email: 'anand@example.com', phone: '9001234505', password: 'pass123', status: 'Active', propertyId: PROP_1_ID, ownerId: OWNER_ID, createdAt: '2024-02-20T00:00:00Z', updatedAt: now, isDeleted: false },
    { id: 'student_6', role: 'student', name: 'Saurabh Jain', email: 'saurabh@example.com', phone: '9001234506', password: 'pass123', status: 'Active', propertyId: PROP_1_ID, ownerId: OWNER_ID, createdAt: '2024-03-01T00:00:00Z', updatedAt: now, isDeleted: false },
    { id: 'student_7', role: 'student', name: 'Pradeep Kumar', email: 'pradeep@example.com', phone: '9001234507', password: 'pass123', status: 'Active', propertyId: PROP_1_ID, ownerId: OWNER_ID, createdAt: '2024-03-05T00:00:00Z', updatedAt: now, isDeleted: false },
    { id: 'student_8', role: 'student', name: 'Anjali Singh', email: 'anjali@example.com', phone: '9001234508', password: 'pass123', status: 'Active', propertyId: PROP_2_ID, ownerId: OWNER_ID, createdAt: '2024-01-20T00:00:00Z', updatedAt: now, isDeleted: false },
    { id: 'student_9', role: 'student', name: 'Priya Sharma', email: 'priyaS@example.com', phone: '9001234509', password: 'pass123', status: 'Active', propertyId: PROP_2_ID, ownerId: OWNER_ID, createdAt: '2024-02-05T00:00:00Z', updatedAt: now, isDeleted: false },
    { id: 'student_10', role: 'student', name: 'Kavya Reddy', email: 'kavya@example.com', phone: '9001234510', password: 'pass123', status: 'Active', propertyId: PROP_2_ID, ownerId: OWNER_ID, createdAt: '2024-02-25T00:00:00Z', updatedAt: now, isDeleted: false },
  ];
  localStorage.setItem('spg_users', JSON.stringify(users));

  // ─────────────────────────────────────────────────
  // 6. STUDENTS (profile records)
  // ─────────────────────────────────────────────────
  const students = [
    { id: 'student_1', userId: 'student_1', propertyId: PROP_1_ID, bedId: 'bed_1', roomId: 'room_1', status: 'active', rentAmount: 8000, depositAmount: 10000, moveInDate: '2024-01-01', pgScore: 92, duesAmount: 0, discountApplied: false, createdAt: '2024-01-01T00:00:00Z', updatedAt: now, isDeleted: false },
    { id: 'student_2', userId: 'student_2', propertyId: PROP_1_ID, bedId: 'bed_2', roomId: 'room_1', status: 'active', rentAmount: 8000, depositAmount: 10000, moveInDate: '2024-01-15', pgScore: 78, duesAmount: 8000, discountApplied: false, createdAt: '2024-01-15T00:00:00Z', updatedAt: now, isDeleted: false },
    { id: 'student_3', userId: 'student_3', propertyId: PROP_1_ID, bedId: 'bed_3', roomId: 'room_2', status: 'active', rentAmount: 8000, depositAmount: 10000, moveInDate: '2024-02-01', pgScore: 85, duesAmount: 0, discountApplied: false, createdAt: '2024-02-01T00:00:00Z', updatedAt: now, isDeleted: false },
    { id: 'student_4', userId: 'student_4', propertyId: PROP_1_ID, bedId: 'bed_4', roomId: 'room_2', status: 'active', rentAmount: 8000, depositAmount: 10000, moveInDate: '2024-02-10', pgScore: 60, duesAmount: 16000, discountApplied: false, createdAt: '2024-02-10T00:00:00Z', updatedAt: now, isDeleted: false },
    { id: 'student_5', userId: 'student_5', propertyId: PROP_1_ID, bedId: 'bed_5', roomId: 'room_3', status: 'active', rentAmount: 12000, depositAmount: 15000, moveInDate: '2024-02-20', pgScore: 95, duesAmount: 0, discountApplied: true, createdAt: '2024-02-20T00:00:00Z', updatedAt: now, isDeleted: false },
    { id: 'student_6', userId: 'student_6', propertyId: PROP_1_ID, bedId: 'bed_6', roomId: 'room_4', status: 'on_notice', rentAmount: 6000, depositAmount: 8000, moveInDate: '2024-03-01', pgScore: 45, duesAmount: 12000, discountApplied: false, createdAt: '2024-03-01T00:00:00Z', updatedAt: now, isDeleted: false },
    { id: 'student_7', userId: 'student_7', propertyId: PROP_1_ID, bedId: 'bed_7', roomId: 'room_4', status: 'active', rentAmount: 6000, depositAmount: 8000, moveInDate: '2024-03-05', pgScore: 72, duesAmount: 0, discountApplied: false, createdAt: '2024-03-05T00:00:00Z', updatedAt: now, isDeleted: false },
    { id: 'student_8', userId: 'student_8', propertyId: PROP_2_ID, bedId: 'bed_11', roomId: 'room_6', status: 'active', rentAmount: 7500, depositAmount: 8000, moveInDate: '2024-01-20', pgScore: 88, duesAmount: 0, discountApplied: false, createdAt: '2024-01-20T00:00:00Z', updatedAt: now, isDeleted: false },
    { id: 'student_9', userId: 'student_9', propertyId: PROP_2_ID, bedId: 'bed_12', roomId: 'room_6', status: 'active', rentAmount: 7500, depositAmount: 8000, moveInDate: '2024-02-05', pgScore: 91, duesAmount: 0, discountApplied: false, createdAt: '2024-02-05T00:00:00Z', updatedAt: now, isDeleted: false },
    { id: 'student_10', userId: 'student_10', propertyId: PROP_2_ID, bedId: 'bed_13', roomId: 'room_7', status: 'active', rentAmount: 11000, depositAmount: 8000, moveInDate: '2024-02-25', pgScore: 67, duesAmount: 11000, discountApplied: false, createdAt: '2024-02-25T00:00:00Z', updatedAt: now, isDeleted: false },
  ];
  localStorage.setItem('spg_students', JSON.stringify(students));

  // ─────────────────────────────────────────────────
  // 7. STAFF
  // ─────────────────────────────────────────────────
  const staff = [
    { id: 'staff_1', userId: 'staff_u1', name: 'Ramesh Babu', role: 'manager', phone: '8001234501', email: 'ramesh@spg.com', assignedPropertyIds: [PROP_1_ID], salary: 25000, salaryStatus: 'Paid', status: 'Active', propertyId: PROP_1_ID, ownerId: OWNER_ID, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'staff_2', userId: 'staff_u2', name: 'Suresh Cook', role: 'cook', phone: '8001234502', email: 'suresh@spg.com', assignedPropertyIds: [PROP_1_ID], salary: 15000, salaryStatus: 'Pending', status: 'Active', propertyId: PROP_1_ID, ownerId: OWNER_ID, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'staff_3', userId: 'staff_u3', name: 'Meena Devi', role: 'warden', phone: '8001234503', email: 'meena@spg.com', assignedPropertyIds: [PROP_2_ID], salary: 18000, salaryStatus: 'Paid', status: 'Active', propertyId: PROP_2_ID, ownerId: OWNER_ID, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'staff_4', userId: 'staff_u4', name: 'Lakshmi Helper', role: 'housekeeping', phone: '8001234504', email: 'lakshmi@spg.com', assignedPropertyIds: [PROP_1_ID, PROP_2_ID], salary: 10000, salaryStatus: 'Paid', status: 'Active', propertyId: PROP_1_ID, ownerId: OWNER_ID, createdAt: now, updatedAt: now, isDeleted: false },
  ];
  localStorage.setItem('spg_staff', JSON.stringify(staff));

  // ─────────────────────────────────────────────────
  // 8. INVOICES (current month rent bills)
  // ─────────────────────────────────────────────────
  const invoices = [
    { id: 'inv_1', propertyId: PROP_1_ID, studentId: 'student_1', month: thisMonth, amount: 8000, status: 'Paid', dueDate: `${thisMonth}-05`, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'inv_2', propertyId: PROP_1_ID, studentId: 'student_2', month: thisMonth, amount: 8000, status: 'Pending', dueDate: `${thisMonth}-05`, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'inv_3', propertyId: PROP_1_ID, studentId: 'student_3', month: thisMonth, amount: 8000, status: 'Paid', dueDate: `${thisMonth}-05`, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'inv_4', propertyId: PROP_1_ID, studentId: 'student_4', month: thisMonth, amount: 8000, status: 'Overdue', dueDate: `${thisMonth}-05`, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'inv_5', propertyId: PROP_1_ID, studentId: 'student_5', month: thisMonth, amount: 12000, status: 'Paid', dueDate: `${thisMonth}-05`, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'inv_6', propertyId: PROP_1_ID, studentId: 'student_6', month: thisMonth, amount: 6000, status: 'Overdue', dueDate: `${thisMonth}-05`, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'inv_7', propertyId: PROP_1_ID, studentId: 'student_7', month: thisMonth, amount: 6000, status: 'Paid', dueDate: `${thisMonth}-05`, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'inv_8', propertyId: PROP_2_ID, studentId: 'student_8', month: thisMonth, amount: 7500, status: 'Paid', dueDate: `${thisMonth}-05`, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'inv_9', propertyId: PROP_2_ID, studentId: 'student_9', month: thisMonth, amount: 7500, status: 'Paid', dueDate: `${thisMonth}-05`, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'inv_10', propertyId: PROP_2_ID, studentId: 'student_10', month: thisMonth, amount: 11000, status: 'Pending', dueDate: `${thisMonth}-05`, createdAt: now, updatedAt: now, isDeleted: false },
  ];
  localStorage.setItem('spg_invoices', JSON.stringify(invoices));

  // ─────────────────────────────────────────────────
  // 9. PAYMENTS
  // ─────────────────────────────────────────────────
  const payments = [
    { id: 'pay_1', propertyId: PROP_1_ID, studentId: 'student_1', invoiceId: 'inv_1', amount: 8000, mode: 'UPI', status: 'Success', paidAt: now, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'pay_2', propertyId: PROP_1_ID, studentId: 'student_3', invoiceId: 'inv_3', amount: 8000, mode: 'Cash', status: 'Success', paidAt: now, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'pay_3', propertyId: PROP_1_ID, studentId: 'student_5', invoiceId: 'inv_5', amount: 12000, mode: 'Bank Transfer', status: 'Success', paidAt: now, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'pay_4', propertyId: PROP_1_ID, studentId: 'student_7', invoiceId: 'inv_7', amount: 6000, mode: 'UPI', status: 'Success', paidAt: now, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'pay_5', propertyId: PROP_2_ID, studentId: 'student_8', invoiceId: 'inv_8', amount: 7500, mode: 'Cash', status: 'Success', paidAt: now, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'pay_6', propertyId: PROP_2_ID, studentId: 'student_9', invoiceId: 'inv_9', amount: 7500, mode: 'UPI', status: 'Success', paidAt: now, createdAt: now, updatedAt: now, isDeleted: false },
  ];
  localStorage.setItem('spg_payments', JSON.stringify(payments));

  // ─────────────────────────────────────────────────
  // 10. EXPENSES
  // ─────────────────────────────────────────────────
  const expenses = [
    { id: 'exp_1', propertyId: PROP_1_ID, category: 'staff_salary', description: 'Manager salary', amount: 25000, date: `${thisMonth}-01`, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'exp_2', propertyId: PROP_1_ID, category: 'staff_salary', description: 'Cook salary', amount: 15000, date: `${thisMonth}-01`, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'exp_3', propertyId: PROP_1_ID, category: 'groceries', description: 'Monthly grocery purchase', amount: 18000, date: `${thisMonth}-03`, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'exp_4', propertyId: PROP_1_ID, category: 'electricity', description: 'Electricity bill', amount: 8500, date: `${thisMonth}-05`, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'exp_5', propertyId: PROP_1_ID, category: 'maintenance', description: 'Plumbing repair', amount: 3500, date: `${thisMonth}-08`, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'exp_6', propertyId: PROP_2_ID, category: 'staff_salary', description: 'Warden salary', amount: 18000, date: `${thisMonth}-01`, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'exp_7', propertyId: PROP_2_ID, category: 'groceries', description: 'Monthly grocery', amount: 12000, date: `${thisMonth}-03`, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'exp_8', propertyId: PROP_2_ID, category: 'electricity', description: 'Electricity bill', amount: 5500, date: `${thisMonth}-05`, createdAt: now, updatedAt: now, isDeleted: false },
  ];
  localStorage.setItem('spg_expenses', JSON.stringify(expenses));

  // ─────────────────────────────────────────────────
  // 11. COMPLAINTS
  // ─────────────────────────────────────────────────
  const complaints = [
    { id: 'comp_1', propertyId: PROP_1_ID, studentId: 'student_2', title: 'Water leakage in room 101', description: 'There is water leaking from the ceiling near the bathroom.', status: 'open', priority: 'high', category: 'maintenance', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'comp_2', propertyId: PROP_1_ID, studentId: 'student_4', title: 'WiFi not working', description: 'Internet has been down since yesterday morning.', status: 'in_progress', priority: 'medium', category: 'utilities', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'comp_3', propertyId: PROP_2_ID, studentId: 'student_8', title: 'Food quality issue', description: 'The dinner quality has been poor for the past week.', status: 'open', priority: 'medium', category: 'food', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'comp_4', propertyId: PROP_1_ID, studentId: 'student_6', title: 'AC not cooling', description: 'The AC in room 201 is not working properly.', status: 'resolved', priority: 'low', category: 'maintenance', createdAt: now, updatedAt: now, isDeleted: false },
  ];
  localStorage.setItem('spg_complaints', JSON.stringify(complaints));

  // ─────────────────────────────────────────────────
  // 12. ENQUIRIES
  // ─────────────────────────────────────────────────
  const enquiries = [
    { id: 'enq_1', propertyId: PROP_1_ID, name: 'Rahul Gupta', phone: '9111000001', email: 'rahul.g@example.com', status: 'Interested', source: 'Website', expectedMoveIn: `${thisMonth}-15`, notes: 'Looking for double room', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'enq_2', propertyId: PROP_1_ID, name: 'Amit Joshi', phone: '9111000002', email: 'amit.j@example.com', status: 'Visited', source: 'Referral', expectedMoveIn: `${thisMonth}-20`, notes: 'Visited on Saturday, liked the facilities', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'enq_3', propertyId: PROP_2_ID, name: 'Sneha Pillai', phone: '9111000003', email: 'sneha@example.com', status: 'Interested', source: 'Social Media', expectedMoveIn: `${thisMonth}-10`, notes: 'Wants single AC room', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'enq_4', propertyId: PROP_1_ID, name: 'Deepak Rao', phone: '9111000004', email: 'deepak@example.com', status: 'Dropped', source: 'Walk-in', expectedMoveIn: null, notes: 'Found another PG', createdAt: now, updatedAt: now, isDeleted: false },
  ];
  localStorage.setItem('spg_enquiries', JSON.stringify(enquiries));

  // ─────────────────────────────────────────────────
  // 13. NOTICES
  // ─────────────────────────────────────────────────
  const notices = [
    { id: 'not_1', propertyId: PROP_1_ID, title: 'Maintenance Shutdown - Water Supply', content: 'Water supply will be shut down on Sunday from 10 AM to 2 PM for tank cleaning.', priority: 'high', targetRole: 'all', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'not_2', propertyId: PROP_1_ID, title: 'Rent Due Reminder', content: 'Please pay your monthly rent by the 5th of every month to avoid late fees.', priority: 'medium', targetRole: 'student', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'not_3', propertyId: PROP_2_ID, title: 'New Mess Menu', content: 'Updated mess menu for the month. Please check with the warden for details.', priority: 'low', targetRole: 'student', createdAt: now, updatedAt: now, isDeleted: false },
  ];
  localStorage.setItem('spg_notices', JSON.stringify(notices));

  // ─────────────────────────────────────────────────
  // 14. ATTENDANCE (staff)
  // ─────────────────────────────────────────────────
  const attendance = [
    { id: 'att_1', staffId: 'staff_1', propertyId: PROP_1_ID, date: thisMonth + '-01', status: 'present', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'att_2', staffId: 'staff_2', propertyId: PROP_1_ID, date: thisMonth + '-01', status: 'present', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'att_3', staffId: 'staff_3', propertyId: PROP_2_ID, date: thisMonth + '-01', status: 'absent', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'att_4', staffId: 'staff_4', propertyId: PROP_1_ID, date: thisMonth + '-01', status: 'present', createdAt: now, updatedAt: now, isDeleted: false },
  ];
  localStorage.setItem('spg_staff_attendance', JSON.stringify(attendance));

  // ─────────────────────────────────────────────────
  // 15. INVENTORY
  // ─────────────────────────────────────────────────
  const inventory = [
    { id: 'inv_i_1', propertyId: PROP_1_ID, name: 'Rice', unit: 'kg', quantity: 50, minStock: 20, category: 'grocery', lastRestocked: now, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'inv_i_2', propertyId: PROP_1_ID, name: 'Dal', unit: 'kg', quantity: 15, minStock: 10, category: 'grocery', lastRestocked: now, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'inv_i_3', propertyId: PROP_1_ID, name: 'Cooking Oil', unit: 'L', quantity: 8, minStock: 5, category: 'grocery', lastRestocked: now, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'inv_i_4', propertyId: PROP_1_ID, name: 'Detergent', unit: 'kg', quantity: 3, minStock: 5, category: 'cleaning', lastRestocked: now, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'inv_i_5', propertyId: PROP_2_ID, name: 'Rice', unit: 'kg', quantity: 30, minStock: 15, category: 'grocery', lastRestocked: now, createdAt: now, updatedAt: now, isDeleted: false },
  ];
  localStorage.setItem('spg_inventory', JSON.stringify(inventory));

  // ─────────────────────────────────────────────────
  // 16. SUBSCRIPTION
  // ─────────────────────────────────────────────────
  const subscription = [{
    id: 'sub_1', ownerId: OWNER_ID, planId: 'p2', planName: 'Premium',
    status: 'active', price: 2499, billingCycle: 'monthly',
    startDate: '2024-01-01', endDate: '2025-01-01',
    maxProperties: 5, maxBeds: 500,
    createdAt: now, updatedAt: now, isDeleted: false
  }];
  localStorage.setItem('spg_subscriptions', JSON.stringify(subscription));

  // ─────────────────────────────────────────────────
  // 17. SECURITY DEPOSITS
  // ─────────────────────────────────────────────────
  const deposits = [
    { id: 'dep_1', propertyId: PROP_1_ID, studentId: 'student_1', amount: 10000, status: 'Active', paidDate: '2024-01-01', refundDate: null, deductions: [], refundAmount: null, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'dep_2', propertyId: PROP_1_ID, studentId: 'student_2', amount: 10000, status: 'Active', paidDate: '2024-01-15', refundDate: null, deductions: [], refundAmount: null, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'dep_3', propertyId: PROP_1_ID, studentId: 'student_3', amount: 10000, status: 'Active', paidDate: '2024-02-01', refundDate: null, deductions: [], refundAmount: null, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'dep_4', propertyId: PROP_1_ID, studentId: 'student_4', amount: 10000, status: 'Active', paidDate: '2024-02-10', refundDate: null, deductions: [{ reason: 'Wall damage', amount: 1500 }], refundAmount: null, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'dep_5', propertyId: PROP_1_ID, studentId: 'student_5', amount: 15000, status: 'Active', paidDate: '2024-02-20', refundDate: null, deductions: [], refundAmount: null, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'dep_6', propertyId: PROP_1_ID, studentId: 'student_6', amount: 8000, status: 'Refund Pending', paidDate: '2024-03-01', refundDate: null, deductions: [{ reason: 'Pending rent', amount: 500 }, { reason: 'Curtain damage', amount: 300 }], refundAmount: 7200, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'dep_7', propertyId: PROP_1_ID, studentId: 'student_7', amount: 8000, status: 'Active', paidDate: '2024-03-05', refundDate: null, deductions: [], refundAmount: null, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'dep_8', propertyId: PROP_2_ID, studentId: 'student_8', amount: 8000, status: 'Active', paidDate: '2024-01-20', refundDate: null, deductions: [], refundAmount: null, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'dep_9', propertyId: PROP_2_ID, studentId: 'student_9', amount: 8000, status: 'Active', paidDate: '2024-02-05', refundDate: null, deductions: [], refundAmount: null, createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'dep_10', propertyId: PROP_2_ID, studentId: 'student_10', amount: 8000, status: 'Refunded', paidDate: '2024-02-25', refundDate: '2024-08-10', deductions: [{ reason: 'Cleaning charge', amount: 500 }], refundAmount: 7500, createdAt: now, updatedAt: now, isDeleted: false },
  ];
  localStorage.setItem('spg_deposits', JSON.stringify(deposits));

  // ─────────────────────────────────────────────────
  // 18. AMC CONTRACTS
  // ─────────────────────────────────────────────────
  const amcContracts = [
    { id: 'amc_1', propertyId: PROP_1_ID, vendor: 'ABC AC Services', service: 'AC Maintenance', amount: 50000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Active', nextServiceDate: '2024-10-01', frequency: 'Monthly', contactPhone: '9000001111', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'amc_2', propertyId: PROP_1_ID, vendor: 'XYZ Elevator Co.', service: 'Elevator Service', amount: 30000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Active', nextServiceDate: '2024-10-15', frequency: 'Quarterly', contactPhone: '9000002222', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'amc_3', propertyId: PROP_1_ID, vendor: 'DEF Pest Control', service: 'Pest Control', amount: 12000, startDate: '2024-01-01', endDate: '2024-09-30', status: 'Expiring', nextServiceDate: '2024-09-25', frequency: 'Quarterly', contactPhone: '9000003333', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'amc_4', propertyId: PROP_1_ID, vendor: 'GHI Security Systems', service: 'CCTV System', amount: 15000, startDate: '2023-01-01', endDate: '2024-08-31', status: 'Expired', nextServiceDate: null, frequency: 'Annual', contactPhone: '9000004444', createdAt: now, updatedAt: now, isDeleted: false },
    { id: 'amc_5', propertyId: PROP_2_ID, vendor: 'CleanPro Services', service: 'Deep Cleaning', amount: 18000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Active', nextServiceDate: '2024-10-20', frequency: 'Monthly', contactPhone: '9000005555', createdAt: now, updatedAt: now, isDeleted: false },
  ];
  localStorage.setItem('spg_amc_contracts', JSON.stringify(amcContracts));

  // ─────────────────────────────────────────────────
  // 19. PREVENTIVE MAINTENANCE SCHEDULE
  // ─────────────────────────────────────────────────
  const preventiveSchedule = [
    { id: 'prev_1', propertyId: PROP_1_ID, asset: 'AC Units', task: 'Filter Cleaning', frequency: 'Monthly', lastDone: thisMonth + '-01', nextDue: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], status: 'Scheduled', createdAt: now, updatedAt: now },
    { id: 'prev_2', propertyId: PROP_1_ID, asset: 'Elevator', task: 'Full Service', frequency: 'Quarterly', lastDone: '2024-07-15', nextDue: '2024-10-15', status: 'Scheduled', createdAt: now, updatedAt: now },
    { id: 'prev_3', propertyId: PROP_1_ID, asset: 'Fire Safety System', task: 'Inspection', frequency: 'Monthly', lastDone: thisMonth + '-05', nextDue: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], status: 'Completed', createdAt: now, updatedAt: now },
    { id: 'prev_4', propertyId: PROP_1_ID, asset: 'Water Tank', task: 'Cleaning', frequency: 'Bi-annual', lastDone: '2024-04-01', nextDue: '2024-10-01', status: 'Due Soon', createdAt: now, updatedAt: now },
    { id: 'prev_5', propertyId: PROP_2_ID, asset: 'Generator', task: 'Oil Change & Service', frequency: 'Quarterly', lastDone: '2024-06-01', nextDue: '2024-09-01', status: 'Overdue', createdAt: now, updatedAt: now },
  ];
  localStorage.setItem('spg_preventive_schedule', JSON.stringify(preventiveSchedule));

  // ─────────────────────────────────────────────────
  // MARK SEEDED
  // ─────────────────────────────────────────────────
  localStorage.setItem(OWNER_SEED_KEY, 'true');
}

export { seedIfNeeded, PROP_1_ID, PROP_2_ID };
