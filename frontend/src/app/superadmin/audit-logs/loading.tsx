import React from 'react';

export default function Loading() {
  return (
    <div className="space-y-6 pb-20">
      <div>
        <div className="h-7 w-48 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-2"></div>
        <div className="h-4 w-72 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
      </div>

      <div className="bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm">
        {/* Filters Skeleton */}
        <div className="p-4 border-b border flex flex-col sm:flex-row gap-4 justify-between items-center bg-card rounded-t-[var(--radius-lg,12px)]">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={`fallback-${i}`} className="h-8 w-16 bg-skeleton-base motion-safe:animate-pulse rounded-[var(--radius-full,999px)]"></div>
            ))}
          </div>
          <div className="w-full sm:w-72 h-9 bg-skeleton-base motion-safe:animate-pulse rounded-[var(--radius-md,8px)]"></div>
        </div>

        {/* Timeline Skeleton */}
        <div className="overflow-x-auto p-4 sm:p-6">
          <div className="relative border-l border ml-3 space-y-8 pb-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={`fallback-${i}`} className="relative pl-8">
                <span className="absolute -left-[17px] top-1 bg-card border-[3px] border-skeleton-base w-[32px] h-[32px] rounded-full motion-safe:animate-pulse"></span>
                <div className="bg-page border border rounded-[var(--radius-md,8px)] p-4 h-24 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="h-4 w-32 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
                    <div className="h-3 w-24 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
                  </div>
                  <div className="h-3 w-3/4 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
                  <div className="h-2 w-48 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
