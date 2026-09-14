'use client';

import { useEffect, useState } from 'react';
import { 
  ShieldCheck, IndianRupee, MapPin, Bed, Activity,
  ArrowRight, Bell, AlertTriangle, Clock, LogIn, LogOut, Info, User
} from 'lucide-react';
import Link from 'next/link';

import { parentOperationsApi } from '@/app/parent/parent_lib/parent_api/ParentOperations';

export function ParentDashboardMain() {
  const [dashData, setDashData] = useState<any>(null);
  const [gateLogs, setGateLogs] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadParentData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch dashboard, gate logs, and alerts in parallel
        const [dashboard, logs, alertsData] = await Promise.all([
          parentOperationsApi.getDashboard(),
          parentOperationsApi.getGateLogs(),
          parentOperationsApi.getAlerts(),
        ]);

        setDashData(dashboard);
        setGateLogs(Array.isArray(logs) ? logs.slice(0, 10) : []);
        setAlerts(Array.isArray(alertsData) ? alertsData.slice(0, 5) : []);
      } catch (e: any) {
        console.error('Failed to load parent dashboard:', e);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadParentData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-secondary text-sm">Loading parent portal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center bg-card rounded-xl border border-border h-64">
        <AlertTriangle className="w-10 h-10 text-danger mb-3" />
        <h2 className="text-lg font-bold text-primary">{error}</h2>
        <button onClick={() => window.location.reload()} className="mt-3 text-xs bg-primary text-white px-4 py-2 rounded-lg font-bold">
          Retry
        </button>
      </div>
    );
  }

  const student = dashData?.student;
  const property = dashData?.property;
  const room = dashData?.room;
  const bed = dashData?.bed;
  const stay = dashData?.stay;
  const lastGateEvent = dashData?.lastGateEvent;
  const presence = dashData?.presence ?? 'INSIDE';
  const totalDue = dashData?.totalDue ?? 0;
  const unpaidCount = dashData?.unpaidInvoicesCount ?? 0;
  const activeSOS = dashData?.activeSOS ?? [];

  if (!student) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center bg-card rounded-xl border border-border h-64">
        <ShieldCheck className="w-12 h-12 text-secondary mb-4" />
        <h2 className="text-xl font-bold text-primary">No Student Linked</h2>
        <p className="text-secondary text-sm mt-2">
          Please contact the PG Management to link your account to your child.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* SOS Active Banner */}
      {activeSOS.length > 0 && (
        <div className="bg-rose-500 text-white p-4 rounded-xl font-bold flex items-center gap-3 animate-pulse shadow-lg">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <span>🚨 Emergency SOS ACTIVE — Your child has triggered an emergency alert!</span>
        </div>
      )}

      <div className="mb-2">
        <h1 className="text-2xl font-black text-primary">Parent Portal & Safety Dashboard</h1>
        <p className="text-sm text-secondary">
          Real-time attendance, gate movement logs, and rent tracking for{' '}
          <strong>{student.fullName}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Child Profile & Live Presence Card */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary text-3xl font-black flex items-center justify-center shrink-0 border border-primary/20">
              {student.fullName?.charAt(0) || <User className="w-8 h-8" />}
            </div>
            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-2xl font-black text-primary">{student.fullName}</h2>
                <div>
                  {presence === 'INSIDE' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Inside PG Campus
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      Currently Outside PG
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-secondary pt-2 border-t border-border">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="truncate">{property?.name || 'PG Property'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-primary shrink-0" />
                  <span>Room {room?.roomNumber || '—'}, Bed {bed?.bedNumber || '—'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-emerald-600">
                    {stay?.status?.replace('_', ' ') || 'Active Resident'}
                  </span>
                </div>
              </div>

              {student.collegeOrCompany && (
                <p className="text-xs text-secondary mt-1">🎓 {student.collegeOrCompany}</p>
              )}
            </div>
          </div>

          {/* Last Known Gate Activity */}
          {lastGateEvent && (
            <div className="mt-5 p-3.5 bg-input/60 border border-border rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span className="text-secondary">
                  Last movement:{' '}
                  <strong className="text-primary">
                    {(lastGateEvent.type || '').toUpperCase() === 'ENTRY' ? 'Checked In' : 'Left Campus'}
                  </strong>{' '}
                  at {new Date(lastGateEvent.timestamp || lastGateEvent.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {lastGateEvent.reason && ` — ${lastGateEvent.reason}`}
                </span>
              </div>
              {(lastGateEvent.type || '').toUpperCase() === 'EXIT' && lastGateEvent.expectedReturnTime && (
                <span className="text-amber-600 font-bold bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded text-[11px]">
                  Return by: {lastGateEvent.expectedReturnTime}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Real-time Alerts Feed */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col">
          <h3 className="text-base font-black text-primary mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Live Safety & Gate Alerts
          </h3>
          <div className="flex-1 space-y-2.5">
            {alerts.length === 0 ? (
              <div className="text-center text-xs text-secondary py-6">No recent alerts.</div>
            ) : (
              alerts.map((a, i) => (
                <div key={a.id || i} className="p-2.5 bg-page border border-border rounded-lg flex items-start gap-2.5 text-xs">
                  {a.severity === 'high' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  ) : a.severity === 'medium' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="font-bold text-primary">{a.title}</div>
                    <div className="text-[10px] text-secondary mt-0.5">
                      {new Date(a.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link href="/parent/alerts" className="mt-3 text-center text-xs font-bold text-primary hover:underline block pt-2 border-t border-border">
            View Complete Notification Log →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Gate Movements */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
            <h3 className="text-base font-black text-primary flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Live Gate Movements & Reasons
            </h3>
            <span className="text-[11px] text-secondary">Updated on student QR scan</span>
          </div>

          <div className="space-y-3">
            {gateLogs.length === 0 ? (
              <div className="text-center text-xs text-secondary py-6">No gate logs recorded yet.</div>
            ) : (
              gateLogs.map((log, i) => {
                const isEntry = (log.type || '').toUpperCase() === 'ENTRY';
                const logTime = new Date(log.timestamp || log.createdAt);
                return (
                  <div
                    key={log.id || i}
                    className="p-3.5 rounded-xl border border-border bg-page/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-input/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isEntry ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                        {isEntry ? <LogIn className="w-4 h-4" /> : <LogOut className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-primary uppercase">
                            {isEntry ? '🟢 Checked In' : '🔴 Left Campus'}
                          </span>
                          {log.reason && (
                            <span className="text-xs font-bold text-primary">• {log.reason}</span>
                          )}
                          {log.isLate && (
                            <span className="bg-rose-500/10 text-rose-600 text-[10px] font-black px-1.5 py-0.5 rounded border border-rose-500/20">
                              LATE ENTRY
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-secondary mt-0.5">
                          {log.destination && log.destination !== log.reason && (
                            <span className="mr-2">📍 {log.destination}</span>
                          )}
                          <span>🕒 {logTime.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </div>
                      </div>
                    </div>
                    {!isEntry && log.expectedReturnTime && (
                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-secondary uppercase font-semibold">Expected Return</div>
                        <div className="text-xs font-bold text-amber-600">{log.expectedReturnTime}</div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Finance & Dues Snapshot */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-primary flex items-center gap-2 mb-4">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              Fee & Rent Overview
            </h3>
            <div className="p-4 bg-input/60 rounded-xl border border-border space-y-3 mb-4">
              <div>
                <p className="text-[10px] text-secondary font-bold uppercase tracking-wider">Monthly Room Rent</p>
                <p className="text-2xl font-black text-primary">
                  ₹{stay?.monthlyRent ? Math.round(stay.monthlyRent / 100).toLocaleString('en-IN') : '—'}
                </p>
              </div>
              <div className="pt-2 border-t border-border flex justify-between text-xs">
                <span className="text-secondary">Outstanding Dues:</span>
                {totalDue > 0 ? (
                  <span className="font-bold text-rose-600">₹{Math.round(totalDue / 100).toLocaleString('en-IN')} ({unpaidCount} invoice{unpaidCount !== 1 ? 's' : ''})</span>
                ) : (
                  <span className="font-bold text-emerald-600">All cleared ✅</span>
                )}
              </div>
            </div>
          </div>
          <Link
            href="/parent/finance"
            className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-xl text-center hover:bg-primary/90 transition-colors shadow-sm block"
          >
            View Invoices & Pay Dues <ArrowRight className="inline w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
