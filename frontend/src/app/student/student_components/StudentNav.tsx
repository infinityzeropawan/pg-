// RESPONSIBILITY: Renders the StudentNav component.
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, IndianRupee, Utensils, MessageSquareWarning, FileText, Bell, LogOut, User } from 'lucide-react';

import { clearSession } from '@/app/student/student_lib/student_auth/StudentSession';

const links = [
  { href: '/student/dashboard', label: 'Home', icon: Home },
  { href: '/student/rent', label: 'Rent', icon: IndianRupee },
  { href: '/student/mess', label: 'Mess', icon: Utensils },
  { href: '/student/complaints', label: 'Support', icon: MessageSquareWarning },
  { href: '/student/profile', label: 'Profile', icon: User },
];

export function StudentNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-card border-r border-border h-screen flex-col fixed left-0 top-0">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-black text-primary tracking-tight">ApnaPG</h2>
          <p className="text-xs text-secondary mt-1 tracking-wider">Student Portal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-md motion-safe:transition-all font-medium text-sm ${isActive ? 'bg-primary text-white shadow-md' : 'text-secondary hover:bg-input hover:text-primary'}`}>
                <Icon className="w-5 h-5" /> {link.label}
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t border-border space-y-2">
            <Link href="/student/notices" className="flex items-center gap-3 px-4 py-3 rounded text-secondary hover:bg-input hover:text-primary text-sm font-medium"><Bell className="w-5 h-5"/> Notices</Link>
            <Link href="/student/documents" className="flex items-center gap-3 px-4 py-3 rounded text-secondary hover:bg-input hover:text-primary text-sm font-medium"><FileText className="w-5 h-5"/> Documents</Link>
          </div>
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link href="/student/sos" className="block text-center w-full px-4 py-3 bg-danger text-white rounded font-bold shadow hover:bg-red-600 motion-safe:transition-colors">
            EMERGENCY SOS
          </Link>
          <button onClick={() => { clearSession(); window.location.href = '/student/login'; }} className="flex items-center gap-3 px-4 py-3 w-full text-left text-danger hover:bg-danger-bg rounded-md motion-safe:transition-colors font-medium text-sm">
            <LogOut className="w-5 h-5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 flex justify-around pb-safe">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link key={link.href} href={link.href} className={`flex flex-col items-center p-3 flex-1 ${isActive ? 'text-primary' : 'text-secondary hover:text-primary'}`}>
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
