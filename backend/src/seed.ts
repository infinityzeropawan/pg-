import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { UserRole, OwnerRequestStatus, PropertyType, RoomType, BedStatus, StayStatus, ComplaintStatus } from '@prisma/client';

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Seed SuperAdmin User
  const adminEmail = 'admin@smartpg.com';
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!admin) {
    const passwordHash = await bcrypt.hash('SuperAdmin@123456', 10);
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        phone: '9999999999',
        fullName: 'Platform SuperAdmin',
        passwordHash,
        role: UserRole.SUPERADMIN,
        mustChangePassword: false,
      },
    });
    console.log(`✅ Created SuperAdmin user: ${adminEmail} (Password: SuperAdmin@123456)`);
  } else {
    console.log(`ℹ️ SuperAdmin already exists: ${adminEmail}`);
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

  // 5. Seed Demo Owner User
  const ownerEmail = 'owner@smartpg.com';
  let owner = await prisma.user.findUnique({ where: { email: ownerEmail } });

  if (!owner) {
    const passwordHash = await bcrypt.hash('Owner@123456', 10);
    owner = await prisma.user.create({
      data: {
        email: ownerEmail,
        phone: '9876543201',
        fullName: 'Rajesh Gupta',
        passwordHash,
        role: UserRole.OWNER,
        mustChangePassword: false,
      },
    });
    console.log(`✅ Created Owner user: ${ownerEmail} (Password: Owner@123456)`);

    // Assign Subscription
    if (starterPlan) {
      await prisma.subscription.create({
        data: {
          ownerId: owner.id,
          planId: starterPlan.id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          isActive: true,
          autoRenew: true,
          paymentStatus: 'PAID',
        },
      });
    }
  } else {
    console.log(`ℹ️ Owner already exists: ${ownerEmail}`);
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

  // 7. Seed Demo Manager User
  const managerEmail = 'manager@smartpg.com';
  let manager = await prisma.user.findUnique({ where: { email: managerEmail } });
  if (!manager) {
    const passwordHash = await bcrypt.hash('Manager@123456', 10);
    manager = await prisma.user.create({
      data: {
        ownerId: owner.id,
        email: managerEmail,
        phone: '9876543202',
        fullName: 'Ramesh Kumar (PG Manager)',
        passwordHash,
        role: UserRole.MANAGER,
        mustChangePassword: false,
      },
    });

    if (property) {
      await prisma.staffAssignment.create({
        data: {
          userId: manager.id,
          propertyId: property.id,
          permissions: JSON.stringify(['all']),
        },
      });
    }
    console.log(`✅ Created Manager user: ${managerEmail} (Password: Manager@123456)`);
  }

  // 8. Seed Demo Parent & Student
  const studentEmail = 'student@smartpg.com';
  let student = await prisma.user.findUnique({ where: { email: studentEmail } });
  if (!student && property) {
    const parentPass = await bcrypt.hash('Parent@123456', 10);
    const parentUser = await prisma.user.create({
      data: {
        ownerId: owner.id,
        fullName: 'Surendra Verma (Father)',
        email: 'parent@smartpg.com',
        phone: '9876543203',
        passwordHash: parentPass,
        role: UserRole.PARENT,
        mustChangePassword: false,
      },
    });

    const parentProfile = await prisma.parentProfile.create({
      data: {
        userId: parentUser.id,
        relation: 'Father',
        address: '24, Civil Lines, Kanpur, UP',
      },
    });

    const studentPass = await bcrypt.hash('Student@123456', 10);
    student = await prisma.user.create({
      data: {
        ownerId: owner.id,
        fullName: 'Rahul Verma',
        email: studentEmail,
        phone: '9876543204',
        passwordHash: studentPass,
        role: UserRole.STUDENT,
        mustChangePassword: false,
      },
    });

    const tenantProfile = await prisma.tenantProfile.create({
      data: {
        userId: student.id,
        emergencyContactName: 'Surendra Verma',
        emergencyContactPhone: '9876543203',
        permanentAddress: '24, Civil Lines, Kanpur, UP',
        idProofType: 'AADHAAR',
        idProofNumber: '1234-5678-9012',
        collegeOrCompany: 'PES University, CSE Dept.',
        parentProfileId: parentProfile.id,
      },
    });

    // Find first vacant bed in Room 101
    const bed = await prisma.bed.findFirst({
      where: { room: { roomNumber: '101', floor: { propertyId: property.id } } },
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
      console.log(`✅ Onboarded Student: ${student.fullName} into Room 101, Bed ${bed.bedNumber}`);
    }

    // Seed sample gate log
    await prisma.gateLog.create({
      data: {
        propertyId: property.id,
        userId: student.id,
        studentName: student.fullName,
        roomNumber: '101',
        type: 'ENTRY',
        reason: 'College / Classes',
        destination: 'PES University Campus',
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
        description: 'The hot water geyser in Room 101 bathroom takes more than 30 mins to heat up.',
        category: 'Plumbing / Electrical',
        priority: 'MEDIUM',
        status: ComplaintStatus.OPEN,
      },
    });

    console.log(`✅ Created Student user: ${studentEmail} (Password: Student@123456)`);
    console.log(`✅ Created Parent user: parent@smartpg.com (Password: Parent@123456)`);
  }

  // 9. Seed Support Ticket
  const ticket = await prisma.supportTicket.findFirst();
  if (!ticket) {
    await prisma.supportTicket.create({
      data: {
        title: 'Need help enabling WhatsApp alerts for PG gate pass',
        description: 'We would like to configure automatic WhatsApp alerts to parents when residents scan the QR code.',
        priority: 'MEDIUM',
        status: 'OPEN',
        createdBy: ownerEmail,
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
