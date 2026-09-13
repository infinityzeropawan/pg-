// DATA FLOW: [AI_TODO: Document data flow direction for useManagerUrlPagination.ts]
'use client';
/**
 * [DATA HOOK] useManagerUrlPagination
 * Handles pagination state via URL search parameters (Rule 41).
 * Replaces local useState to ensure shareable views and state persistence.
 */
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
export function useManagerUrlPagination(defaultPage = 1) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get('page')) || defaultPage;
  const setCurrentPage = useCallback(
    (page: number | ((prev: number) => number)) => {
      const newPage = typeof page === 'function' ? page(currentPage) : page;
      if (newPage === currentPage) return; // Prevent infinite re-render loop
      
      const params = new URLSearchParams(searchParams.toString());
      if (newPage > 1) {
        params.set('page', newPage.toString());
      } else {
        params.delete('page');
      }
      // router.replace to avoid clogging the browser history with pagination steps,
      // or push if we want back button to go to previous page. Rule doesn't specify, standard is push.
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    },
    [searchParams, pathname, router, currentPage]
  );
  return { currentPage, setCurrentPage };
}