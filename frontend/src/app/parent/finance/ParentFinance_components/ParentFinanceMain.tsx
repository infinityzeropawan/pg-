'use client';
import { useEffect, useState } from 'react';
import { IndianRupee, FileText, CheckCircle2, Clock } from 'lucide-react';

import { parentOperationsApi as api } from '@/app/parent/parent_lib/parent_api/ParentOperations';
import { getSession } from '@/app/parent/parent_lib/parent_auth/ParentSession';

export function ParentFinanceMain() {
  const user = typeof window !== 'undefined' ? getSession() : null;
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      const linkedChild = api.getLinkedChild(user.id);
      setChild(linkedChild);
      if (linkedChild) {
        setInvoices(api.getChildInvoices(linkedChild.id));
      }
    }
    setLoading(false);
  }, [user?.id]);

  if (loading) {
    return <div className="p-6 animate-pulse">Loading finance data...</div>;
  }

  const unpaidInvoices = invoices.filter(i => i.status !== 'Paid');
  const paidInvoices = invoices.filter(i => i.status === 'Paid');
  const totalDue = unpaidInvoices.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      <div>
        <h1 className="text-[22px] font-bold text-primary flex items-center gap-2">
          <IndianRupee className="w-6 h-6" />
          Rent & Finance
        </h1>
        <p className="text-sm text-secondary">Manage and track rent payments for {child?.name || 'your child'}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary-subtle border border-primary/20 rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-2">Total Outstanding Dues</h3>
          <div className="text-4xl font-black text-primary mb-4">₹{totalDue.toLocaleString('en-IN')}</div>
          {totalDue > 0 ? (
            <button className="bg-primary text-white font-bold py-2.5 px-6 rounded-md hover:bg-primary-hover shadow-lg motion-safe:transition-colors w-full sm:w-auto">
              Pay Now
            </button>
          ) : (
             <div className="flex items-center gap-2 text-success font-bold bg-success/10 px-4 py-2 rounded w-max border border-success/20">
               <CheckCircle2 className="w-5 h-5" /> All dues cleared
             </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm flex flex-col justify-center">
          <h3 className="text-lg font-bold text-primary mb-2">Payment Methods</h3>
          <p className="text-sm text-secondary mb-4">You can pay rent using UPI, Net Banking, or Credit/Debit Card through our secure gateway.</p>
          <div className="flex gap-2">
            <span className="text-xs font-bold text-primary bg-page border border-border px-3 py-1.5 rounded">UPI</span>
            <span className="text-xs font-bold text-primary bg-page border border-border px-3 py-1.5 rounded">Cards</span>
            <span className="text-xs font-bold text-primary bg-page border border-border px-3 py-1.5 rounded">Net Banking</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-page flex items-center justify-between">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <FileText className="w-5 h-5 text-secondary" />
            Invoice History
          </h3>
        </div>

        {invoices.length === 0 ? (
          <div className="p-8 text-center text-secondary text-sm">No invoices found for this student.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-page border-b border-border text-xs uppercase text-secondary font-bold">
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-input/50 motion-safe:transition-colors">
                    <td className="px-4 py-4 text-sm font-bold text-primary">{inv.month}</td>
                    <td className="px-4 py-4 text-sm font-medium text-primary">₹{inv.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-4 text-sm text-secondary">{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      {inv.status === 'Paid' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-success/10 text-success px-2 py-1 rounded">
                          <CheckCircle2 className="w-3 h-3" /> PAID
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-warning/10 text-warning px-2 py-1 rounded">
                          <Clock className="w-3 h-3" /> PENDING
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {inv.status !== 'Paid' && (
                        <button className="text-xs bg-primary text-white font-bold px-3 py-1.5 rounded hover:bg-primary-hover transition-colors">
                          Pay
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
