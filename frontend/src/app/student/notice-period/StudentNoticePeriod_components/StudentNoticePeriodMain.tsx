// RESPONSIBILITY: Renders the StudentNoticePeriodMain component.
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarClock } from 'lucide-react';

import { useStudentContext } from '@/app/student/student_components/StudentContext';
import { getSession } from '@/app/student/student_lib/student_auth/StudentSession';
import { authApi as api } from '@/app/student/student_lib/student_api/StudentAuth';
import { createId } from '@/lib/utils/id';
import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';

export function StudentNoticePeriodMain() {
  const router = useRouter();
  const { profile } = useStudentContext();
  const session = typeof window !== 'undefined' ? getSession() : null;
  const [formData, setFormData] = useState({ date: '', reason: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !session) return;
    
    // Create notice record manually since it's a small standalone feature
    db.insert('spg_notices', {
      id: createId('not'),
      propertyId: (profile as any).propertyId,
      studentId: (profile as any).id,
      moveOutDate: (formData as any).date,
      reason: (formData as any).reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: session.id,
      updatedBy: session.id,
      isDeleted: false
    });
    
    alert('Move-out notice submitted successfully. Manager has been notified.');
    router.push('/student/dashboard');
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-[24px] font-bold text-primary">Notice Period</h1>
        <p className="text-sm text-secondary">Submit your 30-day move-out notice.</p>
      </div>

      <div className="bg-warning-bg border border-warning rounded-lg p-4 flex gap-3 text-warning text-sm">
        <CalendarClock className="w-5 h-5 shrink-0" />
        <p>As per your agreement, you must serve a minimum of 30 days notice period before vacating to get your security deposit back.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">Expected Move-out Date</label>
          <input required type="date" value={(formData as any).date} onChange={e=>setFormData({...(formData as any), date: e.target.value})} className="w-full bg-input border border-border px-4 py-2 rounded text-sm focus:outline-none focus:border-primary text-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1">Reason for leaving</label>
          <textarea required rows={4} value={(formData as any).reason} onChange={e=>setFormData({...(formData as any), reason: e.target.value})} placeholder="Please tell us why you are leaving..." className="w-full bg-input border border-border px-4 py-2 rounded text-sm focus:outline-none focus:border-primary text-primary resize-none" />
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 bg-input text-primary rounded font-medium text-sm">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-primary text-white rounded font-bold text-sm shadow-sm hover:bg-primary-hover">Submit Notice</button>
        </div>
      </form>
    </div>
  );
}
