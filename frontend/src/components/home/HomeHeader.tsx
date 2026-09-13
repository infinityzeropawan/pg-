'use client';
import Link from 'next/link';

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 shadow-sm border-b" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', borderColor: 'rgba(0,0,0,0.05)' }}>
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[var(--primary-navy)] flex items-center justify-center">
              <span className="text-[var(--primary-gold)] font-bold">PG</span>
            </div>
            <span className="text-[var(--primary-navy)] text-xl font-bold tracking-tight">PG System</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-[var(--text-dark)] font-medium hover:text-[var(--primary-gold)] transition-colors">Features</Link>
          <Link href="#pricing" className="text-[var(--text-dark)] font-medium hover:text-[var(--primary-gold)] transition-colors">Pricing</Link>
          <Link href="#about" className="text-[var(--text-dark)] font-medium hover:text-[var(--primary-gold)] transition-colors">About</Link>
          <Link href="#contact" className="text-[var(--text-dark)] font-medium hover:text-[var(--primary-gold)] transition-colors">Contact</Link>
          <Link href="#blog" className="text-[var(--text-dark)] font-medium hover:text-[var(--primary-gold)] transition-colors">Blog</Link>
          <Link href="#faq" className="text-[var(--text-dark)] font-medium hover:text-[var(--primary-gold)] transition-colors">FAQ</Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/demo" className="text-[var(--text-dark)] font-medium hover:text-[var(--primary-gold)] transition-colors">
            📱 Demo
          </Link>
          <Link href="/login" className="btn-outline">
            🔐 Login
          </Link>
          <Link href="/owner-request" className="btn-primary">
            📝 Register
          </Link>
        </div>

        {/* Mobile menu button (placeholder) */}
        <button className="md:hidden text-[var(--primary-navy)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>
    </header>
  );
}
