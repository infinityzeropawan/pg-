'use client';

import { CreditCard, Map, MessageCircle, Cloud, Mail, BarChart, Lock, Smartphone } from 'lucide-react';

export function IntegrationsSection() {
  const integrations = [
    { name: "Razorpay", icon: <CreditCard className="w-8 h-8" /> },
    { name: "Paytm", icon: <Smartphone className="w-8 h-8" /> },
    { name: "PhonePe", icon: <Smartphone className="w-8 h-8" /> },
    { name: "Google Maps", icon: <Map className="w-8 h-8" /> },
    { name: "WhatsApp", icon: <MessageCircle className="w-8 h-8" /> },
    { name: "AWS", icon: <Cloud className="w-8 h-8" /> },
    { name: "Azure", icon: <Cloud className="w-8 h-8" /> },
    { name: "GCP", icon: <Cloud className="w-8 h-8" /> },
    { name: "Slack", icon: <MessageCircle className="w-8 h-8" /> },
    { name: "Zoho", icon: <BarChart className="w-8 h-8" /> },
    { name: "SMS", icon: <MessageCircle className="w-8 h-8" /> },
    { name: "Email", icon: <Mail className="w-8 h-8" /> },
    { name: "BI Tools", icon: <BarChart className="w-8 h-8" /> },
    { name: "Security", icon: <Lock className="w-8 h-8" /> },
  ];

  return (
    <section className="py-20 px-4" style={{ backgroundColor: 'var(--bg-light)' }}>
      <div className="max-w-[1200px] mx-auto text-center">
        <h2 className="section-header">🔌 Integrations & Partners</h2>
        <p className="section-subheader">Seamlessly connect with your favorite tools</p>
        
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {integrations.map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover-lift fade-in" style={{ width: '120px', animationDelay: `${(i % 5) * 0.1}s` }}>
              <div className="mb-3 text-[var(--primary-teal)]">
                {item.icon}
              </div>
              <span className="text-sm font-medium text-[var(--text-dark)]">{item.name}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-12 text-[var(--primary-navy)] font-semibold fade-in">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span> 50+ Integrations
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span> 30+ Payment Gateways
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span> 20+ Countries
          </div>
        </div>
      </div>
    </section>
  );
}
