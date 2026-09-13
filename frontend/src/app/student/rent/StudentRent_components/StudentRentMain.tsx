'use client';

// RESPONSIBILITY: Renders the StudentRentMain component based on the new checklist.

import { useState, useEffect } from 'react';
import { IndianRupee, CheckCircle, Download, FileText, Printer, Clock, CreditCard, Smartphone, Banknote, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import { useStudentContext } from '@/app/student/student_components/StudentContext';
import { getSession } from '@/app/student/student_lib/student_auth/StudentSession';
import { formatINR, formatDateOnly } from '@/lib/utils/formatters';

export function StudentRentMain() {
  const { profile } = useStudentContext();
  const session = typeof window !== 'undefined' ? getSession() : null;
  const [invoices, setInvoices] = useState<any[]>([]);
  const [showPayModal, setShowPayModal] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');

  const loadData = () => {
    if (profile) {
      setInvoices(studentOperationsApi.getInvoices((profile as any).userId || (profile as any).id));
    }
  };

  useEffect(() => {
    loadData();
  }, [profile]);

  const handlePay = () => {
    if (!session || !profile || !showPayModal) return;
    const totalAmount = showPayModal.amount + (showPayModal.electricityBillAmount || 0);
    studentOperationsApi.payInvoice(showPayModal.id, (profile as any).id, totalAmount, (session as any).id);
    toast.success(`Payment of ${formatINR(totalAmount)} via ${paymentMethod} successful!`);
    setShowPayModal(null);
    loadData();
  };

  if (!profile) return <div className="p-4 motion-safe:animate-pulse">Loading...</div>;

  const pending = invoices.filter(i => i.status !== 'Paid').sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const history = invoices.filter(i => i.status === 'Paid').sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  
  return (
    <div className="space-y-6 w-full pb-20 print:pb-0">
      <div className="print:hidden">
        <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
          💳 Rent & Payments
        </h1>
        <p className="text-sm text-secondary mt-1">Manage your monthly rent, security deposit, and payment history.</p>
      </div>

      {/* Top Section: Pending Dues & Security Deposit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
        {/* Pending Dues Box */}
        <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
              <Clock className="w-5 h-5 text-danger" /> Pending Rent & Dues
            </h3>
            {pending.length > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Base Rent</span>
                  <span className="font-medium text-primary">{formatINR(pending[0].amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Electricity (As per meter)</span>
                  <span className="font-medium text-primary">{formatINR(pending[0].electricityBillAmount || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Mess / Food</span>
                  <span className="font-medium text-primary">Included</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Wi-Fi & Maintenance</span>
                  <span className="font-medium text-primary">Included</span>
                </div>
                <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
                  <span className="font-black text-primary uppercase text-sm">Total Due</span>
                  <span className="font-black text-2xl text-danger">{formatINR(pending[0].amount + (pending[0].electricityBillAmount || 0))}</span>
                </div>
                <div className="text-xs font-bold text-danger bg-danger-bg p-2 rounded text-center">
                  Due Date: {new Date(pending[0].dueDate).toLocaleDateString()}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center h-full">
                 <CheckCircle className="w-12 h-12 text-success mb-3" />
                 <div className="font-black text-lg text-primary">No Pending Dues!</div>
                 <div className="text-sm text-secondary">You are all caught up for this month.</div>
              </div>
            )}
          </div>
          {pending.length > 0 && (
            <div className="mt-6">
              <button onClick={() => setShowPayModal(pending[0])} className="w-full py-3 bg-primary text-white rounded-[var(--radius-md)] font-bold shadow-md hover:bg-primary-hover transition-colors">
                Pay Now &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Security Deposit Box */}
        <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
          <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
            <ShieldAlert className="w-5 h-5 text-info" /> Security Deposit Details
          </h3>
          <div className="space-y-4">
             <div className="bg-info-bg border border-info/20 p-4 rounded-[var(--radius-md)]">
               <div className="text-xs font-bold text-info/80 uppercase mb-1">Total Amount Paid</div>
               <div className="text-3xl font-black text-info">₹10,000</div>
             </div>
             <div className="space-y-2 text-sm">
               <div className="flex justify-between border-b border-border pb-2">
                 <span className="text-secondary font-medium">Status</span>
                 <span className="font-bold text-success">Secured with PG</span>
               </div>
               <div className="flex justify-between border-b border-border pb-2">
                 <span className="text-secondary font-medium">Refundable Amount</span>
                 <span className="font-bold text-primary">₹10,000</span>
               </div>
               <div className="flex justify-between border-b border-border pb-2">
                 <span className="text-secondary font-medium">Expected Deductions</span>
                 <span className="font-bold text-primary">₹0 (Subject to inspection)</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-secondary font-medium">Refund Date</span>
                 <span className="font-bold text-primary">At time of move-out</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Payment History & Invoices */}
      <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm print:hidden">
        <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
          📜 Payment History & Invoices
        </h3>
        
        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-input text-secondary text-xs uppercase font-bold">
                <tr>
                  <th className="px-4 py-3 rounded-tl-[var(--radius-sm)]">Invoice ID</th>
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date Paid</th>
                  <th className="px-4 py-3 rounded-tr-[var(--radius-sm)] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-input transition-colors">
                    <td className="px-4 py-3 font-medium text-primary">#{inv.id.substring(0,8).toUpperCase()}</td>
                    <td className="px-4 py-3 text-secondary">{new Date(inv.dueDate).toLocaleString('default', { month: 'long', year: 'numeric' })}</td>
                    <td className="px-4 py-3 font-bold text-primary">{formatINR(inv.amount + (inv.electricityBillAmount || 0))}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-success font-bold text-xs bg-success-bg px-2 py-1 rounded">
                        <CheckCircle className="w-3 h-3" /> Paid
                      </span>
                    </td>
                    <td className="px-4 py-3 text-secondary">{new Date(inv.updatedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => window.print()} className="text-primary hover:underline font-bold text-xs flex items-center justify-end gap-1 w-full">
                        <Download className="w-3 h-3" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-secondary bg-input p-4 rounded-lg text-center">
            No payment history available yet.
          </div>
        )}
      </div>

      {/* Pay Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-[var(--radius-lg)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-border flex justify-between items-center bg-input">
              <h2 className="text-lg font-black text-primary flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-primary" /> Complete Payment
              </h2>
              <button onClick={() => setShowPayModal(null)} className="text-secondary hover:text-primary font-bold">X</button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="text-center">
                <div className="text-sm font-bold text-secondary uppercase mb-1">Total Amount</div>
                <div className="text-4xl font-black text-primary">{formatINR(showPayModal.amount + (showPayModal.electricityBillAmount || 0))}</div>
              </div>
              
              <div>
                <div className="text-sm font-bold text-secondary uppercase mb-3 border-b border-border pb-1">Select Payment Method</div>
                <div className="space-y-2">
                  <label className={`flex items-center gap-3 p-3 rounded-[var(--radius-md)] border cursor-pointer transition-colors ${paymentMethod === 'UPI' ? 'border-primary bg-primary-subtle' : 'border-border hover:bg-input'}`}>
                    <input type="radio" name="pay_method" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} className="accent-primary" />
                    <Smartphone className={`w-5 h-5 ${paymentMethod === 'UPI' ? 'text-primary' : 'text-secondary'}`} />
                    <span className={`font-bold text-sm ${paymentMethod === 'UPI' ? 'text-primary' : 'text-secondary'}`}>UPI (GPay, PhonePe, Paytm)</span>
                  </label>
                  
                  <label className={`flex items-center gap-3 p-3 rounded-[var(--radius-md)] border cursor-pointer transition-colors ${paymentMethod === 'Card' ? 'border-primary bg-primary-subtle' : 'border-border hover:bg-input'}`}>
                    <input type="radio" name="pay_method" checked={paymentMethod === 'Card'} onChange={() => setPaymentMethod('Card')} className="accent-primary" />
                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'Card' ? 'text-primary' : 'text-secondary'}`} />
                    <span className={`font-bold text-sm ${paymentMethod === 'Card' ? 'text-primary' : 'text-secondary'}`}>Credit / Debit Card</span>
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-[var(--radius-md)] border cursor-pointer transition-colors ${paymentMethod === 'NetBanking' ? 'border-primary bg-primary-subtle' : 'border-border hover:bg-input'}`}>
                    <input type="radio" name="pay_method" checked={paymentMethod === 'NetBanking'} onChange={() => setPaymentMethod('NetBanking')} className="accent-primary" />
                    <Banknote className={`w-5 h-5 ${paymentMethod === 'NetBanking' ? 'text-primary' : 'text-secondary'}`} />
                    <span className={`font-bold text-sm ${paymentMethod === 'NetBanking' ? 'text-primary' : 'text-secondary'}`}>Net Banking</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-border bg-input">
              <button onClick={handlePay} className="w-full py-3 bg-primary text-white rounded-[var(--radius-md)] font-bold shadow-md hover:bg-primary-hover transition-colors">
                Pay {formatINR(showPayModal.amount + (showPayModal.electricityBillAmount || 0))} via {paymentMethod}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
