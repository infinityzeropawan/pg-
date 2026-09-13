'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

import { STAFF_ROUTES } from '@/app/staff/staff_url_config';

export default function StaffError({
  StaffError,
  reset,
}: {
  StaffError: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the StaffError to an StaffError reporting service
    console.error(StaffError);
  }, [StaffError]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center space-y-4">
      <div className="w-16 h-16 bg-danger-bg text-danger rounded-[var(--radius-full)] flex items-center justify-center mb-2">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-primary">Something went wrong</h2>
      <p className="text-sm text-secondary max-w-md">
        An unexpected StaffError occurred in the staff module. We've been notified and are looking into it.
      </p>
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => reset()}
          className="bg-primary text-white px-6 py-2 rounded-[var(--radius-md)] font-medium hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
        <a
          href={STAFF_ROUTES.DASHBOARD}
          className="bg-card border border text-primary px-6 py-2 rounded-[var(--radius-md)] font-medium hover:bg-page motion-safe:transition-colors"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}
