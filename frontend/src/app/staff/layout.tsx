import { StaffLayout } from '@/app/staff/staff_components/StaffLayout';
import { StaffI18nProvider } from '@/app/staff/StaffI18n';

export const metadata = {
  title: 'Staff Portal | Smart PG',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StaffI18nProvider>
              <StaffLayout>{children}</StaffLayout>
          </StaffI18nProvider>
  );
}
