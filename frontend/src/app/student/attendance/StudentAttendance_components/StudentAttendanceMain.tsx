'use client';

// RESPONSIBILITY: Renders the Student Attendance UI with QR Gate Scanner and In/Out Reason modal.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { 
  QrCode, 
  Calendar as CalendarIcon, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Camera, 
  CheckCircle2, 
  ArrowRightLeft, 
  MapPin, 
  Compass, 
  X, 
  Send, 
  CameraOff,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { useStudentContext } from '@/app/student/student_components/StudentContext';
import {
  useStudentAttendance,
  stashGateToken,
  type CalendarCellStatus,
} from '@/app/student/attendance/StudentAttendance_hooks/useStudentAttendance';

const REASON_OPTIONS = [
  { id: 'College / Classes', label: '🎓 College / Classes' },
  { id: 'Coaching / Library', label: '📚 Coaching / Library' },
  { id: 'Market / Shopping', label: '🛒 Market / Grocery' },
  { id: 'Food / Dining', label: '🍔 Food / Dining Out' },
  { id: 'Gym / Sports', label: '🏋️ Gym / Fitness' },
  { id: 'Medical / Emergency', label: '🏥 Medical / Doctor' },
  { id: 'Home Visit', label: '🏠 Home Visit / Vacation' },
  { id: 'Work / Internship', label: '💼 Work / Internship' },
  { id: 'Other', label: '💬 Other Purpose' },
];

/** Container id that html5-qrcode mounts the live camera feed into. */
const SCANNER_ELEMENT_ID = 'gate-qr-reader';

