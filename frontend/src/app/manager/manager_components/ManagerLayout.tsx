// RESPONSIBILITY: Renders the ManagerLayout component.
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, ShieldAlert, Building2, LogOut
} from 'lucide-react';

import { MENU_ITEMS } from '@/app/manager/manager_components/ManagerLayout_constants';

import { clearSession } from '@/app/manager/manager_lib/manager_auth/ManagerSession';
import { useManagerSession } from '@/app/manager/manager_components/manager_hooks/useManagerSession';
import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';
import { useManagerI18n } from '@/app/manager/ManagerI18n';
import { ManagerForcePasswordChangeModal } from '@/app/manager/manager_components/ManagerForcePasswordChangeModal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

import type { DictKey } from '@/app/manager/ManagerI18n';
import '../manager-theme.css';

type MenuItem = { key: string; icon: React.ElementType; href: string; label?: string };
export function ManagerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useManagerSession();
  const { properties, selectedPropertyId, setSelectedPropertyId } = useManagerPropertyContext();
  const { lang, setLang, t } = useManagerI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  console.log('ManagerLayout render ' + JSON.stringify({ selectedPropertyId, propCount: properties.length }));
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    if(typeof window !== 'undefined'){ 
      clearSession(); 
      window.location.href='/'; 
    }
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: 'var(--bg-page)' }}>
      <ManagerForcePasswordChangeModal 
        user={user} 
        onSuccess={() => { /* handled internally */ }} 
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
            <ShieldAlert className="text-[#F5A623] w-5 h-5 hidden sm:block" />
            <span className="hidden sm:block">Smart<span style={{ color: '#F5A623' }}>PG</span> <span className="font-normal text-white/60">Manager</span></span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="text-xs font-medium text-white/80 max-w-[80px] truncate">
            {user?.name || 'Manager'}
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
      {/* Sidebar - Dark Navy with Gold Active Items */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto shrink-0
          transform transition-transform motion-safe:duration-300 motion-safe:ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:sticky md:top-0 md:h-screen
        `}
        style={{ background: '#1A3A5C', borderRight: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Sidebar Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center border border-white/20">
              <ShieldAlert className="text-[#F5A623] w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base">Smart<span style={{ color: '#F5A623' }}>PG</span> <span className="font-normal text-white/60 text-sm">Manager</span></span>
          </div>
          <button className="md:hidden text-white/70 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Nav section label */}
        <div className="px-4 pt-4 pb-2">
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>Navigation</span>
        </div>
        <nav className="px-3 pb-8 space-y-0.5">
          {MENU_ITEMS.map((item: MenuItem) => {
            const label = item.label || t(item.key as DictKey);
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.key} href={item.href} onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold motion-safe:transition-all ${
                  isActive
                    ? 'text-[#1A3A5C] shadow-lg'
                    : 'text-white/65 hover:text-white hover:bg-white/10'
                }`}
                style={isActive ? { background: '#F5A623' } : {}}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-[#1A3A5C]' : 'text-white/50'}`} />
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
                {properties.map(p => (
                  <option key={(p as { id: string }).id} value={(p as { id: string }).id}>{(p as { id: string; name: string }).name}</option>
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