import React from 'react';

export default function Loading() {
  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-betweenitems-start sm:items-center gap-4">
        <div>
          <div className="h-7 w-48 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-2"></div>
          <div className="h-4 w-64 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
        </div>
        <div className="h-9 w-32 bg-skeleton-base motion-safe:animate-pulse rounded-[var(--radius-md,8px)]"></div>
      </div>

      <div className="bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm">
        {/* Filters Skeleton */}
        <div className="p-4 border-b border flex gap-4items-center">
          <div className="flex gap-2 flex-wrap">
            <div className="h-8 w-16 bg-skeleton-base motion-safe:animate-pulse rounded-[var(--radius-full,999px)]"></div>
            <div className="h-8 w-20 bg-skeleton-base motion-safe:animate-pulse rounded-[var(--radius-full,999px)]"></div>
            <div className="h-8 w-24 bg-skeleton-base motion-safe:animate-pulse rounded-[var(--radius-full,999px)]"></div>
          </div>
          <div className="h-9 w-64 bg-skeleton-base motion-safe:animate-pulse rounded-[var(--radius-md,8px)] ml-auto"></div>
        </div>
        
        {/* Table Skeleton */}
        <div className="p-0">
          {[...Array(6)].map((_,i) => (
            <div key={i} className="flex border-b border p-4 gap-6items-center">
              <div className="flex flex-col gap-2 w-1/4">
                <div className="h-4 w-3/4 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
                <div className="h-3 w-1/2 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
              </div>
              <div className="w-1/6">
                <div className="h-4 w-16 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
              </div>
              <div className="flex flex-col gap-2 w-1/6items-center">
                <div className="h-4 w-12 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
                <div className="h-3 w-16 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
              </div>
              <div className="w-1/6 text-right">
                <div className="h-4 w-20 bg-skeleton-base motion-safe:animate-pulse rounded-md ml-auto"></div>
              </div>
              <div className="w-1/6 flex justify-center">
                <div className="h-6 w-20 bg-skeleton-base motion-safe:animate-pulse rounded-[var(--radius-full,999px)]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
