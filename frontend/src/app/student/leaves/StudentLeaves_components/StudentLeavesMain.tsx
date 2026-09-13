'use client';

// RESPONSIBILITY: Renders the Student Leave & Outing UI.

import { useState } from 'react';
import { CalendarOff, Plus, Clock, CheckCircle, XCircle, Moon, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export function StudentLeavesMain() {
  const [showNewModal, setShowNewModal] = useState(false);
  const [leaveType, setLeaveType] = useState<'Night Out' | 'Leave'>('Leave');

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Leave request submitted for approval.');
    setShowNewModal(false);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
            🏕️ Leave & Outing
          </h1>
          <p className="text-sm text-secondary mt-1">Request a night out or multi-day leave.</p>
        </div>
        <button onClick={() => setShowNewModal(true)} className="px-5 py-2.5 bg-primary text-white rounded-[var(--radius-md)] font-bold shadow-md flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors whitespace-nowrap">
          <Plus className="w-5 h-5"/> New Leave Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Active Leave / Ongoing */}
        <div className="bg-gradient-to-br from-bg-card to-info-bg border border-info/30 rounded-[var(--radius-lg)] p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110">
            <Moon className="w-24 h-24 text-info" />
          </div>
          <div className="flex justify-between items-start mb-3 relative z-10">
            <h3 className="font-bold text-primary text-lg">Night Out</h3>
            <span className="px-3 py-1 rounded-[var(--radius-full)] text-[10px] font-black tracking-wider uppercase shadow-sm bg-warning-bg border border-warning/20 text-warning">
              Pending Admin
            </span>
          </div>
          <div className="text-sm text-secondary mb-4 relative z-10">
            <strong>From:</strong> Tonight, 9:00 PM<br/>
            <strong>To:</strong> Tomorrow, 8:00 AM
          </div>
          <div className="text-xs text-secondary relative z-10 mb-4 bg-page p-2 rounded border border-border">
            <strong>Reason:</strong> Group Study at friend's PG
          </div>
          <div className="flex gap-2 relative z-10">
            <button className="flex-1 py-2 bg-page text-danger border border-danger/30 rounded-[var(--radius-md)] text-xs font-bold hover:bg-danger-bg transition-colors">
              Cancel Request
            </button>
          </div>
        </div>

        {/* History Item 1 */}
        <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm hover:border-primary transition-colors flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-primary text-lg">Home Visit</h3>
              <span className="px-3 py-1 rounded-[var(--radius-full)] text-[10px] font-black tracking-wider uppercase shadow-sm bg-success-bg border border-success/20 text-success">
                Approved & Closed
              </span>
            </div>
            <div className="text-sm text-secondary mb-4">
              <strong>From:</strong> 12 Aug 2024<br/>
              <strong>To:</strong> 15 Aug 2024
            </div>
            <div className="text-xs text-secondary mb-4 line-clamp-2">
              <strong>Reason:</strong> Independence Day long weekend. Going to hometown.
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-success uppercase tracking-wider bg-success-bg p-2 rounded">
            <CheckCircle className="w-3 h-3" /> Returned on time
          </div>
        </div>

        {/* History Item 2 */}
        <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm hover:border-primary transition-colors flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-primary text-lg">Night Out</h3>
              <span className="px-3 py-1 rounded-[var(--radius-full)] text-[10px] font-black tracking-wider uppercase shadow-sm bg-danger-bg border border-danger/20 text-danger">
                Rejected
              </span>
            </div>
            <div className="text-sm text-secondary mb-4">
              <strong>From:</strong> 05 Aug 2024, 10 PM<br/>
              <strong>To:</strong> 06 Aug 2024, 6 AM
            </div>
            <div className="text-xs text-secondary mb-4">
              <strong>Reason:</strong> Late night movie show
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-danger uppercase tracking-wider bg-danger-bg p-2 rounded">
            <XCircle className="w-3 h-3" /> Rejected by Warden (Rules violation)
          </div>
        </div>
      </div>

      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleRequest} className="bg-card w-full max-w-md rounded-[var(--radius-lg)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-border bg-input flex justify-between items-center">
              <h2 className="text-lg font-black text-primary flex items-center gap-2">
                <CalendarOff className="w-5 h-5 text-primary" /> New Request
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-2">Leave Type</label>
                <div className="flex bg-page border border-border p-1 rounded-[var(--radius-md)]">
                  <button type="button" onClick={() => setLeaveType('Leave')} className={`flex-1 py-2 text-sm font-bold rounded-[var(--radius-sm)] transition-colors ${leaveType === 'Leave' ? 'bg-primary text-white shadow' : 'text-secondary hover:text-primary'}`}>Multi-Day Leave</button>
                  <button type="button" onClick={() => setLeaveType('Night Out')} className={`flex-1 py-2 text-sm font-bold rounded-[var(--radius-sm)] transition-colors ${leaveType === 'Night Out' ? 'bg-primary text-white shadow' : 'text-secondary hover:text-primary'}`}>Night Out</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase mb-2">From Date/Time</label>
                  <input required type={leaveType === 'Night Out' ? 'datetime-local' : 'date'} className="w-full bg-input border border-border px-3 py-2 rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-primary text-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase mb-2">To Date/Time</label>
                  <input required type={leaveType === 'Night Out' ? 'datetime-local' : 'date'} className="w-full bg-input border border-border px-3 py-2 rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-primary text-primary" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-2">Destination Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                  <input required type="text" placeholder="Where are you going?" className="w-full bg-input border border-border pl-9 pr-3 py-2 rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-primary text-primary" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-2">Reason</label>
                <textarea required rows={3} placeholder="Please provide a valid reason..." className="w-full bg-input border border-border px-3 py-2 rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-primary text-primary resize-none"></textarea>
              </div>

              {leaveType === 'Leave' && (
                <div className="flex items-start gap-2 bg-warning-bg p-3 rounded-[var(--radius-md)] border border-warning/20">
                  <input type="checkbox" id="messOptOut" className="mt-0.5 accent-warning" />
                  <label htmlFor="messOptOut" className="text-xs text-warning font-medium cursor-pointer">
                    Automatically opt-out of Mess for these days to save wallet balance.
                  </label>
                </div>
              )}
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
