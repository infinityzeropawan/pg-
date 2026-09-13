import { CheckCircle, AlertTriangle, XCircle, Clock, Info } from 'lucide-react';
import React from 'react';

export type StatusType = 'Active' | 'Suspended' | 'Pending' | 'Resolved' | 'Open' | 'Closed' | 'Unknown';

export interface StatusBadgeConfig {
  textClass: string;
  bgClass: string;
  borderClass: string;
  icon: React.ElementType;
}

export const getStatusConfig = (status: string): StatusBadgeConfig => {
  const s = status.toLowerCase();
  
  // Success Statuses
  if (['active', 'working', 'present', 'resolved', 'paid'].includes(s)) {
    return {
      textClass: 'text-success',
      bgClass: 'bg-success-bg',
      borderClass: 'border-success',
      icon: CheckCircle
    };
  }
  
  // Warning Statuses
  if (['pending', 'in-progress', 'expiring', 'open'].includes(s)) {
    return {
      textClass: 'text-warning',
      bgClass: 'bg-warning-bg',
      borderClass: 'border-warning',
      icon: Clock
    };
  }

  // Danger Statuses
  if (['suspended', 'overdue', 'failed', 'broken', 'closed'].includes(s)) {
    return {
      textClass: 'text-danger',
      bgClass: 'bg-danger-bg',
      borderClass: 'border-danger',
      icon: XCircle
    };
  }

  // Default / Neutral
  return {
    textClass: 'text-info',
    bgClass: 'bg-info-bg',
    borderClass: 'border-info',
    icon: Info
  };
};

export const StatusBadge = ({ status, className = '' }: { status: string, className?: string }) => {
  const config = getStatusConfig(status);
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[var(--radius-full,999px)] text-[11px] font-semibold border ${config.bgClass} ${config.textClass} ${config.borderClass} ${className}`}>
      <Icon className="w-3 h-3" />
      {status.toUpperCase()}
    </span>
  );
};
