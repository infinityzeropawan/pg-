import { StudentHistoryMain } from '@/app/student/history/StudentHistory_components/StudentHistoryMain';

export const metadata = {
  title: 'Stay History | Student Portal',
  description: 'View your previous PG stays and clearance certificates',
};

export default function StudentHistoryPage() {
  return <StudentHistoryMain />;
}
