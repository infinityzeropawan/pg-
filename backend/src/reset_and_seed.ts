/**
 * RESET & SEED SCRIPT
 * 1. Clears ALL rows from every table in FK-safe order.
 * 2. Re-seeds with realistic example users for the REAL application.
 * These are REAL login accounts — users must log in via portal login pages.
 * Run: npx tsx src/reset_and_seed.ts
 */
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import {
  UserRole, OwnerRequestStatus, PropertyType, RoomType,
  BedStatus, StayStatus, ComplaintStatus, InvoiceStatus,
  PaymentMethod, PaymentStatus,
} from '@prisma/client';

async function clearDatabase() {
  console.log('\n🗑️  Clearing all tables...');
  await prisma.auditLog.deleteMany({});
  await prisma.notificationLog.deleteMany({});
  await prisma.userSession.deleteMany({});
  await prisma.policeVerification.deleteMany({});
  await prisma.sOSAlert.deleteMany({});
  await prisma.leaveRequest.deleteMany({});
  await prisma.gateLog.deleteMany({});
  await prisma.visitorLog.deleteMany({});
  await prisma.mealOrder.deleteMany({});
  await prisma.messMenu.deleteMany({});
  await prisma.complaint.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.tenantStay.deleteMany({});
  await prisma.tenantProfile.deleteMany({});
  await prisma.parentProfile.deleteMany({});
  await prisma.staffAssignment.deleteMany({});
  await prisma.bed.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.floor.deleteMany({});
  await prisma.notice.deleteMany({});
  await prisma.foodMenu.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.property.deleteMany({});
  await prisma.ownerRequest.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.platformSetting.deleteMany({});
  await prisma.platformPlan.deleteMany({});
  console.log('✅ All tables cleared.\n');
}

