import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <div className="h-7 w-48 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-2"></div>
        <div className="h-4 w-72 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
      </div>

      <div className="space-y-6">
        {/* Block 1 */}
        <div className="bg-card border border rounded-[var(--radius-lg,12px)] overflow-hidden shadow-sm">
          <div className="bg-page border-b border p-4 flex items-center gap-2">
            <div className="h-5 w-5 bg-skeleton-base motion-safe:animate-pulse rounded-full"></div>
            <div className="h-5 w-40 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
          </div>
          <div className="p-6 space-y-4">
            <div className="h-20 w-full bg-skeleton-base motion-safe:animate-pulse rounded-[var(--radius-md,8px)]"></div>
            <div className="h-20 w-full bg-skeleton-base motion-safe:animate-pulse rounded-[var(--radius-md,8px)]"></div>
          </div>
        </div>

        {/* Block 2 */}
        <div className="bg-card border border rounded-[var(--radius-lg,12px)] overflow-hidden shadow-sm">
          <div className="bg-page border-b border p-4 flex items-center gap-2">
            <div className="h-5 w-5 bg-skeleton-base motion-safe:animate-pulse rounded-full"></div>
            <div className="h-5 w-40 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="h-16 w-full bg-skeleton-base motion-safe:animate-pulse rounded-[var(--radius-md,8px)]"></div>
            <div className="h-16 w-full bg-skeleton-base motion-safe:animate-pulse rounded-[var(--radius-md,8px)]"></div>
          </div>
        </div>

        {/* Save button area */}
        <div className="flex items-center justify-between pt-4 border-t border">
          <div className="h-4 w-64 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
          <div className="h-10 w-32 bg-skeleton-base motion-safe:animate-pulse rounded-[var(--radius-md,8px)]"></div>
        </div>
      </div>
    </div>
  );
}
