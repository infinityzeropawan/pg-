// [TYPES] ManagerCheckin
// Defines multi-step wizard form shape and per-step Zod validation schemas.
import { z } from 'zod';
export interface ManagerCheckinPersonal {
  name: string;
  email: string;
  phone: string;
  gender: string;
  college: string;
  dob: string;
}
export interface ManagerCheckinDocuments {
  files: unknown[];
  aadharNumber: string;
  panNumber: string;
}
export interface ManagerCheckinParent {
  name: string;
  phone: string;
  email: string;
}
export interface ManagerCheckinRoom {
  bedId: string;
}
export interface ManagerCheckinCompatibility {
  sleepSchedule: string;
  studyHabits: string;
}
export interface ManagerCheckinDeposit {
  type: string;
  rentAmount: string;
  loanPartner: string;
  stayDuration: string;
}
export interface ManagerCheckinAgreement {
  accepted: boolean;
}
export interface ManagerCheckinCredentials {
  password: string;
}
export interface ManagerCheckinFormData {
  enquiryId: string;
  personal: ManagerCheckinPersonal;
  documents: ManagerCheckinDocuments;
  parent: ManagerCheckinParent;
  room: ManagerCheckinRoom;
  compatibility: ManagerCheckinCompatibility;
  deposit: ManagerCheckinDeposit;
  agreement: ManagerCheckinAgreement;
  credentials: ManagerCheckinCredentials;
}
export interface ManagerCheckinStep {
  id: number;
  title: string;
  icon: unknown; // Lucide icon type
}
// Per-step Zod validation schemas (used in useManagerCheckinForm handleNext)
export const CheckinStep1Schema = z.object({
  name: z.string().min(1, 'Full Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
});
export const CheckinStep3Schema = z.object({
  parentName: z.string().min(1, 'Parent Name is required'),
  parentPhone: z.string().min(10, 'Valid parent phone is required'),
});