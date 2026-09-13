// RESPONSIBILITY: Renders the StaffSidebar component.
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Utensils, Shield, Sparkles, Wrench, ListTodo, LogOut } from 'lucide-react';

import { clearSession } from '@/app/staff/staff_lib/staff_auth/StaffSession';

const links = [
  { href: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/staff/cook', label: 'Kitchen', icon: Utensils, role: 'cook' },
  { href: '/staff/guard', label: 'Gate Security', icon: Shield, role: 'guard' },
  { href: '/staff/housekeeping', label: 'Housekeeping', icon: Sparkles, role: 'cleaner' },
  { href: '/staff/maintenance', label: 'Maintenance', icon: Wrench, role: 'maintenance' },
  { href: '/staff/tasks', label: 'General Tasks', icon: ListTodo }
];

export function StaffSidebar({ staffRole }: { staffRole: string | null }) {
  const pathname = usePathname();

  // Filter links: show general ones + the one matching their specific role
  const visibleLinks = links.filter(l => !l.role || l.role === staffRole || staffRole === 'admin');

  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-black text-primary tracking-tight">Staff Portal</h2>
        <p className="text-xs text-secondary mt-1 uppercase tracking-wider">{staffRole || 'Staff'}</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {visibleLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md motion-safe:transition-all font-medium text-sm ${
                isActive 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-secondary hover:bg-input hover:text-primary'
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={() => { clearSession(); window.location.href = '/staff/login'; }}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-danger hover:bg-danger-bg rounded-md motion-safe:transition-colors font-medium text-sm"
        >
          <LogOut className="w-5 h-5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
