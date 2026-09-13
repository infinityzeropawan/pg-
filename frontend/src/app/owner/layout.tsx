// RESPONSIBILITY: Renders the OwnerLayout component. Receives data via props/hooks.

import { OwnerRequireOwner } from '@/app/owner/owner_components/OwnerRequireOwner';
import { OwnerPropertyProvider } from '@/app/owner/owner_components/OwnerPropertyContext';
import { OwnerLayout } from '@/app/owner/owner_components/OwnerLayout';
import { OwnerI18nProvider } from '@/app/owner/OwnerI18n';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Owner Portal | SmartPG',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <OwnerRequireOwner>
      <OwnerI18nProvider>
                  <OwnerPropertyProvider>
            <OwnerLayout>
              {children}
            </OwnerLayout>
          </OwnerPropertyProvider>
              </OwnerI18nProvider>
    </OwnerRequireOwner>
  );
}
