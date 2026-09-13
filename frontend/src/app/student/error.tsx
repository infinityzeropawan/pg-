'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

import { STUDENT_ROUTES } from '@/app/student/student_url_config';

export default function StudentError({
  StudentError,
  reset,
}: {
  StudentError: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(StudentError);
  }, [StudentError]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center space-y-4">
      <div className="w-16 h-16 bg-danger-bg text-danger rounded-[var(--radius-full)] flex items-center justify-center mb-2">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-primary">Something went wrong</h2>
      <p className="text-sm text-secondary max-w-md">
        An unexpected StudentError occurred in the student module. We've been notified and are looking into it.
      </p>
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => reset()}
          className="bg-primary text-white px-6 py-2 rounded-[var(--radius-md)] font-medium hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
        <a
          href={STUDENT_ROUTES.DASHBOARD}
          className="bg-card border border-border text-primary px-6 py-2 rounded-[var(--radius-md)] font-medium hover:bg-page motion-safe:transition-colors"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}
