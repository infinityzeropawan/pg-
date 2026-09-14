// RESPONSIBILITY: Business logic and state for the Student Room screen.
// DATA FLOW: GET /api/v1/student/room -> useStudentRoom -> StudentRoomMain

'use client';

import { useCallback, useEffect, useState } from 'react';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';

export interface RoomInfo {
  property: {
    name: string | null;
    address: string | null;
    amenities: string[];
    images: string[];
  } | null;
  room: {
    roomNumber: string;
    roomType: string | null;
    monthlyRent: number;
  } | null;
  floor: {
    floorNumber: number;
  } | null;
  bed: {
    id: string;
    bedNumber: string;
  } | null;
  stay: {
    id: string;
    startDate: string;
    status: string;
  } | null;
  roommates: { name: string; phone: string }[];
}

export function useStudentRoom() {
  const [room, setRoom] = useState<RoomInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentOperationsApi.getRoomDetails();
      if (!data) {
        setRoom(null);
        setError('No active room allocation found.');
        return;
      }
      setRoom(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load room details.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { room, loading, error, refetch: load };
}