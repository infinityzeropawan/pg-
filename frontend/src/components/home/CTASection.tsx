'use client';
import Link from 'next/link';
import { Check } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 px-4 text-center relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      <div className="max-w-3xl mx-auto relative z-10 fade-in">
        <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--primary-white)' }}>
          🚀 Ready to Simplify Your PG Management?
        </h2>
        
        <p className="text-xl mb-10" style={{ color: 'var(--bg-medium)' }}>
          Join 500+ PG owners already using our platform
        </p>
        
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl max-w-2xl mx-auto mb-10" style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <form className="flex flex-col md:flex-row gap-4 mb-6">
            <input 
              type="email" 
              placeholder="Enter your email address..." 
              className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{ color: 'var(--text-dark)', backgroundColor: 'var(--primary-white)' }}
              required
            />
            <button type="button" className="btn-gold whitespace-nowrap text-lg">
              🌟 Start Free Trial
            </button>
          </form>
          
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 text-sm text-left md:text-center" style={{ color: 'var(--bg-medium)' }}>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Full access to all features</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4 mt-8">
          <Link href="/contact" className="btn-outline-white inline-flex items-center gap-2">
            📞 Talk to Sales
          </Link>
          <p className="text-sm opacity-80" style={{ color: 'var(--bg-medium)' }}>
            Get a personalized demo with our experts
          </p>
        </div>
      </div>
    </section>
  );
}
