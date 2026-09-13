'use client';
import Link from 'next/link';
import { UserCog, Users, ChefHat, GraduationCap, ShieldAlert, Smartphone } from 'lucide-react';

export function RoleSection() {
  const roles = [
    {
      icon: <UserCog className="w-6 h-6" />,
      title: "Owner",
      color: "var(--primary-teal)",
      features: ["Property Management", "Rent Collection", "Reports & Analytics", "Staff Management", "Financial Control", "Security Deposit", "Invoice Generation", "Payment Tracking"]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Manager",
      color: "var(--secondary-green)",
      features: ["Daily Operations", "Student Check-in/out", "Complaint Handling", "Visitor Management", "Housekeeping & Maintenance", "Staff Attendance", "Notices & Alerts", "Room Allocation"]
    },
    {
      icon: <ChefHat className="w-6 h-6" />,
      title: "Cook",
      color: "var(--secondary-orange)",
      features: ["Menu Management", "Meal Tracking", "Inventory Management", "Purchase Requests", "Stock Alerts", "Menu Approval", "Kitchen Hygiene", "Meal Attendance"]
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Student",
      color: "var(--secondary-purple)",
      features: ["Room Information", "Rent Payment", "Complaint System", "Meal Attendance", "Visitor Requests", "Leave & Outing", "Feedback", "Notifications"]
    },
    {
      icon: <ShieldAlert className="w-6 h-6" />,
      title: "SuperAdmin",
      color: "var(--primary-navy)",
      features: ["System Monitoring", "Owner Management", "PG Approval", "Revenue Tracking", "System Settings", "User Management", "Audit Logs", "Backup Management"]
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Everyone",
      color: "var(--primary-gold)",
      features: ["Mobile Access", "Real-time Updates", "Push Notifications", "QR Codes", "Digital Payments", "Smart Dashboard", "Reports Anywhere", "24/7 Support"]
    }
  ];

  return (
    <section className="py-20 px-4 bg-white" style={{ backgroundColor: 'var(--primary-white)' }}>
      <div className="max-w-[1200px] mx-auto">
        <h2 className="section-header">👥 Designed For Every Role</h2>
        <p className="section-subheader">Customized features for everyone in your PG ecosystem</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roles.map((role, i) => (
            <div key={i} className="card home-card hover-lift fade-in" style={{ borderLeft: `4px solid ${role.color}`, animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center gap-3 mb-6">
                <div style={{ color: role.color }}>
                  {role.icon}
                </div>
                <h3 className="font-bold text-xl" style={{ color: 'var(--primary-navy)' }}>{role.title}</h3>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                {role.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-medium)' }}>
                    <span style={{ color: role.color }}>•</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto pt-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                <Link href={`/features/${role.title.toLowerCase()}`} className="inline-flex items-center gap-1 font-medium text-sm transition-colors hover:opacity-80" style={{ color: role.color }}>
                  Learn More <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
