// RESPONSIBILITY: Renders the ManagerDashboardHeader component.
import { CheckCircle2, TrendingUp } from 'lucide-react';

interface ManagerUser {
  name?: string;
  id?: string;
}

interface ManagerProperty {
  id: string;
  name?: string;
}

interface ManagerDashboardHeaderProps {
  user: unknown;
  selectedProp: unknown;
  isPresent: boolean;
  handleMarkPresent: () => void;
}

export function ManagerDashboardHeader({ user, selectedProp, isPresent, handleMarkPresent }: ManagerDashboardHeaderProps) {
  const typedUser = user as ManagerUser | null;
  const typedProp = selectedProp as ManagerProperty | undefined;
  
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const todayDate = new Date().toLocaleDateString('en-IN', dateOptions);
  
  const currentHour = new Date().getHours();
  let greeting = 'Good Evening';
  if (currentHour < 12) greeting = 'Good Morning';
  else if (currentHour < 17) greeting = 'Good Afternoon';

  const managerName = typedUser?.name || 'Manager';

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-5 rounded-[var(--radius-lg)] border border-border shadow-sm">
      <div>
        <h1 className="text-2xl font-black text-primary tracking-tight">
          {greeting}, {managerName}
        </h1>
        <p className="text-sm text-secondary font-medium mt-1 flex items-center gap-2">
          {todayDate}
          <span className="hidden md:inline text-border">•</span>
          <span className="text-theme-primary">{typedProp?.name || 'Loading Property...'}</span>
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Performance Score */}
        <div className="hidden sm:flex flex-col items-end mr-4 pr-4 border-r border-border">
          <span className="text-xs font-bold text-secondary uppercase mb-1">Performance Score</span>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-lg font-black text-success">92/100</span>
          </div>
        </div>

        {isPresent ? (
          <div className="flex items-center gap-2 bg-success-bg border border-success/20 text-success px-4 py-2 rounded-[var(--radius-md)]">
            <CheckCircle2 className="w-4 h-4" />
            <div>
              <p className="text-[10px] font-bold uppercase opacity-80">Attendance</p>
              <p className="text-sm font-bold leading-tight">Marked Present</p>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleMarkPresent}
            className="bg-primary text-white hover:bg-primary-hover px-5 py-2.5 rounded-[var(--radius-md)] font-bold text-sm motion-safe:transition-colors shadow-sm"
          >
            Mark Present Today
          </button>
        )}
      </div>
    </div>
  );
}