/**
 * RESPONSIBILITY: Centralized URL configuration for the Staff module.
 * Never hardcode URLs in components or API wrappers. Use this file.
 */

export const STAFF_ROUTES = {
  // Page Routes
  DASHBOARD: '/staff/dashboard',
  COOK: '/staff/cook',
  STOCK: '/staff/stock',
  ALERTS: '/staff/alerts',
  TASKS: '/staff/tasks',
  LOGIN: '/staff/login',
  FIRST_LOGIN: '/staff/first-login',
};

export const STAFF_API_ENDPOINTS = {
  // Add API endpoints here as needed
  FOOD_MENU: '/api/v1/food-menu',
  STOCK: '/api/v1/stock',
  STOCK_REQUESTS: '/api/v1/stock-requests',
  USAGE_LOGS: '/api/v1/usage-logs',
};
