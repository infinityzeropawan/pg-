'use client';
import { Building2, Percent, Star, Headset, Users, IndianRupee, CheckCircle2, ShieldCheck } from 'lucide-react';

export function TrustStatsSection() {
  const stats = [
    { icon: <Building2 className="w-8 h-8" />, count: "500+", label: "Active PGs" },
    { icon: <Percent className="w-8 h-8" />, count: "98%", label: "Occupancy Rate" },
    { icon: <Star className="w-8 h-8" />, count: "4.8 ⭐", label: "User Rating" },
    { icon: <Headset className="w-8 h-8" />, count: "24/7", label: "Support Available" },
    { icon: <Users className="w-8 h-8" />, count: "25,000+", label: "Students Managed" },
    { icon: <IndianRupee className="w-8 h-8" />, count: "₹10Cr+", label: "Revenue Collected" },
    { icon: <CheckCircle2 className="w-8 h-8" />, count: "5,000+", label: "Complaints Resolved" },
    { icon: <ShieldCheck className="w-8 h-8" />, count: "100%", label: "Data Security" }
  ];

  return (
    <section className="py-20 px-4" style={{ backgroundColor: 'var(--primary-navy)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-xl fade-in" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="mb-4" style={{ color: 'var(--primary-gold)' }}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-white)' }}>
                {stat.count}
              </div>
              <div className="text-sm" style={{ color: 'var(--bg-medium)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
