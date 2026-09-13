'use client';

// RESPONSIBILITY: Renders the Student Documents & Agreement UI.

import { FileText, Download, Upload, CheckCircle, Clock, BookOpen, FileSignature } from 'lucide-react';
import { useStudentContext } from '@/app/student/student_components/StudentContext';

export function StudentDocumentsMain() {
  const { profile } = useStudentContext();

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
          📄 Agreement & Documents
        </h1>
        <p className="text-sm text-secondary mt-1">Manage your lease agreement, KYC documents, and PG rules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Lease Agreement */}
        <div className="md:col-span-2 bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
          <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
            <FileSignature className="w-5 h-5 text-primary" /> Digital Lease Agreement
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-primary-subtle border border-primary/20 rounded-[var(--radius-md)] p-5">
             <div className="w-20 h-24 bg-white rounded shadow border border-border flex items-center justify-center shrink-0">
               <FileText className="w-10 h-10 text-primary" />
             </div>
             <div className="flex-1 text-center sm:text-left">
               <div className="font-bold text-primary text-lg">Lease Agreement 2024-25</div>
               <div className="text-sm text-secondary mb-3">Digitally signed on: {profile?.createdAt ? new Date((profile as any).createdAt).toLocaleDateString() : '01/08/2024'}</div>
               <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                 <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-[var(--radius-md)] shadow hover:bg-primary-hover transition-colors flex items-center gap-2">
                   <FileText className="w-4 h-4" /> View Agreement
                 </button>
                 <button className="px-4 py-2 bg-white text-primary border border-primary/30 text-sm font-bold rounded-[var(--radius-md)] hover:bg-page transition-colors flex items-center gap-2">
                   <Download className="w-4 h-4" /> Download PDF
                 </button>
               </div>
             </div>
          </div>
        </div>

        {/* Rules & Regulations */}
        <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
              <BookOpen className="w-5 h-5 text-info" /> PG Rule Book
            </h3>
            <p className="text-sm text-secondary mb-4">Read the official rules and regulations regarding timings, visitors, and discipline.</p>
          </div>
          <button className="w-full px-4 py-3 bg-info-bg text-info font-bold rounded-[var(--radius-md)] border border-info/30 hover:bg-info/10 transition-colors flex items-center justify-center gap-2">
             <Download className="w-4 h-4" /> Download Rule Book
          </button>
        </div>

        {/* KYC Documents */}
        <div className="md:col-span-3 bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
          <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
            📋 KYC Documents
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {/* Aadhar Card */}
             <div className="border border-border rounded-[var(--radius-md)] p-4 flex flex-col justify-between hover:border-primary transition-colors">
               <div>
                 <div className="flex justify-between items-start mb-2">
                   <div className="w-10 h-10 bg-primary-subtle text-primary rounded-[var(--radius-md)] flex items-center justify-center">
                     <FileText className="w-5 h-5" />
                   </div>
                   <span className="bg-success-bg text-success text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                     <CheckCircle className="w-3 h-3" /> Verified
                   </span>
                 </div>
                 <div className="font-bold text-primary text-sm mb-1">Aadhar Card</div>
                 <div className="text-xs text-secondary mb-4">Uploaded on 01/08/2024</div>
               </div>
               <button className="w-full py-1.5 text-xs font-bold text-primary bg-input rounded hover:bg-border transition-colors">
                 View Document
               </button>
             </div>
             
             {/* ID Card */}
             <div className="border border-border rounded-[var(--radius-md)] p-4 flex flex-col justify-between hover:border-primary transition-colors">
               <div>
                 <div className="flex justify-between items-start mb-2">
                   <div className="w-10 h-10 bg-primary-subtle text-primary rounded-[var(--radius-md)] flex items-center justify-center">
                     <FileText className="w-5 h-5" />
                   </div>
                   <span className="bg-success-bg text-success text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                     <CheckCircle className="w-3 h-3" /> Verified
                   </span>
                 </div>
                 <div className="font-bold text-primary text-sm mb-1">College/Work ID</div>
                 <div className="text-xs text-secondary mb-4">Uploaded on 01/08/2024</div>
               </div>
               <button className="w-full py-1.5 text-xs font-bold text-primary bg-input rounded hover:bg-border transition-colors">
                 View Document
               </button>
             </div>

             {/* Police Verification */}
             <div className="border border-border rounded-[var(--radius-md)] p-4 flex flex-col justify-between border-dashed bg-page">
               <div>
                 <div className="flex justify-between items-start mb-2">
                   <div className="w-10 h-10 bg-input text-secondary rounded-[var(--radius-md)] flex items-center justify-center">
                     <Upload className="w-5 h-5" />
                   </div>
                   <span className="bg-warning-bg text-warning text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                     <Clock className="w-3 h-3" /> Pending
                   </span>
                 </div>
                 <div className="font-bold text-primary text-sm mb-1">Police Verification</div>
                 <div className="text-xs text-secondary mb-4">Action required</div>
               </div>
               <button className="w-full py-1.5 text-xs font-bold text-white bg-primary rounded hover:bg-primary-hover transition-colors shadow">
                 Upload Now
               </button>
             </div>

             {/* Passport Photo */}
             <div className="border border-border rounded-[var(--radius-md)] p-4 flex flex-col justify-between hover:border-primary transition-colors">
               <div>
                 <div className="flex justify-between items-start mb-2">
                   <div className="w-10 h-10 bg-primary-subtle text-primary rounded-[var(--radius-md)] flex items-center justify-center">
                     <FileText className="w-5 h-5" />
                   </div>
                   <span className="bg-success-bg text-success text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                     <CheckCircle className="w-3 h-3" /> Verified
                   </span>
                 </div>
                 <div className="font-bold text-primary text-sm mb-1">Passport Photo</div>
                 <div className="text-xs text-secondary mb-4">Uploaded on 01/08/2024</div>
               </div>
               <button className="w-full py-1.5 text-xs font-bold text-primary bg-input rounded hover:bg-border transition-colors">
                 View Photo
               </button>
             </div>

          </div>
        </div>

      </div>
    </div>
  );
}
