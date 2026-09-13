import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <div className="h-8 w-64 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-2"></div>
        <div className="h-4 w-96 bg-skeleton-base motion-safe:animate-pulse rounded-md mt-1"></div>
      </div>

      <div className="space-y-8">
        {/* Section 1 Skeleton */}
        <div className="bg-card border border rounded-[var(--radius-lg,12px)] overflow-hidden shadow-sm h-[320px] sm:h-[250px]">
          <div className="bg-page border-b border p-4">
            <div className="h-5 w-48 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="h-3 w-24 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-2"></div>
              <div className="h-10 w-full bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
            </div>
            <div>
              <div className="h-3 w-24 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-2"></div>
              <div className="h-10 w-full bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
            </div>
            <div>
              <div className="h-3 w-24 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-2"></div>
              <div className="h-10 w-full bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
            </div>
            <div className="sm:col-span-2">
              <div className="h-3 w-24 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-2"></div>
              <div className="h-10 w-full bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>

        {/* Section 2 Skeleton */}
        <div className="bg-card border border rounded-[var(--radius-lg,12px)] overflow-hidden shadow-sm h-[250px] sm:h-[200px]">
          <div className="bg-page border-b border p-4">
            <div className="h-5 w-48 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <div className="h-3 w-32 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-2"></div>
              <div className="h-10 w-full bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
            </div>
            <div>
              <div className="h-3 w-32 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-2"></div>
              <div className="h-10 w-full bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
            </div>
            <div>
              <div className="h-3 w-32 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-2"></div>
              <div className="h-10 w-full bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
