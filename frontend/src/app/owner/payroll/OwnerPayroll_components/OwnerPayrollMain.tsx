// @ts-nocheck
'use client';

// RESPONSIBILITY: Renders the OwnerPayrollMain component. Receives data via props/hooks.

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Play } from 'lucide-react';
import { subMonths, addMonths } from 'date-fns';

import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';
import { teamApi } from '@/app/owner/owner_lib/owner_api/OwnerTeam';
import { payrollApi } from '@/app/owner/owner_lib/owner_api/OwnerPayroll';
import { db } from '@/lib/storage/db';
import { createId } from '@/lib/utils/id';
import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';
import { OwnerPayrollStats } from '@/app/owner/payroll/OwnerPayroll_components/OwnerPayrollStats';
import { OwnerPayrollTable } from '@/app/owner/payroll/OwnerPayroll_components/OwnerPayrollTable';
import { OwnerPayrollPaymentModal } from '@/app/owner/payroll/OwnerPayroll_components/OwnerPayrollPaymentModal';
import { useTableSync } from '@/lib/hooks/useTableSync';

export function OwnerPayrollMain() {
  const user = typeof window !== 'undefined' ? getSession() : null;
  
  const { selectedPropertyId, setSelectedPropertyId, properties } = useOwnerPropertyContext();

  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [staffData, setStaffData] = useState<any[]>([]);
  const [roleFilter, setRoleFilter] = useState('all');
  
  const { page: currentPage, setPage: setCurrentPage } = useTableSync();

  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    mode: 'UPI',
    transactionId: ''
  });

  const loadPayrollData = () => {
    if (!user) return;
    setLoading(true);
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const data = payrollApi.getPayrollStatus(user.id, month, year);
    setStaffData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPayrollData();
  }, [user?.id, currentDate]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleOpenPaymentModal = (staffRecord: unknown) => {
    setSelectedStaff(staffRecord);
    setPaymentForm({ mode: 'UPI', transactionId: '' });
    setPaymentModalOpen(true);
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !selectedStaff) return;
    
    setProcessingPayment(true);
    
    setTimeout(() => {
      try {
        payrollApi.processPayment({
          ownerId: user.id,
          staffId: selectedStaff.staff.id,
          staffName: selectedStaff.staff.name,
          role: selectedStaff.staff.staffType,
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
          amount: selectedStaff.staff.salary,
          paymentMode: paymentForm.mode as unknown,
          transactionId: paymentForm.transactionId
        });
        toast.success(`Payment recorded for ${selectedStaff.staff.name}`);
        setPaymentModalOpen(false);
        loadPayrollData();
      } catch (err: any) {
        toast.error(err.message || 'Failed to record payment.');
      } finally {
        setProcessingPayment(false);
      }
    }, 1500);
  };

  const handleSetupDreamHappy = async () => {
    if (!user?.id) return;
    setLoading(true);
    toast.success('Setting up Dream and Happy PGs...');
    
    setTimeout(() => {
      try {
        const props = db.getAll('spg_properties').filter((p: unknown) => (p as any).name === 'Dream PG' || (p as any).name === 'Happy PG');
        props.forEach(p => db.remove('spg_properties', p.id));
      } catch (e: any) {}

      const dreamId = createId('prop');
      const happyId = createId('prop');
      
// @ts-expect-error
      db.insert('spg_properties' as unknown, {
        id: dreamId, ownerId: user.id, name: 'Dream PG', slug: 'dream-pg',
        type: 'coed', address: 'Plot 10, Scheme 54', city: 'Indore', pincode: '452010',
        bedsPlanned: 100, createdAt: new Date().toISOString(), isDeleted: false
      } as unknown);

// @ts-expect-error
      db.insert('spg_properties' as unknown, {
        id: happyId, ownerId: user.id, name: 'Happy PG', slug: 'happy-pg',
        type: 'boys', address: 'Vijay Nagar', city: 'Indore', pincode: '452010',
        bedsPlanned: 150, createdAt: new Date().toISOString(), isDeleted: false
      } as unknown);

      const newStaff = [
        { name: 'Ashfaq Ahmed', role: 'manager', salary: 30000, phone: '9876543001', propId: dreamId },
        { name: 'Simran Kaur', role: 'cleaner', salary: 12000, phone: '9876543002', propId: dreamId },
        { name: 'Sameer Khan', role: 'cook', salary: 18000, phone: '9876543003', propId: dreamId },
        { name: 'Ravi Prakash', role: 'manager', salary: 28000, phone: '9876543004', propId: happyId },
        { name: 'Bhola Ram', role: 'guard', salary: 14000, phone: '9876543005', propId: happyId }
      ];

      newStaff.forEach((d) => {
        const randomStr = Math.random().toString(36).substring(2, 7);
// @ts-expect-error
        const email = d.name.split(' ')[0].toLowerCase() + `_${randomStr}@smartpg.test`;
        try {
          const { profile } = teamApi.createTeamMember({
            name: d.name, email: email, phone: d.phone, password: 'Password@123',
            roleType: d.role as unknown, assignedPropertyIds: [d.propId], salary: d.salary,
            joinDate: new Date().toISOString(), shift: 'Morning',
            permissions: { canEditRent: false, canAddExpense: true, canOnboardStudent: d.role === 'manager', canBroadcast: d.role === 'manager', canCollectCash: true }
          }, user.id);
          
          if (d.role === 'manager') {
            payrollApi.processPayment({
              ownerId: user.id, staffId: profile.id, staffName: d.name, role: d.role,
              month: currentDate.getMonth() + 1, year: currentDate.getFullYear(),
              amount: d.salary, paymentMode: 'Bank Transfer', transactionId: 'TXN1122334455'
            });
          }
        } catch (e: any) {
          toast.error(`Failed to create ${d.name}: ${e.message}`);
        }
      });
      
      toast.success('Dream & Happy PGs setup complete!');
      setSelectedPropertyId('all');
      setRoleFilter('all');
      setTimeout(() => { window.location.reload(); }, 800);
    }, 1000);
  };

  const itemsPerPage = 10;

  useEffect(() => {
    // Current page is managed by useTableSync, but if filters change we could reset page.
    // useTableSync already resets page to 1 when search changes, but we might want to reset on filter change too.
    setCurrentPage(1);
  }, [roleFilter, selectedPropertyId, currentDate, setCurrentPage]);

  if (loading && staffData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full motion-safe:animate-spin"></div>
      </div>
    );
  }

  const filteredStaffData = staffData.filter(item => {
    const matchRole = roleFilter === 'all' || item.staff.staffType === roleFilter;
    const allUsers = db.getAll('spg_users') as unknown[];
    const staffUser = allUsers.find((u: any) => u.name === item.staff.name && u.phone === item.staff.phone);
// @ts-expect-error
    const matchProperty = selectedPropertyId === 'all' || (staffUser?.assignedPropertyIds || []).includes(selectedPropertyId);
    return matchRole && matchProperty;
  });

  const totalStaff = filteredStaffData.length;
  const paidCount = filteredStaffData.filter(s => s.isPaid).length;
  const totalPayout = filteredStaffData.reduce((acc, s) => acc + (s.staff.salary || 0), 0);
  const paidPayout = filteredStaffData.filter(s => s.isPaid).reduce((acc, s) => acc + (s.staff.salary || 0), 0);
  const pendingPayout = totalPayout - paidPayout;

  const totalPages = Math.ceil(filteredStaffData.length / itemsPerPage);
  const paginatedData = filteredStaffData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="pb-20 space-y-8 animate-in fade-in motion-safe:duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-primary">Staff Payroll</h1>
          <p className="text-[12px] font-medium text-secondary mt-1">Manage monthly salaries and payouts</p>
        </div>
        <button 
          onClick={handleSetupDreamHappy}
          className="flex items-center gap-2 bg-primary text-white text-[12px] font-bold px-4 py-2 rounded-md hover:bg-primary-hover motion-safe:transition-colors"
        >
          <Play className="w-3.5 h-3.5" /> Setup Dream & Happy PG
        </button>
      </div>

      <OwnerPayrollStats 
        currentDate={currentDate}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
        selectedPropertyId={selectedPropertyId}
        setSelectedPropertyId={setSelectedPropertyId}
        properties={properties}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        totalPayout={totalPayout}
        paidPayout={paidPayout}
        pendingPayout={pendingPayout}
        paidCount={paidCount}
        totalStaff={totalStaff}
      />

      <OwnerPayrollTable 
        paginatedData={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        handleOpenPaymentModal={handleOpenPaymentModal}
      />

      <OwnerPayrollPaymentModal 
        paymentModalOpen={paymentModalOpen}
        setPaymentModalOpen={setPaymentModalOpen}
        selectedStaff={selectedStaff}
        currentDate={currentDate}
        processingPayment={processingPayment}
        paymentForm={paymentForm}
        setPaymentForm={setPaymentForm}
        handleProcessPayment={handleProcessPayment}
      />
    </div>
  );
}