async function seed() {
  console.log('🌱 Seeding fresh data...\n');

  // Plans
  const starter = await prisma.platformPlan.create({ data: { name:'Starter Plan',code:'STARTER',maxProperties:1,maxBeds:50,priceMonthly:149900,priceYearly:1499000,features:JSON.stringify(['student_portal','basic_complaints','rent_invoicing']) }});
  await prisma.platformPlan.create({ data: { name:'Growth Plan',code:'GROWTH',maxProperties:3,maxBeds:200,priceMonthly:299900,priceYearly:2999000,features:JSON.stringify(['student_portal','mess_wallet','whatsapp_alerts','multi_property']) }});
  await prisma.platformPlan.create({ data: { name:'Enterprise Plan',code:'ENTERPRISE',maxProperties:10,maxBeds:1000,priceMonthly:599900,priceYearly:5999000,features:JSON.stringify(['all_features','custom_domain','priority_support']) }});
  console.log('✅ Seeded Platform Plans');

  await prisma.platformSetting.create({ data: { id:'platform',otpEnabled:true,defaultNightEntryTime:'22:00',defaultNoticeDays:30,supportPhone:'+91 98765 43210',maintenanceMode:false,whatsappEnabled:true }});
  console.log('✅ Seeded Platform Settings');

  // SuperAdmin
  await prisma.user.create({ data: { email:'admin@smartpg.com',phone:'9999999999',fullName:'Platform SuperAdmin',passwordHash:await bcrypt.hash('SuperAdmin@123456',10),role:UserRole.SUPERADMIN,mustChangePassword:false }});
  await prisma.user.create({ data: { email:'superadmin@gmail.com',phone:'9999999998',fullName:'Platform Admin',passwordHash:await bcrypt.hash('Super@123',10),role:UserRole.SUPERADMIN,mustChangePassword:false }});
  console.log('✅ Created SuperAdmin: admin@smartpg.com / SuperAdmin@123456');
  console.log('✅ Created SuperAdmin: superadmin@gmail.com / Super@123');

  // Owner
  const ownerUser = await prisma.user.create({ data: { email:'owner@smartpg.com',phone:'9876543201',fullName:'Rajesh Gupta',passwordHash:await bcrypt.hash('Owner@123456',10),role:UserRole.OWNER,mustChangePassword:false }});
  await prisma.user.update({ where:{id:ownerUser.id},data:{ownerId:ownerUser.id}});
  const owner2 = await prisma.user.create({ data: { email:'owner@gmail.com',phone:'9876543299',fullName:'Rajesh Gupta',passwordHash:await bcrypt.hash('Owner3@123',10),role:UserRole.OWNER,mustChangePassword:false }});
  await prisma.user.update({ where:{id:owner2.id},data:{ownerId:ownerUser.id}});
  await prisma.subscription.create({ data: { ownerId:ownerUser.id,planId:starter.id,startDate:new Date(),endDate:new Date(Date.now()+365*24*60*60*1000),isActive:true,autoRenew:true,paymentStatus:'PAID' }});
  console.log('✅ Created Owner: owner@smartpg.com / Owner@123456');
  console.log('✅ Created Owner: owner@gmail.com / Owner3@123');

  // Property
  const property = await prisma.property.create({ data: { ownerId:ownerUser.id,name:'Sunshine Luxury PG',slug:'sunshine-luxury-pg-koramangala',type:PropertyType.BOYS_PG,address:'142, 5th Cross, 6th Block, Koramangala',city:'Bengaluru',state:'Karnataka',pincode:'560095',contactPhone:'+91 98765 43210',contactEmail:'contact@sunshinepg.com',amenities:JSON.stringify(['Hi-Speed WiFi','Daily Housekeeping','3-Time Meals','Power Backup','AC','CCTV 24x7']),images:JSON.stringify([]),rules:'Curfew at 10:00 PM. No visitors after 8:00 PM.' }});
  console.log(`✅ Created Property: ${property.name}`);

  // Food Menu
  // FoodMenu uses weekMenuJson field
  const weekMenu = {monday:{breakfast:"Poha + Tea",lunch:"Rice + Dal + Roti",dinner:"Roti + Paneer + Salad"},tuesday:{breakfast:"Upma + Coffee",lunch:"Rice + Rajma",dinner:"Roti + Aloo Sabji"},wednesday:{breakfast:"Idli + Sambar",lunch:"Rice + Dal Fry + Roti",dinner:"Roti + Mix Veg"},thursday:{breakfast:"Paratha + Curd",lunch:"Rice + Chole",dinner:"Roti + Kadhi + Rice"},friday:{breakfast:"Poha + Tea",lunch:"Rice + Dal + Jeera Aloo",dinner:"Roti + Veg Pulao"},saturday:{breakfast:"Bread + Butter + Egg",lunch:"Pulao + Raita",dinner:"Roti + Pav Bhaji"},sunday:{breakfast:"Aloo Paratha + Curd",lunch:"Rajma + Rice + Roti",dinner:"Roti + Biryani + Raita"}};
  await prisma.foodMenu.create({ data: { ownerId:ownerUser.id, weekMenuJson: JSON.stringify(weekMenu) }});
  console.log('✅ Seeded weekly food menu');

  // Floors, Rooms, Beds
  const allBeds: any[] = [];
  for (let f = 1; f <= 2; f++) {
    const floor = await prisma.floor.create({ data:{propertyId:property.id,floorNumber:f,name:`Floor ${f}`}});
    for (let r = 1; r <= 3; r++) {
      const room = await prisma.room.create({ data:{floorId:floor.id,roomNumber:`${f}0${r}`,type:RoomType.DOUBLE_SHARING,monthlyRent:850000}});
      for (let b = 1; b <= 2; b++) {
        const bed = await prisma.bed.create({ data:{roomId:room.id,bedNumber:`B-${b}`,status:BedStatus.VACANT,monthlyRent:850000}});
        allBeds.push({...bed,roomNumber:room.roomNumber,floorNumber:f});
      }
    }
  }
  console.log('✅ Created 2 Floors, 6 Rooms, 12 Beds');

  // Manager accounts
  for (const m of [
    {email:'manager@smartpg.com',phone:'9876543202',name:'Ramesh Kumar',pass:'Manager@123456'},
    {email:'manager3@gmail.com',phone:'9876543298',name:'Sunil Joshi',pass:'Manager@123'},
  ]) {
    const u = await prisma.user.create({ data:{ownerId:ownerUser.id,email:m.email,phone:m.phone,fullName:m.name,passwordHash:await bcrypt.hash(m.pass,10),role:UserRole.MANAGER,mustChangePassword:false}});
    await prisma.staffAssignment.create({ data:{userId:u.id,propertyId:property.id,permissions:JSON.stringify(['all'])}});
    console.log(`✅ Created Manager: ${m.email} / ${m.pass}`);
  }

  // Staff/Cook
  const cook = await prisma.user.create({ data:{ownerId:ownerUser.id,email:'cook3@gmail.com',phone:'9876543297',fullName:'Chef Suresh',passwordHash:await bcrypt.hash('Cook@123',10),role:UserRole.STAFF,mustChangePassword:false}});
  await prisma.staffAssignment.create({ data:{userId:cook.id,propertyId:property.id,permissions:JSON.stringify(['mess'])}});
  console.log('✅ Created Staff/Cook: cook3@gmail.com / Cook@123');

  // Students & Parents
  const students = [
    {name:'Rahul Verma',email:'student@smartpg.com',phone:'9876543204',pass:'Student@123456',college:'PES University, CSE',parentName:'Suresh Verma',parentEmail:'parent@smartpg.com',parentPhone:'9977543204',parentPass:'Parent@123456',address:'24, Civil Lines, Kanpur, UP'},
    {name:'Aarav Patel',email:'student3@gmail.com',phone:'9876543296',pass:'Student@123',college:'RV College of Engineering, ECE',parentName:'Dinesh Patel',parentEmail:'parent3@gmail.com',parentPhone:'9977543296',parentPass:'Parent@123',address:'12, Gandhi Nagar, Ahmedabad, GJ'},
    {name:'Karan Mehra',email:'student2@smartpg.com',phone:'9876543295',pass:'Student2@123',college:'NMIMS University, MBA',parentName:'Anil Mehra',parentEmail:'parent2@smartpg.com',parentPhone:'9977543295',parentPass:'Parent2@123',address:'5B, Sector 14, Gurgaon, HR'},
  ];

  for (let i = 0; i < students.length; i++) {
    const st = students[i];
    const parentUser = await prisma.user.create({ data:{ownerId:ownerUser.id,fullName:st.parentName,email:st.parentEmail,phone:st.parentPhone,passwordHash:await bcrypt.hash(st.parentPass,10),role:UserRole.PARENT,mustChangePassword:false}});
    const parentProfile = await prisma.parentProfile.create({ data:{userId:parentUser.id,relation:'Father',address:st.address}});
    const studentUser = await prisma.user.create({ data:{ownerId:ownerUser.id,fullName:st.name,email:st.email,phone:st.phone,passwordHash:await bcrypt.hash(st.pass,10),role:UserRole.STUDENT,mustChangePassword:false}});
    const tenantProfile = await prisma.tenantProfile.create({ data:{userId:studentUser.id,emergencyContactName:st.parentName,emergencyContactPhone:st.parentPhone,permanentAddress:st.address,idProofType:'AADHAAR',idProofNumber:`XXXX-XXXX-${(1000+i*111)}`,collegeOrCompany:st.college,parentProfileId:parentProfile.id}});
    const bed = allBeds[i];
    if (bed) {
      const stay = await prisma.tenantStay.create({ data:{ownerId:ownerUser.id,propertyId:property.id,tenantId:tenantProfile.id,bedId:bed.id,monthlyRent:850000,securityDeposit:1000000,status:StayStatus.ACTIVE,startDate:new Date(Date.now()-90*24*60*60*1000)}});
      await prisma.bed.update({ where:{id:bed.id},data:{status:BedStatus.OCCUPIED}});
      // Unpaid invoice (current month)
      const dueDate = new Date(); dueDate.setDate(5);
      await prisma.invoice.create({
        data: {
          ownerId: ownerUser.id,
          propertyId: property.id,
          stayId: stay.id,
          invoiceNumber: `INV-${Date.now()}-${i+1}`,
          billingMonth: new Date().toLocaleString('en-IN',{month:'long',year:'numeric'}),
          totalAmount: 850000,
          paidAmount: 0,
          status: InvoiceStatus.ISSUED,
          dueDate,
          items: { create: [{ title: 'Monthly Rent', amount: 850000 }] },
        },
      });
      // Paid invoice (last month)
      const lastMonth = new Date(Date.now()-30*24*60*60*1000);
      const paidInv = await prisma.invoice.create({
        data: {
          ownerId: ownerUser.id,
          propertyId: property.id,
          stayId: stay.id,
          invoiceNumber: `INV-PAID-${Date.now()}-${i+1}`,
          billingMonth: lastMonth.toLocaleString('en-IN',{month:'long',year:'numeric'}),
          totalAmount: 850000,
          paidAmount: 850000,
          status: InvoiceStatus.PAID,
          dueDate: lastMonth,
          items: { create: [{ title: 'Monthly Rent', amount: 850000 }] },
        },
      });
      await prisma.payment.create({
        data: {
          ownerId: ownerUser.id,
          invoiceId: paidInv.id,
          amount: 850000,
          method: PaymentMethod.UPI,
          status: PaymentStatus.COMPLETED,
          transactionRef: `TXN-${Date.now()}-${i}`,
          paidAt: lastMonth,
        },
      });
      // Gate log
      await prisma.gateLog.create({ data:{propertyId:property.id,userId:studentUser.id,studentName:st.name,roomNumber:bed.roomNumber,type:'entry',reason:'College Classes',destination:'University',expectedReturnTime:'06:00 PM'}});
      // Complaint (linked to this student)
      await prisma.complaint.create({ data:{ownerId:ownerUser.id,propertyId:property.id,createdByUserId:studentUser.id,category:'Maintenance',title:'Fan not working in room',description:'Ceiling fan making noise and not running at full speed.',status:i===0?ComplaintStatus.OPEN:ComplaintStatus.RESOLVED,priority:'MEDIUM'}});
    }
    console.log(`✅ Student: ${st.name} | ${st.email} / ${st.pass}`);
    console.log(`   Parent:  ${st.parentEmail} / ${st.parentPass}`);
  }

  // Notices
  await prisma.notice.create({ data:{ownerId:ownerUser.id,title:'Monthly Rent Due — Pay Before 5th',content:'Please pay your monthly rent before the 5th of every month to avoid a late fee of ₹200/day.',category:'Finance',target:'ALL',isPinned:true}});
  await prisma.notice.create({ data:{ownerId:ownerUser.id,title:'Water Supply Maintenance Tomorrow',content:'No water supply from 6:00 AM to 10:00 AM tomorrow due to planned maintenance. Please store water in advance.',category:'Maintenance',target:'ALL',isPinned:false}});
  console.log('✅ Seeded 2 sample notices');

  // Owner Requests
  await prisma.ownerRequest.createMany({ data:[
    {fullName:'Vikram Sharma',email:'vikram.sharma@example.com',phone:'9876543210',city:'Bengaluru',propertyCount:2,totalBeds:120,notes:'2 luxury PG properties in Koramangala.',status:OwnerRequestStatus.PENDING},
    {fullName:'Ananya Verma',email:'ananya.v@example.com',phone:'9876543211',city:'Pune',propertyCount:1,totalBeds:60,notes:'Girls PG near Hinjewadi Tech Park.',status:OwnerRequestStatus.PENDING},
  ]});
  console.log('✅ Seeded 2 sample owner requests');

  // ── DEMO ACCOUNTS (isDemo: true — all writes blocked by backend) ──────────
  // Demo Owner (can log into owner portal, read-only)
  const demoOwner = await prisma.user.create({ data:{email:'demo.owner@smartpg.com',phone:'9800000001',fullName:'Demo PG Owner',passwordHash:await bcrypt.hash('Demo@123',10),role:UserRole.OWNER,mustChangePassword:false,isDemo:true}});
  await prisma.user.update({ where:{id:demoOwner.id},data:{ownerId:ownerUser.id}});

  // Demo Manager
  const demoManager = await prisma.user.create({ data:{ownerId:ownerUser.id,email:'demo.manager@smartpg.com',phone:'9800000002',fullName:'Demo Branch Manager',passwordHash:await bcrypt.hash('Demo@123',10),role:UserRole.MANAGER,mustChangePassword:false,isDemo:true}});
  await prisma.staffAssignment.create({ data:{userId:demoManager.id,propertyId:property.id,permissions:JSON.stringify(['all'])}});

  // Demo Cook/Staff
  const demoStaff = await prisma.user.create({ data:{ownerId:ownerUser.id,email:'demo.cook@smartpg.com',phone:'9800000003',fullName:'Demo Cook Staff',passwordHash:await bcrypt.hash('Demo@123',10),role:UserRole.STAFF,mustChangePassword:false,isDemo:true}});
  await prisma.staffAssignment.create({ data:{userId:demoStaff.id,propertyId:property.id,permissions:JSON.stringify(['mess'])}});

  // Demo Parent
  const demoParentUser = await prisma.user.create({ data:{ownerId:ownerUser.id,email:'demo.parent@smartpg.com',phone:'9800000005',fullName:'Demo Parent Guardian',passwordHash:await bcrypt.hash('Demo@123',10),role:UserRole.PARENT,mustChangePassword:false,isDemo:true}});
  const demoParentProfile = await prisma.parentProfile.create({ data:{userId:demoParentUser.id,relation:'Father',address:'Demo Address, Demo City'}});

  // Demo Student (linked to demo parent, given a bed + invoices + gate logs)
  const demoStudentUser = await prisma.user.create({ data:{ownerId:ownerUser.id,email:'demo.student@smartpg.com',phone:'9800000004',fullName:'Demo Student Resident',passwordHash:await bcrypt.hash('Demo@123',10),role:UserRole.STUDENT,mustChangePassword:false,isDemo:true}});
  const demoTenantProfile = await prisma.tenantProfile.create({ data:{userId:demoStudentUser.id,emergencyContactName:'Demo Parent',emergencyContactPhone:'9800000005',permanentAddress:'Demo Address, Demo City',idProofType:'AADHAAR',idProofNumber:'DEMO-0000-0000',collegeOrCompany:'Demo University, B.Tech CSE',parentProfileId:demoParentProfile.id}});

  const demoBed = allBeds[3]; // 4th bed — real students got 0,1,2
  if (demoBed) {
    const demoStay = await prisma.tenantStay.create({ data:{ownerId:ownerUser.id,propertyId:property.id,tenantId:demoTenantProfile.id,bedId:demoBed.id,monthlyRent:850000,securityDeposit:1000000,status:StayStatus.ACTIVE,startDate:new Date(Date.now()-60*24*60*60*1000)}});
    await prisma.bed.update({ where:{id:demoBed.id},data:{status:BedStatus.OCCUPIED}});
    const demoDue = new Date(); demoDue.setDate(5);
    await prisma.invoice.create({ data:{ownerId:ownerUser.id,propertyId:property.id,stayId:demoStay.id,invoiceNumber:'INV-DEMO-CURRENT',billingMonth:new Date().toLocaleString('en-IN',{month:'long',year:'numeric'}),totalAmount:850000,paidAmount:0,status:InvoiceStatus.ISSUED,dueDate:demoDue,items:{create:[{title:'Monthly Rent',amount:850000}]}}});
    const demoLastMonth = new Date(Date.now()-30*24*60*60*1000);
    await prisma.invoice.create({ data:{ownerId:ownerUser.id,propertyId:property.id,stayId:demoStay.id,invoiceNumber:'INV-DEMO-PAID',billingMonth:demoLastMonth.toLocaleString('en-IN',{month:'long',year:'numeric'}),totalAmount:850000,paidAmount:850000,status:InvoiceStatus.PAID,dueDate:demoLastMonth,items:{create:[{title:'Monthly Rent',amount:850000}]}}});
    await prisma.gateLog.create({ data:{propertyId:property.id,userId:demoStudentUser.id,studentName:'Demo Student Resident',roomNumber:demoBed.roomNumber,type:'entry',reason:'College Classes',destination:'Demo University',expectedReturnTime:'06:00 PM'}});
    await prisma.complaint.create({ data:{ownerId:ownerUser.id,propertyId:property.id,createdByUserId:demoStudentUser.id,category:'Maintenance',title:'Wi-Fi slow in room (Demo)',description:'Internet speed is very slow during evening hours.',status:ComplaintStatus.OPEN,priority:'MEDIUM'}});
  }

  console.log('✅ Created Demo Accounts (isDemo=true, all writes blocked):');
  console.log('   demo.owner@smartpg.com    / Demo@123  (Owner Portal)');
  console.log('   demo.manager@smartpg.com  / Demo@123  (Manager Portal)');
  console.log('   demo.cook@smartpg.com     / Demo@123  (Staff Portal)');
  console.log('   demo.student@smartpg.com  / Demo@123  (Student Portal)');
  console.log('   demo.parent@smartpg.com   / Demo@123  (Parent Portal)');


  console.log('\n' + '='.repeat(60));
  console.log('🎉 DATABASE RESET & SEEDED SUCCESSFULLY');
  console.log('='.repeat(60));
  console.log('\n📋 REAL APPLICATION LOGIN CREDENTIALS\n');
  console.log('SUPERADMIN  → /superadmin/login');
  console.log('  admin@smartpg.com       /  SuperAdmin@123456');
  console.log('  superadmin@gmail.com    /  Super@123');
  console.log('\nPG OWNER    → /owner/login');
  console.log('  owner@smartpg.com       /  Owner@123456');
  console.log('  owner@gmail.com         /  Owner3@123');
  console.log('\nMANAGER     → /manager/login');
  console.log('  manager@smartpg.com     /  Manager@123456');
  console.log('  manager3@gmail.com      /  Manager@123');
  console.log('\nSTAFF/COOK  → /staff/login');
  console.log('  cook3@gmail.com         /  Cook@123');
  console.log('\nSTUDENT     → /student/login');
  console.log('  student@smartpg.com     /  Student@123456');
  console.log('  student3@gmail.com      /  Student@123');
  console.log('  student2@smartpg.com    /  Student2@123');
  console.log('\nPARENT      → /parent/login');
  console.log('  parent@smartpg.com      /  Parent@123456');
  console.log('  parent3@gmail.com       /  Parent@123');
  console.log('  parent2@smartpg.com     /  Parent2@123');
  console.log('\n⚠️  Users MUST log in via the portal login pages.');
  console.log('   The /demo page links to login pages only — NO auto-login.');
  console.log('='.repeat(60) + '\n');
}

async function main() {
  try {
    await clearDatabase();
    await seed();
  } catch (e) {
    console.error('❌ Reset/seed failed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
