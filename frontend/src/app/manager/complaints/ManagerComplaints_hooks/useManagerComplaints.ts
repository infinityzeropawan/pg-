// @ts-nocheck
// DATA FLOW: [AI_TODO: Document data flow direction for useManagerComplaints.ts]
// [DATA HOOK] useManagerComplaints
// Responsibility: Fetches complaints, manages resolve modal state, and handles complaint status mutations.
// Data Flow: ManagerPropertyContext â†’ api.managerOperations.listComplaints â†’ local state â†’ ManagerComplaintsMain
// Forms: React Hook Form + Zod (ComplaintResolveSchema) for the resolve modal.
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useManagerUrlPagination } from '@/app/manager/manager_components/manager_hooks/useManagerUrlPagination';
import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';
import { ComplaintResolveSchema } from '@/app/manager/complaints/ManagerComplaints_types/ManagerComplaints.types';

import type { ManagerComplaintData } from '@/app/manager/complaints/ManagerComplaints_types/ManagerComplaints.types';
import type { ComplaintResolveFormData } from '@/app/manager/complaints/ManagerComplaints_types/ManagerComplaints.types';
export function useManagerComplaints(selectedPropertyId: string | null, ctxLoading: boolean) {
  const [complaints, setComplaints] = useState<ManagerComplaintData[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'log'>('active');
  const [resolvingComplaint, setResolvingComplaint] = useState<ManagerComplaintData | null>(null);
  const { currentPage, setCurrentPage } = useManagerUrlPagination(1);
  const itemsPerPage = 10;
  // RHF for the resolve modal â€” replaces repairCost/resolutionNotes useState
  const resolveForm = useForm<ComplaintResolveFormData>({

    resolver: zodResolver(ComplaintResolveSchema) as unknown,
    defaultValues: { repairCost: '', resolutionNotes: '' },
  });
  const loadData = () => {
    if (selectedPropertyId) {      setComplaints(api.managerOperations.listComplaints(selectedPropertyId) as unknown as ManagerComplaintData[]);
    }
  };
  // Re-fetch complaints when property changes or context loading finishes.
  useEffect(() => {
    if (!ctxLoading) loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPropertyId, ctxLoading]);
  // Reset pagination to page 1 when switching between active/log tabs or changing the active property.
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedPropertyId]);
  const onOpenResolveModal = (complaint: ManagerComplaintData) => {
    resolveForm.reset({ repairCost: '', resolutionNotes: '' });
    setResolvingComplaint(complaint);
  };
  const onCloseResolveModal = () => {
    resolveForm.reset();
    setResolvingComplaint(null);
  };
  // RHF handleSubmit â€” receives validated data, no manual parsing needed
  const handleResolveSubmit = resolveForm.handleSubmit((data: ComplaintResolveFormData) => {

    if (!resolvingComplaint) return;
    const cost = parseFloat(data.repairCost || '0') || 0;
    api.managerOperations.resolveComplaintWithCost(resolvingComplaint.id, cost, data.resolutionNotes || '', 'manager');
    onCloseResolveModal();
    loadData();
  });
  const handleStartWork = (id: string) => {
    api.managerOperations.updateComplaintStatus(id, 'In Progress', 'manager');
    loadData();
  };
  const activeComplaints = complaints.filter(c => c.status !== 'Resolved');
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').sort((a,b) => new Date((b as Record<string, unknown>).resolvedAt || (b as Record<string, unknown>).updatedAt).getTime() - new Date(a.resolvedAt || a.updatedAt).getTime());

  const currentList = activeTab === 'active' ? activeComplaints : resolvedComplaints;
  const totalPages = Math.ceil(currentList.length / itemsPerPage);
  const paginatedData = currentList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  return {
    activeTab, setActiveTab,
    resolvingComplaint,
    onOpenResolveModal, onCloseResolveModal,
    resolveForm,
    currentPage, setCurrentPage,
    totalPages, paginatedData,
    activeComplaintsCount: activeComplaints.length,
    resolvedComplaintsCount: resolvedComplaints.length,
    handleResolveSubmit, handleStartWork
  };
}