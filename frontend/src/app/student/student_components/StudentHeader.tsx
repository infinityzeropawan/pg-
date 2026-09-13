// RESPONSIBILITY: Renders the StudentHeader component.
'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';

import { getSession } from '@/app/student/student_lib/student_auth/StudentSession';
import { useStudentI18n } from '@/app/student/StudentI18n';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function StudentHeader() {
  const session = typeof window !== 'undefined' ? getSession() : null;
  const { lang, setLang, t } = useStudentI18n();

  return (
    <header className="h-16 bg-page/80 backdrop-blur-md border-b border-border sticky top-0 z-20 flex items-center justify-between px-4 md:px-8">
      <div className="md:hidden">
        <h1 className="text-xl font-black text-primary tracking-tight">ApnaPG</h1>
      </div>
      <div className="hidden md:block">
        <h1 className="text-lg font-bold text-primary">{t('welcome')}, {session?.name?.split(' ')[0] || 'Student'}! 👋</h1>
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

        <Link href="/student/notices" className="relative p-2 text-secondary hover:bg-input rounded-full motion-safe:transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-bg-page"></span>
        </Link>
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-sm">
            {session?.name?.charAt(0) || 'T'}
          </div>
        </div>
      </div>
    </header>
  );
}
