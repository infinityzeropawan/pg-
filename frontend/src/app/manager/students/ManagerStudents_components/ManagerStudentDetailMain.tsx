// RESPONSIBILITY: Renders the ManagerStudentDetailMain component.
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, MapPin, Calendar, IndianRupee, LogOut, Utensils, Clock, ShieldCheck, FileText, Smartphone } from 'lucide-react';
import Link from 'next/link';

import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';
import { useManagerSession } from '@/app/manager/manager_components/manager_hooks/useManagerSession';
import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import { ManagerBillUploadModal } from '@/app/manager/students/ManagerStudents_components/ManagerBillUploadModal';
import { financeApi } from '@/app/owner/owner_lib/owner_api/OwnerFinance';
interface StudentProfile {
  id: string; userId?: string; bedId?: string; createdAt: string; status?: string;
  parentName?: string; parentPhone?: string; rentAmount?: number; duesAmount?: number;
  hasMessFacility?: boolean; pgScore?: number; stayStartDate?: string; stayEndDate?: string;
}
interface StudentUser {
  id: string; name: string; phone?: string; email?: string;
}
interface StudentDetail {
  user: StudentUser;
  profile: StudentProfile;
}
interface Invoice {
  id: string; month?: string; type?: string; dueDate: string; status?: string;
  title?: string; description?: string; amount: number;
  electricityBillAmount?: number; electricityBillImage?: string;
}
export default function ManagerStudentDetailMain() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const user = useManagerSession();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  // Bill upload state
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [selectedInvoiceForBill, setSelectedInvoiceForBill] = useState<Invoice | null>(null);
  const loadData = useCallback(() => {
    if (id) {
const t = (api.students.getById ? api.students.getById(id) : null) as unknown as StudentDetail;
      setStudent(t);
      if (t) {
        if (t.user) {
          setInvoices(studentOperationsApi.getInvoices(t.user.id));
        }
      }
    }
  }, [id]);
  useEffect(() => {
    loadData();
  }, [loadData]);
  const handleCheckout = () => {
    if (confirm('Are you sure you want to checkout this student? This will revoke their access and free their bed.')) {
      api.students.checkout((student?.profile?.id || '') || '', user?.id || '');
      router.push('/manager/students');
    }
  };
  const handleSaveElectricityBill = (amount: number, imageUrl: string) => {
    if (selectedInvoiceForBill && user) {
      financeApi.updateElectricityBill(selectedInvoiceForBill.id, amount, imageUrl, user.id);
      loadData(); // Reload invoices
    }
  };
  if (!student) return <div className="p-6 text-secondary">Loading...</div>;
  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto manager-theme animate-fade-in">
      <ManagerBillUploadModal
        isOpen={isBillModalOpen}
        onClose={() => {
          setIsBillModalOpen(false);
          setSelectedInvoiceForBill(null);
        }}
        onSubmit={handleSaveElectricityBill}
        invoiceTitle={selectedInvoiceForBill?.month || 'Invoice'}
      />
      <Link href="/manager/students" className="inline-flex items-center gap-2 text-secondary hover:text-primary text-sm font-medium motion-safe:transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Students
      </Link>
      <div className="bg-card border border rounded-[var(--radius-xl,16px)] overflow-hidden shadow-sm">
        {/* Header Profile Section */}
        <div className="p-8 bg-gradient-to-r from-theme-primary/10 to-transparent border-b border flex flex-col md:flex-row md:items-center gap-6 relative">
          <div className="absolute top-4 right-4 bg-success-bg text-success px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm border border-success/20">
            <ShieldCheck className="w-3.5 h-3.5" /> KYC Verified
          </div>
          <div className="w-24 h-24 rounded-full bg-card border-4 border-white shadow-md flex items-center justify-center text-theme-primary text-3xl font-bold">
            {student.user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-primary">{student.user?.name || 'Unknown'}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-secondary">
              <span className="flex items-center gap-1.5 bg-input/50 px-3 py-1.5 rounded-[var(--radius-md,8px)]"><User className="w-4 h-4 text-theme-primary"/> ID: {student.profile?.userId?.slice(0,6)}</span>
              <span className="flex items-center gap-1.5 bg-input/50 px-3 py-1.5 rounded-[var(--radius-md,8px)]"><MapPin className="w-4 h-4 text-warning"/> Bed: {student.profile?.bedId || '-'}</span>
              <span className="flex items-center gap-1.5 bg-input/50 px-3 py-1.5 rounded-[var(--radius-md,8px)]"><Calendar className="w-4 h-4 text-info"/> Joined: {new Date(student.profile?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          {student.profile?.status !== 'checked_out' && (
            <button 
              onClick={handleCheckout}
              className="mt-4 md:mt-0 flex items-center justify-center gap-2 bg-danger-bg text-danger px-5 py-2.5 rounded-[var(--radius-md,8px)] font-bold hover:bg-danger/20 motion-safe:transition-colors border border-danger/20"
            >
              <LogOut className="w-4 h-4" /> Checkout Student
            </button>
          )}
        </div>

        {/* 360 View Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-input/30 p-5 rounded-[var(--radius-lg,12px)] border border-transparent hover:border-border transition-colors">
            <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-theme-primary" /> Contact Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center border-b border-dashed pb-2">
                <span className="text-secondary">Phone</span>
                <span className="font-bold text-primary">{student.user?.phone || '-'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-dashed pb-2">
                <span className="text-secondary">Email</span>
                <span className="font-bold text-primary">{student.user?.email || '-'}</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-secondary">Emergency Contact</span>
                <span className="font-bold text-primary">{student.profile.parentName || '-'} ({student.profile.parentPhone || '-'})</span>
              </div>
            </div>
          </div>

          <div className="bg-input/30 p-5 rounded-[var(--radius-lg,12px)] border border-transparent hover:border-border transition-colors">
            <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-success" /> Financials & Facilities
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center border-b border-dashed pb-2">
                <span className="text-secondary">Monthly Rent</span>
                <span className="font-bold text-primary">₹{student.profile.rentAmount || 0}</span>
              </div>
              <div className="flex justify-between items-center border-b border-dashed pb-2">
                <span className="text-secondary">Current Dues</span>
                <span className={`font-black ${(student.profile.duesAmount || 0) > 0 ? 'text-danger bg-danger-bg px-2 py-0.5 rounded' : 'text-success bg-success-bg px-2 py-0.5 rounded'}`}>
                  ₹{student.profile.duesAmount || 0}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-secondary">Mess Facility</span>
                <span className="font-bold text-primary flex items-center gap-1">
                  {student.profile.hasMessFacility ? (
                    <><Utensils className="w-3.5 h-3.5 text-warning"/> Subscribed</>
                  ) : 'Not Opted'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-input/30 p-5 rounded-[var(--radius-lg,12px)] border border-transparent hover:border-border transition-colors md:col-span-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 ${(student.profile.pgScore || 0) >= 80 ? 'border-success text-success bg-success-bg' : 'border-warning text-warning bg-warning-bg'}`}>
                <span className="font-bold">{student.profile.pgScore || 0}</span>
              </div>
              <div>
                <h3 className="font-bold text-primary text-lg">Trust Score</h3>
                <p className="text-xs text-secondary mt-1">Based on behavior, payment history, and rule adherence.</p>
              </div>
            </div>
            <button className="text-sm font-bold text-theme-primary hover:text-theme-primary-hover px-4 py-2 bg-theme-primary/10 rounded-[var(--radius-md,8px)] transition-colors">
              View Detailed Report
            </button>
          </div>
        </div>
        {/* Rent Schedule Section */}
        <div className="p-8 border-t border">
          <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Stay Duration & Rent Schedule
          </h3>
          {student.profile.stayStartDate && student.profile.stayEndDate ? (
            <div className="space-y-4">
              <div className="flex gap-4 text-sm text-secondary mb-6 bg-input p-4 rounded-lg">
                <div><strong>Start Date:</strong> {new Date(student.profile.stayStartDate).toLocaleDateString()}</div>
                <div><strong>End Date:</strong> {new Date(student.profile.stayEndDate).toLocaleDateString()}</div>
                <div><strong>Duration:</strong> {Math.round((new Date(student.profile.stayEndDate).getTime() - new Date(student.profile.stayStartDate).getTime()) / (1000 * 3600 * 24 * 30))} Months</div>
              </div>
              <div className="relative border-l-2 border ml-3 space-y-6">
                {invoices.filter(i => i.type === 'Rent' || !i.type).sort((a,b) => new Date(String(a.dueDate)).getTime() - new Date(String(b.dueDate)).getTime()).map((invoice: Invoice) => {
                  const dueTime = new Date(String(invoice.dueDate)).getTime();
                  const nowTime = new Date().getTime();
                  const diffDays = (dueTime - nowTime) / (1000 * 3600 * 24);
                  const isDueSoon = diffDays <= 3;
                  const showAsDue = invoice.status === 'Pending' && isDueSoon;
                  const displayStatus = invoice.status === 'Paid' ? 'Paid' : (showAsDue ? 'DUE' : 'PENDING');
                  return (
                  <div key={invoice.id} className="relative pl-6">
                    <div className={`absolute w-4 h-4 rounded-full -left-[9px] top-1 ${invoice.status === 'Paid' ? 'bg-success' : (showAsDue ? 'bg-danger' : 'bg-warning border-2 border-card')}`}></div>
                    <div className={`bg-input p-4 rounded-lg border ${showAsDue ? 'border-danger/50 shadow-sm' : 'border'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className={`font-bold ${showAsDue ? 'text-danger' : 'text-primary'}`}>{invoice.title || invoice.description || 'Monthly Rent'}</h4>
                          <p className={`text-xs ${showAsDue ? 'text-danger font-medium' : 'text-secondary'}`}>Due: {new Date(String(invoice.dueDate)).toLocaleDateString()}</p>
                        </div>
                        <div className={`text-xs font-bold px-2 py-1 rounded ${invoice.status === 'Paid' ? 'bg-success-bg text-success' : (showAsDue ? 'bg-danger-bg text-danger' : 'bg-warning-bg text-warning')}`}>
                          {displayStatus}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-secondary font-medium">Rent</span>
                          <span className={`font-black ${showAsDue ? 'text-danger' : 'text-primary'}`}>â‚¹{invoice.amount}</span>
                        </div>
                        {invoice.electricityBillAmount !== undefined ? (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-secondary font-medium">Electricity Bill</span>
                            <span className="font-bold text-primary">â‚¹{invoice.electricityBillAmount}</span>
                          </div>
                        ) : null}
                        {invoice.electricityBillAmount !== undefined && (
                          <div className="flex justify-between items-center mt-2 border-t border pt-2">
                            <span className="text-sm font-bold text-primary">Total</span>
                            <span className={`font-black ${showAsDue ? 'text-danger' : 'text-primary'}`}>â‚¹{invoice.amount + invoice.electricityBillAmount}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex gap-2">
                        {!invoice.electricityBillAmount && (
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
                        {invoice.electricityBillImage && (
                          <a
                            href={invoice.electricityBillImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-secondary bg-page border border hover:text-primary motion-safe:transition-colors px-3 py-1.5 rounded inline-flex items-center gap-1"
                          >
                            View Bill Receipt
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          ) : (
            <div className="text-sm text-secondary bg-input p-4 rounded-lg">
              No stay duration was recorded during onboarding. Monthly rent is tracked manually.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}