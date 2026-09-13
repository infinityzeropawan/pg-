import { useState, useEffect } from 'react';
import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';
import type { StaffMember, StaffAttendance } from '../ManagerStaff_types/Staff.types';

export function useManagerStaff() {
  const { selectedPropertyId } = useManagerPropertyContext();
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [attendance, setAttendance] = useState<StaffAttendance[]>([]);

  useEffect(() => {
    if (!selectedPropertyId) {
      setStaff([]);
      setAttendance([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Mock Data
    setTimeout(() => {
      setStaff([
        { id: 'stf-1', name: 'Ramesh Kumar', role: 'Housekeeping', phone: '9876543210', shift: '08:00 AM - 05:00 PM', status: 'Active' },
        { id: 'stf-2', name: 'Suresh Singh', role: 'Security', phone: '9876543211', shift: '08:00 PM - 08:00 AM', status: 'Active' },
        { id: 'stf-3', name: 'Rajesh Sharma', role: 'Kitchen', phone: '9876543212', shift: '06:00 AM - 02:00 PM', status: 'Inactive' },
        { id: 'stf-4', name: 'Mukesh Bhai', role: 'Maintenance', phone: '9876543213', shift: '09:00 AM - 06:00 PM', status: 'Active' },
      ]);
      const today = new Date().toISOString().split('T')[0] || '';
      setAttendance([
        { staffId: 'stf-1', date: today, status: 'Present' },
        { staffId: 'stf-2', date: today, status: 'Present' },
      ]);
      setLoading(false);
    }, 400);
  }, [selectedPropertyId]);

  const markAttendance = (staffId: string, status: 'Present' | 'Absent' | 'On Leave') => {
    const today = new Date().toISOString().split('T')[0] || '';
    setAttendance(prev => {
      const existing = prev.find(a => a.staffId === staffId && a.date === today);
      if (existing) {
        return prev.map(a => a.staffId === staffId && a.date === today ? { ...a, status } : a);
      }
      return [...prev, { staffId, date: today, status }];
    });
  };

  const addStaff = (newStaff: StaffMember) => {
    setStaff(prev => [newStaff, ...prev]);
  };

  return {
    loading,
    staff,
    attendance,
    markAttendance,
    addStaff
  };
}
