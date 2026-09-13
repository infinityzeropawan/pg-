'use client';
import { SuperAdminRequireSuperAdmin } from '@/app/superadmin/SuperAdmin_components/SuperAdminRequireSuperAdmin';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, UserPlus, Users, Package, BarChart3, ToggleLeft, Ticket, History, Settings, Menu, X, ShieldAlert, LogOut } from 'lucide-react';
import { getSession, clearSession } from '@/app/superadmin/superadmin_lib/superadmin_auth/SuperadminSession';
import { SuperadminI18nProvider, useSuperadminI18n } from '@/app/superadmin/SuperadminI18n';
import type { DictKey } from '@/app/superadmin/SuperadminI18n';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

function SuperAdminLayoutInner({ children, adminName, isMobileMenuOpen, setIsMobileMenuOpen, navItems, handleLogout, pathname }: any) {
  const { lang, setLang, t } = useSuperadminI18n();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/first-login');
  if (isAuthPage) return <>{children}</>;

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg-page)' }}>
      
      {/* ── FIXED TOP HEADER ── Premium Gradient Matching Homepage Hero */}
      <header
        className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-4 md:px-6 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #1A3A5C 0%, #2D7D9A 100%)' }}
      >
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:bg-white/10 p-2 rounded-lg motion-safe:transition-colors md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
              <ShieldAlert className="w-5 h-5 text-[#F5A623]" />
            </div>
            <span className="hidden sm:inline font-bold text-lg text-white tracking-tight">
              Smart<span style={{ color: '#F5A623' }}>PG</span>
              <span className="text-white/60 text-sm font-normal ml-1">Admin</span>
            </span>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="hidden sm:flex items-center bg-white/10 border border-white/20 rounded-lg overflow-hidden text-xs font-bold">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 motion-safe:transition-colors ${lang === 'en' ? 'bg-white/25 text-white' : 'text-white/60 hover:text-white'}`}
            >EN</button>
            <button
              onClick={() => setLang('hi')}
              className={`px-3 py-1.5 motion-safe:transition-colors ${lang === 'hi' ? 'bg-white/25 text-white' : 'text-white/60 hover:text-white'}`}
            >हिं</button>
          </div>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg motion-safe:transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Admin Name */}
          <div className="hidden sm:block text-xs text-white/70">
            👤 <strong className="text-white">{adminName}</strong>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold bg-white/15 text-white border border-white/25 hover:bg-white/25 px-3 py-1.5 rounded-lg motion-safe:transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('logout')}</span>
          </button>
        </div>
      </header>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── FIXED SIDEBAR ── Dark Navy with Gold Active Items */}
      <aside
        className={`
          fixed top-16 bottom-0 left-0 z-40 w-60 overflow-y-auto
          transform transition-transform motion-safe:duration-300 motion-safe:ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
        style={{ background: '#1A3A5C', borderRight: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Sidebar inner top label */}
        <div className="px-4 pt-5 pb-3">
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Navigation
          </span>
        </div>
        <nav className="px-3 pb-8 space-y-0.5">
          {navItems.map((item: unknown) => {
            const isActive = pathname === (item as any).href || pathname.startsWith((item as any).href + '/');
            return (
              <Link
                key={(item as any).href}
                href={(item as any).href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold motion-safe:transition-all ${
                  isActive
                    ? 'text-[#1A3A5C] shadow-lg'
                    : 'text-white/65 hover:text-white hover:bg-white/10'
                }`}
                style={isActive ? { background: '#F5A623' } : {}}
              >
                {(() => {
                  const Icon = (item as any).icon;
                  return <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1A3A5C]' : 'text-white/50'}`} />;
                })()}
                <span className="truncate">{(item as any).key ? t((item as any).key as DictKey) : (item as any).name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="md:ml-60 pt-16 min-h-screen flex flex-col">
        <div className="flex-1 p-4 md:p-6 overflow-x-hidden" style={{ color: 'var(--text-primary)' }}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const session = getSession();
    if(session) setAdminName(session.name);
  }, []);

  const navItems = [
    { key: 'dashboard', href: '/superadmin/dashboard', icon: LayoutDashboard },
    { key: 'ownerRequests', href: '/superadmin/owner-requests', icon: FileText },
    { name: 'Create Owner', href: '/superadmin/create-owner', icon: UserPlus }, // missing in dict
    { key: 'owners', href: '/superadmin/owners', icon: Users },
    { name: 'Plans', href: '/superadmin/plans', icon: Package }, // missing in dict
    { name: 'Analytics', href: '/superadmin/analytics', icon: BarChart3 }, // missing
    { name: 'Feature Flags', href: '/superadmin/feature-flags', icon: ToggleLeft }, // missing
    { key: 'tickets', href: '/superadmin/tickets', icon: Ticket },
    { name: 'Audit Logs', href: '/superadmin/audit-logs', icon: History }, // missing
    { key: 'settings', href: '/superadmin/settings', icon: Settings },
  ];

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      clearSession();
      window.location.href = '/';
    }
  };

  return (
    <SuperAdminRequireSuperAdmin>
      <SuperadminI18nProvider>
          <SuperAdminLayoutInner 
            adminName={adminName} 
            isMobileMenuOpen={isMobileMenuOpen} 
            setIsMobileMenuOpen={setIsMobileMenuOpen} 
            navItems={navItems} 
            handleLogout={handleLogout} 
            pathname={pathname} 
          >
            {children}
          </SuperAdminLayoutInner>
      </SuperadminI18nProvider>
    </SuperAdminRequireSuperAdmin>
  );
}

