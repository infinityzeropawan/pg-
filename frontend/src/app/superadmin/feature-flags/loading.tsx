import React from 'react';

export default function Loading() {
  const mockFeatures = 4;
  const mockRows = 5;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <div className="h-7 w-48 bg-skeleton-base motion-safe:animate-pulse rounded-md mb-2"></div>
        <div className="h-4 w-72 bg-skeleton-base motion-safe:animate-pulse rounded-md"></div>
      </div>

      <div className="bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm overflow-hidden">
        {/* Toolbar Skeleton */}
        <div className="p-4 border-b border flex justify-betweenitems-center bg-page">
          <div className="h-9 w-full sm:w-72 bg-skeleton-base motion-safe:animate-pulse rounded-[var(--radius-md,8px)]"></div>
          <div className="h-9 w-32 bg-skeleton-base motion-safe:animate-pulse rounded-[var(--radius-md,8px)]"></div>
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-card border-b border">
              <tr>
                <th className="px-6 py-4 sticky left-0 bg-card shadow-[1px_0_0_0_var(--border)] z-10">
                  <div className="h-4 w-16 bg-skeleton-base motion-safe:animate-pulse rounded"></div>
                </th>
                <th className="px-6 py-4">
                  <div className="h-4 w-12 bg-skeleton-base motion-safe:animate-pulse rounded mx-auto"></div>
                </th>
                {Array.from({ length: mockFeatures }).map((_: any,i: number) => (
                  <th key={i} className="px-6 py-4 border-l border">
                    <div className="h-4 w-20 bg-skeleton-base motion-safe:animate-pulse rounded mx-auto"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {Array.from({ length: mockRows }).map((_, rIdx) => (
                <tr key={rIdx}>
                  <td className="px-6 py-4 sticky left-0 bg-card shadow-[1px_0_0_0_var(--border)] z-10">
                    <div className="h-4 w-32 bg-skeleton-base motion-safe:animate-pulse rounded mb-2"></div>
                    <div className="h-3 w-20 bg-skeleton-base motion-safe:animate-pulse rounded"></div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="h-6 w-16 bg-skeleton-base motion-safe:animate-pulse rounded mx-auto"></div>
                  </td>
                  {Array.from({ length: mockFeatures }).map((_, fIdx) => (
                    <td key={fIdx} className="px-6 py-4 text-center border-l border">
                      <div className="h-4 w-4 bg-skeleton-base motion-safe:animate-pulse rounded mx-auto"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
