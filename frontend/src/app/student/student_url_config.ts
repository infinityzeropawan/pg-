/**
 * RESPONSIBILITY: Centralized URL configuration for the Student module.
 * Never hardcode URLs in components or API wrappers. Use this file.
 */

export const STUDENT_ROUTES = {
  // Page Routes
  DASHBOARD: '/student/dashboard',
  PROFILE: '/student/profile',
  ROOM: '/student/room',
  RENT: '/student/rent',
  MESS: '/student/mess',
  DOCUMENTS: '/student/documents',
  NOTICES: '/student/notices',
  COMPLAINTS: '/student/complaints',
  NEW_COMPLAINT: '/student/complaints/new',
  NOTICE_PERIOD: '/student/notice-period',
  VISITORS: '/student/visitors',
  LEAVES: '/student/leaves',
  FEEDBACK: '/student/feedback',
  ATTENDANCE: '/student/attendance',
  COMMUNICATION: '/student/communication',
  HISTORY: '/student/history',
  SETTINGS: '/student/settings',
  SOS: '/student/sos',
  LOGIN: '/student/login',
};

export const STUDENT_API_ENDPOINTS = {
  PROFILE: '/api/v1/student/profile',
  ROOM: '/api/v1/student/room',
  RENT_HISTORY: '/api/v1/student/rent-history',
  DOCUMENTS: '/api/v1/student/documents',
  MESS_MENU: '/api/v1/student/mess-menu',
  NOTICES: '/api/v1/student/notices',
  COMPLAINTS: '/api/v1/student/complaints',
  VISITORS: '/api/v1/student/visitors',
  LEAVES: '/api/v1/student/leaves',
  FEEDBACK: '/api/v1/student/feedback',
  ATTENDANCE: '/api/v1/student/attendance',
  COMMUNICATION: '/api/v1/student/communication',
  HISTORY: '/api/v1/student/history',
  SETTINGS: '/api/v1/student/settings',
};
