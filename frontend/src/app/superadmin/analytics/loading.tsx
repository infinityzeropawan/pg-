import React from 'react';

export default function Loading() {
  return (
    <div className="space-y-6 pb-20">
      <div>
        <div className="h-7 w-48 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-2"></div>
        <div className="h-4 w-72 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
      </div>

      {/* KPIs Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={`fallback-${i}`} className="bg-card border border p-5 rounded-[var(--radius-lg,12px)] shadow-sm h-32">
            <div className="flex justify-between items-start mb-4">
              <div className="h-9 w-9 bg-skeleton-base motion-safe:animate-pulse rounded-[var(--radius-md,8px)]"></div>
              <div className="h-5 w-16 bg-skeleton-base motion-safe:animate-pulse rounded-full"></div>
            </div>
            <div className="h-8 w-24 bg-skeleton-base motion-safe:animate-pulse rounded-md mt-2"></div>
            <div className="h-3 w-16 bg-skeleton-base motion-safe:animate-pulse rounded-md mt-2"></div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm p-5 h-[400px]">
          <div className="h-5 w-40 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-2"></div>
          <div className="h-3 w-48 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-6"></div>
          <div className="w-full h-72 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
        </div>
        <div className="bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm p-5 h-[400px]">
          <div className="h-5 w-32 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-2"></div>
          <div className="h-3 w-40 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-6"></div>
          <div className="w-full h-72 bg-skeleton-base motion-safe:animate-pulse rounded-full max-w-[280px] mx-auto"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm h-[300px]">
        <div className="p-4 border-b border bg-card">
          <div className="h-5 w-64 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
        </div>
        <div className="p-6 space-y-4">
          <div className="h-10 w-full bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
          <div className="h-10 w-full bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
          <div className="h-10 w-full bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
