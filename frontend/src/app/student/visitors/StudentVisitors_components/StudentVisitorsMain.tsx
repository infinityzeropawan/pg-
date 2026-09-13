'use client';

// RESPONSIBILITY: Renders the Student Visitors UI.

import { useState } from 'react';
import { Users, Plus, QrCode, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function StudentVisitorsMain() {
  const [showNewModal, setShowNewModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Visitor request submitted for approval.');
    setShowNewModal(false);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
            🤝 Visitor Management
          </h1>
          <p className="text-sm text-secondary mt-1">Request guest entry and view visitor history.</p>
        </div>
        <button onClick={() => setShowNewModal(true)} className="px-5 py-2.5 bg-primary text-white rounded-[var(--radius-md)] font-bold shadow-md flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors whitespace-nowrap">
          <Plus className="w-5 h-5"/> New Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Active Passes / QR Code */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm text-center">
             <h3 className="font-black text-primary text-lg mb-4 border-b border-border pb-3 flex justify-center items-center gap-2">
               <QrCode className="w-5 h-5 text-primary" /> Active Gate Pass
             </h3>
             <div className="bg-primary-subtle border border-primary/20 rounded-[var(--radius-md)] p-4 inline-block mx-auto mb-4">
               <QrCode className="w-32 h-32 text-primary" />
             </div>
             <div className="text-sm font-bold text-primary mb-1">Visitor: Ramesh Patel</div>
             <div className="text-xs text-secondary mb-3">Relation: Father</div>
             <span className="inline-flex items-center gap-1 bg-success-bg text-success text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full">
               <CheckCircle className="w-3 h-3" /> Approved (Valid Today)
             </span>
             <p className="text-xs text-secondary mt-4 border-t border-border pt-3">Show this QR at the security gate for quick entry.</p>
          </div>
        </div>

        {/* History / Requests */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden shadow-sm h-full flex flex-col">
            <div className="p-4 border-b border-border bg-input flex items-center gap-2">
              <button onClick={()=>setActiveTab('active')} className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-bold transition-colors ${activeTab === 'active' ? 'bg-primary text-white shadow' : 'text-secondary hover:text-primary'}`}>
                Active / Pending
              </button>
              <button onClick={()=>setActiveTab('history')} className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-bold transition-colors ${activeTab === 'history' ? 'bg-primary text-white shadow' : 'text-secondary hover:text-primary'}`}>
                Past Visitors
              </button>
            </div>

            <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
              {activeTab === 'active' ? (
                <>
                  <div className="p-4 border border-border rounded-[var(--radius-md)] hover:border-primary transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="font-bold text-primary text-lg">Ramesh Patel</div>
                      <div className="text-sm text-secondary">Relation: Father | Phone: +91 9876543210</div>
                      <div className="text-xs text-secondary mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Entry: Today, 5:00 PM
                      </div>
                    </div>
                    <span className="bg-success-bg text-success text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border border-success/20">
                      Approved
                    </span>
                  </div>
                  <div className="p-4 border border-border rounded-[var(--radius-md)] hover:border-primary transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="font-bold text-primary text-lg">Vikas Kumar</div>
                      <div className="text-sm text-secondary">Relation: Friend | Phone: +91 9988776655</div>
                      <div className="text-xs text-secondary mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Entry: Tomorrow, 2:00 PM
                      </div>
                    </div>
                    <span className="bg-warning-bg text-warning text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border border-warning/20">
                      Pending
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 border border-border rounded-[var(--radius-md)] bg-input/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 opacity-70">
                    <div>
                      <div className="font-bold text-primary text-lg line-through decoration-danger">Suresh Patel</div>
                      <div className="text-sm text-secondary">Relation: Uncle</div>
                      <div className="text-xs text-secondary mt-2">Visited on: 15/07/2024 (Out: 6:00 PM)</div>
                    </div>
                    <span className="bg-page text-secondary text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border border-border">
                      Completed
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

      </div>

      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleRequest} className="bg-card w-full max-w-md rounded-[var(--radius-lg)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-border bg-input flex justify-between items-center">
              <h2 className="text-lg font-black text-primary flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> New Visitor Request
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-2">Visitor Name</label>
                <input required type="text" placeholder="Full Name" className="w-full bg-input border border-border px-4 py-3 rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-primary text-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase mb-2">Relation</label>
                  <select required className="w-full bg-input border border-border px-4 py-3 rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-primary text-primary">
                    <option value="">Select</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase mb-2">Phone</label>
                  <input required type="tel" placeholder="Mobile Number" className="w-full bg-input border border-border px-4 py-3 rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-primary text-primary" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-2">Expected Date & Time</label>
                <input required type="datetime-local" className="w-full bg-input border border-border px-4 py-3 rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-primary text-primary" />
              </div>
              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-2">Purpose of Visit</label>
                <input required type="text" placeholder="E.g., Dropping off luggage" className="w-full bg-input border border-border px-4 py-3 rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-primary text-primary" />
              </div>
            </div>
            
            <div className="p-5 border-t border-border bg-input flex gap-3">
              <button type="button" onClick={() => setShowNewModal(false)} className="flex-1 py-3 bg-page text-primary rounded-[var(--radius-md)] font-bold border border-border hover:bg-border transition-colors text-sm">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-[var(--radius-md)] font-bold shadow-md hover:bg-primary-hover transition-colors text-sm">Submit Request</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
