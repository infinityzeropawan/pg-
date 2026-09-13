'use client';

// RESPONSIBILITY: Renders the Student Stay History UI.

import { History, MapPin, Download, CheckCircle, FileText } from 'lucide-react';

export function StudentHistoryMain() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
          🕒 Stay History
        </h1>
        <p className="text-sm text-secondary mt-1">View your previous room allocations and clearance certificates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Past Stays List */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
            <History className="w-5 h-5 text-primary" /> Previous Allocations
          </h3>

          <div className="relative border-l-2 border-border ml-3 pl-6 pb-6">
            <div className="absolute w-4 h-4 rounded-full -left-[9px] top-1 bg-success border-2 border-card shadow-sm"></div>
            <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 shadow-sm hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-primary text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary" /> Current Stay
                </h4>
                <span className="text-xs font-bold text-success bg-success-bg px-2 py-1 rounded-[var(--radius-sm)]">Active</span>
              </div>
              <p className="text-sm text-secondary mb-3">Green Valley PG - Room 203 (Double Sharing)</p>
              <p className="text-xs font-bold text-primary">From: 01 Aug 2024 — Present</p>
            </div>
          </div>

          <div className="relative border-l-2 border-border ml-3 pl-6 pb-6">
            <div className="absolute w-4 h-4 rounded-full -left-[9px] top-1 bg-input border-2 border-card shadow-sm"></div>
            <div className="bg-card/50 border border-border rounded-[var(--radius-lg)] p-5 hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-primary text-lg flex items-center gap-2 opacity-80">
                  <MapPin className="w-4 h-4 text-secondary" /> Previous Room
                </h4>
                <span className="text-xs font-bold text-secondary bg-page px-2 py-1 rounded-[var(--radius-sm)] border border-border">Completed</span>
              </div>
              <p className="text-sm text-secondary mb-3 opacity-80">Green Valley PG - Room 105 (Triple Sharing)</p>
              <p className="text-xs font-bold text-secondary opacity-80">From: 01 Jan 2024 — 31 Jul 2024</p>
            </div>
          </div>
        </div>

        {/* Clearance Certificates */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm h-full">
             <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
               <FileText className="w-5 h-5 text-info" /> Clearance
             </h3>
             <p className="text-sm text-secondary mb-6">Download your No Dues and Clearance certificates for past stays.</p>
             
             <div className="space-y-4">
               <div className="bg-input rounded-[var(--radius-md)] p-4 border border-border flex items-center justify-between">
                 <div>
                   <div className="font-bold text-primary text-sm">Room 105 Clearance</div>
                   <div className="text-xs text-secondary mt-1">Generated: 31 Jul 2024</div>
                 </div>
                 <button className="w-8 h-8 rounded-full bg-page border border-border text-primary flex items-center justify-center hover:bg-primary-subtle transition-colors">
                   <Download className="w-4 h-4" />
                 </button>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
