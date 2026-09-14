'use client';

// RESPONSIBILITY: Renders the Student Communication UI.
// Every panel is backed by real data: announcements come from the notices API,
// roommates from the room API, and the composer persists a SupportTicket in the DB.

import { useState } from 'react';
import { Megaphone, Pin, Users, Send, Phone, Bed, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

import { useStudentCommunication } from '@/app/student/communication/StudentCommunication_hooks/useStudentCommunication';

export function StudentCommunicationMain() {
  const { notices, roommates, loading, sending, error, sendMessage } = useStudentCommunication();
  const [tab, setTab] = useState<'announcements' | 'roommates'>('announcements');
  const [message, setMessage] = useState('');
  const [sentOk, setSentOk] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending) return;
    const ok = await sendMessage(message);
    if (ok) {
      setMessage('');
      setSentOk(true);
      setTimeout(() => setSentOk(false), 5000);
    }
  };

  const tabClass = (active: boolean) =>
    `px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-[var(--radius-md)] transition-colors cursor-pointer ${
      active
        ? 'bg-card text-primary border border-border border-b-transparent -mb-px'
        : 'text-secondary hover:text-primary'
    }`;

  return (
    <div className="space-y-6 w-full pb-10">
      <div>
        <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
          💬 Communication
        </h1>
        <p className="text-sm text-secondary mt-1">
          Admin announcements for your PG, your roommate directory, and a direct line to the warden.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-danger-bg border border-danger/20 text-danger rounded-[var(--radius-lg)] p-4 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 border-b border-border overflow-x-auto">
        <button onClick={() => setTab('announcements')} className={tabClass(tab === 'announcements')}>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Megaphone className="w-4 h-4" /> Admin Announcements
            <span className="text-[10px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              {notices.length}
            </span>
          </span>
        </button>
        <button onClick={() => setTab('roommates')} className={tabClass(tab === 'roommates')}>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Users className="w-4 h-4" /> Roommates
            <span className="text-[10px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              {roommates.length}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
