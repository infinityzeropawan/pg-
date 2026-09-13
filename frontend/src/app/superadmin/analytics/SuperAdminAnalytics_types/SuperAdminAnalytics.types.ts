export interface SuperAdminAnalyticsStats {
  activeOwnersCount: number;
  pendingRequestsCount: number;
  activePropertiesCount: number;
  totalStudentsCount: number;
  mrr: number;
  occupancyPercentage: number;
  openTicketsCount: number;
  expiringPlansCount: number;
  latestRequests: unknown[];
  recentAuditLogs: unknown[];
  ownersByPlan: Array<{ plan: string; count: number }>;
}

export interface SuperAdminAnalyticsHeaderProps {}

export interface SuperAdminAnalyticsKPIsProps {
  stats: SuperAdminAnalyticsStats;
}

export interface SuperAdminAnalyticsChartsProps {
  revenueData: Array<{ month: string; revenue: number }>;
  planData: Array<{ name: string; value: number }>;
}

export interface SuperAdminAnalyticsTopPropertiesProps {
  // We can pass real data later, but for now we render the mock table.
}
