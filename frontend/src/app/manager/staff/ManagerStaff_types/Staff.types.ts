export interface StaffMember {
  id: string;
  name: string;
  role: 'Housekeeping' | 'Kitchen' | 'Security' | 'Maintenance';
  phone: string;
  shift: string;
  status: 'Active' | 'Inactive';
}

export interface StaffAttendance {
  staffId: string;
  date: string;
  status: 'Present' | 'Absent' | 'On Leave';
}
