// RESPONSIBILITY: Renders the providers component.
'use client';

import { useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';

import { runSeed } from '@/lib/storage/seed';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  useEffect(() => {
    // Only run seed logic on client mount
    runSeed();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <NextTopLoader color="var(--primary)" showSpinner={false} />
        {children}
        <Toaster position="bottom-right" richColors theme="dark" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
