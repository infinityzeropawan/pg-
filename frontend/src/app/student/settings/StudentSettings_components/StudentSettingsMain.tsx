'use client';

// RESPONSIBILITY: Renders the Student Settings UI.
// Every action here is backed by a real endpoint: password changes persist to the
// users table via POST /api/v1/auth/change-password, and logout revokes the
// refresh token via POST /api/v1/auth/logout. Nothing in this screen is cosmetic.

import { useState } from 'react';
import Link from 'next/link';
import { KeyRound, LogOut, ShieldCheck, Loader2, Info } from 'lucide-react';

import { useStudentSettings } from '@/app/student/settings/StudentSettings_hooks/useStudentSettings';
import { STUDENT_ROUTES } from '@/app/student/student_url_config';

export function StudentSettingsMain() {
  const { profile, changingPassword, changePassword, logout } = useStudentSettings();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    const ok = await changePassword(currentPassword, newPassword);
    if (ok) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  const student = profile;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <div className="space-y-6 w-full pb-10">
      <div>
        <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
          ⚙️ Settings &amp; Security
        </h1>
        <p className="text-sm text-secondary mt-1">Manage your account password and active sessions.</p>
      </div>

      {/* Account overview (read-only, straight from the database) */}
      <div className="bg-card border border-border rounded-[var(--radius-lg)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-input/50 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-primary text-lg">Account</h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-xs font-bold text-secondary uppercase mb-1">Full name</span>
            <span className="font-medium text-primary">{student?.name || '—'}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-secondary uppercase mb-1">Email</span>
            <span className="font-medium text-primary break-all">{student?.email || '—'}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-secondary uppercase mb-1">Phone</span>
            <span className="font-medium text-primary">{student?.phone || '—'}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-secondary uppercase mb-1">Member since</span>
            <span className="font-medium text-primary">
              {student?.createdAt ? new Date(student.createdAt).toLocaleDateString('en-IN') : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Change password — POST /api/v1/auth/change-password */}
      <form
        onSubmit={handleChangePassword}
        className="bg-card border border-border rounded-[var(--radius-lg)] shadow-sm overflow-hidden"
      >
        <div className="p-4 border-b border-border bg-input/50 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-primary text-lg">Change Password</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-secondary uppercase mb-1">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-input border border-border rounded-[var(--radius-md)] px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary uppercase mb-1">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
                className="w-full bg-input border border-border rounded-[var(--radius-md)] px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary uppercase mb-1">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                className={`w-full bg-input border rounded-[var(--radius-md)] px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary ${
                  passwordsMismatch ? 'border-danger' : 'border-border'
                }`}
              />
              {passwordsMismatch && (
                <p className="text-[11px] text-danger mt-1">Passwords do not match.</p>
              )}
            </div>
          </div>
          <p className="text-xs text-secondary flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            Use at least 6 characters. Changing your password does not sign you out of other devices.
          </p>
          <button
            type="submit"
            disabled={changingPassword || !newPassword || passwordsMismatch}
            className="px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-[var(--radius-md)] hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            {changingPassword ? 'Updating…' : 'Update Password'}
          </button>
        </div>
      </form>

      {/* Logout — POST /api/v1/auth/logout + local session cleanup */}
      <div className="pt-4">
        <button
          onClick={() => void handleLogout()}
          disabled={loggingOut}
          className="w-full py-3 bg-danger-bg text-danger font-bold rounded-[var(--radius-md)] border border-danger/30 hover:bg-danger hover:text-white transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
        >
          {loggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
          {loggingOut ? 'Signing out…' : 'Logout'}
        </button>
      </div>

      <p className="text-xs text-secondary text-center">
        Need to update your personal or emergency-contact details?{' '}
        <Link href={STUDENT_ROUTES.PROFILE} className="text-primary font-bold hover:underline">
          Edit your profile
        </Link>
        .
      </p>
    </div>
  );
}
