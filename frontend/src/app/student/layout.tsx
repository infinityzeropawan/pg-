import { StudentLayout } from '@/app/student/student_components/StudentLayout';
import { StudentI18nProvider } from '@/app/student/StudentI18n';

export const metadata = {
  title: 'Student Portal | ApnaPG',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StudentI18nProvider>
              <StudentLayout>{children}</StudentLayout>
          </StudentI18nProvider>
  );
}
