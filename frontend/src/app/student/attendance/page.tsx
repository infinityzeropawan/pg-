import { StudentAttendanceMain } from '@/app/student/attendance/StudentAttendance_components/StudentAttendanceMain';

export const metadata = {
  title: 'Attendance | Student Portal',
  description: 'View your monthly attendance and stats',
};

export default function StudentAttendancePage() {
  return <StudentAttendanceMain />;
}
