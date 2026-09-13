'use client';

// RESPONSIBILITY: Renders the OwnerFinanceCharts component. Receives data via props/hooks.

import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export interface OwnerFinanceChartsProps {
  trendOptions: unknown;
  trendSeries: unknown[];
  expenseSeries: number[];
  expensePieOptions: unknown;
}

export function OwnerFinanceCharts({
  trendOptions,
  trendSeries,
  expenseSeries,
  expensePieOptions
}: OwnerFinanceChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5">
        <h3 className="text-sm font-bold text-primary mb-4">Income vs Expense (6 Months Trend)</h3>
        <div className="h-[300px]">
// @ts-expect-error
// @ts-expect-error
    // @ts-expect-error - unresolved TS error
          <Chart options={trendOptions as any} series={trendSeries as any} type="bar" height="100%" />
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="text-sm font-bold text-primary mb-4">Expense Breakdown</h3>
        <div className="h-[300px] flex items-center justify-center">
          {expenseSeries.length > 0 ? (
// @ts-expect-error
            <Chart options={expensePieOptions} series={expenseSeries as any} type="donut" height="100%" />
          ) : (
            <div className="text-secondary text-sm">No expenses recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
