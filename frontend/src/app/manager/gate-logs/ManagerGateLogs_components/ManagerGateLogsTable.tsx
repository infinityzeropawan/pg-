// RESPONSIBILITY: Renders the ManagerGateLogsTable component.
import { LogIn, LogOut, AlertTriangle, Clock, MapPin, CheckCircle } from 'lucide-react';
import type { GateLog } from '@/app/manager/gate-logs/ManagerGateLogs_types/ManagerGateLogs.types';

interface ManagerGateLogsTableProps {
  paginatedData: GateLog[];
}

export function ManagerGateLogsTable({ paginatedData }: ManagerGateLogsTableProps) {
  return (
    <div className="bg-card border border-border rounded-[var(--radius-lg,12px)] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-input border-b border-border text-secondary sticky top-0 z-10 shadow-sm shadow-black/5">
            <tr>
              <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Resident</th>
              <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Movement</th>
              <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Reason / Details</th>
              <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Expected Return</th>
              <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Timestamp</th>
              <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Status / Alerts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.map(log => (
              <tr key={log.id} className="hover:bg-input/40 motion-safe:transition-colors">
                <td className="p-3.5">
                  <div className="font-bold text-primary">{log.studentName || log.studentId}</div>
                  <div className="text-[11px] text-secondary">
                    {log.roomNumber ? `Room ${log.roomNumber}` : `ID: ${log.studentId}`}
                  </div>
                </td>

                <td className="p-3.5">
                  {log.type === 'entry' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      <LogIn className="w-3.5 h-3.5" /> Check-In
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      <LogOut className="w-3.5 h-3.5" /> Check-Out
                    </span>
                  )}
                </td>

                <td className="p-3.5">
                  <div className="font-semibold text-primary">{log.reason || 'General Outing'}</div>
                  {log.destination && log.destination !== log.reason && (
                    <div className="text-[11px] text-secondary flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-secondary/70" />
                      {log.destination}
                    </div>
                  )}
                </td>

                <td className="p-3.5 text-xs text-secondary font-medium">
                  {log.type === 'exit' ? (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      {log.expectedReturnTime || 'By Curfew'}
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Returned
                    </span>
                  )}
                </td>

                <td className="p-3.5 text-xs text-secondary">
                  <div className="font-semibold text-primary">
                    {new Date(log.timestamp || log.createdAt || '1970-01-01').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-[10px]">
                    {new Date(log.timestamp || log.createdAt || '1970-01-01').toLocaleDateString()}
                  </div>
                </td>

                <td className="p-3.5">
                  {log.isLate ? (
                    <span className="text-xs bg-rose-500/10 text-rose-600 border border-rose-500/20 px-2 py-1 rounded-md flex items-center gap-1 w-max font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" /> Late Entry
                    </span>
                  ) : (
                    <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded text-[11px] font-semibold">
                      Normal
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-secondary">
                  No gate logs found. Students can scan the gate QR code or you can record entries manually.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}