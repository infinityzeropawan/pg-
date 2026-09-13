'use client';
import { UserPlus, Home, Users, Activity, ChevronRight } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "Sign Up & Setup",
      desc: "Create your account"
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Add PG Property",
      desc: "Setup rooms & beds"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Add Students",
      desc: "Allocate rooms"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Start Managing",
      desc: "Track everything"
    }
  ];

  return (
    <section className="py-20" style={{ background: 'var(--bg-light)' }}>
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="section-header">📋 How PG Management System Works</h2>
        <p className="section-subheader">4 simple steps to digitize your operations.</p>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5" style={{ background: 'var(--primary-teal)', zIndex: 0, opacity: 0.3 }}></div>

          {steps.map((step, i) => (
            <div key={i} className="flex-1 flex items-center justify-center relative w-full md:w-auto mb-8 md:mb-0">
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-4 shadow-[var(--shadow-md)] hover-lift" 
                     style={{ background: 'var(--primary-teal)', color: 'var(--primary-white)', border: '4px solid var(--primary-white)' }}>
                  {i + 1}
                </div>
                <div className="mb-3" style={{ color: 'var(--primary-navy)' }}>{step.icon}</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--primary-navy)' }}>{step.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-medium)' }}>{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-8 -right-4 lg:-right-8 items-center justify-center w-8 z-20 text-[var(--primary-teal)]">
                  <ChevronRight className="w-8 h-8 opacity-60" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="btn-gold fade-in" style={{ animationDelay: '0.4s' }}>
            🌟 Get Started Now - It's Free
          </button>
        </div>
      </div>
    </section>
  );
}
