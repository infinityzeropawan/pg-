'use client';
import { useManagerReports } from '../ManagerReports_hooks/useManagerReports';
import { BedDouble, Wallet, AlertTriangle } from 'lucide-react';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export function ManagerReportsMain() {
  const { loading, occupancy, financials, defaulters } = useManagerReports();

  if (loading) {
    return <div className="p-6 text-secondary motion-safe:animate-pulse">Loading reports...</div>;
  }

  const occupancyData = occupancy ? [
    { name: 'Occupied', value: occupancy.occupiedBeds, color: 'var(--success)' },
    { name: 'Vacant', value: occupancy.vacantBeds, color: 'var(--warning)' },
    { name: 'Maintenance', value: occupancy.maintenanceBeds, color: 'var(--danger)' },
  ] : [];

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">Reports & Analytics</h1>
        <p className="text-sm text-secondary mt-1">Property performance and financial insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Card with Recharts */}
        <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5">
          <h2 className="text-lg font-black text-primary mb-4 flex items-center gap-2 border-b border-border pb-2">
            <BedDouble className="w-5 h-5 text-theme-primary" /> Occupancy Overview
          </h2>
          {occupancy && (
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-secondary font-medium">Occupancy Rate</p>
                  <p className="text-3xl font-bold text-primary">{occupancy.occupancyRate}%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-secondary">Total Beds</p>
                  <p className="text-lg font-bold text-primary">{occupancy.totalBeds}</p>
                </div>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={occupancyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {occupancyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex justify-between text-xs font-bold pt-2 border-t border-border mt-4">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success"></span> Occupied ({occupancy.occupiedBeds})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning"></span> Vacant ({occupancy.vacantBeds})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-danger"></span> Maintenance ({occupancy.maintenanceBeds})</span>
              </div>
            </div>
          )}
        </div>

        {/* Financials Card */}
        <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5">
          <h2 className="text-lg font-black text-primary mb-4 flex items-center gap-2 border-b border-border pb-2">
            <Wallet className="w-5 h-5 text-success" /> Financial Summary (Monthly)
          </h2>
          {financials && (
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-secondary font-medium">Collection Rate</p>
                  <p className="text-3xl font-bold text-success">{financials.collectionRate}%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-secondary">Expected Rent</p>
                  <p className="text-lg font-bold text-primary">₹{financials.expectedRent.toLocaleString('en-IN')}</p>
                </div>
              </div>
              
              <div className="w-full bg-danger-bg rounded-full h-3 overflow-hidden flex">
                <div className="bg-success h-3" style={{ width: `${financials.collectionRate}%` }}></div>
              </div>
              
              <div className="flex justify-between text-xs font-bold pt-2">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success"></span> Collected (₹{financials.collectedRent.toLocaleString('en-IN')})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-danger"></span> Pending (₹{financials.pendingRent.toLocaleString('en-IN')})</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Defaulters Table */}
      <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5">
        <h2 className="text-lg font-black text-danger mb-4 flex items-center gap-2 border-b border-border pb-2">
          <AlertTriangle className="w-5 h-5 text-danger" /> Rent Defaulters
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-xs uppercase text-secondary bg-input/50">
              <tr>
                <th className="px-3 py-2 rounded-l-md">Student</th>
                <th className="px-3 py-2">Room</th>
                <th className="px-3 py-2">Overdue Amount</th>
                <th className="px-3 py-2 rounded-r-md text-right">Days Overdue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {defaulters.map(def => (
                <tr key={def.id} className="hover:bg-danger-bg/50 transition-colors">
                  <td className="px-3 py-3 font-medium text-primary">{def.studentName}</td>
                  <td className="px-3 py-3 text-secondary">{def.room}</td>
                  <td className="px-3 py-3 font-bold text-danger">₹{def.amount.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-3 text-right">
                    <span className="bg-danger text-white text-xs font-bold px-2 py-1 rounded">
                      {def.daysOverdue} days
                    </span>
                  </td>
                </tr>
              ))}
              {defaulters.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-secondary text-sm">No defaulters found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
