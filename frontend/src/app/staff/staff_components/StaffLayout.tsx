// RESPONSIBILITY: Renders the StaffLayout component.
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Utensils, Shield, Sparkles, Wrench, ListTodo, LogOut, Menu, X, ShieldAlert, Bell, Package } from 'lucide-react';

import { getSession, clearSession } from '@/app/staff/staff_lib/staff_auth/StaffSession';
import { StaffProvider, useStaffContext } from '@/app/staff/staff_components/StaffContext';
import { useStaffI18n } from '@/app/staff/StaffI18n';

;
import { StaffForcePasswordChangeModal } from '@/app/staff/staff_components/StaffForcePasswordChangeModal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

import type { DictKey } from '@/app/staff/StaffI18n';

const NAV_ITEMS = [
  { key: 'dashboard', href: '/staff/dashboard', icon: LayoutDashboard },
  { key: 'cook', href: '/staff/cook', icon: Utensils, role: 'cook' },
  { key: 'stock', href: '/staff/stock', icon: Package, role: 'cook' },
  { key: 'tasks', href: '/staff/tasks', icon: ListTodo }
];

function StaffLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = typeof window !== 'undefined' ? getSession() : null;
  const { staffRole, loading } = useStaffContext();
  const { lang, setLang, t } = useStaffI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [forcePasswordChange, setForcePasswordChange] = useState(user?.mustChangePassword || false);

  useEffect(() => {
    const session = getSession();
    if (!session || session.role !== 'staff') {
      router.replace('/staff/login');
    }
  }, [router]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    clearSession();
    router.push('/');
  };

  if (loading) return null;

  const visibleLinks = NAV_ITEMS.filter(l => !l.role || l.role === staffRole || staffRole === 'admin');

  return (
    <div className="min-h-screen bg-page flex flex-col md:flex-row">
      <StaffForcePasswordChangeModal 
        user={user} 
        onSuccess={() => setForcePasswordChange(false)} 
      />
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-header/90 backdrop-blur-md p-3 border-b border-border shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-primary p-1">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-1 font-bold text-primary">
            <ShieldAlert className="text-primary w-5 h-5 hidden sm:block" />
            <span className="hidden sm:block">Staff Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="text-xs font-medium text-secondary max-w-[80px] truncate">
            {user?.name || 'Staff'}
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
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-border overflow-y-auto shrink-0
        transform transition-transform motion-safe:duration-300 motion-safe:ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:sticky md:top-0 md:h-screen
      `}>
        <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 font-bold text-xl text-primary">
              <ShieldAlert className="text-primary w-7 h-7" />
              <span>Staff Portal</span>
            </div>
            <p className="text-xs text-secondary mt-1 uppercase tracking-wider pl-9">{staffRole || 'Staff'}</p>
          </div>
          <button className="md:hidden text-secondary" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {visibleLinks.map((item: any) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium motion-safe:transition-colors ${isActive ? 'bg-primary-subtle text-primary border-l-4 border-primary' : 'text-secondary hover:bg-page hover:text-primary'}`}
              >
                <item.icon className="w-5 h-5" />
                {t(item.key as DictKey)}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex h-16 bg-header border-b border-border items-center px-6 justify-between shrink-0 sticky top-0 z-20 backdrop-blur-md bg-opacity-80">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-primary capitalize leading-tight">
              {pathname.split('/')[2]?.replace('-', ' ') || 'Dashboard'}
            </h2>
            <p className="text-xs text-secondary capitalize leading-tight">Role: {staffRole || 'Loading...'}</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* Language Switcher */}
            <div className="flex items-center bg-input border border-border rounded-md overflow-hidden text-xs font-bold">
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 motion-safe:transition-colors ${lang === 'en' ? 'bg-primary text-white' : 'text-secondary hover:text-primary'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('hi')}
                className={`px-3 py-1.5 motion-safe:transition-colors ${lang === 'hi' ? 'bg-primary text-white' : 'text-secondary hover:text-primary'}`}
              >
                हिं
              </button>
            </div>

            <div className="text-sm text-secondary">
              Staff: <strong className="text-primary">{user?.name}</strong>
            </div>
            <button onClick={handleLogout} className="text-sm bg-page border border-border px-4 py-2 rounded-md text-danger font-medium hover:bg-danger-bg hover:text-danger motion-safe:transition-all">
              {t('logout')}
            </button>
          </div>
        </header>
        
        <div className="flex-1 p-4 md:p-6 text-primary overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

export function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <StaffProvider>
      <StaffLayoutInner>{children}</StaffLayoutInner>
    </StaffProvider>
  );
}

