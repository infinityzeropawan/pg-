// RESPONSIBILITY: Renders the OwnerPayrollPaymentModal component. Receives data via props/hooks.

import { X, Loader2, Banknote } from 'lucide-react';
import { format } from 'date-fns';

import type { Dispatch, SetStateAction } from 'react';

export interface OwnerPayrollPaymentModalProps {
  paymentModalOpen: boolean;
  setPaymentModalOpen: Dispatch<SetStateAction<boolean>>;
  selectedStaff: unknown;
  currentDate: Date;
  processingPayment: boolean;
  paymentForm: unknown;
  setPaymentForm: Dispatch<SetStateAction<any>>;
  handleProcessPayment: (e: React.FormEvent) => void;
}

export function OwnerPayrollPaymentModal({
  paymentModalOpen,
  setPaymentModalOpen,
  selectedStaff,
  currentDate,
  processingPayment,
  paymentForm,
  setPaymentForm,
  handleProcessPayment
}: OwnerPayrollPaymentModalProps) {
  if (!paymentModalOpen || !selectedStaff) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in motion-safe:duration-200">
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-md border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-page">
          <div>
            <h3 className="text-[18px] font-bold text-primary">Record Salary Payment</h3>

            <p className="text-[12px] text-secondary">Paying <strong className="text-primary">{(selectedStaff as any).staff.name}</strong> for {format(currentDate, 'MMMM yyyy')}</p>
          </div>
          <button 
            onClick={() => !processingPayment && setPaymentModalOpen(false)}
            className="text-secondary hover:text-primary motion-safe:transition-colors p-1"
            disabled={processingPayment}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleProcessPayment} className="p-6 space-y-5">
          <div className="bg-page p-4 rounded-md border border-border flex justify-between items-center mb-6">
            <span className="text-[14px] font-medium text-secondary">Salary Amount</span>

            <span className="text-[22px] font-bold text-primary">₹{((selectedStaff as any).staff.salary || 0).toLocaleString('en-IN')}</span>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-secondary mb-2 uppercase tracking-wider">Payment Mode</label>
            <div className="grid grid-cols-3 gap-3">
              {['UPI', 'Cash', 'Bank Transfer'].map((mode) => (
                <button
                  key={mode}
                  type="button"

                  onClick={() => setPaymentForm({...(paymentForm as any), mode})}
                  className={`py-2 px-3 rounded-md text-[13px] font-semibold border motion-safe:transition-all ${

                    (paymentForm as any).mode === mode 
                      ? 'border-primary bg-primary-subtle text-primary'
                      : 'border-border bg-page text-secondary hover:border-text-secondary'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>


          {(paymentForm as any).mode !== 'Cash' && (
            <div className="animate-in fade-in motion-safe:duration-200">
              <label className="block text-[12px] font-semibold text-secondary mb-1.5 uppercase tracking-wider">Transaction ID (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. TXN123456789"

                value={(paymentForm as any).transactionId}

                onChange={e => setPaymentForm({...(paymentForm as any), transactionId: e.target.value})}
                disabled={processingPayment}
                className="w-full bg-input border border-border rounded-md px-4 py-2.5 text-sm text-primary outline-none focus:border-primary motion-safe:transition-colors"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={processingPayment}
            className="w-full mt-4 py-3 bg-primary text-white text-[14px] font-bold rounded-md hover:bg-primary-hover motion-safe:transition-colors flex justify-center items-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {processingPayment ? (
              <><Loader2 className="w-4 h-4 motion-safe:animate-spin" /> Recording Payment...</>
            ) : (
              <><Banknote className="w-4 h-4" /> Mark as Paid</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
