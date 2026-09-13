'use client';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden text-center pt-24 pb-16 lg:pt-32 lg:pb-24 px-4" style={{ background: 'var(--gradient-hero)' }}>
      <div className="max-w-[1200px] mx-auto fade-in">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight" style={{ color: 'var(--primary-white)' }}>
          🏢 Smart <span style={{ color: 'var(--primary-gold)' }}>PG Management System</span>
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto" style={{ color: 'var(--bg-medium)' }}>
          "One Platform to Manage Your PG Business Effortlessly"
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base font-medium mb-12" style={{ color: 'var(--bg-medium)' }}>
          <span className="flex items-center gap-2"><span style={{ color: 'var(--primary-gold)' }}>✓</span> Manage rooms</span>
          <span className="flex items-center gap-2"><span style={{ color: 'var(--primary-gold)' }}>✓</span> Track payments</span>
          <span className="flex items-center gap-2"><span style={{ color: 'var(--primary-gold)' }}>✓</span> Handle complaints</span>
          <span className="flex items-center gap-2"><span style={{ color: 'var(--primary-gold)' }}>✓</span> Serve meals</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link href="/owner-request" className="btn-gold text-lg">
            🚀 Get Started Free
          </Link>
          <button className="btn-outline-white text-lg">
            ▶️ Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto p-8 rounded-[var(--radius-lg)] border" style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold" style={{ color: 'var(--primary-gold)' }}>500+</span>
            <span style={{ color: 'var(--primary-white)' }}>📊 PGs Managed</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold" style={{ color: 'var(--primary-gold)' }}>25,000+</span>
            <span style={{ color: 'var(--primary-white)' }}>🧑 Students</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold" style={{ color: 'var(--primary-gold)' }}>₹10Cr+</span>
            <span style={{ color: 'var(--primary-white)' }}>💰 Revenue Tracked</span>
          </div>
        </div>

        {/* Mockup / Illustration Placeholder */}
        <div className="mt-16 max-w-5xl mx-auto rounded-t-[var(--radius-xl)] bg-[var(--primary-white)] shadow-[var(--shadow-xl)] p-2 pb-0 relative overflow-hidden border border-[var(--primary-teal)]" style={{ height: 'auto' }}>
          <img 
            src="/images/mockup.jpg" 
            alt="Dashboard Preview" 
            className="w-full h-auto rounded-t-[var(--radius-lg)] border border-b-0 border-[var(--bg-medium)] block"
          />
        </div>
      </div>
    </section>
  );
}
