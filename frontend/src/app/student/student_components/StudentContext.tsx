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
    const session = getSession();
    if (session?.role === 'student') {
      const p = studentOperationsApi.getProfile(session.id);
      setProfile(p);
    }
    setLoading(false);
  }, []);

  return (
    <StudentContext.Provider value={{ profile, loading }}>
      {children}
    </StudentContext.Provider>
  );
}

export const useStudentContext = () => useContext(StudentContext);
