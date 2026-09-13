import { studentsApi } from '@/app/owner/owner_lib/owner_api/OwnerStudents';
import { roomsApi } from '@/app/owner/owner_lib/owner_api/OwnerRooms';
import { bedsApi } from '@/app/owner/owner_lib/owner_api/OwnerBeds';
import { propertiesApi } from '@/app/owner/owner_lib/owner_api/OwnerProperties';
import { foodApi } from '@/app/owner/owner_lib/owner_api/OwnerFood';
import { financeApi } from '@/app/owner/owner_lib/owner_api/OwnerFinance';
import { stockRequestsApi } from '@/app/staff/staff_lib/staff_api/StaffStockRequests';

import { managerEnquiriesApi } from './managerEnquiries';
import { managerCheckinApi } from './managerCheckin';
import { mealsApi } from './ManagerMeals';
import { managerOperationsApi } from './managerOperations';
import { managerDashboardApi } from './managerDashboard';
import { authApi } from './ManagerAuth';
export const api = {
  ...authApi,
  managerDashboard: managerDashboardApi,
  managerOperations: managerOperationsApi,
  managerEnquiries: managerEnquiriesApi,  // alias used by hooks
  meals: mealsApi,
  managerMeals: mealsApi,                 // alias used by some hooks
  checkin: managerCheckinApi,
  enquiries: managerEnquiriesApi,
  students: studentsApi,
  rooms: roomsApi,
  beds: bedsApi,
  properties: propertiesApi,
  food: foodApi,
  finance: financeApi,
  stockRequests: stockRequestsApi,
};