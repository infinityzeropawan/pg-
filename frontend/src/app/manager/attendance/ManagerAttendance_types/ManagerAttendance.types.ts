export interface ManagerAttendanceStudent {
  id: string;
  userId?: string;
  name: string;
  phone: string;
  roomNumber?: string;
}
export interface ManagerAttendanceRecord {
  id?: string;
  studentId: string;
  propertyId: string;
  status: 'Present' | 'Absent' | 'On Leave';
  date: string;
}
export type ManagerAttendanceStatus = 'Present' | 'Absent' | 'On Leave' | 'Pending';