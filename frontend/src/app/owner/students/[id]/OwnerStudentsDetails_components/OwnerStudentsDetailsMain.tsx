// @ts-nocheck
'use client';

// RESPONSIBILITY: Renders the OwnerStudentsDetailsMain component. Receives data via props/hooks.

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { authApi } from '@/app/owner/owner_lib/owner_api/OwnerAuth';

import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';
import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';

import { ArrowLeft, User, Phone, Mail, Building, CreditCard, Activity, CheckCircle, ShieldAlert, LogOut, Clock } from 'lucide-react';
import Link from 'next/link';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import { OwnerBillUploadModal } from '@/app/owner/students/[id]/OwnerStudentsDetails_components/OwnerBillUploadModal';
import { financeApi } from '@/app/owner/owner_lib/owner_api/OwnerFinance';

export function OwnerStudentsDetailsMain({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const user = typeof window !== 'undefined' ? getSession() : null;
  const { properties } = useOwnerPropertyContext();

  const [student, setStudent] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Bill upload state
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [selectedInvoiceForBill, setSelectedInvoiceForBill] = useState<any>(null);

  const loadData = () => {
    if (!user || !id) return;
    setLoading(true);
    const data = studentsApi.getById(id);
    if (!data) {
      router.replace('/owner/students');
      return;
    }
    
    // Safety check: is owner of this property?
    const prop = propertiesApi.getById(data.profile.propertyId);
    if (prop?.ownerId !== user.id) {
      router.replace('/owner/students');
      return;
    }

    setStudent(data);
    setInvoices(studentOperationsApi.getInvoices(data.user.id));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id, user?.id, router]);

  const handleMarkNotice = () => {
    if (!user || !student) return;
    if (confirm(`Mark ${student.user.name} on notice?`)) {
      studentsApi.markNotice(student.profile.id, user.id);
      loadData();
    }
  };

  const handleCheckout = () => {
    if (!user || !student) return;
    if (confirm(`Are you sure you want to completely checkout ${student.user.name}? This will free their bed.`)) {
      studentsApi.checkout(student.profile.id, user.id);
      loadData();
    }
  };

  const handleSaveElectricityBill = (amount: number, imageUrl: string) => {
    if (selectedInvoiceForBill && user) {
      financeApi.updateElectricityBill(selectedInvoiceForBill.id, amount, imageUrl, user.id);
      loadData(); // Reload invoices
    }
  };

  if (loading || !student) return <div className="p-6 motion-safe:animate-pulse">Loading profile...</div>;

  const propertyName = properties.find(p => p.id === student.profile.propertyId)?.name || 'Unknown Property';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <OwnerBillUploadModal
        isOpen={isBillModalOpen}
        onClose={() => {
          setIsBillModalOpen(false);
          setSelectedInvoiceForBill(null);
        }}
        onSubmit={handleSaveElectricityBill}
        invoiceTitle={selectedInvoiceForBill?.month || 'Invoice'}
      />
      <div className="flex items-center gap-4 mb-2">
        <Link href="/owner/students" className="p-2 hover:bg-card rounded-full motion-safe:transition-colors text-secondary hover:text-primary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-[22px] font-bold text-primary flex items-center gap-3">
            {student.user.name}
            {student.profile.status === 'on_notice' && (
              <span className="text-[10px] uppercase bg-warning-bg text-warning px-2 py-1 rounded-md tracking-wider border border-warning">
                On Notice
              </span>
            )}
            {student.profile.status === 'checked_out' && (
              <span className="text-[10px] uppercase bg-danger-bg text-danger px-2 py-1 rounded-md tracking-wider border border-danger">
                Checked Out
              </span>
            )}
          </h1>
          <p className="text-sm text-secondary">Student Profile</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-input border-2 border-border flex items-center justify-center text-primary font-bold text-3xl mb-4">
                {student.user.name.substring(0, 2).toUpperCase()}
              </div>
              <h2 className="text-lg font-bold text-primary">{student.user.name}</h2>
              <p className="text-sm text-secondary">{propertyName}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-3 text-sm text-primary">
                <Phone className="w-4 h-4 text-secondary" />
                <span>{student.user.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary">
                <Mail className="w-4 h-4 text-secondary" />
                <span className="truncate">{student.user.email}</span>
              </div>
              <div className="flex flex-col gap-1 pt-3">
                <span className="text-xs text-secondary">Parent / Guardian</span>
                <div className="text-sm font-medium">{student.profile.parentName || 'Not provided'}</div>
                <div className="text-sm text-secondary">{student.profile.parentPhone}</div>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary pt-3 border-t border-border">
                <span className="text-secondary font-medium">Stay Duration:</span>
                <span className="font-bold">
                  {student.profile.stayStartDate && student.profile.stayEndDate ? 
                    `${Math.round((new Date(student.profile.stayEndDate).getTime() - new Date(student.profile.stayStartDate).getTime()) / (1000 * 3600 * 24 * 30))} Months` 
                    : 'Not specified'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border bg-[rgba(99,102,241,0.02)]">
              <h2 className="text-base font-semibold text-primary">Owner Actions</h2>
            </div>
            <div className="p-4 space-y-3">
              {student.profile.status === 'active' && (
                <button onClick={handleMarkNotice} className="w-full py-2.5 bg-warning-bg text-warning border border-warning rounded-md text-sm font-medium hover:bg-orange-900 motion-safe:transition-colors flex items-center justify-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Mark on Notice
                </button>
              )}
              
              {student.profile.status !== 'checked_out' && (
                <button onClick={handleCheckout} className="w-full py-2.5 bg-danger-bg text-danger border border-danger rounded-md text-sm font-medium hover:bg-red-900 motion-safe:transition-colors flex items-center justify-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Complete Checkout
                </button>
              )}

              {student.profile.status === 'checked_out' && (
                <div className="text-sm text-secondary text-center py-2">
                  This student has completely checked out.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="text-xs text-secondary font-medium mb-1">Pending Dues</div>
              <div className={`text-2xl font-bold ${student.profile.duesAmount > 0 ? 'text-danger' : 'text-success'}`}>
                ₹{student.profile.duesAmount.toLocaleString()}
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="text-xs text-secondary font-medium mb-1">Monthly Rent</div>
              <div className="text-2xl font-bold text-primary">
                ₹{student.profile.rentAmount.toLocaleString()}
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-5 relative overflow-hidden">
              <div className="text-xs text-secondary font-medium mb-1 relative z-10">PG Score</div>
              <div className="text-2xl font-bold text-primary relative z-10">
                {student.profile.pgScore} / 100
              </div>
              <Activity className="absolute -bottom-4 -right-4 w-20 h-20 text-primary opacity-10" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 overflow-hidden">
            <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Rent Schedule & Payment History
            </h3>
            {invoices.length > 0 ? (
              <div className="relative border-l-2 border-border ml-3 space-y-6">
                {invoices.filter(i => i.type === 'Rent' || !i.type).sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()).map((invoice: unknown) => {
// @ts-expect-error
                  const dueTime = new Date(invoice.dueDate).getTime();
                  const nowTime = new Date().getTime();
                  const diffDays = (dueTime - nowTime) / (1000 * 3600 * 24);
                  const isDueSoon = diffDays <= 3;
// @ts-expect-error
                  const showAsDue = invoice.status === 'Pending' && isDueSoon;
// @ts-expect-error
                  const displayStatus = invoice.status === 'Paid' ? 'Paid' : (showAsDue ? 'DUE' : 'PENDING');

                  return (
// @ts-expect-error
                    <div key={invoice.id} className="relative pl-6">
// @ts-expect-error
                      <div className={`absolute w-4 h-4 rounded-full -left-[9px] top-1 ${(invoice as any).status === 'Paid' ? 'bg-success' : (showAsDue ? 'bg-danger' : 'bg-warning border-2 border-bg-card')}`}></div>
                      <div className={`bg-input p-4 rounded-lg border ${showAsDue ? 'border-danger/50 shadow-sm' : 'border-border'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
// @ts-expect-error
                            <h4 className={`font-bold ${showAsDue ? 'text-danger' : 'text-primary'}`}>{(invoice as any).title || (invoice as any).description || 'Monthly Rent'}</h4>
// @ts-expect-error
                            <p className={`text-xs ${showAsDue ? 'text-danger font-medium' : 'text-secondary'}`}>Due: {new Date((invoice as any).dueDate).toLocaleDateString()}</p>
                          </div>
// @ts-expect-error
                          <div className={`text-xs font-bold px-2 py-1 rounded ${(invoice as any).status === 'Paid' ? 'bg-success-bg text-success' : (showAsDue ? 'bg-danger-bg text-danger' : 'bg-warning-bg text-warning')}`}>
                            {displayStatus}
                          </div>
                        </div>
                      
                      <div className="flex flex-col gap-1 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-secondary font-medium">Rent</span>
// @ts-expect-error
                          <span className={`font-black ${showAsDue ? 'text-danger' : 'text-primary'}`}>₹{(invoice as any).amount.toLocaleString()}</span>
                        </div>
// @ts-expect-error
                        {(invoice as any).electricityBillAmount !== undefined ? (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-secondary font-medium">Electricity Bill</span>
// @ts-expect-error
                            <span className="font-bold text-primary">₹{(invoice as any).electricityBillAmount.toLocaleString()}</span>
                          </div>
                        ) : null}
// @ts-expect-error
                        {(invoice as any).electricityBillAmount !== undefined && (
                          <div className="flex justify-between items-center mt-2 border-t border-border pt-2">
                            <span className="text-sm font-bold text-primary">Total</span>
// @ts-expect-error
                            <span className={`font-black ${showAsDue ? 'text-danger' : 'text-primary'}`}>₹{((invoice as any).amount + (invoice as any).electricityBillAmount).toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex gap-2">
// @ts-expect-error
                        {!(invoice as any).electricityBillAmount && (
                          <button
                            onClick={() => {
                              setSelectedInvoiceForBill(invoice);
                              setIsBillModalOpen(true);
                            }}
                            className="text-xs font-bold text-primary bg-primary-subtle hover:bg-primary hover:text-white motion-safe:transition-colors px-3 py-1.5 rounded"
                          >
                            Add Electricity Bill
                          </button>
                        )}
// @ts-expect-error
                        {(invoice as any).electricityBillImage && (
                          <a
// @ts-expect-error
                            href={invoice.electricityBillImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-secondary bg-page border border-border hover:text-primary motion-safe:transition-colors px-3 py-1.5 rounded inline-flex items-center gap-1"
                          >
                            View Bill Receipt
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-secondary bg-input p-4 rounded-lg">
                No invoices found for this student.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
