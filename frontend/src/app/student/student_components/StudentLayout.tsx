// RESPONSIBILITY: Renders the StudentLayout component.
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, IndianRupee, Utensils, MessageSquareWarning, FileText, Bell, LogOut, User, Menu, X, ShieldAlert, Bed, Users, CalendarOff, CheckSquare, MessageCircle, HistoryIcon, Settings, Star } from 'lucide-react';

import { getSession, clearSession } from '@/app/student/student_lib/student_auth/StudentSession';
import { StudentProvider, useStudentContext } from '@/app/student/student_components/StudentContext';
import { useStudentI18n } from '@/app/student/StudentI18n';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import '../student-theme.css';

import type { DictKey } from '@/app/student/StudentI18n';

const NAV_ITEMS = [
  { key: 'dashboard', href: '/student/dashboard', icon: Home },
  { key: 'profile', href: '/student/profile', icon: User },
  { key: 'room', href: '/student/room', icon: Bed },
  { key: 'payRent', href: '/student/rent', icon: IndianRupee },
  { key: 'documents', href: '/student/documents', icon: FileText },
  { key: 'complaints', href: '/student/complaints', icon: MessageSquareWarning },
  { key: 'mess', href: '/student/mess', icon: Utensils },
  { key: 'visitors', href: '/student/visitors', icon: Users },
  { key: 'leaves', href: '/student/leaves', icon: CalendarOff },
  { key: 'attendance', href: '/student/attendance', icon: CheckSquare },
  { key: 'communication', href: '/student/communication', icon: MessageCircle },
  { key: 'history', href: '/student/history', icon: HistoryIcon },
  { key: 'settings', href: '/student/settings', icon: Settings },
];

function StudentLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = typeof window !== 'undefined' ? getSession() : null;
  const { profile, loading } = useStudentContext();
  const { lang, setLang, t } = useStudentI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session || session.role !== 'student') {
      router.replace('/student/login');
    }
  }, [router]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    clearSession();
    router.push('/');
  };

  if (loading) return null;

  return (
    <div className="student-theme min-h-screen bg-page flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-header/90 backdrop-blur-md p-3 border-b border-border shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-primary p-1">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-1 font-bold text-primary">
            <ShieldAlert className="text-primary w-5 h-5 hidden sm:block" />
            <span className="hidden sm:block">Student Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="text-xs font-medium text-secondary max-w-[80px] truncate">
            {user?.name || 'Student'}
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
      <aside className={`w-64 bg-card border-r border-border flex-col sticky top-0 h-screen shrink-0 z-50 ${isMobileMenuOpen ? 'flex absolute left-0 shadow-2xl' : 'hidden md:flex'}`}>
        <div className="p-6 border-b border-border flex justify-between items-center bg-card">
          <div className="flex items-center gap-2 font-black text-xl text-primary">
            <ShieldAlert className="text-primary w-7 h-7" />
            <span>Student App</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-primary">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="mb-4 px-3">
            <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Menu</p>
          </div>
          
          {NAV_ITEMS.map((item: any) => {
            if (item.key === 'mess' && !(profile as any)?.hasMessFacility) return null;
            return (
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
              {t(item.key as DictKey)}
            </Link>
          )})}
          
          <div className="pt-4 mt-4 border-t border-border space-y-2">
            <Link href="/student/notices" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-md text-secondary hover:bg-input hover:text-primary text-sm font-medium">
              <Bell className="w-5 h-5"/> Notices
            </Link>
            <Link href="/student/feedback" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-md text-secondary hover:bg-input hover:text-primary text-sm font-medium">
              <Star className="w-5 h-5"/> Feedback
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex h-16 bg-header border-b border-border items-center px-6 justify-between shrink-0 sticky top-0 z-20 backdrop-blur-md bg-opacity-80">
          <h2 className="text-lg font-semibold text-primary capitalize">
            {pathname.split('/')[2]?.replace('-', ' ') || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
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
              Student: <strong className="text-primary">{user?.name}</strong>
            </div>
            <button onClick={handleLogout} className="text-sm bg-page border border-border px-4 py-2 rounded-md text-danger font-medium hover:bg-danger-bg hover:text-danger motion-safe:transition-all">
              {t('logout')}
            </button>
          </div>
        </header>
        
        <div className="flex-1 p-4 pb-24 md:p-6 md:pb-6 text-primary overflow-x-hidden w-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 motion-safe:transition-all motion-safe:duration-300">
        <div className="flex items-center justify-around p-2">
          {NAV_ITEMS.filter(item => !(item.key === 'mess' && !profile?.hasMessFacility)).slice(0, 5).map((item: any) => (
            <Link
              key={item.key}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 min-w-[64px] motion-safe:transition-colors rounded-xl ${
                pathname === item.href ? 'text-primary bg-primary-subtle' : 'text-secondary hover:bg-input'
              }`}
            >
              <item.icon className={`w-6 h-6 ${pathname === item.href ? 'drop-shadow-sm' : ''}`} />
              <span className="text-[10px] font-bold">{t(item.key as DictKey)}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Global Floating Emergency SOS */}
      <Link href="/student/sos" className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 w-14 h-14 bg-danger text-white rounded-full flex items-center justify-center shadow-lg shadow-danger/30 border-2 border-white hover:bg-danger-hover motion-safe:transition-transform hover:scale-105 active:scale-95 group">
        <ShieldAlert className="w-6 h-6 group-hover:animate-pulse" />
      </Link>
    </div>
  );
}

export function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudentProvider>
      <StudentLayoutInner>{children}</StudentLayoutInner>
    </StudentProvider>
  );
}

