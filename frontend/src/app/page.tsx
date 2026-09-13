'use client';

import './homepage.css'; // Import the new design system styles

import { HomeHeader } from '@/components/home/HomeHeader';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustStatsSection } from '@/components/home/TrustStatsSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { RoleSection } from '@/components/home/RoleSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { PricingSection } from '@/components/home/PricingSection';
import { FAQSection } from '@/components/home/FAQSection';
import { BlogSection } from '@/components/home/BlogSection';
import { CTASection } from '@/components/home/CTASection';
import { HomeFooter } from '@/components/home/HomeFooter';

export default function LandingPage() {
  return (
    <div className="home-theme flex flex-col min-h-screen font-sans" style={{ background: 'var(--bg-light)' }}>
      <HomeHeader />
      
      <main className="flex-grow">
        <HeroSection />
        <TrustStatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <RoleSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <BlogSection />
        <CTASection />
      </main>
      
      <HomeFooter />

      {/* DEBUG BUTTON TO RESET LOCAL STORAGE */}
      <div className="fixed bottom-4 left-4 z-50">
        <button 
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.clear();
              alert('Database Reset! Reloading...');
              window.location.reload();
            }
          }}
          className="text-xs bg-red-600 text-white px-3 py-1 rounded shadow"
        >
          Reset Demo Data
        </button>
      </div>
    </div>
  );
}
