import React from 'react';

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* KPI Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_,i) => (
          <div key={i} className="bg-card border border p-5 rounded-[var(--radius-lg,12px)] h-[120px] flex flex-col justify-between">
            <div className="flexitems-center gap-3">
              <div className="w-10 h-10 rounded-[var(--radius-md,8px)] bg-skeleton-base motion-safe:animate-pulse"></div>
              <div className="w-20 h-3 rounded-full bg-skeleton-base motion-safe:animate-pulse"></div>
            </div>
            <div className="w-16 h-8 rounded-md bg-skeleton-base motion-safe:animate-pulse mt-4"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Skeleton */}
        <div className="lg:col-span-2 bg-card border border rounded-[var(--radius-lg,12px)] h-[350px]">
          <div className="p-4 border-b border flex justify-betweenitems-center">
            <div className="w-48 h-5 rounded-md bg-skeleton-base motion-safe:animate-pulse"></div>
            <div className="w-16 h-4 rounded-md bg-skeleton-base motion-safe:animate-pulse"></div>
          </div>
          <div className="p-4 space-y-4 mt-2">
            {[...Array(4)].map((_,i) => (
              <div key={i} className="flex gap-4items-center border-b border pb-4">
                <div className="w-1/4 h-4 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
                <div className="w-1/4 h-4 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
                <div className="w-1/4 h-4 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
                <div className="w-16 h-5 bg-skeleton-base motion-safe:animate-pulse rounded-full ml-auto"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Skeleton */}
        <div className="lg:col-span-1 bg-card border border rounded-[var(--radius-lg,12px)] p-4 h-[350px] flex flex-col">
          <div className="w-32 h-5 rounded-md bg-skeleton-base motion-safe:animate-pulse mb-2"></div>
          <div className="w-48 h-3 rounded-md bg-skeleton-base motion-safe:animate-pulse mb-6"></div>
          <div className="flex-1 w-full bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
