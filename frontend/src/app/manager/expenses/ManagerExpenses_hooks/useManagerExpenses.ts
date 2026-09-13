// @ts-nocheck
// DATA FLOW: [AI_TODO: Document data flow direction for useManagerExpenses.ts]
// [DATA HOOK] useManagerExpenses
// Responsibility: Fetches expense list and handles add/delete expense mutations with toast feedback.
// Data Flow: ManagerPropertyContext â†’ api.finance.listExpenses â†’ local state â†’ ManagerExpensesMain
// Forms: React Hook Form + Zod (ExpenseFormSchema) â€” no manual validation logic here.
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';
import { useManagerUrlPagination } from '@/app/manager/manager_components/manager_hooks/useManagerUrlPagination';
import { ExpenseFormSchema } from '@/app/manager/expenses/ManagerExpenses_types/ManagerExpenses.types';

import type { ExpenseFormData } from '@/app/manager/expenses/ManagerExpenses_types/ManagerExpenses.types';
export function useManagerExpenses(selectedPropertyId: string | null, propsLoading: boolean, userId: string | undefined) {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<unknown[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // React Hook Form with Zod resolver â€” replaces all manual useState + validation
  const form = useForm<ExpenseFormData>({

    resolver: zodResolver(ExpenseFormSchema) as unknown,
    defaultValues: {
      category: 'maintenance',
      amount: '',
      description: '',
    },
  });
  const loadExpenses = () => {
    if (!userId || !selectedPropertyId) return;
    setLoading(true);
    const stats = api.finance.getStats(userId, selectedPropertyId);
    setExpenses(stats.expenses);
    const students = api.managerOperations.listStudents(selectedPropertyId);
    setStudentCount(students.length);
    setLoading(false);
  };
  // Re-fetch expenses when property changes or context loading state updates.
  useEffect(() => {
    if (!propsLoading && selectedPropertyId) {
      loadExpenses();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsLoading, selectedPropertyId, userId]);
  const { currentPage, setCurrentPage } = useManagerUrlPagination(1);
  const itemsPerPage = 10;
  // Reset pagination to page 1 whenever the selected property changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPropertyId]);
  const onModalOpen = () => {
    form.reset({ category: 'maintenance', amount: '', description: '' });
    setIsModalOpen(true);
  };
  const onModalClose = () => {
    form.reset();
    setIsModalOpen(false);
  };
  // RHF-compatible submit handler â€” receives validated data directly, no manual checks needed

  const handleSubmit = form.handleSubmit(async (data: ExpenseFormData) => {
    if (!userId || !selectedPropertyId) return;
    setIsSubmitting(true);
    api.finance.createExpense({
      propertyId: selectedPropertyId,      category: data.category as unknown,

      amount: Number(data.amount),
      description: data.description,
    }, userId);
    toast.success('Expense logged successfully');
    setIsSubmitting(false);
    onModalClose();
    loadExpenses();
  });
  return {
    loading, expenses, studentCount,
    isModalOpen, onModalOpen, onModalClose,
    isSubmitting,
    form,
    currentPage, setCurrentPage, itemsPerPage,
    handleSubmit,
  };
}