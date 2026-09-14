import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { UserRole, OwnerRequestStatus, PropertyType, RoomType, BedStatus, StayStatus, ComplaintStatus, InvoiceStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Seed SuperAdmin Users
  const adminEmails = [
    { email: 'admin@smartpg.com', pass: 'SuperAdmin@123456' },
    { email: 'superadmin@gmail.com', pass: 'Super@123' },
  ];

  let admin: any = null;
  for (const a of adminEmails) {
    let existing = await prisma.user.findUnique({ where: { email: a.email } });
    if (!existing) {
      const passwordHash = await bcrypt.hash(a.pass, 10);
      existing = await prisma.user.create({
        data: {
          email: a.email,
          phone: a.email.includes('gmail') ? '9999999998' : '9999999999',
          fullName: 'Platform SuperAdmin',
          passwordHash,
          role: UserRole.SUPERADMIN,
          mustChangePassword: false,
        },
      });
      console.log(`✅ Created SuperAdmin user: ${a.email} (Password: ${a.pass})`);
    }
    if (!admin) admin = existing;
  }

  // 2. Seed Platform Plans
  const plansData = [
    {
      name: 'Starter Plan',
      code: 'STARTER',
      maxProperties: 1,
      maxBeds: 50,
      priceMonthly: 149900, // ₹1,499 in Paise
      priceYearly: 1499000,
      features: JSON.stringify(['student_portal', 'basic_complaints', 'rent_invoicing']),
    },
    {
      name: 'Growth Plan',
      code: 'GROWTH',
      maxProperties: 3,
      maxBeds: 200,
      priceMonthly: 299900, // ₹2,999 in Paise
      priceYearly: 2999000,
      features: JSON.stringify(['student_portal', 'mess_wallet', 'whatsapp_alerts', 'multi_property']),
    },
    {
      name: 'Enterprise Plan',
      code: 'ENTERPRISE',
      maxProperties: 10,
      maxBeds: 1000,
      priceMonthly: 599900, // ₹5,999 in Paise
      priceYearly: 5999000,
      features: JSON.stringify(['all_features', 'custom_domain', 'priority_support', 'biometric_integration']),
    },
  ];

  let starterPlan: any = null;
  for (const plan of plansData) {
    let existing = await prisma.platformPlan.findUnique({ where: { code: plan.code } });
    if (!existing) {
      existing = await prisma.platformPlan.create({ data: plan });
      console.log(`✅ Seeded Plan: ${plan.name}`);
    }
    if (plan.code === 'STARTER') starterPlan = existing;
  }

  // 3. Seed Platform Setting
  const setting = await prisma.platformSetting.findUnique({ where: { id: 'platform' } });
  if (!setting) {
    await prisma.platformSetting.create({
      data: {
        id: 'platform',
        otpEnabled: true,
        defaultNightEntryTime: '22:00',
        defaultNoticeDays: 30,
        supportPhone: '+91 98765 43210',
        maintenanceMode: false,
        whatsappEnabled: true,
      },
    });
    console.log('✅ Seeded Platform Settings');
  }

  // 4. Seed Sample Owner Requests
  const sampleRequests = [
    {
      fullName: 'Vikram Sharma',
      email: 'vikram.sharma@example.com',
      phone: '9876543210',
      city: 'Bengaluru',
      propertyCount: 2,
      totalBeds: 120,
      notes: 'Looking for fast onboarding for 2 luxury PG properties in Koramangala.',
      status: OwnerRequestStatus.PENDING,
    },
    {
      fullName: 'Ananya Verma',
      email: 'ananya.v@example.com',
      phone: '9876543211',
      city: 'Pune',
      propertyCount: 1,
      totalBeds: 60,
      notes: 'Girls PG near Hinjewadi Tech Park.',
      status: OwnerRequestStatus.PENDING,
    },
  ];

  for (const req of sampleRequests) {
    const existing = await prisma.ownerRequest.findUnique({ where: { email: req.email } });
    if (!existing) {
      await prisma.ownerRequest.create({ data: req });
      console.log(`✅ Seeded Owner Request for: ${req.fullName}`);
    }
  }

  // 5. Seed Demo Owner Users
  const ownerAccounts = [
    { email: 'owner@smartpg.com', pass: 'Owner@123456', phone: '9876543201' },
    { email: 'owner@gmail.com', pass: 'Owner3@123', phone: '9876543299' },
  ];

  let owner: any = null;
  for (const o of ownerAccounts) {
    let existing = await prisma.user.findUnique({ where: { email: o.email } });
    if (!existing) {
      const passwordHash = await bcrypt.hash(o.pass, 10);
      existing = await prisma.user.create({
        data: {
          email: o.email,
          phone: o.phone,
          fullName: 'Rajesh Gupta (PG Owner)',
          passwordHash,
          role: UserRole.OWNER,
          mustChangePassword: false,
        },
      });
      await prisma.user.update({
        where: { id: existing.id },
        data: { ownerId: owner ? owner.id : existing.id },
      });
      console.log(`✅ Created Owner user: ${o.email} (Password: ${o.pass})`);

      if (starterPlan) {
        await prisma.subscription.create({
          data: {
            ownerId: existing.id,
            planId: starterPlan.id,
            startDate: new Date(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            isActive: true,
            autoRenew: true,
            paymentStatus: 'PAID',
          },
        });
      }
    }
    if (!owner) owner = existing;
  }

  // 6. Seed Property, Floors, Rooms & Beds for Owner
  let property = await prisma.property.findFirst({ where: { ownerId: owner.id } });
  if (!property) {
    property = await prisma.property.create({
      data: {
        ownerId: owner.id,
        name: 'Sunshine Luxury PG',
        slug: 'sunshine-luxury-pg-koramangala',
        type: PropertyType.BOYS_PG,
        address: '142, 5th Cross, 6th Block, Koramangala',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560095',
        contactPhone: '+91 98765 43210',
        contactEmail: 'contact@sunshinepg.com',
        amenities: JSON.stringify(['Hi-Speed WiFi', 'Daily Housekeeping', '3-Time Meals', 'Power Backup', 'AC', 'CCTV 24x7']),
        images: JSON.stringify([]),
        rules: 'Curfew at 10:00 PM. Cleanliness in dining hall mandatory. Visitors allowed until 8:00 PM.',
      },
    });

    console.log(`✅ Created Property: ${property.name}`);

    // Floor 1 & Floor 2
    for (let f = 1; f <= 2; f++) {
      const floor = await prisma.floor.create({
        data: {
          propertyId: property.id,
          floorNumber: f,
          name: `Floor ${f}`,
        },
      });

      // 3 Rooms per floor
      for (let r = 1; r <= 3; r++) {
        const roomNum = `${f}0${r}`;
        const room = await prisma.room.create({
          data: {
            floorId: floor.id,
            roomNumber: roomNum,
            type: RoomType.DOUBLE_SHARING,
            monthlyRent: 8500,
          },
        });

        // 2 Beds per room
        for (let b = 1; b <= 2; b++) {
          await prisma.bed.create({
            data: {
              roomId: room.id,
              bedNumber: `B-${b}`,
              status: BedStatus.VACANT,
              monthlyRent: 8500,
            },
          });
        }
      }
    }
    console.log('✅ Created 2 Floors, 6 Rooms, and 12 Beds for Sunshine Luxury PG');
  }

  // 7. Seed Demo Manager Users
  const managerAccounts = [
    { email: 'manager@smartpg.com', pass: 'Manager@123456', phone: '9876543202' },
    { email: 'manager3@gmail.com', pass: 'Manager@123', phone: '9876543298' },
    { email: 'cook3@gmail.com', pass: 'Cook@123', phone: '9876543297', role: UserRole.STAFF, name: 'Chef Suresh (Cook)' },
  ];

  let manager: any = null;
  for (const m of managerAccounts) {
    let existing = await prisma.user.findUnique({ where: { email: m.email } });
    if (!existing) {
      const passwordHash = await bcrypt.hash(m.pass, 10);
      existing = await prisma.user.create({
        data: {
          ownerId: owner.id,
          email: m.email,
          phone: m.phone,
          fullName: m.name || 'Ramesh Kumar (PG Manager)',
          passwordHash,
          role: m.role || UserRole.MANAGER,
          mustChangePassword: false,
        },
      });
      console.log(`✅ Created Manager/Staff user: ${m.email} (Password: ${m.pass})`);
    }

    if (property) {
      const existingAssign = await prisma.staffAssignment.findFirst({
        where: { userId: existing.id, propertyId: property.id },
      });
      if (!existingAssign) {
        await prisma.staffAssignment.create({
          data: {
            userId: existing.id,
            propertyId: property.id,
            permissions: JSON.stringify(['all']),
          },
        });
      }
    }

    if (!manager && (m.role || UserRole.MANAGER) === UserRole.MANAGER) manager = existing;
  }

  // 8. Seed Demo Parent & Student
  const studentAccounts = [
    { email: 'student@smartpg.com', pass: 'Student@123456', phone: '9876543204', name: 'Rahul Verma', parentEmail: 'parent@smartpg.com', parentPass: 'Parent@123456' },
    { email: 'student3@gmail.com', pass: 'Student@123', phone: '9876543296', name: 'Aarav Patel', parentEmail: 'parent3@gmail.com', parentPass: 'Parent@123' },
  ];

  let student: any = null;
  for (const st of studentAccounts) {
    let existing = await prisma.user.findFirst({ where: { OR: [{ email: st.email }, { phone: st.phone }] } });
    if (!existing && property) {
      const parentEmail = st.parentEmail;
      let parentUser = await prisma.user.findUnique({ where: { email: parentEmail } });
      if (!parentUser) {
        const parentPass = await bcrypt.hash(st.parentPass, 10);
        parentUser = await prisma.user.create({
          data: {
            ownerId: owner.id,
            fullName: `Parent of ${st.name}`,
            email: parentEmail,
            phone: `977654${st.phone.slice(-4)}`,
            passwordHash: parentPass,
            role: UserRole.PARENT,
            mustChangePassword: false,
          },
        });
      }

      let parentProfile = await prisma.parentProfile.findUnique({ where: { userId: parentUser.id } });
      if (!parentProfile) {
        parentProfile = await prisma.parentProfile.create({
          data: {
            userId: parentUser.id,
            relation: 'Father',
            address: '24, Civil Lines, Kanpur, UP',
          },
        });
      }

      const studentPass = await bcrypt.hash(st.pass, 10);
      existing = await prisma.user.create({
        data: {
          ownerId: owner.id,
          fullName: st.name,
          email: st.email,
          phone: st.phone,
          passwordHash: studentPass,
          role: UserRole.STUDENT,
          mustChangePassword: false,
        },
      });

      const tenantProfile = await prisma.tenantProfile.create({
        data: {
          userId: existing.id,
          emergencyContactName: `Parent of ${st.name}`,
          emergencyContactPhone: `987654${st.phone.slice(-4)}`,
          permanentAddress: '24, Civil Lines, Kanpur, UP',
          idProofType: 'AADHAAR',
          idProofNumber: '1234-5678-9012',
          collegeOrCompany: 'PES University, CSE Dept.',
          parentProfileId: parentProfile.id,
        },
      });

      // Find first vacant bed
      const bed = await prisma.bed.findFirst({
        where: { status: BedStatus.VACANT, room: { floor: { propertyId: property.id } } },
        include: { room: true },
      });

      if (bed) {
        await prisma.tenantStay.create({
          data: {
            ownerId: owner.id,
            propertyId: property.id,
            tenantId: tenantProfile.id,
            bedId: bed.id,
            monthlyRent: 8500,
            securityDeposit: 10000,
            status: StayStatus.ACTIVE,
            startDate: new Date(),
          },
        });

        await prisma.bed.update({
          where: { id: bed.id },
          data: { status: BedStatus.OCCUPIED },
        });
        console.log(`✅ Onboarded Student: ${st.name} into Bed ${bed.bedNumber}`);
      }

      // Seed sample gate logs (In and Out)
      await prisma.gateLog.create({
        data: {
          propertyId: property.id,
          userId: existing.id,
          studentName: st.name,
          roomNumber: bed?.room?.roomNumber || '101',
          type: 'EXIT',
          reason: 'College / Classes',
          destination: 'PES University Campus',
          isLate: false,
          loggedBy: 'Main Gate QR',
        },
      });
      await prisma.gateLog.create({
        data: {
          propertyId: property.id,
          userId: existing.id,
          studentName: st.name,
          roomNumber: bed?.room?.roomNumber || '101',
          type: 'ENTRY',
          reason: 'Return from Evening Study',
          destination: 'PES University Library',
          isLate: false,
          loggedBy: 'Main Gate QR',
        },
      });

      // Seed sample complaint
      await prisma.complaint.create({
        data: {
          ownerId: owner.id,
          propertyId: property.id,
          title: 'Geyser heating takes long time',
          description: 'The hot water geyser in bathroom takes more than 30 mins to heat up.',
          category: 'Plumbing / Electrical',
          priority: 'MEDIUM',
          status: ComplaintStatus.OPEN,
        },
      });

      // Seed sample leave request
      await prisma.leaveRequest.create({
        data: {
          studentId: existing.id,
          propertyId: property.id,
          startDate: new Date(Date.now() + 86400000),
          endDate: new Date(Date.now() + 86400000 * 4),
          reason: 'Family event in hometown',
          status: 'APPROVED',
        },
      });

      // Seed mess wallet & order
      await prisma.messWallet.upsert({
        where: { tenantId: existing.id },
        update: { balance: 150000 },
        create: { tenantId: existing.id, balance: 150000 },
      });

      console.log(`✅ Created Student user: ${st.email} (Password: ${st.pass})`);
    }
    if (!student) student = existing;
  }

  // 9. Seed Food Menu, Stock Items & Staff Tasks
  if (owner && property) {
    const defaultMenu = {
      Monday: { breakfast: 'Poha & Tea', lunch: 'Roti, Paneer Masala, Rice, Dal', dinner: 'Chapati, Mix Veg, Chawal, Kheer' },
      Tuesday: { breakfast: 'Idli Sambar', lunch: 'Roti, Aloo Gobi, Rice, Dal Fry', dinner: 'Paratha, Egg Curry / Paneer, Rice' },
      Wednesday: { breakfast: 'Aloo Paratha', lunch: 'Roti, Chana Masala, Rice, Curd', dinner: 'Veg Biryani, Raita, Gulab Jamun' },
      Thursday: { breakfast: 'Upma & Coffee', lunch: 'Roti, Bhindi Masala, Rice, Dal', dinner: 'Roti, Dal Tadka, Jeera Rice' },
      Friday: { breakfast: 'Puri Bhaji', lunch: 'Roti, Rajma, Rice, Salad', dinner: 'Roti, Paneer Butter Masala, Rice' },
      Saturday: { breakfast: 'Bread Butter / Omelette', lunch: 'Roti, Kadhi Pakoda, Rice', dinner: 'Special South Indian Meal' },
      Sunday: { breakfast: 'Masala Dosa', lunch: 'Veg / Chicken Dum Biryani', dinner: 'Roti, Choice Veg, Rice, Ice Cream' },
    };

    await prisma.foodMenu.upsert({
      where: { ownerId: owner.id },
      update: { weekMenuJson: JSON.stringify(defaultMenu) },
      create: { ownerId: owner.id, weekMenuJson: JSON.stringify(defaultMenu) },
    });
    console.log('✅ Seeded Food Menu for Sunshine Luxury PG');

    // Kitchen Stock Items
    const stockItems = [
      { itemName: 'Basmati Rice', category: 'Grocery', currentQuantity: 45, unit: 'kg', minThreshold: 10 },
      { itemName: 'Wheat Flour (Atta)', category: 'Grocery', currentQuantity: 60, unit: 'kg', minThreshold: 15 },
      { itemName: 'Cooking Sunflower Oil', category: 'Grocery', currentQuantity: 8, unit: 'liters', minThreshold: 10 },
      { itemName: 'Paneer Fresh', category: 'Dairy', currentQuantity: 5, unit: 'kg', minThreshold: 3 },
      { itemName: 'Fresh Milk', category: 'Dairy', currentQuantity: 20, unit: 'liters', minThreshold: 5 },
    ];

    for (const item of stockItems) {
      await prisma.stockItem.create({
        data: {
          propertyId: property.id,
          itemName: item.itemName,
          category: item.category,
          currentQuantity: item.currentQuantity,
          unit: item.unit,
          minThreshold: item.minThreshold,
        },
      });
    }
    console.log('✅ Seeded 5 Kitchen Inventory Stock Items');

    // Staff Tasks
    const staffTasks = [
      { title: 'Prepare Dinner for 50 residents', description: 'Vegetarian and non-vegetarian meals', priority: 'HIGH', status: 'IN_PROGRESS' },
      { title: 'Sanitize Dining Tables & Kitchen', description: 'Deep clean all cooking counters', priority: 'MEDIUM', status: 'COMPLETED' },
      { title: 'Re-stock Rice and Cooking Oil', description: 'Purchase stock from local distributor', priority: 'HIGH', status: 'PENDING' },
    ];

    for (const t of staffTasks) {
      await prisma.staffTask.create({
        data: {
          propertyId: property.id,
          assignedTo: manager.id,
          title: t.title,
          description: t.description,
          priority: t.priority,
          status: t.status,
        },
      });
    }
    console.log('✅ Seeded 3 Staff Tasks');
    // Seed Sample Invoices & Payments if TenantStays exist
    const stay = await prisma.tenantStay.findFirst({
      where: { propertyId: property.id },
    });
    if (stay) {
      const existingInv = await prisma.invoice.findFirst({
        where: { stayId: stay.id },
      });
      if (!existingInv) {
        const invoice = await prisma.invoice.create({
          data: {
            ownerId: owner.id,
            propertyId: property.id,
            stayId: stay.id,
            invoiceNumber: 'INV-DEMO-001',
            billingMonth: '2026-09',
            dueDate: new Date(Date.now() + 7 * 86400000),
            totalAmount: 850000,
            paidAmount: 850000,
            status: InvoiceStatus.PAID,
            items: {
              create: [
                { title: 'Monthly Rent - Sep 2026', amount: 850000 },
              ],
            },
          },
        });
        await prisma.payment.create({
          data: {
            ownerId: owner.id,
            invoiceId: invoice.id,
            transactionRef: 'TXN-DEMO-001',
            amount: 850000,
            method: PaymentMethod.UPI,
            status: PaymentStatus.COMPLETED,
          },
        });
        console.log('✅ Seeded Demo Invoice & Payment');
      }
    }

    // Seed Sample Expenses
    const expenseCount = await prisma.expense.count({ where: { propertyId: property.id } });
    if (expenseCount === 0) {
      const sampleExpenses = [
        { title: 'Electricity Bill Sep', category: 'Utilities', amount: 125000, expenseDate: new Date() },
        { title: 'Wi-Fi Fiber Connection', category: 'Internet', amount: 35000, expenseDate: new Date() },
        { title: 'Daily Grocery & Vegetables', category: 'Food', amount: 240000, expenseDate: new Date() },
      ];
      for (const exp of sampleExpenses) {
        await prisma.expense.create({
          data: {
            ownerId: owner.id,
            propertyId: property.id,
            title: exp.title,
            category: exp.category,
            amount: exp.amount,
            expenseDate: exp.expenseDate,
          },
        });
      }
      console.log('✅ Seeded 3 Sample Expenses');
    }

    // Seed Sample Enquiries
    const enquiryCount = await prisma.enquiry.count({ where: { propertyId: property.id } });
    if (enquiryCount === 0) {
      const sampleEnquiries = [
        { name: 'Karan Malhotra', phone: '9876500001', email: 'karan@example.com', roomType: RoomType.DOUBLE_SHARING, message: 'Looking for a double sharing room from Oct 1st.', isResolved: false },
        { name: 'Rohan Sharma', phone: '9876500002', email: 'rohan@example.com', roomType: RoomType.SINGLE, message: 'Interested in single room near PES college.', isResolved: true },
      ];
      for (const enq of sampleEnquiries) {
        await prisma.enquiry.create({
          data: {
            propertyId: property.id,
            name: enq.name,
            phone: enq.phone,
            email: enq.email,
            roomType: enq.roomType,
            message: enq.message,
            isResolved: enq.isResolved,
          },
        });
      }
      console.log('✅ Seeded 2 Sample Enquiries');
    }
  }

  // 10. Seed Support Ticket
  const ticket = await prisma.supportTicket.findFirst();
  if (!ticket) {
    await prisma.supportTicket.create({
      data: {
        title: 'Need help enabling WhatsApp alerts for PG gate pass',
        description: 'We would like to configure automatic WhatsApp alerts to parents when residents scan the QR code.',
        priority: 'MEDIUM',
        status: 'OPEN',
        createdBy: owner?.email || 'owner@smartpg.com',
      },
    });
    console.log('✅ Seeded sample support ticket');
  }

  console.log('🎉 Comprehensive database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
