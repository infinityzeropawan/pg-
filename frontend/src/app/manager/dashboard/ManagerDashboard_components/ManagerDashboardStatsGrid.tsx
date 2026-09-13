import { Users, LogIn, LogOut, MessageSquare, BedDouble } from 'lucide-react';
import type { ManagerDashboardStats } from '@/app/manager/dashboard/ManagerDashboard_types/ManagerDashboard.types';

interface Props {
  stats: ManagerDashboardStats | null;
}

export function ManagerDashboardStatsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {/* 5 Stats Cards as requested: Check-in Today, Check-out, Pending Complaints, Visitors, Occupied Beds */}
      <StatCard 
        icon={<LogIn className="w-5 h-5 text-success" />} 
        label="Check-in Today" 
        value={stats?.todayCheckins || 0} 
      />
      <StatCard 
        icon={<LogOut className="w-5 h-5 text-warning" />} 
        label="Check-out Today" 
        value={stats?.todayCheckouts || 0} 
      />
      <StatCard 
        icon={<MessageSquare className="w-5 h-5 text-danger" />} 
        label="Pending Complaints" 
        value={stats?.openComplaints || 0} 
      />
      <StatCard 
        icon={<Users className="w-5 h-5 text-info" />} 
        label="Pending Visitors" 
        value={stats?.pendingVisitors || 0} 
      />
      <StatCard 
        icon={<BedDouble className="w-5 h-5 text-theme-primary" />} 
        label="Occupied Beds" 
        value={stats?.occupiedBeds || 0} 
      />
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
  return (
    <div className="bg-card border border-border rounded-[var(--radius-lg)] p-4 flex flex-col justify-between hover:shadow-sm motion-safe:transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-secondary">{label}</span>
        <div className="p-1.5 rounded-full bg-input">{icon}</div>
      </div>
      <div className="text-2xl font-black text-primary">{value}</div>
    </div>
  );
}