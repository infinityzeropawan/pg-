// RESPONSIBILITY: Renders the StudentNoticePeriodMain component.
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarClock } from 'lucide-react';

import { toast } from 'sonner';

import { useStudentContext } from '@/app/student/student_components/StudentContext';
import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';

export function StudentNoticePeriodMain() {
  const router = useRouter();
  const { profile, refetch } = useStudentContext();
  const [formData, setFormData] = useState({ date: '', reason: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    
    try {
      await studentOperationsApi.submitNoticePeriod(formData.date, formData.reason);
      await refetch();
      toast.success('Move-out notice submitted successfully.');
      router.push('/student/dashboard');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit notice period');
    } finally {
      setLoading(false);
    }
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
          <input required type="date" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} className="w-full bg-input border border-border px-4 py-2 rounded text-sm focus:outline-none focus:border-primary text-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1">Reason for leaving</label>
          <textarea required rows={4} value={formData.reason} onChange={e=>setFormData({...formData, reason: e.target.value})} placeholder="Please tell us why you are leaving..." className="w-full bg-input border border-border px-4 py-2 rounded text-sm focus:outline-none focus:border-primary text-primary resize-none" />
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 bg-input text-primary rounded font-medium text-sm">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded font-bold text-sm shadow-sm hover:bg-primary-hover disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit Notice'}
          </button>
        </div>
      </form>
    </div>
  );
}
