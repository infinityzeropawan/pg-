import { 
  LayoutDashboard, MessageSquare, ClipboardCheck, BedDouble, 
  Users, AlertCircle, Utensils, UserPlus, Clock, LogOut, Radio, FileText, Archive, IndianRupee, Receipt, Menu
} from 'lucide-react';

export const MENU_ITEMS = [
  { key: 'dashboard', icon: LayoutDashboard, href: '/manager/dashboard' },
  { key: 'students', icon: Users, href: '/manager/students' },
  { key: 'rooms', icon: BedDouble, href: '/manager/rooms' },
  { key: 'checkin', icon: ClipboardCheck, href: '/manager/check-in' },
  { key: 'enquiries', icon: MessageSquare, href: '/manager/enquiries' },
  { key: 'complaints', icon: AlertCircle, href: '/manager/complaints' },
  { key: 'visitors', icon: UserPlus, href: '/manager/visitors' },
  { key: 'attendance', icon: Clock, href: '/manager/attendance' },
  { key: 'gate-logs', icon: LogOut, href: '/manager/gate-logs' },
  { key: 'leaves', icon: Clock, href: '/manager/leaves', label: 'Leaves' },
  { key: 'food', icon: Utensils, href: '/manager/food', label: 'Food Menu' },
  { key: 'broadcasts', icon: Radio, href: '/manager/broadcasts' },
  { key: 'housekeeping', icon: ClipboardCheck, href: '/manager/housekeeping', label: 'Housekeeping' },
  { key: 'documents', icon: FileText, href: '/manager/documents' },
  { key: 'inventory', icon: Archive, href: '/manager/inventory' },
  { key: 'finance', icon: IndianRupee, href: '/manager/finance' },
  { key: 'expenses', icon: Receipt, href: '/manager/expenses', label: 'Expenses' },
  { key: 'daily-ops', icon: FileText, href: '/manager/daily-operations', label: 'Daily Ops' },
  { key: 'reports', icon: FileText, href: '/manager/reports', label: 'Reports' },
  { key: 'staff', icon: Users, href: '/manager/staff', label: 'Staff' },
  { key: 'settings', icon: Menu, href: '/manager/settings', label: 'Settings' }
];