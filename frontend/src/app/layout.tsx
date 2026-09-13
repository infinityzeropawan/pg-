import type { Metadata } from 'next';

import '@/app/globals.css';
import { Providers } from '@/app/providers';

export const metadata: Metadata = {
  title: 'SmartPG — Hostel Operating System',
  description: 'A complete multi-student hostel management SaaS platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="font-sans antialiased min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
