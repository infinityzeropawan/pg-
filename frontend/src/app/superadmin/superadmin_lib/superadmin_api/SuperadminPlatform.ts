import { MOCK_DASHBOARD_STATS } from '../superadmin_mock_data';

export const platformApi = {
  getDashboardStats: () => {
    // FORCE HARDCODED MOCK DATA AS REQUESTED
    return MOCK_DASHBOARD_STATS as any;
  },
};
