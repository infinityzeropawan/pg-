// DATA FLOW: getSession() → localStorage → ManagerPropertyContext → all manager pages
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';
import { getSession } from '@/app/manager/manager_lib/manager_auth/ManagerSession';

import type { SessionUser } from '@/lib/types';

interface ManagerPropertyContextType {
  properties: unknown[];
  selectedPropertyId: string;
  setSelectedPropertyId: (id: string) => void;
  loading: boolean;
}

const ManagerPropertyContext = createContext<ManagerPropertyContextType>({
  properties: [],
  selectedPropertyId: '',
  setSelectedPropertyId: () => {},
  loading: true
});

export const ManagerPropertyProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('ManagerPropertyProvider render');
  const [properties, setProperties] = useState<unknown[]>([]);
  const [selectedPropertyId, setPropertyId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SessionUser | null>(null);

  // Read session from localStorage on client mount only (SSR-safe).
  useEffect(() => {
    const session = getSession();
    setUser(session);
  }, []);

  // Load properties once we have the user session.
  useEffect(() => {
    if (user === null) {
      // Not loaded yet — keep loading=true until user state resolves.
      return;
    }
    if (user?.role === 'manager' && user.assignedPropertyIds && user.assignedPropertyIds.length > 0) {
      const allProps = api.properties.listAll();
      const assignedProps = allProps.filter((p) => user.assignedPropertyIds?.includes((p as { id: string }).id));
      console.log('ManagerPropertyContext matched props:', { allProps, assignedProps, user });
      setProperties(assignedProps);
      if (assignedProps.length > 0) {
        setPropertyId((assignedProps[0] as { id: string }).id);
      }
    } else {
      console.log('ManagerPropertyContext failed condition:', { role: user?.role, assigned: user?.assignedPropertyIds });
    }
    console.log('ManagerPropertyContext setting loading to false');
    setLoading(false);
  }, [user]);

  return (
    <ManagerPropertyContext.Provider value={{
      properties,
      selectedPropertyId,
      setSelectedPropertyId: setPropertyId,
      loading
    }}>
      {children}
    </ManagerPropertyContext.Provider>
  );
};

export const useManagerPropertyContext = () => useContext(ManagerPropertyContext);