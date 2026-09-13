// RESPONSIBILITY: Renders the ParentLayout component.
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, IndianRupee, Bell, LogOut, User, Menu, X, ShieldCheck } from 'lucide-react';

import { getSession, clearSession } from '@/app/parent/parent_lib/parent_auth/ParentSession';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', href: '/parent/dashboard', icon: Home },
  { key: 'finance', label: 'Rent & Finance', href: '/parent/finance', icon: IndianRupee },
  { key: 'alerts', label: 'Safety Alerts', href: '/parent/alerts', icon: Bell },
];

function ParentLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = typeof window !== 'undefined' ? getSession() : null;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    clearSession();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-page flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-header/90 backdrop-blur-md p-3 border-b border-border shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-primary p-1">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-1 font-bold text-primary">
            <ShieldCheck className="text-primary w-5 h-5 hidden sm:block" />
            <span className="hidden sm:block">Parent Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="text-xs font-medium text-secondary max-w-[80px] truncate">
            {user?.name || 'Parent'}
          </div>
          <button onClick={handleLogout} className="text-xs bg-danger-bg text-danger px-2 py-1.5 rounded-md font-bold flex items-center gap-1">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`hidden md:flex w-64 bg-card border-r border-border flex-col sticky top-0 h-screen shrink-0 ${isMobileMenuOpen ? 'flex absolute z-50 w-64 h-screen left-0' : 'hidden'}`}>
        <div className="p-6 border-b border-border flex justify-between items-center bg-card">
          <div className="flex items-center gap-2 font-black text-xl text-primary">
            <ShieldCheck className="text-primary w-7 h-7" />
            <span>Parent Portal</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-primary">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="mb-4 px-3">
            <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Menu</p>
          </div>
          
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-bold motion-safe:transition-all ${
                pathname === item.href 
                  ? 'bg-primary text-white shadow-lg shadow-primary-subtle' 
                  : 'text-secondary hover:bg-input hover:text-primary'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex h-16 bg-header border-b border-border items-center px-6 justify-between shrink-0 sticky top-0 z-20 backdrop-blur-md bg-opacity-80">
          <h2 className="text-lg font-semibold text-primary capitalize">
            {pathname?.split('/')[2]?.replace('-', ' ') || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-secondary">
              Parent: <strong className="text-primary">{user?.name}</strong>
            </div>
            <button onClick={handleLogout} className="text-sm bg-page border border-border px-4 py-2 rounded-md text-danger font-medium hover:bg-danger-bg hover:text-danger motion-safe:transition-all">
              Logout
            </button>
          </div>
        </header>
        
        <div className="flex-1 p-4 md:p-6 text-primary overflow-x-hidden">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 motion-safe:transition-all motion-safe:duration-300">
        <div className="flex items-center justify-around p-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 min-w-[64px] motion-safe:transition-colors rounded-xl ${
                pathname === item.href ? 'text-primary bg-primary-subtle' : 'text-secondary hover:bg-input'
              }`}
            >
              <item.icon className={`w-6 h-6 ${pathname === item.href ? 'drop-shadow-sm' : ''}`} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ParentLayoutInner>{children}</ParentLayoutInner>
  );
}
