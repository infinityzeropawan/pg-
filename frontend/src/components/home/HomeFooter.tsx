'use client';
import Link from 'next/link';
import { Lock } from 'lucide-react';

export function HomeFooter() {
  return (
    <footer className="pt-16 pb-8 px-4" style={{ backgroundColor: 'var(--primary-navy)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b pb-12" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-[var(--primary-white)]">
                <span className="font-bold" style={{ color: 'var(--primary-navy)' }}>PG</span>
              </div>
              <span className="text-xl font-bold" style={{ color: 'var(--primary-white)' }}>PG System</span>
            </div>
            <p className="mb-4" style={{ color: 'var(--bg-medium)' }}>
              Smart PG Management Platform. Made with ❤️ in India
            </p>
            <div className="space-y-2 text-sm" style={{ color: 'var(--bg-medium)' }}>
              <p>📞 +91 9876543210</p>
              <p>✉️ info@pgmgmt.com</p>
            </div>
          </div>
          
          {/* Product Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-wider" style={{ color: 'var(--primary-white)' }}>Product</h4>
            <ul className="space-y-3 flex flex-col">
              {['Features', 'Pricing', 'Integrations', 'Changelog', 'Roadmap', 'API Docs', 'Mobile Apps', 'Security', 'Demo'].map((item) => (
                <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm transition-colors hover:text-[var(--primary-gold)]" style={{ color: 'var(--text-light)' }}>
                  {item}
                </Link>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-wider" style={{ color: 'var(--primary-white)' }}>Company</h4>
            <ul className="space-y-3 flex flex-col">
              {['About Us', 'Careers', 'Blog', 'Press', 'Team', 'Testimonials', 'Partners', 'Awards', 'Newsletter'].map((item) => (
                <Link key={item} href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-sm transition-colors hover:text-[var(--primary-gold)]" style={{ color: 'var(--text-light)' }}>
                  {item}
                </Link>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-wider" style={{ color: 'var(--primary-white)' }}>Support</h4>
            <ul className="space-y-3 flex flex-col">
              {['Help Center', 'Contact', 'Privacy', 'Terms', 'Refund Policy', 'FAQ', 'Status', 'Community'].map((item) => (
                <Link key={item} href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-sm transition-colors hover:text-[var(--primary-gold)]" style={{ color: 'var(--text-light)' }}>
                  {item}
                </Link>
              ))}
            </ul>
          </div>
        </div>

        {/* Social & Apps */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 pb-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-4 text-[var(--primary-white)]">
            <span className="font-medium mr-2">📱 Follow Us:</span>
            <Link href="#" className="hover:text-[var(--primary-gold)] transition-colors text-sm font-bold">Facebook</Link>
            <Link href="#" className="hover:text-[var(--primary-gold)] transition-colors text-sm font-bold">Twitter</Link>
            <Link href="#" className="hover:text-[var(--primary-gold)] transition-colors text-sm font-bold">LinkedIn</Link>
            <Link href="#" className="hover:text-[var(--primary-gold)] transition-colors text-sm font-bold">Instagram</Link>
            <Link href="#" className="hover:text-[var(--primary-gold)] transition-colors text-sm font-bold">YouTube</Link>
            <Link href="#" className="hover:text-[var(--primary-gold)] transition-colors text-sm font-bold">WA</Link>
            <Link href="#" className="hover:text-[var(--primary-gold)] transition-colors text-sm font-bold">TG</Link>
          </div>
          
          <div className="flex items-center gap-4 text-[var(--primary-white)]">
            <span className="font-medium mr-2">🌐 Download our apps:</span>
            <Link href="#" className="text-sm font-medium hover:text-[var(--primary-gold)] border border-current px-3 py-1 rounded">iOS App Store</Link>
            <Link href="#" className="text-sm font-medium hover:text-[var(--primary-gold)] border border-current px-3 py-1 rounded">Google Play Store</Link>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm" style={{ color: 'var(--bg-medium)' }}>
          <div className="text-center md:text-left">
            <p>© 2024 PG Management System. All rights reserved.</p>
            <p>Made with ❤️ in India | Version 2.0.1</p>
          </div>
          
          <div className="flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-green-400" />
            <span>Your data is secure with bank-grade encryption</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
