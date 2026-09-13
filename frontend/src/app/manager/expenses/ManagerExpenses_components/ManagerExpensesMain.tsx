// @ts-nocheck
// RESPONSIBILITY: Renders the ManagerExpensesMain component.
'use client';
import { AlertCircle, Loader2 } from 'lucide-react';

import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';
import { useManagerSession } from '@/app/manager/manager_components/manager_hooks/useManagerSession';
import { useManagerExpenses } from '@/app/manager/expenses/ManagerExpenses_hooks/useManagerExpenses';
import { ManagerExpensesHeader } from '@/app/manager/expenses/ManagerExpenses_components/ManagerExpensesHeader';
import { ManagerExpensesList } from '@/app/manager/expenses/ManagerExpenses_components/ManagerExpensesList';
import { ManagerExpensesModal } from '@/app/manager/expenses/ManagerExpenses_components/ManagerExpensesModal';
export function ManagerExpensesMain() {
  const user = useManagerSession();
  const { selectedPropertyId, loading: propsLoading } = useManagerPropertyContext();
  const {
    loading, expenses, studentCount,
    isModalOpen, onModalOpen, onModalClose,
    isSubmitting,
    form,
    currentPage, setCurrentPage, itemsPerPage,
    handleSubmit
  } = useManagerExpenses(selectedPropertyId, propsLoading, user?.id);
  if (propsLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary motion-safe:animate-spin" />
      </div>
    );
  }
  if (!selectedPropertyId) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <AlertCircle className="w-16 h-16 text-warning mb-4" />
        <h2 className="text-xl font-bold text-primary">Property Required</h2>
        <p className="text-secondary mt-2">Please select a property from the top menu to view or log expenses.</p>
      </div>
    );
  }
  const categoryLabels: Record<string, string> = {
    maintenance: 'Maintenance & Repairs',
    electricity: 'Electricity Bill',
    water: 'Water Bill',
    kitchen_stock: 'Groceries & Kitchen',
    cleaning: 'Cleaning & Housekeeping',
    staff_salary: 'Staff Salary',
    other: 'Other'
  };
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthExpenses = expenses.filter(e => {    const d = new Date(e.date);

    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });  const groceryExpenses = currentMonthExpenses.filter(e => String((e as Record<string, unknown>).category) === 'kitchen_stock' || (e as any).category === 'groceries').reduce((acc, e) => (acc as number) + Number((e as Record<string, unknown>).amount), 0);  const costPerStudent = studentCount > 0 ? (groceryExpenses / studentCount) : 0;
  
  const sortedExpenses = [...expenses].sort((a: any, b: any) => new Date((b as Record<string, unknown>).date).getTime() - new Date(a.date).getTime());

  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);

  const paginatedData = sortedExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  return (
    <div className="space-y-6 pb-20">
      <ManagerExpensesHeader         groceryExpenses={groceryExpenses}
        costPerStudent={costPerStudent}
        studentCount={studentCount}
        setIsModalOpen={onModalOpen}

      />
      <ManagerExpensesList 
        expenses={expenses}
        paginatedData={paginatedData}
        categoryLabels={categoryLabels}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      <ManagerExpensesModal 
        isModalOpen={isModalOpen}
        onModalClose={onModalClose}
        isSubmitting={isSubmitting}
        form={form}
        handleSubmit={handleSubmit}
        categoryLabels={categoryLabels}
      />

    </div>
  );
}