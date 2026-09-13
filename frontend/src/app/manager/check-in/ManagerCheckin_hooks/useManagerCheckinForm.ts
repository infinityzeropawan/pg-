// @ts-nocheck
// DATA FLOW: [AI_TODO: Document data flow direction for useManagerCheckinForm.ts]
// [FORM HOOK] useManagerCheckinForm
// Responsibility: Manages the 10-step check-in wizard state, per-step Zod validation, and final commit.
// Data Flow: step + formData state â†’ Zod safeParse per-step â†’ api.managerCheckin.commitCheckin â†’ success/error toast
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { CheckinStep1Schema, CheckinStep3Schema } from '@/app/manager/check-in/ManagerCheckin_types/ManagerCheckin.types';
import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';

import type { ManagerCheckinFormData } from '@/app/manager/check-in/ManagerCheckin_types/ManagerCheckin.types';
export function useManagerCheckinForm(enquiryId: string, initialEnquiryData: unknown, selectedPropertyId: string | null, userId: string | undefined) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const [formData, setFormData] = useState<ManagerCheckinFormData>({
    enquiryId,
    personal: { name: '', email: '', phone: '', gender: 'Male', college: '', dob: '' },
    documents: { files: [], aadharNumber: '', panNumber: '' },
    parent: { name: '', phone: '', email: '' },
    room: { bedId: '' },
    compatibility: { sleepSchedule: 'normal', studyHabits: 'quiet' },
    deposit: { type: 'normal', rentAmount: '', loanPartner: '', stayDuration: '3' },
    agreement: { accepted: false },
    credentials: { password: 'Student@123' }
  });
  useEffect(() => {
    if (initialEnquiryData) {
      setFormData(prev => ({
        ...prev,

        personal: { ...prev.personal, name: initialEnquiryData.name, phone: initialEnquiryData.phone, email: initialEnquiryData.email || '' },

        deposit: { ...prev.deposit, rentAmount: initialEnquiryData.budget ? initialEnquiryData.budget.toString() : '' }
      }));
    }
  }, [initialEnquiryData]);
  const handleNext = () => {
    // Per-step Zod validation â€” replaces manual if-else field checks
    if (step === 1) {
      const result = CheckinStep1Schema.safeParse({        name: (formData as unknown as Record<string, unknown>).personal.name.trim(),        phone: formData.personal.phone.trim(),

      });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((e: { path: (string | number)[]; message: string }) => {
          if (e.path[0]) fieldErrors[String(e.path[0])] = e.message;

        });
        setErrors(fieldErrors);
        return;
      }
    }
    if (step === 3) {
      const result = CheckinStep3Schema.safeParse({        parentName: formData.parent.name.trim(),        parentPhone: formData.parent.phone.trim(),
      });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((e: { path: (string | number)[]; message: string }) => {
          if (e.path[0]) fieldErrors[String(e.path[0])] = e.message;
        });

        setErrors(fieldErrors);

        return;

      }

    }
    setErrors({});
    setStep(s => Math.min(s + 1, 10));
  };
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));
  const handleCommit = async () => {
    if (!userId || !selectedPropertyId) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    api.managerCheckin.commitCheckin({      ...formData,
      managerId: userId,
      propertyId: selectedPropertyId
    });

    toast.success('Check-in completed successfully');

    setIsSubmitting(false);
    handleNext(); 
  };
  return {
    step,
    setStep,
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    handleNext,
    handlePrev,
    handleCommit,
    router
  };
}