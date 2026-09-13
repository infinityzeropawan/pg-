// RESPONSIBILITY: Payment modal for OwnerSubscription page.
'use client';

import { useState } from 'react';
import { CreditCard, CheckCircle2, Loader2, X } from 'lucide-react';

interface OwnerSubscriptionPaymentModalProps {
  selectedPlan: any;
  onClose: () => void;
  onPaymentSuccess: (planId: string) => void;
}

export function OwnerSubscriptionPaymentModal({
  selectedPlan,
  onClose,
  onPaymentSuccess,
}: OwnerSubscriptionPaymentModalProps) {
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingPayment(true);
    setTimeout(() => {
      onPaymentSuccess(selectedPlan.id);
      setProcessingPayment(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in motion-safe:duration-200">
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-md border border-border overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-page">
          <div>
            <h3 className="text-[18px] font-bold text-primary">Checkout</h3>
            <p className="text-[12px] text-secondary">You are upgrading to the <strong className="text-primary">{selectedPlan.name}</strong> plan</p>
          </div>
          <button 
            onClick={() => !processingPayment && onClose()}
            className="text-secondary hover:text-primary motion-safe:transition-colors p-1"
            disabled={processingPayment}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleProcessPayment} className="p-6 space-y-5">
          
          {/* Order Summary */}
          <div className="bg-page p-4 rounded-md border border-border flex justify-between items-center mb-6">
            <span className="text-[14px] font-medium text-secondary">Total Amount to Pay</span>
            <span className="text-[20px] font-bold text-primary">₹{selectedPlan.price.toLocaleString('en-IN')}</span>
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-[12px] font-semibold text-secondary mb-1.5 uppercase tracking-wider">Name on Card</label>
            <input 
              type="text" 
              required
              placeholder="e.g. John Doe"
              value={paymentForm.cardName}
              onChange={e => setPaymentForm({...paymentForm, cardName: e.target.value})}
              disabled={processingPayment}
              className="w-full bg-input border border-border rounded-md px-4 py-2.5 text-sm text-primary outline-none focus:border-primary motion-safe:transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-secondary mb-1.5 uppercase tracking-wider">Card Number</label>
            <div className="relative">
              <input 
                type="text" 
                required
                placeholder="0000 0000 0000 0000"
                maxLength={16}
                value={paymentForm.cardNumber}
                onChange={e => setPaymentForm({...paymentForm, cardNumber: e.target.value.replace(/\D/g, '')})}
                disabled={processingPayment}
                className="w-full bg-input border border-border rounded-md pl-10 pr-4 py-2.5 text-sm text-primary outline-none focus:border-primary motion-safe:transition-colors"
              />
              <CreditCard className="w-4 h-4 text-secondary absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-secondary mb-1.5 uppercase tracking-wider">Expiry (MM/YY)</label>
              <input 
                type="text" 
                required
                placeholder="MM/YY"
                maxLength={5}
                value={paymentForm.expiry}
                onChange={e => {
                  let val = e.target.value.replace(/\D/g, '');
                  if (val.length > 2) val = val.slice(0,2) + '/' + val.slice(2,4);
                  setPaymentForm({...paymentForm, expiry: val})
                }}
                disabled={processingPayment}
                className="w-full bg-input border border-border rounded-md px-4 py-2.5 text-sm text-primary outline-none focus:border-primary motion-safe:transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-secondary mb-1.5 uppercase tracking-wider">CVV</label>
              <input 
                type="password" 
                required
                placeholder="***"
                maxLength={3}
                value={paymentForm.cvv}
                onChange={e => setPaymentForm({...paymentForm, cvv: e.target.value.replace(/\D/g, '')})}
                disabled={processingPayment}
                className="w-full bg-input border border-border rounded-md px-4 py-2.5 text-sm text-primary outline-none focus:border-primary motion-safe:transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={processingPayment}
            className="w-full mt-2 py-3 bg-primary text-white text-[14px] font-bold rounded-md hover:bg-primary-hover motion-safe:transition-colors flex justify-center items-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {processingPayment ? (
              <><Loader2 className="w-4 h-4 motion-safe:animate-spin" /> Processing Secure Payment...</>
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> Pay ₹{selectedPlan.price.toLocaleString('en-IN')}</>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
