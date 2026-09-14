// DATA FLOW: [AI_TODO: Document data flow direction for OwnerPropertyContext.tsx]
'use client';

// RESPONSIBILITY: Renders the OwnerPropertyContext component. Receives data via props/hooks.

import React, { createContext, useContext, useState, useEffect } from 'react';

import { propertiesApi } from '@/app/owner/owner_lib/owner_api/OwnerProperties';
import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';

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

  const loadProperties = async (ownerId?: string) => {
    setLoading(true);
    try {
      const backendProps = await propertiesApi.fetchProperties();
      if (backendProps && backendProps.length > 0) {
        setProperties(backendProps);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn('Backend property fetch fallback to local:', e);
    }
    if (ownerId) {
      const props = propertiesApi.listByOwner(ownerId);
      setProperties(props);
    }
    setLoading(false);
  };

  useEffect(() => {
    const session = getSession();
    if (session) {
      loadProperties(session.id);
      const savedState = sessionStorage.getItem('spg_owner_ui_state');
      if (savedState) setPropertyId(savedState);
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const refreshProperties = () => {
    if (user?.id) loadProperties(user.id);
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
