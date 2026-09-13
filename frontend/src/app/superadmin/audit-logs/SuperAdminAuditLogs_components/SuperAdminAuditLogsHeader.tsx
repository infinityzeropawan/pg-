// RESPONSIBILITY: Renders the SuperAdminAuditLogsHeader component.
import React from 'react';

import type { SuperAdminAuditLogsHeaderProps } from '@/app/superadmin/audit-logs/SuperAdminAuditLogs_types/SuperAdminAuditLogs.types';

export const SuperAdminAuditLogsHeader: React.FC<SuperAdminAuditLogsHeaderProps> = () => {
  return (
    <div>
      <h1 className="text-[22px] font-bold text-primary">System Audit Logs</h1>
      <p className="text-secondary text-sm">Chronological record of critical system actions.</p>
    </div>
  );
};
