// RESPONSIBILITY: Renders the ManagerDashboardQuickActions component.
import Link from 'next/link';
import { 
  UserPlus, 
  IndianRupee, 
  AlertCircle, 
  Package, 
  TrendingUp 
} from 'lucide-react';
export function ManagerDashboardQuickActions() {
  return (
    <div>
      <h2 className="font-black text-primary text-lg border-b border-border pb-3 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/manager/students" className="bg-card border border-border rounded-[var(--radius-md)] p-4 flex flex-col items-center justify-center gap-3 hover:bg-input hover:border-primary hover:shadow-sm motion-safe:transition-all">
          <div className="p-3 bg-theme-primary/10 rounded-full text-theme-primary">
            <UserPlus className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-primary">Add Student</span>
        </Link>
        <Link href="/manager/finance" className="bg-card border border-border rounded-[var(--radius-md)] p-4 flex flex-col items-center justify-center gap-3 hover:bg-success-bg hover:border-success hover:shadow-sm motion-safe:transition-all">
          <div className="p-3 bg-success-bg rounded-full text-success">
            <IndianRupee className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-primary">Collect Rent</span>
        </Link>
        <Link href="/manager/complaints" className="bg-card border border-border rounded-[var(--radius-md)] p-4 flex flex-col items-center justify-center gap-3 hover:bg-danger-bg hover:border-danger hover:shadow-sm motion-safe:transition-all">
          <div className="p-3 bg-danger-bg rounded-full text-danger">
            <AlertCircle className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-primary">Complaints</span>
        </Link>
        <Link href="/manager/inventory" className="bg-card border border-border rounded-[var(--radius-md)] p-4 flex flex-col items-center justify-center gap-3 hover:bg-warning-bg hover:border-warning hover:shadow-sm motion-safe:transition-all">
          <div className="p-3 bg-warning-bg rounded-full text-warning">
            <Package className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-primary">Inventory</span>
        </Link>
      </div>
    </div>
  );
}