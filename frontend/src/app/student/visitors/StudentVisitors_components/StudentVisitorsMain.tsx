'use client';

// RESPONSIBILITY: Renders the Student Visitors UI from live API data.
// DATA FLOW: GET/POST /api/v1/student/visitors, PATCH .../:id/checkout
//            -> useStudentVisitors -> StudentVisitorsMain

import { useState } from 'react';
import { Users, Plus, Clock, LogOut, Loader2, Inbox, AlertTriangle, Phone, ClipboardList } from 'lucide-react';

import { useStudentVisitors } from '@/app/student/visitors/StudentVisitors_hooks/useStudentVisitors';
import type { StudentVisitor } from '@/app/student/student_lib/student_api/StudentTypes';

function formatWhen(value: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function StudentVisitorsMain() {
  const { activeVisitors, pastVisitors, loading, submitting, error, addVisitor, checkOutVisitor } =
    useStudentVisitors();

  const [showNewModal, setShowNewModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [form, setForm] = useState({ visitorName: '', visitorPhone: '', purpose: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addVisitor({
      visitorName: form.visitorName.trim(),
      visitorPhone: form.visitorPhone.trim(),
      purpose: form.purpose.trim(),
    });
    setForm({ visitorName: '', visitorPhone: '', purpose: '' });
    setShowNewModal(false);
  };

  const list = activeTab === 'active' ? activeVisitors : pastVisitors;

  const renderCard = (v: StudentVisitor, isActive: boolean) => (
    <div
      key={v.id}
      className="p-4 border border-border rounded-[var(--radius-md)] hover:border-primary transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card"
    >
      <div className="min-w-0">
        <div className="font-bold text-primary text-lg break-words">{v.visitorName}</div>
        <div className="text-sm text-secondary flex items-center gap-1.5">
          <Phone className="w-3 h-3" /> {v.visitorPhone || '—'}
        </div>
        <div className="text-xs text-secondary mt-1.5 flex items-center gap-1.5">
          <ClipboardList className="w-3 h-3" /> {v.purpose || '—'}
        </div>
        <div className="text-xs text-secondary mt-2 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Entry: {formatWhen(v.checkInTime)}
          {!isActive && v.checkOutTime && ` • Exit: ${formatWhen(v.checkOutTime)}`}
        </div>
      </div>
      {isActive ? (
        <button
          onClick={() => void checkOutVisitor(v.id)}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-warning-bg text-warning border border-warning/20 text-xs font-black uppercase tracking-wider rounded-full hover:bg-warning hover:text-white transition-colors"
        >
          <LogOut className="w-3 h-3" /> Check Out
        </button>
      ) : (
        <span className="bg-page text-secondary text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border border-border shrink-0">
          Completed
        </span>
      )}
    </div>
  );

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
            🤝 Visitor Management
          </h1>
          <p className="text-sm text-secondary mt-1">Log guest entries at your PG and review past visits.</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="px-5 py-2.5 bg-primary text-white rounded-[var(--radius-md)] font-bold shadow-md flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors whitespace-nowrap"
        >
          <Plus className="w-5 h-5" /> Log Visitor Entry
        </button>
      </div>

      {error && (
        <div className="p-4 bg-danger-bg border border-danger/30 rounded-[var(--radius-md)] flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-danger mt-0.5" />
          <span className="text-sm text-danger">{error}</span>
        </div>
      )}

      <div className="bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden shadow-sm h-full flex flex-col">
        <div className="p-4 border-b border-border bg-input flex items-center gap-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-bold transition-colors ${
              activeTab === 'active' ? 'bg-primary text-white shadow' : 'text-secondary hover:text-primary'
            }`}
          >
            Active ({activeVisitors.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-bold transition-colors ${
              activeTab === 'history' ? 'bg-primary text-white shadow' : 'text-secondary hover:text-primary'
            }`}
          >
            Past Visitors ({pastVisitors.length})
          </button>
        </div>

        <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="p-8 text-center text-secondary motion-safe:animate-pulse flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading visitor records…
            </div>
          ) : list.length === 0 ? (
            <div className="text-center p-10 text-secondary">
              <Inbox className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <div className="font-bold text-primary">
                {activeTab === 'active' ? 'No visitors currently checked in' : 'No past visitor records'}
              </div>
              <div className="text-sm">
                {activeTab === 'active'
                  ? 'Use “Log Visitor Entry” when a guest arrives.'
                  : 'Checked-out visitors will appear here.'}
              </div>
            </div>
          ) : (
            list.map((v) => renderCard(v, activeTab === 'active'))
          )}
        </div>
      </div>

      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="bg-card w-full max-w-md rounded-[var(--radius-lg)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
          >
            <div className="p-5 border-b border-border bg-input flex justify-between items-center">
              <h2 className="text-lg font-black text-primary flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Log Visitor Entry
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-2">Visitor name</label>
                <input
                  required
                  type="text"
                  value={form.visitorName}
                  onChange={(e) => setForm((p) => ({ ...p, visitorName: e.target.value }))}
                  placeholder="Full name"
                  className="w-full bg-input border border-border px-4 py-3 rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-primary text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-2">Phone</label>
                <input
                  required
                  type="tel"
                  value={form.visitorPhone}
                  onChange={(e) => setForm((p) => ({ ...p, visitorPhone: e.target.value }))}
                  placeholder="Mobile number"
                  className="w-full bg-input border border-border px-4 py-3 rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-primary text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-2">Purpose of visit</label>
                <input
                  required
                  type="text"
                  value={form.purpose}
                  onChange={(e) => setForm((p) => ({ ...p, purpose: e.target.value }))}
                  placeholder="E.g., Dropping off luggage"
                  className="w-full bg-input border border-border px-4 py-3 rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-primary text-primary"
                />
              </div>
              <p className="text-[11px] text-secondary">
                The entry time is recorded automatically. Use “Check Out” when the visitor leaves.
              </p>
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
                className="flex-1 py-3 bg-primary text-white rounded-[var(--radius-md)] font-bold shadow-md hover:bg-primary-hover transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? 'Saving…' : 'Save Entry'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