export function StudentAttendanceMain() {
  const { profile, loading: ctxLoading } = useStudentContext();

  const {
    logs,
    calendar,
    stats,
    currentStatus,
    lastActivity,
    loading,
    submitting: isSubmitting,
    error,
    monthLabel,
    recordGateAttendance,
    applyScannedPayload,
    clearGateToken,
    pendingScanRestored,
  } = useStudentAttendance();

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanStep, setScanStep] = useState<'scan' | 'form' | 'success'>('scan');
  const [scanError, setScanError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanAttempt, setScanAttempt] = useState(0);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Gate Form State
  const [gateAction, setGateAction] = useState<'entry' | 'exit'>('exit');
  const [selectedReason, setSelectedReason] = useState('College / Classes');
  const [destination, setDestination] = useState('');
  const [expectedReturnTime, setExpectedReturnTime] = useState('06:00 PM');
  const [lastSubmittedLog, setLastSubmittedLog] = useState<any>(null);

  const handleOpenScanner = () => {
    setScanStep('scan');
    setScanError(null);
    setScanAttempt(0);
    // A new scan invalidates any token left over from a previous attempt.
    clearGateToken();
    // Pre-populate the default action from the live gate status
    setGateAction(currentStatus === 'INSIDE' ? 'exit' : 'entry');
    setIsScannerOpen(true);
  };

  /** Releases the camera stream; safe to call when it never started. */
  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    setCameraActive(false);
    if (!scanner) return;
    try {
      const state = scanner.getState();
      if (state === Html5QrcodeScannerState.SCANNING || state === Html5QrcodeScannerState.PAUSED) {
        await scanner.stop();
      }
      scanner.clear();
    } catch {
      // Stream already gone — nothing left to release.
    }
  }, []);

  /** A decoded payload must be a gate poster before the form is unlocked. */
  const handleDecoded = useCallback(
    (decodedText: string) => {
      if (!applyScannedPayload(decodedText)) return;
      void stopScanner();
      setScanStep('form');
    },
    [applyScannedPayload, stopScanner]
  );

  const closeScanner = useCallback(() => {
    void stopScanner();
    setIsScannerOpen(false);
    clearGateToken();
  }, [clearGateToken, stopScanner]);

  // Live camera decode.
  //
  // BUG HISTORY: this modal used to show a decorative viewfinder plus a
  // "Simulate / Confirm QR Scan" button that jumped straight to the form. Nothing
  // ever decoded a QR code and the API call carried no proof the resident was on
  // site, so attendance could be marked from anywhere.
  useEffect(() => {
    if (!isScannerOpen || scanStep !== 'scan') return;
    let cancelled = false;

    const start = async () => {
      setScanError(null);
      try {
        const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID, { verbose: false });
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => handleDecoded(decodedText),
          () => {
            // Per-frame decode misses are expected while framing the code.
          }
        );
        if (!cancelled) setCameraActive(true);
      } catch (e) {
        if (cancelled) return;
        console.error('[StudentAttendanceMain] Camera unavailable:', e);
        setCameraActive(false);
        setScanError(
          'Camera access was blocked or no camera is available. Scan the poster with your phone camera instead — it opens this page with the gate pass attached.'
        );
      }
    };

    void start();
    return () => {
      cancelled = true;
      void stopScanner();
    };
  }, [isScannerOpen, scanStep, handleDecoded, stopScanner, scanAttempt]);

  // Poster scanned with the native phone camera -> `?gate=<token>` deep link.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = new URLSearchParams(window.location.search).get('gate');
    if (!token) return;
    // Stash before applying: the layout may bounce an unauthenticated visitor to
    // /student/login (dropping the query), and the pass must survive that trip.
    stashGateToken(token);
    if (!applyScannedPayload(token)) return;

    setGateAction(currentStatus === 'INSIDE' ? 'exit' : 'entry');
    setScanStep('form');
    setIsScannerOpen(true);
    // Keep the URL clean so a refresh does not re-trigger the pass.
    window.history.replaceState({}, '', window.location.pathname);
  }, [applyScannedPayload, currentStatus]);

  // A pass scanned before signing in was restored — jump straight to the confirm step.
  useEffect(() => {
    if (!pendingScanRestored || isScannerOpen) return;
    setGateAction(currentStatus === 'INSIDE' ? 'exit' : 'entry');
    setScanStep('form');
    setIsScannerOpen(true);
  }, [pendingScanRestored, isScannerOpen, currentStatus]);

  const handleSubmitAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = await recordGateAttendance({
      type: gateAction,
      reason: selectedReason,
      destination,
      expectedReturnTime,
    });
    if (newLog) {
      setLastSubmittedLog(newLog);
      setScanStep('success');
    }
  };

  return (
    <div className="space-y-6 w-full pb-16">
      
      {/* Header Banner with Scan CTA */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-[var(--radius-xl,16px)] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-primary flex items-center gap-2">
              Gate Attendance & Pass
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              Live Scanner
            </span>
          </div>
          <p className="text-sm text-secondary">
            Scan the PG entrance QR code to record your In/Out attendance with reasons.
          </p>
        </div>

        <button
          onClick={handleOpenScanner}
          className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white font-bold text-sm rounded-xl shadow-lg hover:bg-primary-hover active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Camera className="w-5 h-5" />
          <span>Scan Gate QR Code</span>
        </button>
      </div>

      {/* Live Presence Status Widget */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
              currentStatus === 'INSIDE' 
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
            }`}>
              {currentStatus === 'INSIDE' ? <ShieldCheck className="w-6 h-6" /> : <Compass className="w-6 h-6" />}
            </div>
            <div>
              <div className="text-xs font-bold text-secondary uppercase tracking-wider">Current Gate Status</div>
              <div className="text-lg font-black text-primary flex items-center gap-2">
                {currentStatus === 'INSIDE' ? (
                  <span className="text-emerald-600 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Currently INSIDE PG
                  </span>
                ) : (
                  <span className="text-amber-600 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Currently OUTSIDE PG
                  </span>
                )}
              </div>
              {lastActivity && (
                <div className="text-xs text-secondary mt-0.5">
                  Last recorded: <span className="font-semibold">{lastActivity.type === 'entry' ? 'Checked In' : 'Checked Out'}</span> at {new Date(lastActivity.timestamp || lastActivity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {lastActivity.reason && ` (${lastActivity.reason})`}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleOpenScanner}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentStatus === 'INSIDE'
                ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 dark:bg-amber-950/30 dark:border-amber-800'
                : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-800'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            {currentStatus === 'INSIDE' ? 'Leaving PG? Check-Out' : 'Back at PG? Check-In'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Attendance Stats Cards */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-primary-subtle border border-primary/20 rounded-xl p-5 text-center shadow-sm">
            <div className="text-xs font-bold text-primary/70 uppercase mb-1">Attendance Rate</div>
            <div className="text-4xl font-black text-primary">{stats.attendanceRate}%</div>
            <div className="text-xs font-semibold text-primary mt-1">
              {stats.present}/{stats.total} Days Present
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-secondary uppercase">Late Curfew Entries</div>
              <div className="text-2xl font-black text-warning">{stats.lateEntries}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-secondary uppercase">Approved Leaves</div>
              <div className="text-2xl font-black text-primary">{stats.approvedLeaves}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-zinc-900 border border-border rounded-xl p-4 text-xs text-secondary space-y-1.5">
            <div className="font-bold text-primary flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" /> Curfew Policy:
            </div>
            <p>Main gate closes at <strong>10:00 PM</strong>. Entries after curfew are automatically flagged and sent to parents.</p>
          </div>
        </div>

        {/* Monthly Calendar View */}
        <div className="md:col-span-3 bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
             <h3 className="font-black text-primary text-lg flex items-center gap-2">
               <CalendarIcon className="w-5 h-5 text-primary" /> Monthly Attendance Calendar
               <span className="text-xs font-bold text-secondary normal-case">({monthLabel})</span>
             </h3>
             <div className="flex flex-wrap gap-4 text-xs font-bold text-secondary">
               <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Present</span>
               <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Absent</span>
               <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Late</span>
               <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Leave</span>
             </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} className="font-bold text-secondary text-xs uppercase mb-1">{d}</div>
            ))}
            {/* Offset so day 1 lands on the correct weekday column */}
            {Array.from({
              length: (new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() + 6) % 7,
            }).map((_, i) => (
              <div key={`offset-${i}`}></div>
            ))}
            {calendar.map(d => (
              <div 
                key={d.day} 
                className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-bold border transition-colors ${
                  d.status === 'Present' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                  d.status === 'Absent' ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400' :
                  d.status === 'Late' ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400' :
                  d.status === 'Leave' ? 'bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400' :
                  'bg-input border-border text-secondary'
                }`}
              >
                <span>{d.day}</span>
                <span className="text-[9px] font-normal opacity-80">{d.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Recent In/Out Logs Table */}
        <div className="md:col-span-4 bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
            <h3 className="font-black text-primary text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Live Gate Activity & Pass History
            </h3>
            <span className="text-xs text-secondary font-medium">Real-time synced with Parent Portal</span>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="bg-input text-secondary text-xs uppercase font-bold">
                 <tr>
                   <th className="px-4 py-3 rounded-tl-lg">Time & Date</th>
                   <th className="px-4 py-3">Type</th>
                   <th className="px-4 py-3">Reason / Purpose</th>
                   <th className="px-4 py-3">Destination</th>
                   <th className="px-4 py-3">Expected Return</th>
                   <th className="px-4 py-3 rounded-tr-lg">Parent Alert</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border">
                 {logs.length === 0 ? (
                   <tr>
                     <td colSpan={6} className="text-center py-6 text-secondary text-sm">
                       No gate activity logs found. Scan the gate QR code to record attendance.
                     </td>
                   </tr>
                 ) : (
                   logs.map(log => {
                     const logDate = new Date(log.timestamp || log.createdAt);
                     return (
                       <tr key={log.id} className="hover:bg-input/50 transition-colors">
                         <td className="px-4 py-3">
                           <div className="font-bold text-primary">{logDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                           <div className="text-[11px] text-secondary">{logDate.toLocaleDateString()}</div>
                         </td>
                         <td className="px-4 py-3">
                           <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase ${
                             log.type === 'entry'
                               ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                               : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                           }`}>
                             {log.type === 'entry' ? '🟢 Check-In' : '🔴 Check-Out'}
                           </span>
                           {log.isLate && (
                             <span className="ml-1.5 bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[10px] font-black px-2 py-0.5 rounded">
                               LATE
                             </span>
                           )}
                         </td>
                         <td className="px-4 py-3 font-semibold text-primary">
                           {log.reason || 'General Outing'}
                         </td>
                         <td className="px-4 py-3 text-secondary text-xs">
                           {log.destination || '-'}
                         </td>
                         <td className="px-4 py-3 text-secondary text-xs font-medium">
                           {log.type === 'exit' ? (log.expectedReturnTime || 'By Curfew') : 'Returned'}
                         </td>
                           <td className="px-4 py-3">
                             {log.parentNotified ? (
                               <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                 <CheckCircle2 className="w-3.5 h-3.5" /> Sent
                               </span>
                             ) : (
                               <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary">
                                 <AlertCircle className="w-3.5 h-3.5" /> No parent linked
                               </span>
                             )}
                           </td>
                       </tr>
                     );
                   })
                 )}
               </tbody>
             </table>
          </div>
        </div>

      </div>

      {/* QR Code Scanner & Reason Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative bg-card border border-border rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-fade-in">
            
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-page">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base text-primary">
                  {scanStep === 'scan' ? 'Scan Gate QR Code' : scanStep === 'form' ? 'Attendance Details' : 'Attendance Logged'}
                </h3>
              </div>
              <button
                onClick={closeScanner}
                className="p-1.5 text-secondary hover:text-primary rounded-lg hover:bg-input transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Live camera scanner */}
            {scanStep === 'scan' && (
              <div className="p-6 text-center space-y-5">
                <div className="relative w-64 h-64 mx-auto bg-slate-950 rounded-2xl overflow-hidden border-2 border-primary/40 shadow-inner">
                  {/* html5-qrcode injects the live <video> feed into this element. */}
                  <div
                    id={SCANNER_ELEMENT_ID}
                    className="w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover"
                  />

                  {/* Laser sweep + corner reticles stay above the feed */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-bounce pointer-events-none"></div>
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl pointer-events-none"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr pointer-events-none"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl pointer-events-none"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br pointer-events-none"></div>

                  {!cameraActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-slate-950">
                      <Camera className="w-10 h-10 text-primary/80 animate-pulse" />
                      <p className="text-xs font-semibold text-white/90">Starting camera…</p>
                      <span className="text-[10px] text-white/50">{profile?.propertyName || 'PG Main Entrance'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-secondary">
                    Point the camera at the gate QR poster on the wall — the code is verified against this
                    property, so a poster from another PG will not work.
                  </p>
                  
                  {scanError ? (
                    <>
                      <div className="flex items-start gap-2 text-left text-xs text-amber-700 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                        <CameraOff className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{scanError}</span>
                      </div>
                      <button
                        onClick={() => setScanAttempt((n) => n + 1)}
                        className="w-full py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Retry camera
                      </button>
                    </>
                  ) : (
                    <p className="text-[10px] text-secondary">
                      Camera active — hold the poster steady inside the frame.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Reason & In/Out Form */}
            {scanStep === 'form' && (
              <form onSubmit={handleSubmitAttendance} className="p-5 space-y-4">
                
                {/* Gate Action Toggle */}
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase mb-2">Select Movement</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGateAction('entry')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        gateAction === 'entry'
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                          : 'bg-input border-border text-secondary hover:text-primary'
                      }`}
                    >
                      <span>🟢 Check-In (Entering PG)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGateAction('exit')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        gateAction === 'exit'
                          ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                          : 'bg-input border-border text-secondary hover:text-primary'
                      }`}
                    >
                      <span>🔴 Check-Out (Leaving PG)</span>
                    </button>
                  </div>
                </div>

                {/* Reason Selection */}
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase mb-2">Reason / Purpose</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {REASON_OPTIONS.map(r => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedReason(r.id)}
                        className={`p-2 rounded-lg text-xs font-medium text-left border transition-all cursor-pointer truncate ${
                          selectedReason === r.id
                            ? 'bg-primary text-white border-primary font-bold shadow-sm'
                            : 'bg-input border-border text-primary hover:border-primary/50'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Destination Notes */}
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase mb-1">
                    Destination / Details <span className="font-normal lowercase text-secondary/70">(optional)</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-secondary absolute left-3 top-3" />
                    <input
                      type="text"
                      value={destination}
                      onChange={e => setDestination(e.target.value)}
                      placeholder="e.g. City College Block B, Central Library..."
                      className="w-full pl-9 pr-3 py-2 bg-input border border-border rounded-xl text-xs text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Expected Return Time (Only for Exit) */}
                {gateAction === 'exit' && (
                  <div>
                    <label className="block text-xs font-bold text-secondary uppercase mb-1">
                      Expected Return Time
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={expectedReturnTime}
                        onChange={e => setExpectedReturnTime(e.target.value)}
                        placeholder="e.g. 06:00 PM"
                        className="flex-1 px-3 py-2 bg-input border border-border rounded-xl text-xs text-primary focus:outline-none focus:border-primary"
                      />
                      <div className="flex gap-1">
                        {['06:00 PM', '08:00 PM', '09:30 PM'].map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setExpectedReturnTime(t)}
                            className="px-2 py-1 bg-input border border-border hover:border-primary rounded-lg text-[10px] font-semibold text-secondary hover:text-primary cursor-pointer"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-primary-hover active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmitting ? 'Recording...' : `Confirm ${gateAction === 'entry' ? 'Check-In' : 'Check-Out'} & Notify`}
                  </button>
                  <p className="text-[10px] text-center text-secondary mt-2">
                    ⚡ Live update is sent automatically to your Parents & PG Manager.
                  </p>
                </div>
              </form>
            )}

            {/* Step 3: Success Confirmation */}
            {scanStep === 'success' && lastSubmittedLog && (
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-lg font-black text-primary">Attendance Recorded!</h4>
                  <p className="text-xs text-secondary mt-1">
                    Your {lastSubmittedLog.type === 'entry' ? 'Check-In' : 'Check-Out'} for{' '}
                    <strong>{lastSubmittedLog.reason}</strong> has been logged.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-zinc-900 border border-border rounded-xl p-3 text-xs text-left space-y-1">
                  <div className="flex justify-between">
                    <span className="text-secondary">Time:</span>
                    <span className="font-bold text-primary">{new Date(lastSubmittedLog.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Parent Notification:</span>
                    {lastSubmittedLog.parentNotified ? (
                      <span className="font-bold text-emerald-600">Dispatched ✅</span>
                    ) : (
                      <span className="font-bold text-secondary">No parent linked</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Manager Roster:</span>
                    <span className="font-bold text-emerald-600">Updated ✅</span>
                  </div>
                </div>

                <button
                  onClick={closeScanner}
                  className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
