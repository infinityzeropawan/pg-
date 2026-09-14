'use client';

// RESPONSIBILITY: First-login password change for the Parent portal.
// Reached when the session has `mustChangePassword` set (see ParentRequireParent).

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { authApi } from '@/app/parent/parent_lib/parent_api/ParentAuth';
import { clearSession } from '@/app/parent/parent_lib/parent_auth/ParentSession';

const MIN_LENGTH = 8;

export default function ParentFirstLoginPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < MIN_LENGTH) {
      setError(`Password must be at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      await authApi.changePassword('', newPassword);
      toast.success('Password updated. Please sign in again.');
      clearSession();
      router.replace('/parent/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update password.');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-page p-4">
      <div className="w-full max-w-md">
        <div className="inline-flex items-center justify-center p-3 bg-primary-subtle rounded-xl mb-5 border border-primary/20">
          <ShieldCheck className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-black text-primary mb-2">Set a new password</h1>
        <p className="text-sm text-secondary mb-6">
          For security, you must replace your temporary password before using the Parent Portal.
        </p>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-[var(--radius-lg)] p-6 space-y-5 shadow-sm">
          <div>
            <label htmlFor="parent-new-password" className="block text-sm font-bold text-secondary uppercase mb-2">New Password</label>
            <div className="relative">
              <input
                id="parent-new-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={MIN_LENGTH}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-input border border-border pr-12 px-4 py-3 rounded-[var(--radius-md)] text-sm text-primary focus:outline-none focus:border-primary"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary hover:text-primary"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="parent-confirm-password" className="block text-sm font-bold text-secondary uppercase mb-2">Confirm Password</label>
            <input
              id="parent-confirm-password"
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-input border border-border px-4 py-3 rounded-[var(--radius-md)] text-sm text-primary focus:outline-none focus:border-primary"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-danger text-sm bg-danger-bg border border-danger/20 p-3 rounded-[var(--radius-sm)] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-primary text-white rounded-[var(--radius-md)] font-bold shadow-md hover:bg-primary-hover transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Password & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}