'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Shield, Building2, UserCheck, Users, User, ArrowRight, 
  Sparkles, Key, ExternalLink, CheckCircle, MonitorPlay
} from 'lucide-react';

import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeFooter } from '@/components/home/HomeFooter';

export default function DemoPage() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const demoAccounts = [
    {
      role: 'SUPERADMIN',
      title: 'Superadmin Portal',
      subtitle: 'System Health, Subscription Plans, Owner Approvals & Feature Flags',
      icon: Shield,
      email: 'superadmin@smartpg.com',
      password: 'SuperAdmin@123',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-600',
      badge: 'Platform Governance',
      href: '/superadmin/dashboard',
      loginApiRole: 'SUPERADMIN',
    },
    {
      role: 'OWNER',
      title: 'PG Owner Portal',
      subtitle: 'Multi-property P&L, Occupancy Analytics, Rent Collection & Maintenance',
      icon: Building2,
      email: 'owner@smartpg.com',
      password: 'Owner@123',
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-600',
      badge: 'Full Business Suite',
      href: '/owner/dashboard',
      loginApiRole: 'OWNER',
    },
    {
      role: 'MANAGER',
      title: 'Branch Manager Portal',
      subtitle: 'Property Operations, Room Beds, Staff Attendance, Tenant Onboarding',
      icon: UserCheck,
      email: 'manager@smartpg.com',
      password: 'Manager@123',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-600',
      badge: 'Branch Operations',
      href: '/manager/dashboard',
      loginApiRole: 'MANAGER',
    },
    {
      role: 'STUDENT',
      title: 'Student Resident App',
      subtitle: 'Room Rent Dues, Mess Menu & Ordering, QR Gate Movements, SOS Alert',
      icon: User,
      email: 'student3@gmail.com',
      password: 'Student@123',
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-600',
      badge: 'Resident Mobile UI',
      href: '/student/dashboard',
      loginApiRole: 'STUDENT',
    },
    {
      role: 'PARENT',
      title: 'Parent Safety Portal',
      subtitle: 'Child Live Location Presence, Gate In/Out Logs, Fee Payment & Safety Feed',
      icon: Users,
      email: 'peter.m@example.com',
      password: 'Parent@123',
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-600',
      badge: 'Child Safety & Fees',
      href: '/parent/dashboard',
      loginApiRole: 'PARENT',
    },
  ];

  const handleQuickLogin = async (acc: typeof demoAccounts[0]) => {
    setLoadingRole(acc.role);
    try {
      const res = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: acc.email, password: acc.password, role: acc.loginApiRole }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', json.data.accessToken);
          localStorage.setItem('refresh_token', json.data.refreshToken);
          localStorage.setItem('spg_current_session', JSON.stringify(json.data.user));
        }
      }
    } catch (e) {
      console.warn('Backend login fallback to client session:', e);
      if (typeof window !== 'undefined') {
        localStorage.setItem('spg_current_session', JSON.stringify({
          id: `demo_${acc.role.toLowerCase()}`,
          role: acc.role,
          name: acc.title,
          email: acc.email,
        }));
      }
    } finally {
      router.push(acc.href);
    }
  };

  return (
    <div className="home-theme flex flex-col min-h-screen font-sans bg-[var(--bg-light)]">
      <HomeHeader />

      <main className="flex-grow pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Header Banner */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[var(--primary-teal)]/10 text-[var(--primary-teal)] border border-[var(--primary-teal)]/20 shadow-sm">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Live Interactive Production Demo Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--primary-navy)]">
              Experience <span className="text-[var(--primary-gold)]">Smart PG</span> In Action
            </h1>
            <p className="text-base md:text-lg text-[var(--text-dark)]/70">
              Select any role below to launch the live interactive dashboard pre-populated with real production database records. No sign-up required!
            </p>
          </div>

          {/* Role Demo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoAccounts.map((acc) => {
              const IconComp = acc.icon;
              const isLoading = loadingRole === acc.role;
              return (
                <div
                  key={acc.role}
                  className={`bg-white rounded-2xl border p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden bg-gradient-to-br ${acc.color}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-white/90 shadow-sm flex items-center justify-center border border-black/5 group-hover:scale-110 transition-transform">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/80 border border-black/10 shadow-xs">
                        {acc.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-[var(--primary-navy)] group-hover:text-[var(--primary-teal)] transition-colors">
                        {acc.title}
                      </h3>
                      <p className="text-xs text-[var(--text-dark)]/70 mt-1 line-clamp-2">
                        {acc.subtitle}
                      </p>
                    </div>

                    {/* Pre-filled credentials preview */}
                    <div className="p-3 rounded-xl bg-white/70 border border-black/5 text-xs space-y-1 font-mono">
                      <div className="flex items-center justify-between text-[11px] text-[var(--text-dark)]/60 font-sans font-semibold mb-1">
                        <span className="flex items-center gap-1">
                          <Key className="w-3 h-3 text-[var(--primary-teal)]" /> Demo Credentials
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold">Auto-login</span>
                      </div>
                      <div className="truncate"><span className="text-[var(--text-dark)]/40 font-sans">ID:</span> {acc.email}</div>
                      <div className="truncate"><span className="text-[var(--text-dark)]/40 font-sans">Pass:</span> {acc.password}</div>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-black/5 space-y-2">
                    <button
                      onClick={() => handleQuickLogin(acc)}
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-[var(--primary-navy)] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[var(--primary-teal)] transition-colors flex items-center justify-center gap-2 group/btn disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span>Launching Portal...</span>
                      ) : (
                        <>
                          <span>Launch {acc.role} Demo</span>
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    <Link
                      href={acc.href}
                      className="w-full py-2 text-center text-xs font-semibold text-[var(--primary-navy)]/70 hover:text-[var(--primary-navy)] flex items-center justify-center gap-1 hover:underline"
                    >
                      <span>Direct URL View</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Features Highlight */}
          <div className="p-8 rounded-2xl bg-white border border-black/5 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
              <div className="font-bold text-sm text-[var(--primary-navy)]">Real Database Connected</div>
              <p className="text-xs text-[var(--text-dark)]/60">Live queries hitting PostgreSQL via Prisma REST API</p>
            </div>
            <div className="space-y-1">
              <MonitorPlay className="w-6 h-6 text-[var(--primary-teal)] mx-auto" />
              <div className="font-bold text-sm text-[var(--primary-navy)]">Instant 1-Click Access</div>
              <p className="text-xs text-[var(--text-dark)]/60">Automated JWT auth session setup for all 5 roles</p>
            </div>
            <div className="space-y-1">
              <Sparkles className="w-6 h-6 text-amber-500 mx-auto" />
              <div className="font-bold text-sm text-[var(--primary-navy)]">Full E2E Features</div>
              <p className="text-xs text-[var(--text-dark)]/60">Room beds, rent dues, mess menu, SOS, and gate logs</p>
            </div>
          </div>

        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
