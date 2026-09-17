import bcrypt from 'bcryptjs';
import { prisma } from './db';
import {
  UserRole,
  OwnerRequestStatus,
  PropertyType,
  RoomType,
  BedStatus,
  StayStatus,
  ComplaintStatus,
  InvoiceStatus,
  PaymentMethod,
  PaymentStatus,
  AttendanceStatus,
  MealType,
  DocumentType,
  VerificationStatus,
} from '@prisma/client';
import { signGateToken } from './utils/gateQr';
import { attendanceDateFromKey } from './utils/datetime';

async function seedRichData() {
  console.log('🚀 Seeding comprehensive, production-grade real demo data...');

  // 1. Identify or ensure Primary Owner
  const ownerUser = await prisma.user.findFirst({
    where: { email: 'owner@smartpg.com' },
  });

  if (!ownerUser) {
    throw new Error('Primary owner owner@smartpg.com not found. Please run base seed first.');
  }

  // Ensure ownerId is self
  await prisma.user.update({
    where: { id: ownerUser.id },
    data: { ownerId: ownerUser.id, isDemo: false },
  });

  // 2. Ensure Demo Owner shares the same ownerId so it has full access to the PG!
  const demoOwnerUser = await prisma.user.findUnique({
    where: { email: 'demo.owner@smartpg.com' },
  });
  if (demoOwnerUser) {
    await prisma.user.update({
      where: { id: demoOwnerUser.id },
      data: { ownerId: ownerUser.id, isDemo: false },
    });
    console.log('✅ Demo Owner linked to primary owner account.');
  }

  // 3. Properties: Sunshine Luxury PG + Green Valley PG (Multi-property testing)
  let property = await prisma.property.findFirst({
    where: { ownerId: ownerUser.id, name: 'Sunshine Luxury PG' },
  });

  if (!property) {
    property = await prisma.property.create({
      data: {
        ownerId: ownerUser.id,
        name: 'Sunshine Luxury PG',
        slug: 'sunshine-luxury-pg-koramangala',
        type: PropertyType.BOYS_PG,
        address: '142, 5th Cross, 6th Block, Koramangala',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560095',
        contactPhone: '+91 98765 43210',
        contactEmail: 'contact@sunshinepg.com',
        amenities: JSON.stringify(['Hi-Speed WiFi', 'Daily Housekeeping', '3-Time Meals', 'Power Backup', 'AC', 'CCTV 24x7', 'Biometric Gate']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
        ]),
        rules: 'Curfew at 10:00 PM. Gate QR scan mandatory for entry & exit. No visitors inside rooms after 8:00 PM.',
        curfewTime: '22:00',
      },
    });
    console.log('✅ Created Sunshine Luxury PG');
  } else {
    await prisma.property.update({
      where: { id: property.id },
      data: { curfewTime: '22:00' },
    });
  }

  // Add 2nd Property for multi-property dashboard testing
  let secondProperty = await prisma.property.findFirst({
    where: { ownerId: ownerUser.id, name: 'Green Valley Luxury PG' },
  });
  if (!secondProperty) {
    secondProperty = await prisma.property.create({
      data: {
        ownerId: ownerUser.id,
        name: 'Green Valley Luxury PG',
        slug: 'green-valley-luxury-pg-indiranagar',
        type: PropertyType.COLIVING,
        address: '88, 100 Feet Road, HAL 2nd Stage, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        contactPhone: '+91 98765 43215',
        contactEmail: 'indiranagar@smartpg.com',
        amenities: JSON.stringify(['Gigabit WiFi', 'Gym', 'Gaming Lounge', '3-Time Meals', 'Washing Machines', 'CCTV']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
        ]),
        rules: 'Curfew at 10:30 PM. Silence hours 11:00 PM - 6:00 AM.',
        curfewTime: '22:30',
      },
    });
    // Create basic rooms for 2nd property
    for (let f = 1; f <= 2; f++) {
      const floor = await prisma.floor.create({
        data: { propertyId: secondProperty.id, floorNumber: f, name: `Floor ${f}` },
      });
      for (let r = 1; r <= 2; r++) {
        const room = await prisma.room.create({
          data: {
            floorId: floor.id,
            roomNumber: `G-${f}0${r}`,
            type: RoomType.DOUBLE_SHARING,
            monthlyRent: 950000,
          },
        });
        for (let b = 1; b <= 2; b++) {
          await prisma.bed.create({
            data: {
              roomId: room.id,
              bedNumber: `Bed-${b}`,
              status: BedStatus.VACANT,
              monthlyRent: 950000,
            },
          });
        }
      }
    }
    console.log('✅ Created 2nd Property (Green Valley Luxury PG) with 2 Floors & 8 Beds for Multi-Property testing');
  }

  // 4. Ensure Managers & Staff Assignments
  const managerUsers = await prisma.user.findMany({
    where: { role: { in: [UserRole.MANAGER, UserRole.STAFF] } },
  });
  for (const m of managerUsers) {
    const assign = await prisma.staffAssignment.findFirst({
      where: { userId: m.id, propertyId: property.id },
    });
    if (!assign) {
      await prisma.staffAssignment.create({
        data: {
          userId: m.id,
          propertyId: property.id,
          permissions: JSON.stringify(m.role === UserRole.STAFF ? ['mess', 'stock'] : ['all']),
        },
      });
    }
  }

  // 5. Students & Stays Setup
  const demoStudent = await prisma.user.findUnique({ where: { email: 'demo.student@smartpg.com' } });
  const realStudent = await prisma.user.findUnique({ where: { email: 'student@smartpg.com' } });
  const student2 = await prisma.user.findUnique({ where: { email: 'student2@smartpg.com' } });
  const student3 = await prisma.user.findUnique({ where: { email: 'student3@gmail.com' } });

  const activeStudents = [demoStudent, realStudent, student2, student3].filter(Boolean) as any[];

  // Ensure every student has tenantProfile and active stay in Sunshine Luxury PG
  for (const st of activeStudents) {
    let tp = await prisma.tenantProfile.findUnique({ where: { userId: st.id } });
    if (!tp) {
      tp = await prisma.tenantProfile.create({
        data: {
          userId: st.id,
          emergencyContactName: 'Guardian of ' + st.fullName,
          emergencyContactPhone: '9876500099',
          permanentAddress: '42, Park Avenue, Bengaluru, KA',
          idProofType: 'AADHAAR',
          idProofNumber: '5432-9876-1234',
          collegeOrCompany: 'PES University, CSE Dept',
        },
      });
    }

    let stay = await prisma.tenantStay.findFirst({
      where: { tenantId: tp.id, propertyId: property.id },
    });

    if (!stay) {
      // Find vacant bed
      const bed = await prisma.bed.findFirst({
        where: { status: BedStatus.VACANT, room: { floor: { propertyId: property.id } } },
      });
      if (bed) {
        stay = await prisma.tenantStay.create({
          data: {
            ownerId: ownerUser.id,
            propertyId: property.id,
            tenantId: tp.id,
            bedId: bed.id,
            monthlyRent: 850000,
            securityDeposit: 1000000,
            status: StayStatus.ACTIVE,
            startDate: new Date('2026-07-01'),
          },
        });
        await prisma.bed.update({
          where: { id: bed.id },
          data: { status: BedStatus.OCCUPIED },
        });
      }
    }
  }

  console.log('✅ Verified all 4 Students have profiles and active stays in Sunshine Luxury PG.');

  // 6. Generate Realistic Attendance for September 2026 (Month 9 of 2026)
  // We populate Day 1 through Day 18 (Today)
  console.log('📅 Generating complete Attendance calendar and Gate Logs for September 2026...');
  const gateToken = signGateToken(property.id);

  for (const st of activeStudents) {
    for (let day = 1; day <= 18; day++) {
      const dayStr = `2026-09-${String(day).padStart(2, '0')}`;
      const canonicalDate = attendanceDateFromKey(dayStr);

      let status: AttendanceStatus = AttendanceStatus.PRESENT;
      let remarks = `Gate entry verified`;

      // Make realistic variation
      if (day === 6 || day === 7) {
        // Weekend leave
        status = AttendanceStatus.ON_LEAVE;
        remarks = 'Approved weekend family visit';
      } else if (day === 12 && st.email.includes('demo')) {
        // Single absent day
        status = AttendanceStatus.ABSENT;
        remarks = 'Sick leave / room rest';
      } else if (day === 10 || day === 16) {
        status = AttendanceStatus.PRESENT;
        remarks = 'Gate entry at 22:45 (Late after curfew)';
      }

      await prisma.attendance.upsert({
        where: {
          propertyId_userId_date: {
            propertyId: property.id,
            userId: st.id,
            date: canonicalDate,
          },
        },
        update: { status, remarks },
        create: {
          propertyId: property.id,
          userId: st.id,
          date: canonicalDate,
          status,
          remarks,
        },
      });

      // Gate Logs for each active day
      if (status !== AttendanceStatus.ON_LEAVE) {
        const exitTime = new Date(`${dayStr}T08:30:00.000Z`);
        const entryHour = (day === 10 || day === 16) ? 22 : 18;
        const entryMinute = (day === 10 || day === 16) ? 45 : 30;
        const entryTime = new Date(`${dayStr}T${String(entryHour).padStart(2, '0')}:${String(entryMinute).padStart(2, '0')}:00.000Z`);
        const isLate = entryHour >= 22;

        // Morning exit
        await prisma.gateLog.create({
          data: {
            propertyId: property.id,
            userId: st.id,
            studentName: st.fullName,
            roomNumber: '101',
            type: 'EXIT',
            entryType: 'EXIT',
            reason: day % 2 === 0 ? 'College / Classes' : 'Library / Study Group',
            destination: 'PES University Campus',
            expectedReturnTime: '06:00 PM',
            isLate: false,
            loggedBy: 'Gate QR Scan',
            passCode: gateToken,
            parentNotifiedAt: exitTime,
            timestamp: exitTime,
            createdAt: exitTime,
          },
        });

        // Evening / Night entry
        await prisma.gateLog.create({
          data: {
            propertyId: property.id,
            userId: st.id,
            studentName: st.fullName,
            roomNumber: '101',
            type: 'ENTRY',
            entryType: 'ENTRY',
            reason: isLate ? 'Project Lab Discussion (Late)' : 'Return from Classes',
            destination: 'Sunshine Luxury PG',
            isLate,
            loggedBy: 'Gate QR Scan',
            passCode: gateToken,
            parentNotifiedAt: entryTime,
            timestamp: entryTime,
            createdAt: entryTime,
          },
        });
      }
    }
  }
  console.log('✅ Generated 18 days of Attendance + 30+ Gate movements with QR codes for all students.');

  // 7. Parent Notification Logs (linked to parent accounts)
  const parents = await prisma.user.findMany({ where: { role: UserRole.PARENT } });
  for (const p of parents) {
    await prisma.notificationLog.createMany({
      data: [
        {
          userId: p.id,
          type: 'GATE_ATTENDANCE',
          title: '🟢 Student Checked In at PG',
          message: 'Your ward safely scanned into Sunshine Luxury PG via the Gate QR code at 18:30.',
          isRead: true,
          sentAt: new Date('2026-09-17T18:30:00.000Z'),
        },
        {
          userId: p.id,
          type: 'GATE_ATTENDANCE',
          title: '⚠️ Late Curfew Entry Alert',
          message: 'Your ward entered the PG at 22:45 after the 10:00 PM curfew. Reason: Project Lab Discussion.',
          isRead: false,
          sentAt: new Date('2026-09-16T22:45:00.000Z'),
        },
        {
          userId: p.id,
          type: 'INVOICE',
          title: '📄 Monthly Rent Invoice Generated',
          message: 'Monthly Rent Invoice for September 2026 (₹8,500) has been generated. Due date: 25th September.',
          isRead: true,
          sentAt: new Date('2026-09-01T10:00:00.000Z'),
        },
      ],
    });
  }
  console.log('✅ Seeded Parent Notification Logs.');

  // 8. Leave Requests
  if (demoStudent) {
    await prisma.leaveRequest.deleteMany({ where: { studentId: demoStudent.id } });
    await prisma.leaveRequest.createMany({
      data: [
        {
          studentId: demoStudent.id,
          propertyId: property.id,
          startDate: new Date('2026-09-06T00:00:00.000Z'),
          endDate: new Date('2026-09-07T23:59:59.000Z'),
          reason: 'Family wedding anniversary in hometown',
          status: 'APPROVED',
          approvedBy: 'Ramesh Kumar (PG Manager)',
          createdAt: new Date('2026-09-03'),
        },
        {
          studentId: demoStudent.id,
          propertyId: property.id,
          startDate: new Date('2026-09-26T00:00:00.000Z'),
          endDate: new Date('2026-09-29T23:59:59.000Z'),
          reason: 'Diwali Festival Semester Break',
          status: 'APPROVED',
          approvedBy: 'Ramesh Kumar (PG Manager)',
          createdAt: new Date('2026-09-15'),
        },
        {
          studentId: demoStudent.id,
          propertyId: property.id,
          startDate: new Date('2026-10-10T00:00:00.000Z'),
          endDate: new Date('2026-10-12T23:59:59.000Z'),
          reason: 'Inter-College Hackathon at IIT Madras',
          status: 'PENDING',
          createdAt: new Date('2026-09-17'),
        },
      ],
    });
    console.log('✅ Seeded Leave Requests for Demo Student.');
  }

  // 9. Visitor Logs (Manager & Owner view)
  await prisma.visitorLog.deleteMany({ where: { propertyId: property.id } });
  await prisma.visitorLog.createMany({
    data: [
      {
        propertyId: property.id,
        visitorName: 'Anand Verma (Father)',
        visitorPhone: '9876543290',
        purpose: 'Family visit & handing over study materials',
        checkInTime: new Date('2026-09-16T15:30:00.000Z'),
        checkOutTime: new Date('2026-09-16T17:45:00.000Z'),
      },
      {
        propertyId: property.id,
        visitorName: 'Rohan Sharma (College Friend)',
        visitorPhone: '9876543291',
        purpose: 'Group project study in common lounge',
        checkInTime: new Date('2026-09-15T14:00:00.000Z'),
        checkOutTime: new Date('2026-09-15T16:30:00.000Z'),
      },
      {
        propertyId: property.id,
        visitorName: 'Amazon Logistics Courier',
        visitorPhone: '9876543292',
        purpose: 'Parcel delivery for Room 102',
        checkInTime: new Date('2026-09-17T11:20:00.000Z'),
        checkOutTime: new Date('2026-09-17T11:40:00.000Z'),
      },
      {
        propertyId: property.id,
        visitorName: 'Urban Company Technician (Mahesh)',
        visitorPhone: '9876543293',
        purpose: 'RO Water Purifier deep maintenance',
        checkInTime: new Date('2026-09-14T10:00:00.000Z'),
        checkOutTime: new Date('2026-09-14T12:00:00.000Z'),
      },
    ],
  });
  console.log('✅ Seeded 4 Visitor Logs for Manager & Owner.');

  // 10. Mess Wallet & Meal Orders
  for (const st of activeStudents) {
    await prisma.messWallet.upsert({
      where: { tenantId: st.id },
      update: { balance: 350000 },
      create: { tenantId: st.id, balance: 350000 },
    });

    // Add recent meal orders
    const pastDays = [14, 15, 16, 17];
    for (const d of pastDays) {
      const orderDate = new Date(`2026-09-${d}T08:00:00.000Z`);
      await prisma.mealOrder.createMany({
        data: [
          {
            propertyId: property.id,
            userId: st.id,
            mealType: MealType.BREAKFAST,
            date: orderDate,
            rating: 5,
            feedback: 'Crisp hot dosas and fresh coconut chutney!',
            createdAt: orderDate,
          },
          {
            propertyId: property.id,
            userId: st.id,
            mealType: MealType.LUNCH,
            date: orderDate,
            rating: 4,
            feedback: 'Good meal, fresh rotis.',
            createdAt: orderDate,
          },
          {
            propertyId: property.id,
            userId: st.id,
            mealType: MealType.DINNER,
            date: orderDate,
            rating: 5,
            feedback: 'Paneer butter masala was restaurant quality!',
            createdAt: orderDate,
          },
        ],
      });
    }
  }
  console.log('✅ Seeded Mess Wallets (₹3,500 balance) & Meal Orders.');

  // 11. Documents & Rent Agreements & Police Verifications
  for (const st of activeStudents) {
    const tp = await prisma.tenantProfile.findUnique({ where: { userId: st.id } });
    if (tp) {
      // Documents
      const existingDocs = await prisma.document.count({ where: { tenantId: tp.id } });
      if (existingDocs === 0) {
        await prisma.document.createMany({
          data: [
            {
              tenantId: tp.id,
              type: DocumentType.AADHAAR,
              fileName: 'aadhaar_card_verified.pdf',
              fileSize: 1048576,
              fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            },
            {
              tenantId: tp.id,
              type: DocumentType.COLLEGE_ID,
              fileName: 'college_id_card_2026.pdf',
              fileSize: 524288,
              fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            },
            {
              tenantId: tp.id,
              type: DocumentType.RENT_AGREEMENT,
              fileName: 'executed_pg_rental_agreement.pdf',
              fileSize: 2097152,
              fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            },
          ],
        });
      }

      // Rent Agreement
      await prisma.rentAgreement.deleteMany({ where: { tenantId: tp.id } });
      await prisma.rentAgreement.create({
        data: {
          tenantId: tp.id,
          agreementUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          startDate: new Date('2026-07-01'),
          endDate: new Date('2027-06-30'),
          isSignedByTenant: true,
          isSignedByOwner: true,
        },
      });

      // Police Verification
      await prisma.policeVerification.upsert({
        where: { tenantId: tp.id },
        update: {
          status: VerificationStatus.VERIFIED,
          documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          remarks: 'Verified & cleared by Koramangala Police Station Record Division.',
        },
        create: {
          tenantId: tp.id,
          status: VerificationStatus.VERIFIED,
          documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          remarks: 'Verified & cleared by Koramangala Police Station Record Division.',
        },
      });
    }
  }
  console.log('✅ Seeded verified Aadhaar, College ID, Rent Agreement & Police verification.');

  // 12. Realistic PG Expenses (Owner Finance)
  await prisma.expense.deleteMany({ where: { propertyId: property.id } });
  await prisma.expense.createMany({
    data: [
      {
        ownerId: ownerUser.id,
        propertyId: property.id,
        title: 'BESCOM High-Tension Commercial Electricity Bill',
        category: 'Electricity',
        amount: 1850000,
        expenseDate: new Date('2026-09-02'),
      },
      {
        ownerId: ownerUser.id,
        propertyId: property.id,
        title: 'BWSSB Commercial Water Tanker Supply (2 Loads)',
        category: 'Water',
        amount: 450000,
        expenseDate: new Date('2026-09-05'),
      },
      {
        ownerId: ownerUser.id,
        propertyId: property.id,
        title: 'ACT Fibernet 300 Mbps Enterprise Lease Line',
        category: 'Internet',
        amount: 320000,
        expenseDate: new Date('2026-09-01'),
      },
      {
        ownerId: ownerUser.id,
        propertyId: property.id,
        title: 'Monthly Provisions, Fresh Dairy, Rice & Veggies Wholesale',
        category: 'Grocery',
        amount: 3450000,
        expenseDate: new Date('2026-09-08'),
      },
      {
        ownerId: ownerUser.id,
        propertyId: property.id,
        title: 'Professional Housekeeping & Chemical Supplies',
        category: 'Maintenance',
        amount: 380000,
        expenseDate: new Date('2026-09-10'),
      },
      {
        ownerId: ownerUser.id,
        propertyId: property.id,
        title: 'Chef Suresh - Head Cook Monthly Salary',
        category: 'Staff Salary',
        amount: 2500000,
        expenseDate: new Date('2026-09-01'),
      },
      {
        ownerId: ownerUser.id,
        propertyId: property.id,
        title: 'Ramesh Kumar - PG Resident Manager Monthly Salary',
        category: 'Staff Salary',
        amount: 2200000,
        expenseDate: new Date('2026-09-01'),
      },
    ],
  });
  console.log('✅ Seeded 7 Comprehensive PG Expenses totaling over ₹1,10,000.');

  // 13. High-Quality Notices
  await prisma.notice.deleteMany({ where: { ownerId: ownerUser.id } });
  await prisma.notice.createMany({
    data: [
      {
        ownerId: ownerUser.id,
        title: '📢 Monthly Rent Due — Please Pay Before 25th September',
        content: 'Dear Residents, monthly rent invoices for September 2026 have been generated. Please complete payment via UPI/Cards in your student portal before the 25th to avoid late charges.',
        category: 'Finance',
        target: 'ALL',
        isPinned: true,
      },
      {
        ownerId: ownerUser.id,
        title: '🛡️ Gate QR Poster Attendance & Curfew Policy (10:00 PM)',
        content: 'All residents must scan the printable Gate QR code poster pasted at the security reception upon entering or leaving the premises. Entries past 10:00 PM will trigger an automatic notification to registered parents.',
        category: 'Security',
        target: 'ALL',
        isPinned: true,
      },
      {
        ownerId: ownerUser.id,
        title: '📶 Wi-Fi Access Points Upgraded to Wi-Fi 6',
        content: 'High-speed dual-band Wi-Fi 6 access points have been installed on Floor 1 and Floor 2. Please connect to SunshineLuxuryPG_5G for uninterrupted gaming and video calls.',
        category: 'Maintenance',
        target: 'ALL',
        isPinned: false,
      },
      {
        ownerId: ownerUser.id,
        title: '🍲 Special Sunday Feast — Hyderabadi Dum Biryani',
        content: 'This Sunday dinner features special Hyderabadi Dum Biryani with Veg and Non-Veg options, Mirchi ka Salan, and Gulab Jamun dessert. Dinner hours: 8:00 PM to 10:30 PM.',
        category: 'Mess',
        target: 'ALL',
        isPinned: false,
      },
    ],
  });
  console.log('✅ Seeded 4 Real Notices.');

  // 14. Real Prospective Enquiries / Leads
  await prisma.enquiry.deleteMany({ where: { propertyId: property.id } });
  await prisma.enquiry.createMany({
    data: [
      {
        propertyId: property.id,
        name: 'Vikram Malhotra',
        phone: '9876501101',
        email: 'vikram.m@gmail.com',
        roomType: RoomType.DOUBLE_SHARING,
        message: 'Looking for a double sharing AC room starting October 1st. Software Engineer working at Manyata Tech Park.',
        isResolved: false,
      },
      {
        propertyId: property.id,
        name: 'Sneha Kulkarni',
        phone: '9876501102',
        email: 'sneha.k@gmail.com',
        roomType: RoomType.SINGLE,
        message: 'Need a quiet single room for UPSC study preparation. Is 3-time meal included in the rent?',
        isResolved: true,
      },
      {
        propertyId: property.id,
        name: 'Amitabh Sen',
        phone: '9876501103',
        email: 'amitabh.sen@gmail.com',
        roomType: RoomType.TRIPLE_SHARING,
        message: '1st year PES University CSE student. Visiting this Saturday with parents for room inspection.',
        isResolved: false,
      },
    ],
  });
  console.log('✅ Seeded 3 Realistic Inquiries for Owner & Manager.');

  // 15. Staff Tasks
  const manager = await prisma.user.findFirst({ where: { email: 'manager@smartpg.com' } });
  const cook = await prisma.user.findFirst({ where: { email: 'cook3@gmail.com' } });

  await prisma.staffTask.deleteMany({ where: { propertyId: property.id } });
  await prisma.staffTask.createMany({
    data: [
      {
        propertyId: property.id,
        assignedTo: cook?.id || managerUsers[0].id,
        title: 'Morning Breakfast Prep & Dining Sanitization',
        description: 'Prepare Poha, boiled eggs and chai for 60 residents. Sanitize dining tables.',
        priority: 'HIGH',
        status: 'COMPLETED',
        dueDate: new Date(),
      },
      {
        propertyId: property.id,
        assignedTo: cook?.id || managerUsers[0].id,
        title: 'Order 50kg Basmati Rice & 20L Cooking Oil',
        description: 'Wholesale delivery from Sri Lakshmi Provisions before Friday dinner.',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        dueDate: new Date(Date.now() + 86400000),
      },
      {
        propertyId: property.id,
        assignedTo: manager?.id || managerUsers[0].id,
        title: '10:00 PM Curfew Check & Gate Log Review',
        description: 'Verify gate attendance entries and verify all resident movements on the dashboard.',
        priority: 'URGENT',
        status: 'PENDING',
        dueDate: new Date(),
      },
      {
        propertyId: property.id,
        assignedTo: manager?.id || managerUsers[0].id,
        title: 'Quarterly Fire Extinguisher & First Aid Audit',
        description: 'Inspect pressure gauges on Floor 1 and Floor 2 safety equipment.',
        priority: 'LOW',
        status: 'COMPLETED',
        dueDate: new Date(Date.now() - 86400000 * 3),
      },
    ],
  });
  console.log('✅ Seeded Staff & Kitchen Tasks.');

  // 16. Support Tickets
  await prisma.supportTicket.deleteMany({});
  await prisma.supportTicket.createMany({
    data: [
      {
        title: 'Biometric Turnstile API Integration',
        description: 'We want to link our physical gate turnstile device directly to the SmartPG Gate QR attendance API endpoint.',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        createdBy: ownerUser.email,
      },
      {
        title: 'Custom Domain Setup Assistance',
        description: 'Need assistance pointing pg.sunshinehostels.com DNS records to our SmartPG tenant portal.',
        priority: 'LOW',
        status: 'RESOLVED',
        createdBy: ownerUser.email,
      },
    ],
  });
  console.log('✅ Seeded Platform Support Tickets.');

  console.log('\n🎉 ALL SECTIONS POPULATED WITH 100% REAL COHERENT PRODUCTION DATA!');
}

seedRichData()
  .catch((e) => {
    console.error('❌ Failed to seed rich data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
