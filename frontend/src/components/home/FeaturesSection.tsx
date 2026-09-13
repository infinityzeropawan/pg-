'use client';
import { Home, IndianRupee, Smartphone, ShieldCheck, UtensilsCrossed, BarChart3, MessageSquareWarning, Star, Users, LogIn, Calendar, Bell } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: <Home className="w-6 h-6" />,
      title: "Room Management",
      bullets: ["Multiple PGs", "Buildings", "Floors", "Rooms", "Beds"]
    },
    {
      icon: <IndianRupee className="w-6 h-6" />,
      title: "Payment Tracking",
      bullets: ["Auto Collection", "Invoices", "GST Ready", "Reports", "Discounts"]
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile App",
      bullets: ["Access anywhere", "QR Code", "Push Notif.", "Offline"]
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Security First",
      bullets: ["Data Encrypted", "Secure Login", "Backup", "Audit"]
    },
    {
      icon: <UtensilsCrossed className="w-6 h-6" />,
      title: "Mess Management",
      bullets: ["Daily Menu", "Meal Tracking", "Inventory", "Purchase Request"]
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics & Reports",
      bullets: ["Occupancy Reports", "Financial Reports", "Student Reports", "Staff Reports"]
    },
    {
      icon: <MessageSquareWarning className="w-6 h-6" />,
      title: "Complaint System",
      bullets: ["Quick Response", "Priority Based", "Photo Upload", "Status"]
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Student Feedback",
      bullets: ["Ratings", "Reviews", "Suggestions", "Service Quality", "Overall"]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Staff Management",
      bullets: ["Manager", "Cook", "Housekeeping", "Security", "Attendance"]
    },
    {
      icon: <LogIn className="w-6 h-6" />,
      title: "Visitor Management",
      bullets: ["Visitor Entry", "Approvals", "QR Code Pass", "History"]
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Leave & Outing",
      bullets: ["Leave Requests", "Approval System", "History", "Reports"]
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Notices & Alerts",
      bullets: ["Important Updates", "Rent Reminders", "Emergency", "Broadcast"]
    }
  ];

  return (
    <section id="features" className="py-20 px-4 bg-white" style={{ backgroundColor: 'var(--primary-white)' }}>
      <div className="max-w-[1200px] mx-auto">
        <h2 className="section-header">🚀 Why Choose PG Management System?</h2>
        <p className="section-subheader">Everything you need to manage your PG business efficiently</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="card home-card hover-lift hover:border-[var(--primary-gold)] border border-transparent fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(45,125,154,0.1)', color: 'var(--primary-teal)' }}>
                {feature.icon}
              </div>
              <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--primary-navy)' }}>{feature.title}</h3>
              <ul className="text-sm space-y-2" style={{ color: 'var(--text-medium)' }}>
                {feature.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span style={{ color: 'var(--primary-teal)', fontSize: '10px' }}>•</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
