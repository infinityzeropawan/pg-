'use client';

// RESPONSIBILITY: Renders the Student Leave & Outing UI.
// DATA FLOW: GET /api/v1/student/leaves + POST /api/v1/student/leaves -> StudentLeavesMain

import { useState } from 'react';
import { CalendarOff, Plus, Clock, Moon, MapPin } from 'lucide-react';
import { toast } from 'sonner';

import { useStudentContext } from '@/app/student/student_components/StudentContext';
import { useStudentLeaves } from '../StudentLeaves_hooks/useStudentLeaves';

export function StudentLeavesMain() {
  const { profile } = useStudentContext();
  const {
    leaves,
    loading,
    submitting,
    requestLeave,
    cancelLeave,
    LEAVE_STATUS: STATUS,
  } = useStudentLeaves();

  const [showNewModal, setShowNewModal] = useState(false);
  const [leaveType, setLeaveType] = useState<'Night Out' | 'Leave'>('Leave');
  const [formData, setFormData] = useState({ startDate: '', endDate: '', destination: '', reason: '' });

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-input rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-input rounded-[var(--radius-lg)] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    await requestLeave({
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      destination: formData.destination,
    });
    setShowNewModal(false);
    setFormData({ startDate: '', endDate: '', destination: '', reason: '' });
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
            <CalendarOff className="w-6 h-6" /> Leave & Outing
          </h1>
          <p className="text-sm text-secondary mt-1">Request a night out or multi-day leave.</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="px-5 py-2.5 bg-primary text-white rounded-[var(--radius-md)] font-bold shadow-md flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors whitespace-nowrap"
        >
          <Plus className="w-5 h-5" /> New Leave Request
        </button>
      </div>

      {/* Active / Pending Leaves */}
      {leaves.filter(l => l.status === STATUS.PENDING || l.status === STATUS.APPROVED).length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {leaves
            .filter(l => l.status === STATUS.PENDING || l.status === STATUS.APPROVED)
            .map((l) => (
            <div key={l.id} className="bg-gradient-to-br from-bg-card to-info-bg border border-info/30 rounded-[var(--radius-lg)] p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Moon className="w-16 h-16 text-info" />
              </div>
              <div className="flex justify-between items-start mb-3 relative z-10">
                <h3 className="font-bold text-primary text-lg">{l.reason || 'Leave Request'}</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                  l.status === STATUS.PENDING
                    ? 'bg-warning-bg border border-warning/20 text-warning'
                    : 'bg-success-bg border border-success/20 text-success'
                }`}>
                  {l.status === STATUS.PENDING ? 'Pending' : 'Approved'}
                </span>
              </div>
              <div className="text-sm text-secondary mb-3 relative z-10">
                <strong>From:</strong> {new Date(l.startDate).toLocaleString('en-IN')}<br />
                <strong>To:</strong> {new Date(l.endDate).toLocaleString('en-IN')}
              </div>
              {l.reason && (
                <div className="text-xs text-secondary relative z-10 mb-3 bg-page p-2 rounded border border-border">
                  <strong>Reason:</strong> {l.reason}
                </div>
              )}
              {l.status === STATUS.PENDING && (
                <div className="flex gap-2 relative z-10">
                  <button
                    onClick={() => void cancelLeave(l.id)}
                    className="flex-1 py-2 bg-page text-danger border border-danger/30 rounded-[var(--radius-md)] text-xs font-bold hover:bg-danger-bg transition-colors"
                  >
                    Cancel Request
                  </button>
                </div>
              )}
            </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-[var(--radius-lg)]">
          <CalendarOff className="w-12 h-12 text-secondary/30 mx-auto mb-3" />
          <p className="text-primary font-bold">No active leave requests</p>
          <p className="text-sm text-secondary mt-1">Submit a new leave request to get started.</p>
        </div>
      )}

      {/* History */}
      {leaves.filter(l => l.status === STATUS.REJECTED || l.status === STATUS.CANCELLED || l.status === STATUS.APPROVED).length > 0 && (
        <div className="mt-8">
          <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" /> Recent Requests
          </h3>
          <div className="space-y-3">
            {leaves
              .filter(l => l.status === STATUS.REJECTED || l.status === STATUS.CANCELLED || l.status === STATUS.APPROVED)
              .map((l) => (
              <div key={l.id} className={`bg-card border border-border rounded-[var(--radius-lg)] p-4 flex justify-between items-center hover:border-primary transition-colors ${
                l.status === STATUS.APPROVED ? 'border-success/30 bg-success-bg/10' : l.status === STATUS.REJECTED ? 'border-danger/30 bg-danger-bg/10' : ''
              }`}>
                <div>
                  <h4 className="font-bold text-primary">{l.reason || 'Leave Request'}</h4>
                  <div className="text-xs text-secondary mt-1">
                    {new Date(l.startDate).toLocaleDateString('en-IN')} → {new Date(l.endDate).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                  l.status === STATUS.APPROVED
                    ? 'bg-success-bg text-success border border-success/20'
                    : l.status === STATUS.REJECTED
                    ? 'bg-danger-bg text-danger border border-danger/20'
                    : 'bg-secondary/10 text-secondary border border-secondary/20'
                }`}>
                  {l.status === STATUS.APPROVED ? 'Approved' : l.status === STATUS.REJECTED ? 'Rejected' : l.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Request Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleRequest} className="bg-card w-full max-w-md rounded-[var(--radius-lg)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-border bg-input/50 flex justify-between items-center">
              <h2 className="text-lg font-black text-primary flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> New Leave Request
              </h2>
              <button type="button" onClick={() => setShowNewModal(false)} className="text-secondary hover:text-primary">
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLeaveType('Leave')}
                  className={`flex-1 py-2 text-sm font-bold rounded-[var(--radius-sm)] transition-colors ${leaveType === 'Leave' ? 'bg-primary text-white shadow' : 'text-secondary hover:text-primary'}`}
                >
                  Multi-Day Leave
                </button>
                <button
                  type="button"
                  onClick={() => setLeaveType('Night Out')}
                  className={`flex-1 py-2 text-sm font-bold rounded-[var(--radius-sm)] transition-colors ${leaveType === 'Night Out' ? 'bg-primary text-white shadow' : 'text-secondary hover:text-primary'}`}
                >
                  Night Out
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase mb-2">From</label>
                  <input
                    required
                    type={leaveType === 'Night Out' ? 'datetime-local' : 'date'}
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-input border border-border px-3 py-2 rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-primary text-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase mb-2">To</label>
                  <input
                    required
                    type={leaveType === 'Night Out' ? 'datetime-local' : 'date'}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-input border border-border px-3 py-2 rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-primary text-primary"
                  />
                </div>
              </div>

              {leaveType === 'Leave' && (
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase mb-2">Destination Address</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      placeholder="Where are you going?"
                      className="w-full bg-input border border-border pl-9 pr-3 py-2 rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-primary text-primary"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-2">Reason</label>
                <textarea
                  required
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Please provide a valid reason..."
                  className="w-full bg-input border border-border px-3 py-2 rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-primary text-primary resize-none"
                />
              </div>
            </div>

            <div className="p-5 border-t border-border bg-input flex gap-3">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="flex-1 py-3 bg-page text-primary rounded-[var(--radius-md)] font-bold border border-border hover:bg-border transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 bg-primary text-white rounded-[var(--radius-md)] font-bold shadow-md hover:bg-primary-hover transition-colors text-sm"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
