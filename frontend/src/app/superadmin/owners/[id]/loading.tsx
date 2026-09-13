import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* Header Skeleton */}
      <div className="flexitems-center gap-4 border-b border pb-4">
        <div className="w-10 h-10 rounded-[var(--radius-md,8px)] bg-skeleton-base motion-safe:animate-pulse"></div>
        <div>
          <div className="h-7 w-64 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-2"></div>
          <div className="h-4 w-48 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
        </div>
        <div className="ml-auto flex gap-3">
          <div className="w-16 h-6 rounded-full bg-skeleton-base motion-safe:animate-pulse"></div>
          <div className="w-24 h-6 rounded-full bg-skeleton-base motion-safe:animate-pulse"></div>
        </div>
      </div>

      {/* Alert Skeleton */}
      <div className="bg-card border border p-4 rounded-[var(--radius-lg,12px)] flexitems-start gap-3 h-[72px]">
        <div className="w-5 h-5 rounded-full bg-skeleton-base motion-safe:animate-pulse shrink-0"></div>
        <div className="w-full">
          <div className="h-4 w-1/3 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-2"></div>
          <div className="h-3 w-2/3 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col Skeletons */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-6 shadow-sm h-[200px]">
            <div className="w-32 h-5 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 w-full bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
              <div className="h-4 w-full bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
              <div className="h-4 w-full bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
            </div>
          </div>
          <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-6 shadow-sm h-[180px]">
            <div className="w-48 h-5 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-6"></div>
            <div className="space-y-3">
              <div className="h-10 w-full bg-skeleton-base motion-safe:animate-pulse rounded-[var(--radius-md,8px)]"></div>
              <div className="h-10 w-full bg-skeleton-base motion-safe:animate-pulse rounded-[var(--radius-md,8px)]"></div>
            </div>
          </div>
        </div>

        {/* Right Col Skeletons */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_,i) => (
              <div key={i} className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 h-[100px] flex flex-col justify-centeritems-center">
                <div className="h-3 w-20 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-4"></div>
                <div className="h-8 w-16 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
              </div>
            ))}
          </div>

          <div className="bg-card border border rounded-[var(--radius-lg,12px)] h-[250px]">
            <div className="border-b border p-4">
              <div className="h-5 w-32 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
            </div>
            <div className="p-4 space-y-4">
              {[...Array(3)].map((_,i) => (
                <div key={i} className="flex justify-betweenitems-center pb-4 border-b border">
                  <div>
                    <div className="h-4 w-32 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-2"></div>
                    <div className="h-3 w-48 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
                  </div>
                  <div className="h-6 w-24 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
