'use client';

// RESPONSIBILITY: Public demo/preview landing page.
//
// SECURITY NOTE: This page deliberately does NOT contain credentials and does NOT
// perform any authentication. An earlier version shipped working seed credentials
// (e.g. student3@gmail.com) in the client bundle and, when the backend was unreachable,
// fabricated a session in localStorage with an OWNER role — fully bypassing the
// client-side route guards. Both behaviours are removed.

import Link from 'next/link';
import { ArrowRight, Building2, ShieldCheck, UserCheck, Users, User, Sparkles } from 'lucide-react';

import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeFooter } from '@/components/home/HomeFooter';

const PORTALS = [
  {
    title: 'PG Owner Portal',
    subtitle: 'Multi-property P&L, occupancy analytics, rent collection & maintenance.',
    icon: Building2,
    loginHref: '/owner/login',
  },
  {
    title: 'Branch Manager Portal',
    subtitle: 'Property operations, rooms & beds, staff attendance, tenant onboarding.',
    icon: UserCheck,
    loginHref: '/manager/login',
  },
  {
    title: 'Student Resident App',
    subtitle: 'Rent & dues, mess menu & ordering, QR gate movements, SOS alerts.',
    icon: User,
    loginHref: '/student/login',
  },
  {
    title: 'Parent Safety Portal',
    subtitle: "Child presence, gate in/out logs, fee payment & safety feed.",
    icon: Users,
    loginHref: '/parent/login',
  },
];

const HIGHLIGHTS = [
  {
    title: 'Real production schema',
    description: 'Every dashboard reads from PostgreSQL through the Prisma REST API.',
    icon: ShieldCheck,
  },
  {
    title: 'Guided walkthrough',
    description: 'Our team will walk you through the workflows relevant to your property.',
    icon: Sparkles,
  },
  {
    title: 'Request credentials',
    description: 'We issue sandbox accounts on request — credentials are never published here.',
    icon: ArrowRight,
  },
];

export default function DemoPage() {
  return (
    <div className="home-theme flex flex-col min-h-screen font-sans bg-[var(--bg-light)]">
      <HomeHeader />

      <main className="flex-1 px-4 sm:px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--primary-navy)]">
              Explore SmartPG
            </h1>
            <p className="text-[var(--text-medium)] mt-3">
              Pick a portal to reach its secure sign-in. Sandbox demo accounts are issued on
              request — we do not publish login credentials on this page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PORTALS.map(portal => {
              const Icon = portal.icon;
              return (
                <Link
                  key={portal.title}
                  href={portal.loginHref}
                  className="group rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col justify-between min-h-[220px]"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[var(--primary-teal)]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-[var(--primary-teal)]" />
                    </div>
                    <h2 className="text-lg font-black text-[var(--primary-navy)]">{portal.title}</h2>
                    <p className="text-xs text-[var(--text-dark)]/70 mt-1">{portal.subtitle}</p>
                  </div>
                  <span className="mt-6 pt-4 border-t border-black/5 text-xs font-bold text-[var(--primary-teal)] inline-flex items-center gap-1">
                    Go to sign-in
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="p-8 rounded-2xl bg-white border border-black/5 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 text-center max-w-4xl mx-auto">
            {HIGHLIGHTS.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="space-y-1">
                  <Icon className="w-6 h-6 text-emerald-600 mx-auto" />
                  <div className="font-bold text-sm text-[var(--primary-navy)]">{item.title}</div>
                  <p className="text-xs text-[var(--text-dark)]/60">{item.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary-navy)] text-white font-bold text-sm shadow-md hover:bg-[var(--primary-teal)] transition-colors"
            >
              Open the unified role login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
