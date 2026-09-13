// RESPONSIBILITY: Renders the ManagerDashboardNoProperty component.
import { Lock } from 'lucide-react';

import { clearSession } from '@/app/manager/manager_lib/manager_auth/ManagerSession';
export function ManagerDashboardNoProperty() {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center max-w-md mx-auto">
      <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center mb-6 border border-border">
        <Lock className="w-10 h-10 text-secondary" />
      </div>
      <h2 className="text-2xl font-bold text-primary mb-2">No Property Assigned</h2>
      <p className="text-secondary mb-8 leading-relaxed">
        You have not been assigned to manage any PG yet. Please contact your PG Owner to grant you access to a property.
      </p>
      <button 
        onClick={() => {
          if (typeof window !== 'undefined') { 
            clearSession(); 
            window.location.href = '/'; 
          }
        }}
        className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-[var(--radius-md,8px)] motion-safe:transition-colors"
      >
        Logout for now
      </button>
    </div>
  );
}