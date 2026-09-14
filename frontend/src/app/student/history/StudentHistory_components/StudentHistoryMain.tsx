'use client';

// RESPONSIBILITY: Renders the Student Stay History UI from live API data.
// DATA FLOW: GET /api/v1/student/history -> useStudentHistory -> StudentHistoryMain

import { useMemo, useState } from 'react';
import {
  History, MapPin, FileText, LogOut, LifeBuoy, IndianRupee, Bell,
  Inbox, RefreshCw, AlertTriangle, Clock,
} from 'lucide-react';

import { useStudentHistory } from '@/app/student/history/StudentHistory_hooks/useStudentHistory';
import type { StudentHistoryEntry } from '@/app/student/student_lib/student_api/StudentTypes';
import { formatPaise } from '@/lib/utils/money';

const TYPE_FILTERS = ['ALL', 'STAY', 'INVOICE', 'COMPLAINT', 'LEAVE', 'GATE', 'SOS'] as const;
type TypeFilter = (typeof TYPE_FILTERS)[number];

const TYPE_LABELS: Record<string, string> = {
  STAY: 'Stay',
  INVOICE: 'Invoice',
  COMPLAINT: 'Complaint',
  LEAVE: 'Leave',
  GATE: 'Gate Log',
  SOS: 'SOS Alert',
};

const TYPE_TONES: Record<string, string> = {
  STAY: 'bg-primary-subtle text-primary border-primary/20',
  INVOICE: 'bg-info-bg text-info border-info/20',
  COMPLAINT: 'bg-warning-bg text-warning border-warning/20',
  LEAVE: 'bg-page text-secondary border-border',
  GATE: 'bg-success-bg text-success border-success/20',
  SOS: 'bg-danger-bg text-danger border-danger/20',
};

function EntryIcon({ type }: { type: string }) {
  const cls = 'w-4 h-4';
  if (type === 'STAY') return <MapPin className={cls} />;
  if (type === 'INVOICE') return <IndianRupee className={cls} />;
  if (type === 'COMPLAINT') return <FileText className={cls} />;
  if (type === 'LEAVE') return <LogOut className={cls} />;
  if (type === 'SOS') return <LifeBuoy className={cls} />;
  if (type === 'GATE') return <History className={cls} />;
  return <Bell className={cls} />;
}

/** Renders a timestamp, returning an em dash when the value is missing/invalid. */
function formatWhen(value: string): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * The backend returns the raw Prisma record for each timeline row, so every type is
 * reduced here to the handful of fields that are meaningful to a resident. Nothing is
 * invented: a row is only emitted when the corresponding column exists.
 */
function entryDetails(entry: StudentHistoryEntry): Array<{ label: string; value: string }> {
  const data = (entry.data ?? {}) as Record<string, any>;
  const rows: Array<{ label: string; value: string }> = [];

  if (entry.type === 'INVOICE') {
    if (data.invoiceNumber) rows.push({ label: 'Invoice', value: String(data.invoiceNumber) });
    if (data.billingMonth) rows.push({ label: 'Billing month', value: String(data.billingMonth) });
    if (data.totalAmount != null) rows.push({ label: 'Total', value: formatPaise(Number(data.totalAmount)) });
    if (data.paidAmount != null) rows.push({ label: 'Paid', value: formatPaise(Number(data.paidAmount)) });
  } else if (entry.type === 'LEAVE') {
    if (data.startDate) rows.push({ label: 'From', value: formatWhen(String(data.startDate)) });
    if (data.endDate) rows.push({ label: 'To', value: formatWhen(String(data.endDate)) });
    if (data.reason) rows.push({ label: 'Reason', value: String(data.reason) });
  } else if (entry.type === 'COMPLAINT') {
    if (data.category) rows.push({ label: 'Category', value: String(data.category) });
    if (data.priority) rows.push({ label: 'Priority', value: String(data.priority) });
  } else if (entry.type === 'GATE') {
    if (data.reason) rows.push({ label: 'Reason', value: String(data.reason) });
    if (data.destination) rows.push({ label: 'Destination', value: String(data.destination) });
    if (data.expectedReturnTime) rows.push({ label: 'Expected return', value: String(data.expectedReturnTime) });
    rows.push({ label: 'Late entry', value: data.isLate ? 'Yes' : 'No' });
  } else if (entry.type === 'STAY') {
    if (data.startDate) rows.push({ label: 'Start date', value: formatWhen(String(data.startDate)) });
    if (data.expectedEndDate) rows.push({ label: 'Expected end', value: formatWhen(String(data.expectedEndDate)) });
    if (data.monthlyRent != null) rows.push({ label: 'Monthly rent', value: formatPaise(Number(data.monthlyRent)) });
    if (data.securityDeposit != null) rows.push({ label: 'Security deposit', value: formatPaise(Number(data.securityDeposit)) });
  } else if (entry.type === 'SOS') {
    if (data.message) rows.push({ label: 'Message', value: String(data.message) });
    if (data.description) rows.push({ label: 'Details', value: String(data.description) });
  }

  return rows;
}

