// @ts-nocheck
// RESPONSIBILITY: Renders the ManagerCheckinMain component.
'use client';
import { useSearchParams } from 'next/navigation';
import { Lock, LogIn, LogOut, FileText, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';

import { useManagerSession } from '@/app/manager/manager_components/manager_hooks/useManagerSession';
import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';
import { useManagerCheckinData } from '@/app/manager/check-in/ManagerCheckin_hooks/useManagerCheckinData';
import { useManagerCheckinForm } from '@/app/manager/check-in/ManagerCheckin_hooks/useManagerCheckinForm';
import { ManagerCheckinProgress } from '@/app/manager/check-in/ManagerCheckin_components/ManagerCheckinProgress';
import { ManagerCheckinForm } from '@/app/manager/check-in/ManagerCheckin_components/ManagerCheckinForm';
export function ManagerCheckinMain() {
  const searchParams = useSearchParams();
  const enquiryId = searchParams?.get('enquiryId') || '';
  const user = useManagerSession();
  const { selectedPropertyId, loading: ctxLoading } = useManagerPropertyContext();
  const { 
    step, setStep, formData, setFormData, errors, setErrors, isSubmitting, 
    handleNext, handlePrev, handleCommit, router 
  } = useManagerCheckinForm(enquiryId, null, selectedPropertyId, user?.id);
  const { vacantBeds, compatibilityScore, enquiryData } = useManagerCheckinData(    selectedPropertyId, step, enquiryId, formData.room.bedId, formData.compatibility
  );
  // Sync initial enquiry data if fetched
  if (enquiryData && formData.personal.name === '') {
    setFormData(prev => ({
      ...prev,      personal: { ...prev.personal, name: enquiryData.name, phone: enquiryData.phone, email: enquiryData.email || '' },      deposit: { ...prev.deposit, rentAmount: enquiryData.budget ? enquiryData.budget.toString() : '' }
    }));
  }

  const [activeTab, setActiveTab] = useState<'dashboard' | 'checkin_wizard' | 'checkout_wizard'>(enquiryId ? 'checkin_wizard' : 'dashboard');

  if (ctxLoading) return <div className="p-6 text-secondary">Loading wizard...</div>;
  if (!selectedPropertyId) {

    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center max-w-md mx-auto manager-theme animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center mb-6 border border shadow-sm">
          <Lock className="w-10 h-10 text-secondary" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Property Required</h2>
        <p className="text-secondary">Please select a property before performing a check-in.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 manager-theme animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-[24px] font-bold text-primary tracking-tight">Check-in & Check-out</h1>
          <p className="text-sm text-secondary mt-1">Manage onboarding and offboarding of residents.</p>
        </div>
        {activeTab === 'dashboard' && (
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('checkout_wizard')}
              className="flex items-center gap-2 bg-input border border text-primary px-4 py-2 rounded-[var(--radius-md,8px)] hover:border-danger hover:text-danger font-bold text-sm shadow-sm transition-colors"
            >
              <LogOut className="w-4 h-4" /> Start Check-out
            </button>
            <button 
              onClick={() => setActiveTab('checkin_wizard')}
              className="flex items-center gap-2 bg-theme-primary text-white px-4 py-2 rounded-[var(--radius-md,8px)] hover:bg-theme-primary-hover font-bold text-sm shadow-sm transition-colors"
            >
              <LogIn className="w-4 h-4" /> Start Check-in
            </button>
          </div>
        )}
        {activeTab !== 'dashboard' && (
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="text-sm font-bold text-secondary hover:text-primary transition-colors border px-4 py-2 rounded-[var(--radius-md,8px)]"
          >
            Cancel & Return
          </button>
        )}
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm hover:border-theme-primary transition-colors">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <LogIn className="w-5 h-5 text-theme-primary" /> Today's Check-ins
            </h3>
            <div className="flex flex-col items-center justify-center py-10 text-secondary">
              <ClipboardCheck className="w-12 h-12 mb-3 opacity-20" />
              <p>No check-ins scheduled for today.</p>
            </div>
          </div>
          <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm hover:border-danger transition-colors">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <LogOut className="w-5 h-5 text-danger" /> Today's Check-outs
            </h3>
            <div className="flex flex-col items-center justify-center py-10 text-secondary">
              <FileText className="w-12 h-12 mb-3 opacity-20" />
              <p>No check-outs scheduled for today.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'checkin_wizard' && (
        <div className="bg-card border border rounded-[var(--radius-xl,16px)] p-6 shadow-sm">
          <ManagerCheckinProgress step={step} />
          <div className="mt-8">
            <ManagerCheckinForm 
              step={step}
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
              vacantBeds={vacantBeds}
              compatibilityScore={compatibilityScore}
              router={router}
              isSubmitting={isSubmitting}
              handlePrev={handlePrev}
              handleNext={handleNext}
              handleCommit={handleCommit}
            />
          </div>
        </div>
      )}

      {activeTab === 'checkout_wizard' && (
        <div className="bg-card border border rounded-[var(--radius-xl,16px)] p-6 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <LogOut className="w-16 h-16 text-danger mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-primary mb-2">Check-out Wizard</h2>
          <p className="text-secondary max-w-md">The multi-step check-out wizard (Notice -&gt; Rent Calc -&gt; Damage Assessment -&gt; Deposit -&gt; Inventory) is coming soon in the next release.</p>
        </div>
      )}
    </div>
  );
}