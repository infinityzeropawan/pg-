'use client';

import { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  IndianRupee, 
  MapPin, 
  Bed, 
  Activity, 
  ArrowRight, 
  Bell, 
  AlertTriangle,
  Clock,
  Compass,
  LogIn,
  LogOut,
  Info
} from 'lucide-react';
import Link from 'next/link';

import { parentOperationsApi as api } from '@/app/parent/parent_lib/parent_api/ParentOperations';
import { getSession } from '@/app/parent/parent_lib/parent_auth/ParentSession';

export function ParentDashboardMain() {
  const user = typeof window !== 'undefined' ? getSession() : null;
  const [child, setChild] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [gateLogs, setGateLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const linkedChild = api.getLinkedChild(user.id);
      setChild(linkedChild);
      
      if (linkedChild) {
        setAlerts(api.getChildAlerts(linkedChild.id).slice(0, 4));
        setGateLogs(api.getChildGateLogs(linkedChild.id).slice(0, 5));
      }
    }
    setLoading(false);
  }, [user?.id]);

  if (loading) {
    return <div className="p-8 text-center text-secondary animate-pulse">Loading parent portal...</div>;
  }

  if (!child) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center bg-card rounded-xl border border-border h-64">
        <ShieldCheck className="w-12 h-12 text-secondary mb-4" />
        <h2 className="text-xl font-bold text-primary">No Student Linked</h2>
        <p className="text-secondary text-sm mt-2">Please contact the PG Management to link your account to your child.</p>
      </div>
    );
  }

  // Determine current presence status
  const currentStatus = gateLogs.length > 0 && gateLogs[0].type === 'exit' ? 'OUTSIDE' : 'INSIDE';
  const lastGateEvent = gateLogs.length > 0 ? gateLogs[0] : null;

  return (
    <div className="space-y-6 pb-20">
      <div className="mb-2">
        <h1 className="text-2xl font-black text-primary">Parent Portal & Safety Dashboard</h1>
        <p className="text-sm text-secondary">Real-time attendance, gate movement logs, and rent tracking for <strong>{child.name}</strong>.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Child Profile & Live Presence Card */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary text-3xl font-black flex items-center justify-center shrink-0 border border-primary/20">
              {child.name.charAt(0)}
            </div>
            
            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-2xl font-black text-primary">{child.name}</h2>
                
                {/* Live Status Badge */}
                <div>
                  {currentStatus === 'INSIDE' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Inside PG Campus
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      Currently Outside PG
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-secondary pt-2 border-t border-border">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="truncate">{child.propertyName || 'Sunshine PG'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-primary shrink-0" />
                  <span>Room {child.roomNumber || '101'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-emerald-600">Active Resident</span>
                </div>
              </div>
            </div>
          </div>

          {/* Last Known Gate Activity Strip */}
          {lastGateEvent && (
            <div className="mt-5 p-3.5 bg-input/60 border border-border rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span className="text-secondary">
                  Last movement:{' '}
                  <strong className="text-primary">
                    {lastGateEvent.type === 'entry' ? 'Checked In' : 'Checked Out'}
                  </strong>{' '}
                  at {new Date(lastGateEvent.timestamp || lastGateEvent.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {lastGateEvent.reason && ` for ${lastGateEvent.reason}`}
                </span>
              </div>
              {lastGateEvent.type === 'exit' && lastGateEvent.expectedReturnTime && (
                <span className="text-amber-600 font-bold bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded text-[11px]">
                  Return by: {lastGateEvent.expectedReturnTime}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Real-time Alerts & Activity Feed */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col">
          <h3 className="text-base font-black text-primary mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Live Safety & Gate Alerts
          </h3>
          
          <div className="flex-1 space-y-2.5">
            {alerts.length === 0 ? (
              <div className="text-center text-xs text-secondary py-6">No recent alerts.</div>
            ) : (
              alerts.map(a => (
                <div key={a.id} className="p-2.5 bg-page border border-border rounded-lg flex items-start gap-2.5 text-xs">
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
            View Complete Notification Log &rarr;
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent In/Out Gate Logs with Reasons */}
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
              gateLogs.map(log => {
                const isEntry = log.type === 'entry';
                const logTime = new Date(log.timestamp || log.createdAt);

                return (
                  <div 
                    key={log.id} 
                    className="p-3.5 rounded-xl border border-border bg-page/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-input/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isEntry ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {isEntry ? <LogIn className="w-4 h-4" /> : <LogOut className="w-4 h-4" />}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-primary uppercase">
                            {isEntry ? '🟢 Checked In' : '🔴 Checked Out'}
                          </span>
                          <span className="text-xs font-bold text-primary">
                            • {log.reason || 'General Outing'}
                          </span>
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
                      <div className="text-right sm:text-right shrink-0">
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
                <p className="text-2xl font-black text-primary">₹{child.rentAmount || 8500}</p>
              </div>

              <div className="pt-2 border-t border-border flex justify-between text-xs">
                <span className="text-secondary">Payment Status:</span>
                <span className="font-bold text-emerald-600">Up to Date ✅</span>
              </div>
            </div>
          </div>

          <Link 
            href="/parent/finance" 
            className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-xl text-center hover:bg-primary-hover transition-colors shadow-sm block"
          >
            View Invoices & Pay Dues
          </Link>
        </div>

      </div>
    </div>
  );
}
