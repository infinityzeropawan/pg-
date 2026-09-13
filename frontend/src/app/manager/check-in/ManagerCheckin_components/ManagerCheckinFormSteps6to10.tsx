// @ts-nocheck
// RESPONSIBILITY: Renders the ManagerCheckinFormSteps6to10 component.
import { Wallet, FileCheck, Key, Utensils, CheckCircle, Lock } from 'lucide-react';

import type { ManagerCheckinFormData } from '@/app/manager/check-in/ManagerCheckin_types/ManagerCheckin.types';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
interface Props {
  step: number;
  formData: ManagerCheckinFormData;
  setFormData: React.Dispatch<React.SetStateAction<ManagerCheckinFormData>>;
  vacantBeds: unknown[];
  router: AppRouterInstance;
}
export function ManagerCheckinFormSteps6to10({ step, formData, setFormData, vacantBeds, router }: Props) {
  if (step < 6) return null;
  return (
    <>
      {step === 6 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2"><Wallet className="text-primary" /> Deposit & Rent</h2>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Agreed Monthly Rent (₹)</label>            <input type="number" value={formData.deposit.rentAmount} onChange={e => setFormData({...formData, deposit: {...formData.deposit, rentAmount: e.target.value}})} className="w-full max-w-sm bg-input border border rounded px-3 py-2 text-primary focus:border-primary outline-none" />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-secondary mb-1">Stay Duration (Months)</label>            <select value={formData.deposit.stayDuration} onChange={e => setFormData({...formData, deposit: {...formData.deposit, stayDuration: e.target.value}})} className="w-full max-w-sm bg-input border border rounded px-3 py-2 text-primary focus:border-primary outline-none">
              {[1, 2, 3, 4, 5, 6, 9, 12].map(months => (
                <option key={months} value={months.toString()}>{months} {months === 1 ? 'Month' : 'Months'}</option>
              ))}
            </select>
            <p className="text-xs text-secondary mt-1">Rent schedule will be generated automatically for this duration.</p>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-secondary mb-3">Deposit Model</label>
            <div className="flex gap-4">              <label className={`flex-1 border rounded-xl p-4 cursor-pointer motion-safe:transition-colors ${formData.deposit.type === 'normal' ? 'border-primary bg-primary-subtle' : 'border bg-input'}`}>                <input type="radio" name="dep" checked={formData.deposit.type === 'normal'} onChange={() => setFormData({...formData, deposit: {...formData.deposit, type: 'normal', loanPartner: ''}})} className="sr-only" />
                <div className="font-bold text-primary mb-1">Normal Deposit</div>
                <div className="text-xs text-secondary">Student pays upfront deposit.</div>
              </label>              <label className={`flex-1 border rounded-xl p-4 cursor-pointer motion-safe:transition-colors ${formData.deposit.type === 'zero_deposit' ? 'border-primary bg-primary-subtle' : 'border bg-input'}`}>                <input type="radio" name="dep" checked={formData.deposit.type === 'zero_deposit'} onChange={() => setFormData({...formData, deposit: {...formData.deposit, type: 'zero_deposit'}})} className="sr-only" />
                <div className="font-bold text-primary mb-1">Zero Deposit</div>
                <div className="text-xs text-secondary">Financed by Loan Partner.</div>
              </label>
            </div>
          </div>          {formData.deposit.type === 'zero_deposit' && (
            <div className="mt-4 animate-in fade-in">
              <label className="block text-sm font-medium text-secondary mb-1">Loan Partner</label>              <select value={formData.deposit.loanPartner} onChange={e => setFormData({...formData, deposit: {...formData.deposit, loanPartner: e.target.value}})} className="w-full max-w-sm bg-input border border rounded px-3 py-2 text-primary focus:border-primary outline-none">
                <option value="">Select Partner</option>
                <option value="Liquiloans">Liquiloans</option>
                <option value="Eduvanz">Eduvanz</option>
              </select>
            </div>
          )}
        </div>
      )}
      {step === 7 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2"><FileCheck className="text-primary" /> Digital Agreement</h2>
          <div className="bg-white text-black font-serif border border-gray-300 p-8 rounded shadow-inner max-h-96 overflow-y-auto">
            <div className="text-center mb-6 border-b-2 border-black pb-4">
              <h1 className="text-2xl font-bold uppercase tracking-widest">Rental Agreement</h1>
              <p className="text-sm text-gray-600 mt-1">Smart PG Management Systems</p>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-gray-800">              <p>This Rental Agreement is made and entered into on <strong>{new Date().toLocaleDateString('en-IN')}</strong>, by and between the Property Management and <strong>{formData.personal.name || '[Student Name]'}</strong> (hereinafter referred to as the "Student").</p>
              <h3 className="font-bold text-base mt-4">1. Premises</h3>
              <p>The Student agrees to lease the bed assigned in Room {(vacantBeds.find((b) =>(b as Record<string, unknown>).id===formData.room.bedId) as unknown)?.roomNumber || '[Room Number]'} under the standard occupancy terms.</p>
              <h3 className="font-bold text-base mt-4">2. Rent & Deposit</h3>              <p>The agreed monthly rent is ₹{formData.deposit.rentAmount || '0'}. Rent must be paid on or before the agreed rent cycle date every month. {formData.deposit.type === 'zero_deposit' ? `A Zero Deposit model has been opted via ${formData.deposit.loanPartner}.` : 'A standard security deposit is required before move-in.'}</p>
              <h3 className="font-bold text-base mt-4">3. House Rules & Notice</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Student must serve the mandatory notice period before vacating.</li>
                <li>Visitors are allowed strictly within visiting hours.</li>
                <li>Any damages to the premises will be deducted from the deposit.</li>
              </ul>
              <div className="mt-8 pt-8 border-t border-gray-300 grid grid-cols-2 gap-8">

                <div>
                  <div className="border-b border-gray-400 h-10 w-48"></div>
                  <div className="mt-2 text-xs uppercase font-bold text-gray-500">Authorized Signatory</div>
                </div>
                <div>                  {formData.agreement.accepted ? (
                    <div className="h-10 text-success font-bold italic flex items-end">Digitally Accepted</div>
                  ) : (
                    <div className="border-b border-gray-400 h-10 w-48"></div>
                  )}
                  <div className="mt-2 text-xs uppercase font-bold text-gray-500">Student Signature</div>
                </div>
              </div>
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer mt-4 p-3 border border-primary rounded-lg bg-primary-subtle motion-safe:transition-colors">            <input type="checkbox" checked={formData.agreement.accepted} onChange={e => setFormData({...formData, agreement: { accepted: e.target.checked }})} className="w-5 h-5 accent-[var(--primary)] cursor-pointer" />
            <span className="text-sm font-medium text-primary">I verify the student has read and accepts all legal terms and conditions.</span>
          </label>
        </div>
      )}
      {step === 8 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2"><Key className="text-primary" /> Credentials Setup</h2>
          <p className="text-sm text-secondary">Set a temporary password for the Student. They will be forced to change it on their first login.</p>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Temporary Password</label>            <input type="text" value={formData.credentials.password} onChange={e => setFormData({...formData, credentials: { password: e.target.value }})} className="w-full max-w-sm bg-input border border rounded px-3 py-2 text-primary focus:border-primary outline-none font-mono" />
          </div>
          <div className="bg-warning-bg border border-warning text-warning p-3 rounded-lg text-sm flex items-start gap-2">
            <Lock className="w-4 h-4 mt-0.5 shrink-0" />            <p>System will enforce password reset when {formData.personal.email || 'student'} logs in.</p>
          </div>
        </div>
      )}
      {step === 9 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2"><Utensils className="text-primary" /> Mess Wallet Initialization</h2>
          <div className="border-2 border rounded-xl p-8 text-center bg-input">
            <div className="w-16 h-16 bg-primary-subtle rounded-full flex items-center justify-center mx-auto mb-4 border border-primary">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg text-primary mb-2">Wallet Ready</h3>
            <p className="text-secondary text-sm mb-4">A mess wallet will be created for this student with ₹0 starting balance.</p>
            <div className="inline-block px-4 py-2 bg-card border border rounded-lg text-primary font-mono font-bold text-xl">
              ₹0.00
            </div>
          </div>
        </div>
      )}
      {step === 10 && (
        <div className="space-y-4 animate-in zoom-in-95 flex flex-col items-center justify-center py-10 text-center">
          <div className="w-20 h-20 bg-success-bg rounded-full flex items-center justify-center mb-4 border-4 border-success">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-primary">Check-in Complete!</h2>
          <p className="text-secondary mb-6 max-w-md">
            {formData.personal.name} has been successfully onboarded to Room {(vacantBeds.find((b) =>(b as Record<string, unknown>).id===formData.room.bedId) as unknown)?.roomNumber || '-'}. 
            Parent link created and mess wallet initialized.
          </p>
          <div className="flex gap-4">
            <button onClick={() => router.push('/manager/students')} className="px-6 py-2.5 bg-input border border text-primary font-medium rounded-lg hover:bg-primary-subtle motion-safe:transition-colors">
              Go to Students
            </button>
            <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover motion-safe:transition-colors">
              New Check-in
            </button>
          </div>
        </div>
      )}
    </>

  );
}