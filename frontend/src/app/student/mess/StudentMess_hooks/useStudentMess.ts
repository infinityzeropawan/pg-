// RESPONSIBILITY: Business logic + state for the Student Mess screen.
// DATA FLOW: GET /student/mess, POST /student/mess/order, POST /student/mess/wallet/recharge,
//            PATCH /student/mess/orders/:id/rate -> useStudentMess -> StudentMessMain

'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import {
  normalizeMessPayload,
  type StudentMessPayload,
} from '@/app/student/student_lib/student_api/StudentTypes';
import { useStudentContext } from '@/app/student/student_components/StudentContext';

export const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'DINNER'] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export interface UseStudentMessResult {
  loading: boolean;
  ordering: string | null;
  error: string | null;
  walletBalancePaise: number;
  todayMenu: Record<string, string> | null;
  weekMenu: Record<string, Record<string, string>> | null;
  recentOrders: StudentMessPayload['recentOrders'];
  orderMeal: (mealType: MealType) => Promise<void>;
  rateOrder: (orderId: string, rating: number) => Promise<void>;
  rechargeWallet: (amountRupees: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useStudentMess(): UseStudentMessResult {
  const { profile } = useStudentContext();
  const [mess, setMess] = useState<StudentMessPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentOperationsApi.getMessData();
      setMess(normalizeMessPayload(data));
    } catch (e: unknown) {
      console.error('[useStudentMess] Failed to load mess data:', e);
      setMess(null);
      setError(e instanceof Error ? e.message : 'Failed to load mess data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const orderMeal = useCallback(
    async (mealType: MealType) => {
      setOrdering(mealType);
      try {
        await studentOperationsApi.orderMeal(mealType);
        toast.success(`${mealType.charAt(0)}${mealType.slice(1).toLowerCase()} order recorded.`);
        await load();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Failed to record the meal order.');
      } finally {
        setOrdering(null);
      }
    },
    [load]
  );

  const rateOrder = useCallback(
    async (orderId: string, rating: number) => {
      try {
        await studentOperationsApi.rateMeal(orderId, rating);
        toast.success('Thanks for rating your meal!');
        await load();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Failed to submit the rating.');
      }
    },
    [load]
  );

  const rechargeWallet = useCallback(
    async (amountRupees: number) => {
      try {
        await studentOperationsApi.rechargeMessWallet(amountRupees);
        toast.success('Wallet credit recorded.');
        await load();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Wallet recharge failed.');
      }
    },
    [load]
  );

  return {
    loading,
    ordering,
    error,
    walletBalancePaise: mess?.wallet?.balancePaise ?? 0,
    todayMenu: mess?.menu?.today ?? null,
    weekMenu: (mess?.menu?.week as Record<string, Record<string, string>> | undefined) ?? null,
    recentOrders: mess?.recentOrders ?? [],
    orderMeal,
    rateOrder,
    rechargeWallet,
    refetch: load,
  };
}