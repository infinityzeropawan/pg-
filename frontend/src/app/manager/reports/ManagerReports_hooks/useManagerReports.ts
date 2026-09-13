import { useState, useEffect } from 'react';
import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';
import type { OccupancyStats, FinancialStats, Defaulter } from '../ManagerReports_types/Reports.types';

export function useManagerReports() {
  const { selectedPropertyId } = useManagerPropertyContext();
  const [loading, setLoading] = useState(true);

  const [occupancy, setOccupancy] = useState<OccupancyStats | null>(null);
  const [financials, setFinancials] = useState<FinancialStats | null>(null);
  const [defaulters, setDefaulters] = useState<Defaulter[]>([]);

  useEffect(() => {
    if (!selectedPropertyId) {
      setOccupancy(null);
      setFinancials(null);
      setDefaulters([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Mock Data
    setTimeout(() => {
      setOccupancy({
        totalBeds: 120,
        occupiedBeds: 95,
        vacantBeds: 20,
        maintenanceBeds: 5,
        occupancyRate: 79.1
      });
      setFinancials({
        expectedRent: 500000,
        collectedRent: 420000,
        pendingRent: 80000,
        collectionRate: 84
      });
      setDefaulters([
        { id: 'def-1', studentName: 'Rohan Gupta', room: '101A', amount: 8000, daysOverdue: 5 },
        { id: 'def-2', studentName: 'Amit Verma', room: '205B', amount: 15000, daysOverdue: 12 },
        { id: 'def-3', studentName: 'Sanjay Kumar', room: '304', amount: 7500, daysOverdue: 2 },
      ]);
      setLoading(false);
    }, 400);
  }, [selectedPropertyId]);

  return {
    loading,
    occupancy,
    financials,
    defaulters
  };
}
