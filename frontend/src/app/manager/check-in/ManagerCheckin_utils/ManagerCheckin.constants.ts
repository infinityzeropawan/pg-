import { 
  User, FileText, Users, BedDouble, HeartHandshake, 
  Wallet, FileCheck, Key, Utensils, CheckCircle 
} from 'lucide-react';

import type { ManagerCheckinStep } from '@/app/manager/check-in/ManagerCheckin_types/ManagerCheckin.types';
export const MANAGER_CHECKIN_WIZARD_STEPS: ManagerCheckinStep[] = [
  { id: 1, title: 'Personal', icon: User },
  { id: 2, title: 'Documents', icon: FileText },
  { id: 3, title: 'Parent', icon: Users },
  { id: 4, title: 'Room/Bed', icon: BedDouble },
  { id: 5, title: 'Compatibility', icon: HeartHandshake },
  { id: 6, title: 'Deposit', icon: Wallet },
  { id: 7, title: 'Agreement', icon: FileCheck },
  { id: 8, title: 'Credentials', icon: Key },
  { id: 9, title: 'Mess', icon: Utensils },
  { id: 10, title: 'Success', icon: CheckCircle }
];