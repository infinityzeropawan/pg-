'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Lock, Shield, User, Building2, ChevronRight, Sparkles } from 'lucide-react';

export function HomeHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow-sm border-b" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', borderColor: 'rgba(0,0,0,0.08)' }}>
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-navy)] flex items-center justify-center shadow-sm">
              <span className="text-[var(--primary-gold)] font-bold text-sm">PG</span>
            </div>
            <span className="text-[var(--primary-navy)] text-xl font-extrabold tracking-tight">
              Smart<span className="text-[var(--primary-teal)]">PG</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
          <Link href="#features" className="text-[var(--text-dark)] hover:text-[var(--primary-teal)] transition-colors">Features</Link>
          <Link href="#pricing" className="text-[var(--text-dark)] hover:text-[var(--primary-teal)] transition-colors">Pricing</Link>
          <Link href="#about" className="text-[var(--text-dark)] hover:text-[var(--primary-teal)] transition-colors">About</Link>
          <Link href="#contact" className="text-[var(--text-dark)] hover:text-[var(--primary-teal)] transition-colors">Contact</Link>
          <Link href="#faq" className="text-[var(--text-dark)] hover:text-[var(--primary-teal)] transition-colors">FAQ</Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/demo" className="text-sm font-semibold text-[var(--primary-navy)] hover:text-[var(--primary-teal)] px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Demo Hub</span>
          </Link>
          <Link href="/login" className="px-4 py-2 text-sm font-bold rounded-xl border border-[var(--primary-teal)] text-[var(--primary-teal)] hover:bg-blue-50 transition-all flex items-center gap-1.5 shadow-xs">
            <Lock className="w-3.5 h-3.5" />
            <span>Login</span>
          </Link>
          <Link href="/owner-request" className="px-4 py-2 text-sm font-bold rounded-xl bg-[var(--primary-teal)] text-white hover:bg-[var(--primary-navy)] transition-all shadow-sm">
            Register PG
          </Link>
        </div>

        {/* Mobile Header Buttons (Mobile Login + Hamburger Toggle) */}
        <div className="flex items-center gap-2 md:hidden">
          <Link 
            href="/login" 
            className="px-3 py-1.5 text-xs font-extrabold rounded-lg bg-[var(--primary-teal)] text-white shadow-xs flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            <span>Login</span>
          </Link>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-lg text-[var(--primary-navy)] bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-4 pb-6 space-y-5 shadow-xl animate-in slide-in-from-top duration-200">
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)}
              className="w-full py-3 px-4 rounded-xl bg-[var(--primary-teal)] text-white text-center font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Unified Login</span>
            </Link>
            <Link 
              href="/owner-request" 
              onClick={() => setIsOpen(false)}
              className="w-full py-3 px-4 rounded-xl bg-[var(--primary-navy)] text-white text-center font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <span>Register PG</span>
            </Link>
          </div>

          <Link 
            href="/demo" 
            onClick={() => setIsOpen(false)}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between shadow-xs"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Live Interactive Demo Hub</span>
            </span>
            <ChevronRight className="w-4 h-4 text-amber-600" />
          </Link>

          {/* Role Direct Portals */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Direct Role Login Portals</p>
            <div className="grid grid-cols-2 gap-2">
              <Link 
                href="/owner/login" 
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-lg border border-gray-100 bg-gray-50 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[var(--primary-teal)] transition-colors flex items-center justify-between"
              >
                <span>PG Owner</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
              <Link 
                href="/manager/login" 
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-lg border border-gray-100 bg-gray-50 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[var(--primary-teal)] transition-colors flex items-center justify-between"
              >
                <span>Manager</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
              <Link 
                href="/staff/login" 
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-lg border border-gray-100 bg-gray-50 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[var(--primary-teal)] transition-colors flex items-center justify-between"
              >
                <span>Staff & Cook</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
              <Link 
                href="/student/login" 
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-lg border border-gray-100 bg-gray-50 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[var(--primary-teal)] transition-colors flex items-center justify-between"
              >
                <span>Student</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
              <Link 
                href="/parent/login" 
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-lg border border-gray-100 bg-gray-50 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[var(--primary-teal)] transition-colors flex items-center justify-between col-span-2"
              >
                <span>Parent / Guardian Portal</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Quick Page Links */}
          <div className="pt-2 border-t border-gray-100 space-y-1">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1">Navigation</p>
            {['features', 'pricing', 'about', 'contact', 'faq'].map((item) => (
              <Link
                key={item}
                href={`#${item}`}
                onClick={() => setIsOpen(false)}
                className="block py-1.5 text-xs font-semibold text-gray-600 hover:text-[var(--primary-teal)] capitalize"
              >
                {item}
              </Link>
            ))}
          </div>

        </div>
      )}
    </header>
  );
}

