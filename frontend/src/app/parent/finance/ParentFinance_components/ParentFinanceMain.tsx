'use client';

import { useEffect, useState } from 'react';
import { IndianRupee, FileText, CheckCircle2, Clock } from 'lucide-react';

import { parentOperationsApi as api } from '@/app/parent/parent_lib/parent_api/ParentOperations';

export function ParentFinanceMain() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.getLinkedChild(),
      api.getInvoices(),
    ]).then(([linkedChild, invList]) => {
      if (isMounted) {
        setChild(linkedChild);
        setInvoices(Array.isArray(invList) ? invList : []);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return <div className="p-6 animate-pulse">Loading finance data...</div>;
  }

  const unpaidInvoices = invoices.filter(i => i.status !== 'PAID' && i.status !== 'Paid');
  const paidInvoices = invoices.filter(i => i.status === 'PAID' || i.status === 'Paid');
  const totalDue = unpaidInvoices.reduce((acc, curr) => acc + ((curr.totalAmount || curr.amount || 0) - (curr.paidAmount || 0)), 0);

  const handlePay = async (invoiceId: string) => {
    try {
      await api.payInvoice(invoiceId, 'UPI');
      alert('Payment successful!');
      const updated = await api.getInvoices();
      setInvoices(Array.isArray(updated) ? updated : []);
    } catch (e: any) {
      alert(e.message || 'Payment failed');
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      <div>
        <h1 className="text-[22px] font-bold text-primary flex items-center gap-2">
          <IndianRupee className="w-6 h-6" />
          Rent & Finance
        </h1>
        <p className="text-sm text-secondary">Manage and track rent payments for {child?.fullName || child?.name || 'your child'}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-secondary">Total Outstanding Dues</span>
          <span className={`text-2xl font-black ${totalDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            ₹{Math.round(totalDue / 100).toLocaleString('en-IN')}
          </span>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-secondary">Pending Invoices</span>
          <span className="text-2xl font-black text-primary">{unpaidInvoices.length}</span>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-secondary">Paid Invoices</span>
          <span className="text-2xl font-black text-emerald-600">{paidInvoices.length}</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Invoice History
        </h2>
        {invoices.length === 0 ? (
          <div className="text-center py-8 text-secondary text-sm">No invoices found.</div>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => {
              const isPaid = inv.status === 'PAID' || inv.status === 'Paid';
              const amt = Math.round((inv.totalAmount || inv.amount || 0) / 100);
              return (
                <div key={inv.id} className="p-4 bg-page border border-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-primary text-sm flex items-center gap-2">
                      Invoice #{inv.invoiceNumber || inv.id}
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${isPaid ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                        {isPaid ? 'PAID' : 'PENDING'}
                      </span>
                    </div>
                    <div className="text-xs text-secondary mt-1">Due Date: {new Date(inv.dueDate).toLocaleDateString('en-IN')}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-base font-black text-primary">₹{amt.toLocaleString('en-IN')}</span>
                    {!isPaid && (
                      <button onClick={() => handlePay(inv.id)} className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary/90">
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
