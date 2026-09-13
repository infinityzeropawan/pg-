'use client';

// RESPONSIBILITY: Renders the OwnerLayout component. Receives data via props/hooks.

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Building2, Bed, Users, UserSquare2, 
  Wallet, UtensilsCrossed, FileBarChart, Settings, CreditCard,
  LogOut, Bell, Building, Menu, X, ShieldAlert, Banknote, Wrench, CalendarCheck,
  MessageSquare, Megaphone, Receipt, TrendingUp
} from 'lucide-react';

import { getSession, clearSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';
import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';
import { useOwnerI18n } from '@/app/owner/OwnerI18n';

;
import { OwnerForcePasswordChangeModal } from '@/app/owner/owner_components/OwnerForcePasswordChangeModal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

import type { DictKey } from '@/app/owner/OwnerI18n';

const NAV_ITEMS = [
  { key: 'dashboard', href: '/owner/dashboard', icon: LayoutDashboard },
  { key: 'properties', href: '/owner/properties', icon: Building2 },
  { key: 'rooms', href: '/owner/rooms', icon: Bed },
  { key: 'team', href: '/owner/team', icon: Users },
  { key: 'attendance', href: '/owner/attendance', icon: CalendarCheck, label: 'Staff Attendance' },
  { key: 'payroll', href: '/owner/payroll', icon: Banknote },
  { key: 'students', href: '/owner/students', icon: UserSquare2 },
  { key: 'finance', href: '/owner/finance', icon: Wallet },
  { key: 'maintenance', href: '/owner/maintenance', icon: Wrench, label: 'Maintenance Log' },
  { key: 'food', href: '/owner/food', icon: UtensilsCrossed, label: 'Food Menu' },
  { key: 'complaints', href: '/owner/complaints', icon: MessageSquare, label: 'Complaints' },
  { key: 'notices', href: '/owner/notices', icon: Megaphone, label: 'Notices' },
  { key: 'tax', href: '/owner/tax', icon: Receipt, label: 'Tax & Compliance' },
  { key: 'reports', href: '/owner/reports', icon: TrendingUp, label: 'Reports & BI' },
  { key: 'settings', href: '/owner/settings', icon: Settings },
  { key: 'subscription', href: '/owner/subscription', icon: CreditCard },
];

export function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = typeof window !== 'undefined' ? getSession() : null;
  const { properties, selectedPropertyId, setSelectedPropertyId } = useOwnerPropertyContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useOwnerI18n();
  const [forcePasswordChange, setForcePasswordChange] = useState(user?.mustChangePassword || false);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    clearSession();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: 'var(--bg-page)' }}>
      <OwnerForcePasswordChangeModal 
        user={user} 
        onSuccess={() => setForcePasswordChange(false)} 
      />
      
      {/* Mobile Header - Gradient matching homepage */}
      <div
        className="md:hidden flex items-center justify-between p-3 shrink-0 sticky top-0 z-50 shadow-md"
        style={{ background: 'linear-gradient(135deg, #1A3A5C 0%, #2D7D9A 100%)' }}
      >
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-white p-1">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-1 font-bold text-white">
            <Building className="text-[#F5A623] w-5 h-5 hidden sm:block" />
            <span className="hidden sm:block">Smart<span style={{ color: '#F5A623' }}>PG</span></span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="text-xs font-medium text-white/80 max-w-[80px] truncate">
            {user?.name || 'Owner'}
          </div>
          <button onClick={handleLogout} className="text-xs bg-white/15 text-white border border-white/25 px-2 py-1.5 rounded-lg font-bold flex items-center gap-1">
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

      {/* Sidebar - Clean white with teal active items */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto shrink-0
        transform transition-transform motion-safe:duration-300 motion-safe:ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:sticky md:top-0 md:h-screen
      `} style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)' }}>
        {/* Sidebar Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ background: 'linear-gradient(135deg, #1A3A5C 0%, #2D7D9A 100%)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center border border-white/20">
              <Building className="text-[#F5A623] w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base">Smart<span style={{ color: '#F5A623' }}>PG</span> <span className="font-normal text-white/60 text-sm">Owner</span></span>
          </div>
          <button className="md:hidden text-white/70 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Nav section label */}
        <div className="px-4 pt-4 pb-2">
          <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">Menu</span>
        </div>
        <nav className="px-3 pb-8 space-y-0.5">
          {NAV_ITEMS.map((item: any) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const label = item.label || t(item.key as DictKey);
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold motion-safe:transition-all ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-secondary hover:bg-page hover:text-primary'
                }`}
                style={isActive ? { background: '#2D7D9A' } : {}}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-secondary'}`} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Desktop Header - gradient matching homepage */}
        <header
          className="hidden md:flex h-16 items-center px-6 justify-between shrink-0 sticky top-0 z-20 shadow-md"
          style={{ background: 'linear-gradient(135deg, #1A3A5C 0%, #2D7D9A 100%)' }}
        >
          <h2 className="text-base font-bold text-white capitalize tracking-wide">
            {pathname.split('/')[2]?.replace(/-/g, ' ') || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* Language Switcher */}
            <div className="flex items-center bg-white/10 border border-white/20 rounded-lg overflow-hidden text-xs font-bold">
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 transition-colors ${lang === 'en' ? 'bg-white/25 text-white' : 'text-white/60 hover:text-white'}`}
              >EN</button>
              <button 
                onClick={() => setLang('hi')}
                className={`px-3 py-1.5 transition-colors ${lang === 'hi' ? 'bg-white/25 text-white' : 'text-white/60 hover:text-white'}`}
              >हिं</button>
            </div>
            {/* Property Switcher */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5">
              <Building2 className="w-4 h-4 text-white/70 shrink-0" />
              <select 
                className="bg-transparent text-sm font-semibold text-white outline-none cursor-pointer w-full max-w-[130px] truncate"
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
              >
                <option value="all">All Properties</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{(p as any).name}</option>
                ))}
              </select>
            </div>
            <div className="text-xs text-white/70">
              👤 <strong className="text-white">{user?.name}</strong>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs font-bold bg-white/15 text-white border border-white/25 hover:bg-white/25 px-3 py-1.5 rounded-lg transition-all">
              <LogOut className="w-3.5 h-3.5" />
              {t('logout')}
            </button>
          </div>
        </header>
        
        <div className="flex-1 p-4 md:p-6 overflow-x-hidden" style={{ color: 'var(--text-primary)' }}>
          {children}
        </div>
      </main>
    </div>
  );
}

