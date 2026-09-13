// RESPONSIBILITY: Renders the OwnerFinanceCards component. Receives data via props/hooks.

import { Wallet, IndianRupee, TrendingDown, TrendingUp, Receipt, ChevronUp, ChevronDown } from 'lucide-react';

import { formatINR } from '@/lib/utils/formatters';

export interface OwnerFinanceCardsProps {
  stats: unknown;
  netProfit: number;
  profitMargin: string | number;
  isProfitable: boolean;
}

export function OwnerFinanceCards({
  stats,
  netProfit,
  profitMargin,
  isProfitable
}: OwnerFinanceCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
      {/* Total Revenue */}
      <div className="bg-card border border-border rounded-lg p-5 relative overflow-hidden group hover:border-success motion-safe:transition-colors">
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm font-medium text-secondary">Total Revenue</div>
          <div className="p-1.5 bg-success-bg text-success rounded-md border border-success">
            <IndianRupee className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-primary mb-1 group-hover:text-success motion-safe:transition-colors">
// @ts-expect-error
          {formatINR((stats as any).revenue)}
        </div>
        <div className="flex items-center text-xs text-success font-medium">
          <TrendingUp className="w-3 h-3 mr-1" /> +12% from last month
        </div>
      </div>

      {/* Total Expenses */}
      <div className="bg-card border border-border rounded-lg p-5 relative overflow-hidden group hover:border-danger motion-safe:transition-colors">
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm font-medium text-secondary">Total Expenses</div>
          <div className="p-1.5 bg-danger-bg text-danger rounded-md border border-danger">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-primary mb-1 group-hover:text-danger motion-safe:transition-colors">
// @ts-expect-error
          {formatINR((stats as any).totalExpenses)}
        </div>
        <div className="flex items-center text-xs text-danger font-medium">
          <TrendingUp className="w-3 h-3 mr-1" /> +5% from last month
        </div>
      </div>

      {/* Net Profit */}
      <div className="bg-card border border-border rounded-lg p-5 relative overflow-hidden group hover:border-primary motion-safe:transition-colors">
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm font-medium text-secondary">Net Profit</div>
          <div className="p-1.5 bg-primary-subtle text-primary rounded-md border border-primary">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-primary mb-1">
          {formatINR(netProfit)}
        </div>
        <div className={`flex items-center text-xs font-medium ${isProfitable ? 'text-success' : 'text-danger'}`}>
          {isProfitable ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
          {profitMargin}% Profit Margin
        </div>
      </div>

      {/* Pending Dues */}
      <div className="bg-card border border-border rounded-lg p-5 relative overflow-hidden group hover:border-warning motion-safe:transition-colors">
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm font-medium text-secondary">Pending Dues</div>
          <div className="p-1.5 bg-warning-bg text-warning rounded-md border border-warning">
            <Receipt className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-primary mb-1 group-hover:text-warning motion-safe:transition-colors">
// @ts-expect-error
          {formatINR((stats as any).pendingDues)}
        </div>
        <div className="flex items-center text-xs text-warning font-medium cursor-pointer hover:underline">
          View defaulters list &rarr;
        </div>
      </div>
    </div>
  );
}
