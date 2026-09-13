'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

import { useDebounce } from '@/lib/hooks/useDebounce';

/**
 * useTableSync
 * Custom hook for React.
 */
export function useTableSync(defaultPage = 1, defaultSearch = '') {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(() => Number(searchParams.get('page')) || defaultPage);
  const [search, setSearch] = useState(() => searchParams.get('q') || defaultSearch);
  const debouncedSearch = useDebounce(search, 300);

  // Sync state to URL when state changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let changed = false;

    if (page !== (Number(searchParams.get('page')) || 1)) {
      if (page === 1) params.delete('page');
      else params.set('page', page.toString());
      changed = true;
    }

    if (debouncedSearch !== (searchParams.get('q') || '')) {
      if (!debouncedSearch) params.delete('q');
      else params.set('q', debouncedSearch);
      
      // If search changes, reset page to 1
      if (debouncedSearch !== (searchParams.get('q') || '')) {
        params.delete('page');
        setPage(1);
      }
      changed = true;
    }

    if (changed) {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [page, debouncedSearch, pathname, router, searchParams]);

  return { page, setPage, search, setSearch, debouncedSearch };
}
