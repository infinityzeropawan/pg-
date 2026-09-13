'use client';

import { useEffect, useState } from 'react';
import { ShieldAlert, Bell, AlertTriangle, Filter, LogIn, LogOut, Info } from 'lucide-react';

import { parentOperationsApi as api } from '@/app/parent/parent_lib/parent_api/ParentOperations';
import { getSession } from '@/app/parent/parent_lib/parent_auth/ParentSession';

export function ParentAlertsMain() {
  const user = typeof window !== 'undefined' ? getSession() : null;
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user?.id) {
      const child = api.getLinkedChild(user.id);
      if (child) {
        setAlerts(api.getChildAlerts(child.id));
      }
    }
    setLoading(false);
  }, [user?.id]);

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'gate') return a.type === 'gate';
    return a.severity === filter;
  });

  if (loading) {
    return <div className="p-8 text-center text-secondary animate-pulse">Loading safety alerts...</div>;
  }

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-primary flex items-center gap-2">
            🔔 Safety Alerts & Gate Activity
          </h1>
          <p className="text-sm text-secondary">Real-time alerts for student gate check-ins, exits, late entries, and SOS triggers.</p>
        </div>
        
        <div className="flex items-center gap-2 text-sm bg-card border border-border p-1.5 rounded-xl shadow-sm">
          <Filter className="w-4 h-4 text-secondary ml-2" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent text-primary focus:outline-none border-none py-1 pr-3 text-xs font-semibold"
          >
            <option value="all">All Notifications</option>
            <option value="gate">Gate Movements (In/Out)</option>
            <option value="medium">Curfew & Late Entries</option>
            <option value="high">Critical / SOS</option>
            <option value="low">Rent & Dues</option>
          </select>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-card border border-border rounded-xl shadow-sm">
          <ShieldAlert className="w-16 h-16 text-secondary/30 mb-4" />
          <h2 className="text-xl font-bold text-primary mb-2">No Alerts Found</h2>
          <p className="text-secondary text-sm max-w-sm">
            Everything is normal! There are no SOS triggers, late entries, or pending notices at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
             <div className="text-center text-sm text-secondary py-12 bg-card border border-border rounded-xl">
               No alerts match the selected filter.
             </div>
          ) : (
            filteredAlerts.map(alert => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-xl border ${
                  alert.severity === 'high' ? 'bg-rose-500/5 border-rose-500/30' :
                  alert.severity === 'medium' ? 'bg-amber-500/5 border-amber-500/30' :
                  'bg-card border-border'
                } flex items-start gap-3.5 shadow-sm transition-all hover:bg-input/40`}
              >
                <div className="shrink-0 mt-0.5">
                  {alert.severity === 'high' ? (
                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center border border-rose-500/20">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  ) : alert.severity === 'medium' ? (
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  ) : alert.type === 'gate' ? (
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                      <Bell className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-input text-secondary flex items-center justify-center border border-border">
                      <Info className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className={`font-bold text-sm ${
                      alert.severity === 'high' ? 'text-rose-600' :
                      alert.severity === 'medium' ? 'text-amber-600' :
                      'text-primary'
                    }`}>
                      {alert.title}
                    </h3>
                    <span className="text-[11px] font-medium text-secondary whitespace-nowrap">
                      {new Date(alert.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                  
                  <p className="text-xs text-secondary mt-1">
                    {alert.type === 'sos' && 'An emergency SOS was triggered from the student app. The PG Manager and Guards have been notified.'}
                    {alert.type === 'late' && 'The student entered the premises after the designated night entry cutoff time (10:00 PM).'}
                    {alert.type === 'gate' && 'Logged automatically via the PG Main Gate QR attendance scanner.'}
                    {alert.type === 'due' && 'A new rent invoice has been generated and is pending payment.'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
