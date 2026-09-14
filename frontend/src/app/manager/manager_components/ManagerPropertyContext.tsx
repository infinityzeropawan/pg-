// DATA FLOW: getSession() → localStorage → ManagerPropertyContext → all manager pages
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';
import { propertiesApi } from '@/app/owner/owner_lib/owner_api/OwnerProperties';
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
  const [properties, setProperties] = useState<unknown[]>([]);
  const [selectedPropertyId, setPropertyId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const session = getSession();
    setUser(session);
  }, []);

  useEffect(() => {
    if (user === null) return;

    const loadBackendProperties = async () => {
      try {
        const backendProps = await propertiesApi.fetchProperties();
        if (backendProps && backendProps.length > 0) {
          const filtered = user.assignedPropertyIds && user.assignedPropertyIds.length > 0
            ? backendProps.filter((p: any) => user.assignedPropertyIds?.includes(p.id))
            : backendProps;
          
          setProperties(filtered);
          if (filtered.length > 0) {
            setPropertyId(filtered[0].id);
          } else if (user.propertyId) {
            setPropertyId(user.propertyId);
          }
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn('Backend properties fetch fallback to local:', e);
      }

      // Fallback
      if (user.assignedPropertyIds && user.assignedPropertyIds.length > 0) {
        const allProps = api.properties.listAll();
        const assignedProps = allProps.filter((p) => user.assignedPropertyIds?.includes((p as { id: string }).id));
        setProperties(assignedProps);
        if (assignedProps.length > 0) {
          setPropertyId((assignedProps[0] as { id: string }).id);
        }
      }
      setLoading(false);
    };

    loadBackendProperties();
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