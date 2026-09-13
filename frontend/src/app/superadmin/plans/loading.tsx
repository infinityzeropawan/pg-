import React from 'react';

export default function Loading() {
  return (
    <div className="space-y-6 pb-20">
      <div>
        <div className="h-7 w-48 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-2"></div>
        <div className="h-4 w-72 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={`fallback-${i}`} className="bg-card border border rounded-[var(--radius-lg,12px)] overflow-hidden shadow-sm h-[450px]">
            <div className="p-6 border-b border text-center flex flex-col items-center">
              <div className="h-6 w-24 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-4"></div>
              <div className="h-10 w-32 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-6"></div>
              <div className="h-10 w-full bg-skeleton-base motion-safe:animate-pulse rounded-[var(--radius-md,8px)]"></div>
            </div>
            <div className="p-6 space-y-6">
              <div className="h-4 w-full bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
              <div className="h-4 w-full bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
              <div className="h-4 w-full bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
