import { StudentVisitorsMain } from '@/app/student/visitors/StudentVisitors_components/StudentVisitorsMain';

export const metadata = {
  title: 'Visitor Management | Student Portal',
  description: 'Manage visitor requests, history, and gate passes',
};

export default function StudentVisitorsPage() {
  return <StudentVisitorsMain />;
}
