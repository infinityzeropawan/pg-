import { useState, useEffect } from 'react';
import { useManagerUrlPagination } from '@/app/manager/manager_components/manager_hooks/useManagerUrlPagination';
import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';
import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';
import { useManagerSession } from '@/app/manager/manager_components/manager_hooks/useManagerSession';

import type { GateLog, UseManagerGateLogsReturn } from '@/app/manager/gate-logs/ManagerGateLogs_types/ManagerGateLogs.types';

export function useManagerGateLogs(): UseManagerGateLogsReturn {
  const { selectedPropertyId, loading: ctxLoading } = useManagerPropertyContext();
  const [logs, setLogs] = useState<GateLog[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const { currentPage, setCurrentPage } = useManagerUrlPagination(1);
  const itemsPerPage = 10;
  const user = useManagerSession();

  const loadData = () => {
    if (!ctxLoading && selectedPropertyId) {
      const fetchedLogs = api.managerOperations.listGateLogs(selectedPropertyId) as unknown as GateLog[];
      setLogs(fetchedLogs);
      const studentList = api.managerOperations.listStudents(selectedPropertyId);
      setStudents(studentList);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPropertyId, ctxLoading]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPropertyId]);

  const handleAdd = (
    studentId: string, 
    type: 'entry' | 'exit', 
    isLate: boolean,
    reason?: string,
    destination?: string,
    expectedReturnTime?: string
  ) => {
    if (!user || !selectedPropertyId || !studentId) return;
    api.managerOperations.addGateLog({
      propertyId: selectedPropertyId,
      studentId,
      type,
      isLate,
      reason,
      destination,
      expectedReturnTime,
      managerId: user.id
    });
    loadData();
  };

  const sortedLogs = [...logs].sort((a,b) => new Date((b.timestamp || b.createdAt) as string).getTime() - new Date((a.timestamp || a.createdAt) as string).getTime());
  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);
  const paginatedData = sortedLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return {
    logs,
    loading: ctxLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    handleAdd,
    selectedPropertyId,
    ctxLoading,
    students
  };
}