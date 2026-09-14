'use client';

// RESPONSIBILITY: Renders the Student Profile UI layer.
// DATA FLOW: useStudentProfile.ts -> StudentProfileMain.tsx
// Every value displayed comes from the profile payload fetched from Neon via
// GET /api/v1/student/profile. The editable fields persist through
// PUT /api/v1/student/profile (TenantProfile columns).

import Link from 'next/link';
import {
  User, Shield, Phone, Mail, MapPin, FileText, Briefcase, IdCard,
  Loader2, ExternalLink, GraduationCap, ReceiptText,
} from 'lucide-react';
import { STUDENT_ROUTES } from '@/app/student/student_url_config';
import { formatPaise } from '@/lib/utils/money';

import { useStudentProfile } from '@/app/student/profile/StudentProfile_hooks/useStudentProfile';

export function StudentProfileMain() {
  const { profile, formData, setFormData, handleSubmit, saving } = useStudentProfile();

  if (!profile) return <div className="p-4 motion-safe:animate-pulse text-secondary">Loading profile…</div>;

  const idNumber = profile.idProofNumber || '';
  const maskedId = idNumber.length > 4 ? `•••• •••• ${idNumber.slice(-4)}` : idNumber || 'Not provided';
  const dues = Number(profile.duesAmount || 0);

  const field = (
    label: string,
    key: keyof typeof formData,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <div>
      <label className="block text-xs font-bold text-secondary uppercase mb-1">{label}</label>
      <input
        value={formData[key]}
        onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))}
        className="w-full bg-input border border-border rounded-[var(--radius-md)] px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
        {...props}
      />
    </div>
  );

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
          👤 My Profile
        </h1>
        <p className="text-sm text-secondary mt-1">Your registered details and emergency contact.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Identity & KYC */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 text-center shadow-sm">
            <div className="w-24 h-24 bg-primary-subtle text-primary rounded-[var(--radius-full)] mx-auto flex items-center justify-center text-4xl font-black border-4 border-white shadow-md mb-4">
              {profile.name?.charAt(0)?.toUpperCase() || <User className="w-8 h-8" />}
            </div>
            <h2 className="text-xl font-black text-primary">{profile.name}</h2>
            <p className="text-sm font-medium text-secondary mb-4">{profile.email}</p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-subtle rounded-[var(--radius-full)] text-xs font-bold text-primary mb-4">
              <span>Room {profile.roomNumber || '—'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/30"></span>
              <span>Bed {profile.bedCode || profile.bedId || '—'}</span>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm text-left">
              <div className="flex items-center gap-2 text-primary">
                <Phone className="w-4 h-4 text-secondary" /> {profile.phone || '—'}
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Mail className="w-4 h-4 text-secondary" /> <span className="break-all">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <GraduationCap className="w-4 h-4 text-secondary" />
                {profile.stayStatus ? profile.stayStatus.replace(/_/g, ' ').toLowerCase() : 'No active stay'}
              </div>
            </div>
          </div>

          {/* KYC — real TenantProfile ID-proof columns */}
          <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 shadow-sm">
            <h3 className="font-bold text-primary mb-3 flex items-center gap-2 border-b border-border pb-2">
              <Shield className="w-4 h-4 text-secondary" /> ID Verification
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-xs font-bold text-secondary uppercase">ID type</div>
                <div className="font-medium text-primary flex items-center gap-2">
                  <IdCard className="w-3.5 h-3.5 text-secondary" /> {profile.idProofType || '—'}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-secondary uppercase">ID number</div>
                <div className="font-medium text-primary">{maskedId}</div>
              </div>
            </div>
            <Link
              href={STUDENT_ROUTES.DOCUMENTS}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-input text-primary font-bold text-sm py-2 rounded-[var(--radius-md)] hover:bg-border transition-colors"
            >
              <FileText className="w-4 h-4" /> Manage uploaded documents
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Editable details + account facts */}
        <div className="md:col-span-2 space-y-6">
          <form
            onSubmit={(e) => void handleSubmit(e)}
            className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm"
          >
            <h3 className="font-black text-primary text-lg mb-4 border-b border-border pb-3">
              Editable Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field('Emergency contact name', 'emergencyContactName', { required: true, placeholder: 'e.g. Suresh Sharma (Father)' })}
              {field('Emergency contact phone', 'emergencyContactPhone', { required: true, placeholder: 'e.g. +91 98765 43210' })}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-secondary uppercase mb-1">Permanent address</label>
                <textarea
                  value={formData.permanentAddress}
                  onChange={(e) => setFormData((prev) => ({ ...prev, permanentAddress: e.target.value }))}
                  rows={3}
                  className="w-full bg-input border border-border rounded-[var(--radius-md)] px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
                />
              </div>
              {field('College / Company', 'collegeOrCompany', { placeholder: 'e.g. St. Xavier\u2019s College' })}
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-[var(--radius-md)] hover:bg-primary-hover disabled:opacity-60 transition-colors flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <p className="text-xs text-secondary">Changes are saved to your PG record immediately.</p>
            </div>
          </form>

          <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
            <h3 className="font-black text-primary text-lg mb-4 border-b border-border pb-3">Account Facts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-xs font-bold text-secondary uppercase mb-1">Current address</span>
                <span className="font-medium text-primary flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                  {profile.permanentAddress || '—'}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-secondary uppercase mb-1">College / Company</span>
                <span className="font-medium text-primary flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                  {profile.collegeOrCompany || '—'}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-secondary uppercase mb-1">Member since</span>
                <span className="font-medium text-primary">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN') : '—'}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-secondary uppercase mb-1">Outstanding dues</span>
                <span className={`font-medium flex items-center gap-2 ${dues > 0 ? 'text-danger' : 'text-success'}`}>
                  <ReceiptText className="w-4 h-4" />
                  {formatPaise(dues)}
                  {profile.unpaidInvoicesCount > 0 && ` (${profile.unpaidInvoicesCount} unpaid)`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
