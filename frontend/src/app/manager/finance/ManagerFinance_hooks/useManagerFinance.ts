// @ts-nocheck
// DATA FLOW: [AI_TODO: Document data flow direction for useManagerFinance.ts]
import { useState, useEffect } from 'react';

import { useManagerUrlPagination } from '@/app/manager/manager_components/manager_hooks/useManagerUrlPagination';
// [DATA HOOK] useManagerFinance
// Responsibility: Loads invoices, computes rent stats, handles mark-paid and pagination with URL-agnostic local state.
// Data Flow: ManagerPropertyContext → api.finance → local state → ManagerFinancePage
import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';
import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';
import { useManagerSession } from '@/app/manager/manager_components/manager_hooks/useManagerSession';

import type { 
  ManagerFinanceFilter, 
  EnrichedInvoice, 
  UseManagerFinanceReturn 
} from '@/app/manager/finance/ManagerFinance_types/ManagerFinance.types';
export function useManagerFinance(): UseManagerFinanceReturn {
  const { selectedPropertyId, loading: ctxLoading } = useManagerPropertyContext();
  const [invoices, setInvoices] = useState<EnrichedInvoice[]>([]);
  const [stats, setStats] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ManagerFinanceFilter>('all');
  const { currentPage, setCurrentPage } = useManagerUrlPagination(1);
  const user = useManagerSession();
  const loadData = () => {
    if (!selectedPropertyId) return;
    setLoading(true);
    // Auto seed invoices for current month
    api.finance.seedMonthlyInvoices(selectedPropertyId);
    const allInvoices = api.finance.listInvoices(selectedPropertyId);
    const students = api.managerOperations.listStudents(selectedPropertyId) || [];
    // Map student names
    const enrichedInvoices = allInvoices.map((inv) => {      const studentData = students.find((t: unknown) => t.profile.id === inv.studentId);

      return {
        ...inv,
        studentName: studentData?.user?.name || 'Unknown',
        roomBed: 'Unknown'
      };    }).sort((a, b) => new Date((b as Record<string, unknown>).createdAt).getTime() - new Date(a.createdAt).getTime());

    setInvoices(enrichedInvoices);
    const dashStats = api.managerDashboard.getStats(selectedPropertyId);
    setStats(dashStats?.rentStats || null);
    setLoading(false);
  };
  // Reload invoice data when property changes or context finishes loading.
  useEffect(() => {
    if (!ctxLoading) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPropertyId, ctxLoading]);
  const handleMarkPaid = (invId: string) => {
    if (!user) return;
    const inv = invoices.find(i => i.id === invId);
    if (!inv) return;
    api.finance.recordCashPayment(
      { propertyId: inv.propertyId, studentId: inv.studentId, amount: inv.amount, method: 'cash' }, 
      user.id, 
      inv.id
    );
    loadData();
  };
  const handleSendReminder = (studentName: string) => {
    alert(`Rent reminder sent to ${studentName}!`);
  };
  const itemsPerPage = 10;
  // Reset to page 1 whenever filter or property changes to avoid empty pages.
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, selectedPropertyId]);
  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'all') return true;
    if (filter === 'paid') return inv.status.toLowerCase() === 'paid';
    return inv.status.toLowerCase() !== 'paid'; // pending or overdue
  });
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedData = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  return {
    invoices,    stats,
    loading,

    filter,
    setFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    handleMarkPaid,
    handleSendReminder,
    selectedPropertyId,
    ctxLoading
  };
}