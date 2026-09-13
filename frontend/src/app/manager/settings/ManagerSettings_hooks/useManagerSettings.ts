import { useState, useEffect } from 'react';
import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';
import { useManagerSession } from '@/app/manager/manager_components/manager_hooks/useManagerSession';

export function useManagerSettings() {
  const { selectedPropertyId } = useManagerPropertyContext();
  const user = useManagerSession();
  const [loading, setLoading] = useState(true);

  const [gateTiming, setGateTiming] = useState('22:00');
  const [visitorAllowed, setVisitorAllowed] = useState(true);
  const [notifications, setNotifications] = useState({
    sos: true,
    complaints: true,
    rent: false,
  });

  useEffect(() => {
    if (!selectedPropertyId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setTimeout(() => setLoading(false), 400);
  }, [selectedPropertyId]);

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return {
    user,
    loading,
    gateTiming,
    setGateTiming,
    visitorAllowed,
    setVisitorAllowed,
    notifications,
    setNotifications,
    handleSave
  };
}
