// DATA FLOW: GET /api/v1/student/profile -> StudentProvider -> useStudentContext -> all Student screens
'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';

/**
 * Normalised, fully-typed Student profile consumed by every Student portal screen.
 *
 * IMPORTANT: This context must never fabricate values. Every field below is either
 * sourced from the backend response or explicitly null'. Screens are expected to
 * render an empty/error state when the profile cannot be loaded.
 */
export interface StudentPortalProfile {
  /** Prisma `User.id` — the identity used by every authenticated student endpoint. */
  id: string;
  /** Alias kept for legacy screens that read `userId`. */
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  propertyId: string | null;
  propertyName: string | null;
  roomNumber: string | null;
  bedId: string | null;
  bedCode: string | null;
  floorNumber: number | null;
  /** Outstanding dues in the smallest currency unit (paise), as stored by the API. */
  duesAmount: number;
  unpaidInvoicesCount: number;
  monthlyRent: number;
  /** Security deposit held for the active stay, in paise. */
  securityDeposit: number;
  hasMessFacility: boolean;
  emergencyContactName: string;
  emergencyContactPhone: string;
  permanentAddress: string;
  collegeOrCompany: string;
  idProofType: string;
  idProofNumber: string;
  parentName: string;
  parentPhone: string;
  stayStartDate: string | null;
  stayStatus: string | null;
  isOnNoticePeriod: boolean;
  /** True when a linked parent account exists to receive gate / leave / SOS alerts. */
  hasLinkedParent: boolean;
  createdAt: string | null;
}

interface StudentContextType {
  profile: StudentPortalProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const StudentContext = createContext<StudentContextType>({
  profile: null,
  loading: true,
  error: null,
  refetch: async () => {},
});

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function mapProfileResponse(data: any): StudentPortalProfile | null {
  const student = data?.student;
  if (!student?.id) return null;

  const tenantProfile = data?.profile ?? null;
  const property = data?.property ?? null;
  const room = data?.room ?? null;
  const floor = data?.floor ?? null;
  const bed = data?.bed ?? null;
  const stay = data?.stay ?? null;
  const linkedParent = data?.linkedParent ?? null;

  const emergencyContactName = asString(tenantProfile?.emergencyContactName);
  const emergencyContactPhone = asString(tenantProfile?.emergencyContactPhone);

  return {
    id: asString(student.id),
    userId: asString(student.id),
    name: asString(student.fullName),
    email: asString(student.email),
    phone: asString(student.phone),
    avatarUrl: student.avatarUrl ?? null,
    propertyId: property?.id ?? null,
    propertyName: property?.name ?? null,
    roomNumber: room?.roomNumber ?? null,
    bedId: bed?.id ?? null,
    bedCode: bed?.bedNumber ?? null,
    floorNumber: floor?.floorNumber ?? null,
    duesAmount: Number(data?.outstandingDues ?? 0),
    unpaidInvoicesCount: Number(data?.unpaidInvoicesCount ?? 0),
    monthlyRent: Number(stay?.monthlyRent ?? room?.monthlyRent ?? 0),
    securityDeposit: Number(data?.deposit?.amount ?? stay?.securityDeposit ?? 0),
    hasMessFacility: Boolean(data?.hasMessFacility),
    hasLinkedParent: Boolean(linkedParent?.id),
    emergencyContactName,
    emergencyContactPhone,
    permanentAddress: asString(tenantProfile?.permanentAddress),
    collegeOrCompany: asString(tenantProfile?.collegeOrCompany),
    idProofType: asString(tenantProfile?.idProofType),
    idProofNumber: asString(tenantProfile?.idProofNumber),
    // Prefer the explicitly linked parent account, then fall back to the emergency contact.
    parentName: asString(linkedParent?.user?.fullName) || emergencyContactName,
    parentPhone: asString(linkedParent?.user?.phone) || emergencyContactPhone,
    stayStartDate: stay?.startDate ?? null,
    stayStatus: stay?.status ?? null,
    isOnNoticePeriod: stay?.status === 'NOTICE_PERIOD',
    createdAt: student.createdAt ?? null,
  };
}

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<StudentPortalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentOperationsApi.getProfile();
      const mapped = mapProfileResponse(data);
      if (!mapped) {
        setProfile(null);
        setError('We could not load your resident profile. Please contact your PG manager.');
        return;
      }
      setProfile(mapped);
    } catch (e: unknown) {
      console.error('[StudentContext] Failed to fetch student profile:', e);
      setProfile(null);
      setError(e instanceof Error ? e.message : 'Failed to load your profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const value = useMemo(
    () => ({ profile, loading, error, refetch: loadProfile }),
    [profile, loading, error, loadProfile]
  );

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export const useStudentContext = () => useContext(StudentContext);
