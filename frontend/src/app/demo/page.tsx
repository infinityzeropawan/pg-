'use client';

// RESPONSIBILITY: Public demo landing page displaying available demo accounts and portal access.

import Link from 'next/link';
import { ArrowRight, Building2, UserCheck, Users, User, Utensils, ShieldCheck, Sparkles, Lock, CheckCircle2 } from 'lucide-react';

import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeFooter } from '@/components/home/HomeFooter';

const DEMO_PORTALS = [
  {
    title: 'PG Owner Portal',
    subtitle: 'Multi-property P&L, occupancy analytics, rent collection & staff payroll.',
    role: 'Owner',
    email: 'demo.owner@smartpg.com',
    password: 'Demo@123',
    icon: Building2,
    loginHref: '/owner/login?demo=1&email=demo.owner@smartpg.com',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  {
    title: 'Branch Manager Portal',
    subtitle: 'Property operations, rooms & beds, staff attendance, tenant onboarding.',
    role: 'Manager',
    email: 'demo.manager@smartpg.com',
    password: 'Demo@123',
    icon: UserCheck,
    loginHref: '/manager/login?demo=1&email=demo.manager@smartpg.com',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
  {
    title: 'Student Resident App',
    subtitle: 'Rent & dues, mess menu, gate pass, complaints & emergency SOS alerts.',
    role: 'Student',
    email: 'demo.student@smartpg.com',
    password: 'Demo@123',
    icon: User,
    loginHref: '/student/login?demo=1&email=demo.student@smartpg.com',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  },
  {
    title: 'Parent Safety Portal',
    subtitle: "Child presence monitoring, gate entry/exit logs & fee receipt feed.",
    role: 'Parent',
    email: 'demo.parent@smartpg.com',
    password: 'Demo@123',
    icon: Users,
    loginHref: '/parent/login?demo=1&email=demo.parent@smartpg.com',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  },
  {
    title: 'Staff & Cook Portal',
    subtitle: 'Daily meal tracking, inventory management & assigned operational tasks.',
    role: 'Staff / Cook',
    email: 'demo.cook@smartpg.com',
    password: 'Demo@123',
    icon: Utensils,
    loginHref: '/staff/login?demo=1&email=demo.cook@smartpg.com',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
];

const HIGHLIGHTS = [
  {
    title: 'Read-Only Demo Mode',
    description: 'Explore full UI & analytics safely. Database mutations are blocked by backend middleware.',
    icon: Lock,
  },
  {
    title: 'Pre-loaded Sample Data',
    description: 'Seeded with sample PG properties, rooms, tenants, invoices, gate logs, and complaints.',
    icon: CheckCircle2,
  },
  {
    title: 'Isolated & Secure',
    description: 'Demo data is isolated from real customer accounts and database records.',
    icon: ShieldCheck,
  },
];

export default function DemoPage() {
  return (
    <div className="home-theme flex flex-col min-h-screen font-sans bg-[var(--bg-light)]">
      <HomeHeader />

      <main className="flex-1 px-4 sm:px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Demo Portals
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--primary-navy)]">
              Explore SmartPG Dashboards
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-medium)]">
              Select any role below to experience SmartPG. Demo accounts log in with pre-filled credentials in read-only mode so you can preview every feature safely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMO_PORTALS.map((portal) => {
              const Icon = portal.icon;
              return (
                <div
                  key={portal.title}
                  className="rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--primary-teal)]/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[var(--primary-teal)]" />
                      </div>
                      <span className={`px-2.5 py-1 rounded-md border text-[11px] font-bold ${portal.badgeColor}`}>
                        {portal.role}
                      </span>
                    </div>
                    <h2 className="text-lg font-black text-[var(--primary-navy)]">{portal.title}</h2>
                    <p className="text-xs text-[var(--text-dark)]/70 mt-1 mb-4">{portal.subtitle}</p>

                    <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 text-xs space-y-1 font-mono">
                      <div className="text-[11px] font-sans font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Demo Credentials:
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span className="text-gray-500 font-sans">Email:</span>
                        <span className="font-semibold text-gray-900">{portal.email}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span className="text-gray-500 font-sans">Password:</span>
                        <span className="font-semibold text-gray-900">{portal.password}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={portal.loginHref}
                    className="mt-5 w-full py-2.5 px-4 rounded-xl bg-[var(--primary-navy)] hover:bg-[var(--primary-teal)] text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    Try Demo as {portal.role}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="p-8 rounded-2xl bg-white border border-black/5 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {HIGHLIGHTS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-sm text-[var(--primary-navy)]">{item.title}</div>
                  <p className="text-xs text-[var(--text-dark)]/60 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center space-y-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary-navy)] text-white font-bold text-sm shadow-md hover:bg-[var(--primary-teal)] transition-colors"
            >
              Real Account Sign In
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-[var(--text-dark)]/50">
              Are you an authorized PG owner or resident? Use the real login portal.
            </p>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