export function StudentHistoryMain() {
  const { timeline, loading, error, refetch } = useStudentHistory();
  const [filter, setFilter] = useState<TypeFilter>('ALL');

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const entry of timeline) {
      map[entry.type] = (map[entry.type] || 0) + 1;
    }
    return map;
  }, [timeline]);

  const filtered = useMemo(
    () => (filter === 'ALL' ? timeline : timeline.filter((e) => e.type === filter)),
    [timeline, filter]
  );

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
            🕘 Stay History
          </h1>
          <p className="text-sm text-secondary mt-1">
            A complete audit trail of your stays, payments, requests and gate activity.
          </p>
        </div>
        <button
          onClick={() => void refetch()}
          disabled={loading}
          className="px-4 py-2 bg-input text-primary rounded-[var(--radius-md)] font-bold border border-border flex items-center justify-center gap-2 hover:bg-border transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Type filters */}
      <div className="flex flex-wrap gap-2">
        {TYPE_FILTERS.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
              filter === t
                ? 'bg-primary text-white border-primary'
                : 'bg-input text-secondary border-border hover:border-primary/40'
            }`}
          >
            {t === 'ALL' ? 'All' : TYPE_LABELS[t] || t}
            <span className="ml-1.5 opacity-70">
              {t === 'ALL' ? timeline.length : counts[t] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* States */}
      {loading && (
        <div className="p-8 text-center text-secondary motion-safe:animate-pulse">
          Loading your history…
        </div>
      )}

      {!loading && error && (
        <div className="p-6 bg-danger-bg border border-danger/30 rounded-[var(--radius-lg)] flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-danger text-sm">Could not load history</div>
            <div className="text-sm text-secondary mt-0.5">{error}</div>
          </div>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center p-10 text-secondary bg-card border border-border rounded-[var(--radius-lg)]">
          <Inbox className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <div className="font-bold text-primary">No history entries yet</div>
          <div className="text-sm">
            {filter === 'ALL'
              ? 'Your activity will appear here as you use the portal.'
              : `No ${TYPE_LABELS[filter]?.toLowerCase() || filter} records found.`}
          </div>
        </div>
      )}

      {/* Timeline */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((entry, idx) => (
            <div
              key={`${entry.type}-${entry.date}-${idx}`}
              className="bg-card border border-border rounded-[var(--radius-lg)] p-4 sm:p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 ${
                    TYPE_TONES[entry.type] || 'bg-input text-secondary border-border'
                  }`}
                >
                  <EntryIcon type={entry.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="font-bold text-primary text-sm break-words">
                      {entry.action || TYPE_LABELS[entry.type] || entry.type}
                    </div>
                    <div className="text-[11px] text-secondary flex items-center gap-1 whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {formatWhen(entry.date)}
                    </div>
                  </div>
                  <span
                    className={`inline-block mt-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-[var(--radius-sm)] border ${
                      TYPE_TONES[entry.type] || 'bg-input text-secondary border-border'
                    }`}
                  >
                    {TYPE_LABELS[entry.type] || entry.type}
                  </span>
                  {entryDetails(entry).length > 0 && (
                    <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                      {entryDetails(entry).map((row) => (
                        <div key={row.label} className="flex justify-between sm:justify-start gap-2">
                          <dt className="text-secondary font-semibold shrink-0">{row.label}:</dt>
                          <dd className="text-primary break-words">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
