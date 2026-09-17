// RESPONSIBILITY: Renders the ManagerGateLogsMain component with QR Poster Printing & Live Gate Analytics.
'use client';

import { useState } from 'react';
import { QrCode, Printer, Users, LogIn, LogOut, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';
import { useManagerGateLogs } from '@/app/manager/gate-logs/ManagerGateLogs_hooks/useManagerGateLogs';
import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';
import { ManagerGateLogsTable } from '@/app/manager/gate-logs/ManagerGateLogs_components/ManagerGateLogsTable';
import { ManagerGateLogsForm } from '@/app/manager/gate-logs/ManagerGateLogs_components/ManagerGateLogsForm';
import { GateQrPosterModal } from '@/components/qr/GateQrPosterModal';
import { businessDayKey } from '@/lib/utils/datetime';

export function ManagerGateLogsMain() {
  const {
    logs,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    handleAdd,
    selectedPropertyId,
    ctxLoading,
    students
  } = useManagerGateLogs();

  const { properties } = useManagerPropertyContext();
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  if (ctxLoading || loading) {
    return <div className="p-8 text-center text-secondary animate-pulse">Loading gate activity roster...</div>;
  }

  if (!selectedPropertyId) {
    return (
      <div className="p-8 text-center flex flex-col items-center">
        <ShieldCheck className="w-12 h-12 text-secondary mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-primary">Property Required</h3>
        <p className="text-sm text-secondary">Please select a property from the top navigation to view gate logs.</p>
      </div>
    );
  }

  // Property currently selected in the top navigation. No fabricated fallbacks:
  // the poster and the panel must never show invented details.
  const activeProperty = (properties as any[])?.find(p => p.id === selectedPropertyId);

  // Calculate live statistics. The day key must use the same business timezone as the
  // stored timestamps — `toISOString()` returns the UTC date, which is still yesterday
  // between 00:00 and 05:30 IST and silently moved today's scans into yesterday.
  const today = businessDayKey();
  const todayLogs = logs.filter(l => businessDayKey(l.timestamp || l.createdAt || '') === today);

  // Inside/outside is the *latest* movement per student (the API returns logs newest
  // first), so a student whose last scan was an exit is outside.
  const studentLatestMove: Record<string, string> = {};
  logs.forEach(l => {
    if (!studentLatestMove[l.studentId]) {
      studentLatestMove[l.studentId] = l.type;
    }
  });

  const totalStudents = students.length;
  const outsideCount = Object.values(studentLatestMove).filter(t => t === 'exit').length;
  const insideCount = Math.max(0, totalStudents - outsideCount);
  const lateCount = todayLogs.filter(l => l.isLate).length;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header & Print Poster CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card border border-border rounded-xl p-5 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-primary flex items-center gap-2">
            🛡️ Gate Logs & Attendance
          </h1>
          <p className="text-xs text-secondary mt-1">
            Real-time tracking of student entries, exits, reasons, and curfew compliance
            {activeProperty?.name ? ` for ${activeProperty.name}` : ''}.
          </p>
        </div>

        <button
          onClick={() => setIsPosterModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-primary-hover active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Print Gate QR Poster</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-secondary uppercase tracking-wider">Today&apos;s Gate Scans</div>
            <div className="text-2xl font-black text-primary mt-1">{todayLogs.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-secondary uppercase tracking-wider">Inside PG</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{insideCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <LogIn className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-secondary uppercase tracking-wider">Currently Outside</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{outsideCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-secondary uppercase tracking-wider">Late Returns</div>
            <div className="text-2xl font-black text-rose-600 mt-1">{lateCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content Area: Table + Manual Entry Form */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <ManagerGateLogsTable paginatedData={paginatedData} />
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </div>

        <div className="w-full lg:w-80 shrink-0">
          <ManagerGateLogsForm students={students} handleAdd={handleAdd} />
        </div>
      </div>

      {/* Gate QR Poster Modal — fetches the signed token + real property details */}
      <GateQrPosterModal
        isOpen={isPosterModalOpen}
        onClose={() => setIsPosterModalOpen(false)}
        propertyId={selectedPropertyId}
      />

    </div>
  );
}