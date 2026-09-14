// DATA FLOW: [AI_TODO: Document data flow direction for StudentContext.tsx]
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import { getSession } from '@/app/student/student_lib/student_auth/StudentSession';

interface StudentContextType {
  profile: any | null;
  loading: boolean;
}

const StudentContext = createContext<StudentContextType>({
  profile: null,
  loading: true
});

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const res = await fetch('http://localhost:5000/api/v1/student/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.data?.student) {
          const st = data.data.student;
          const prop = data.data.property;
          const room = data.data.room;
          const bed = data.data.bed;
          setProfile({
            userId: st.id,
            name: st.fullName,
            email: st.email,
            phone: st.phone,
            propertyName: prop?.name || 'Sunshine Luxury PG',
            roomNumber: room?.roomNumber || '101',
            bedCode: bed?.bedNumber || 'B-1',
            duesAmount: 0,
            propertyId: prop?.id || 'prop_1',
          });
        } else {
          setProfile({
            userId: 'student_demo',
            name: 'Aarav Patel',
            propertyName: 'Sunshine Luxury PG',
            roomNumber: '101',
            bedCode: 'B-1',
            duesAmount: 0,
            propertyId: 'prop_1',
          });
        }
      } catch (e) {
        console.error('Failed to fetch student profile:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  return (
    <StudentContext.Provider value={{ profile, loading }}>
      {children}
    </StudentContext.Provider>
  );
}

export const useStudentContext = () => useContext(StudentContext);
