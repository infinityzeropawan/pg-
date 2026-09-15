import { useState, useEffect, useCallback } from 'react';
import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';
import { adminRequest } from '@/app/owner/owner_lib/owner_api/AdminClient';
import type { StaffMember, StaffAttendance } from '../ManagerStaff_types/Staff.types';

export function useManagerStaff() {
  const { selectedPropertyId } = useManagerPropertyContext();
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [attendance, setAttendance] = useState<StaffAttendance[]>([]);

  const fetchStaffData = useCallback(async () => {
    if (!selectedPropertyId) {
      setStaff([]);
      setAttendance([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0] || '';
      const [backendStaff, backendAtt] = await Promise.all([
        adminRequest<any[]>('/staff').catch(() => []),
        adminRequest<any[]>(`/staff/attendance?date=${today}`).catch(() => [])
      ]);

      if (Array.isArray(backendStaff) && backendStaff.length > 0) {
        const filtered = backendStaff
          .filter(s => !s.assignedPropertyIds || s.assignedPropertyIds.length === 0 || s.assignedPropertyIds.includes(selectedPropertyId))
          .map(s => ({
            id: s.id,
            name: s.name || s.user?.name || 'Staff Member',
            role: s.role || s.staffType || 'Staff',
            phone: s.phone || s.user?.phone || 'N/A',
            shift: s.shift || 'Flexible',
            status: s.status || 'Active'
          }));
        setStaff(filtered as StaffMember[]);
      } else {
        setStaff([]);
      }

      if (Array.isArray(backendAtt)) {
        setAttendance(backendAtt.map(a => ({
          staffId: a.staffUserId || a.staffId || a.id,
          date: a.date || today,
          status: (a.status === 'present' || a.status === 'Present') ? 'Present' : a.status
        })));
      } else {
        setAttendance([]);
      }
    } catch {
      setStaff([]);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  }, [selectedPropertyId]);

  useEffect(() => {
    fetchStaffData();
  }, [fetchStaffData]);

  const markAttendance = async (staffId: string, status: 'Present' | 'Absent' | 'On Leave') => {
    const today = new Date().toISOString().split('T')[0] || '';
    setAttendance(prev => {
      const existing = prev.find(a => a.staffId === staffId && a.date === today);
      if (existing) {
        return prev.map(a => a.staffId === staffId && a.date === today ? { ...a, status } : a);
      }
      return [...prev, { staffId, date: today, status }];
    });

    try {
      if (selectedPropertyId) {
        await adminRequest('/staff/attendance', {
          method: 'POST',
          body: JSON.stringify({
            propertyId: selectedPropertyId,
            staffUserId: staffId,
            status: status.toLowerCase(),
            date: today
          })
        });
      }
    } catch {
      // Best effort
    }
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

