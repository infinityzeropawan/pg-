// RESPONSIBILITY: Business logic + state for the Student Communication screen.
// DATA FLOW: GET /api/v1/student/notices (admin broadcasts)
//            GET /api/v1/student/room (roommate directory)
//            POST /api/v1/student/feedback (message persisted as a SupportTicket)
//            -> useStudentCommunication -> StudentCommunicationMain

'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import { useStudentContext } from '@/app/student/student_components/StudentContext';

export interface NoticeMessage {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  createdAt: string;
}

export interface RoommateInfo {
  name: string;
  phone: string;
  bedNumber: string | null;
  roomNumber: string | null;
}

function normalizeNotices(raw: unknown): NoticeMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((n: any) => ({
    id: String(n.id),
    title: String(n.title ?? ''),
    content: String(n.content ?? ''),
    category: String(n.category ?? 'General'),
    isPinned: Boolean(n.isPinned),
    createdAt: String(n.createdAt ?? ''),
  }));
}

function normalizeRoommates(raw: unknown): RoommateInfo[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r: any) => ({
    name: String(r?.name ?? 'Roommate'),
    phone: String(r?.phone ?? ''),
    bedNumber: r?.bedNumber ?? null,
    roomNumber: r?.roomNumber ?? null,
  }));
}

export function useStudentCommunication() {
  const { profile } = useStudentContext();
  const [notices, setNotices] = useState<NoticeMessage[]>([]);
  const [roommates, setRoommates] = useState<RoommateInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [noticeData, roomData] = await Promise.all([
        studentOperationsApi.getNotices(),
        studentOperationsApi.getRoomDetails(),
      ]);
      setNotices(normalizeNotices(noticeData));
      setRoommates(normalizeRoommates((roomData as any)?.roommates));
    } catch (e: unknown) {
      console.error('[useStudentCommunication] Failed to load:', e);
      setNotices([]);
      setRoommates([]);
      setError(e instanceof Error ? e.message : 'Failed to load communication data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /**
   * Sends a message to the PG admin/warden. There is no dedicated chat table, so the
   * message is persisted as a SupportTicket (the same queue the admin dashboard reads).
   */
  const sendMessage = useCallback(
    async (text: string): Promise<boolean> => {
      const body = text.trim();
      if (!body) return false;
      if (!profile) {
        toast.error('You must be logged in to send a message.');
        return false;
      }
      setSending(true);
      try {
        await studentOperationsApi.submitFeedback({
          title: 'Message from resident',
          description: body,
          priority: 'MEDIUM',
        });
        toast.success('Message sent to the PG admin.');
        return true;
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Failed to send your message.');
        return false;
      } finally {
        setSending(false);
      }
    },
    [profile]
  );

  return { notices, roommates, loading, sending, error, sendMessage, refetch: load, profile };
}
