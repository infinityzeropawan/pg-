// DATA FLOW: [AI_TODO: Document data flow direction for OwnerPropertyContext.tsx]
'use client';

// RESPONSIBILITY: Renders the OwnerPropertyContext component. Receives data via props/hooks.

import React, { createContext, useContext, useState, useEffect } from 'react';

import { propertiesApi } from '@/app/owner/owner_lib/owner_api/OwnerProperties';
import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';
import { seedIfNeeded } from '@/app/owner/owner_lib/owner_mock_seed';

import type { Property } from '@/app/owner/owner_lib/owner_api/OwnerProperties';


interface OwnerPropertyContextType {
  selectedPropertyId: string | 'all';
  setSelectedPropertyId: (id: string | 'all') => void;
  properties: Property[];
  loading: boolean;
  refreshProperties: () => void;
}

const OwnerPropertyContext = createContext<OwnerPropertyContextType>({
  selectedPropertyId: 'all',
  setSelectedPropertyId: () => {},
  properties: [],
  loading: true,
  refreshProperties: () => {},
});

export const useOwnerPropertyContext = () => useContext(OwnerPropertyContext);

export function OwnerPropertyProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') setUser(getSession());
  }, []);
  const [selectedPropertyId, setPropertyId] = useState<string | 'all'>('all');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedIfNeeded(); // Ensure demo data is in localStorage before reading
    const session = getSession();
    if (session?.role === 'owner') {
      const props = propertiesApi.listByOwner(session.id);
      setProperties(props);
      
      const savedState = sessionStorage.getItem('spg_owner_ui_state');
      if (savedState) {
        setPropertyId(savedState);
      }
    }
    setLoading(false);
  }, [user?.id]);

  const refreshProperties = () => {
    if (user?.role === 'owner') {
      const props = propertiesApi.listByOwner(user.id);
      setProperties(props);
    }
  };

  const setSelectedPropertyId = (id: string | 'all') => {
    setPropertyId(id);
    sessionStorage.setItem('spg_owner_ui_state', id);
  };

  return (
    <OwnerPropertyContext.Provider value={{ selectedPropertyId, setSelectedPropertyId, properties, loading, refreshProperties }}>
      {children}
    </OwnerPropertyContext.Provider>
  );
}

