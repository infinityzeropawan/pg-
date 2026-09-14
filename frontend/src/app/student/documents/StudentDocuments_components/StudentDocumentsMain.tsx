'use client';

// RESPONSIBILITY: Renders the Student Documents & Agreement UI from live DB records.

import {
  FileText,
  Download,
  CheckCircle,
  Clock,
  BookOpen,
  FileSignature,
  AlertCircle,
  Inbox,
} from 'lucide-react';

import { useStudentDocuments } from '../StudentDocuments_hooks/useStudentDocuments';

const DOC_TYPE_LABELS: Record<string, string> = {
  AADHAAR: 'Aadhaar Card',
  PAN: 'PAN Card',
  POLICE_VERIFICATION: 'Police Verification',
  RENT_AGREEMENT: 'Rent Agreement',
  COLLEGE_ID: 'College / Work ID',
  EMPLOYMENT_ID: 'Employment ID',
  OTHER: 'Other Document',
};

function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string): string {
  if (!value) return '—';
  const d = new Date(value);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-IN');
}

function EmptyBlock({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="text-center p-6 border border-dashed border-border rounded-[var(--radius-md)] bg-page">
      <Inbox className="w-8 h-8 mx-auto mb-2 opacity-30 text-secondary" />
      <div className="font-bold text-primary text-sm">{title}</div>
      <div className="text-xs text-secondary mt-1">{hint}</div>
    </div>
  );
}

export function StudentDocumentsMain() {
  const { documents, agreements, rules, propertyName, loading, error } = useStudentDocuments();

  if (loading) {
    return (
      <div className="p-8 text-center text-secondary motion-safe:animate-pulse">
        Loading your documents...
      </div>
    );
  }

  const latestAgreement = agreements.length > 0 ? agreements[0] : null;

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
          📄 Agreement &amp; Documents
        </h1>
        <p className="text-sm text-secondary mt-1">
          Manage your lease agreement, KYC documents, and PG rules.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-4 bg-danger-bg border border-danger/30 rounded-[var(--radius-md)] text-danger text-sm font-semibold">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lease Agreement */}
        <div className="md:col-span-2 bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
          <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
            <FileSignature className="w-5 h-5 text-primary" /> Digital Lease Agreement
          </h3>

          {latestAgreement ? (
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-primary-subtle border border-primary/20 rounded-[var(--radius-md)] p-5">
              <div className="w-20 h-24 bg-white rounded shadow border border-border flex items-center justify-center shrink-0">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="font-bold text-primary text-lg">
                  Lease Agreement{propertyName ? ` — ${propertyName}` : ''}
                </div>
                <div className="text-sm text-secondary mt-1">
                  Valid: {formatDate(latestAgreement.startDate)} → {formatDate(latestAgreement.endDate)}
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${latestAgreement.isSignedByTenant ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'}`}>
                    {latestAgreement.isSignedByTenant ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {latestAgreement.isSignedByTenant ? 'Signed by you' : 'Your signature pending'}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${latestAgreement.isSignedByOwner ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'}`}>
                    {latestAgreement.isSignedByOwner ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {latestAgreement.isSignedByOwner ? 'Signed by owner' : 'Owner signature pending'}
                  </span>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
                  <a
                    href={latestAgreement.agreementUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-[var(--radius-md)] shadow hover:bg-primary-hover transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" /> View Agreement
                  </a>
                  <a
                    href={latestAgreement.agreementUrl}
                    download
                    className="px-4 py-2 bg-white text-primary border border-primary/30 text-sm font-bold rounded-[var(--radius-md)] hover:bg-page transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <EmptyBlock
              title="No agreement on file yet"
              hint="Your PG manager uploads the signed agreement once onboarding is complete."
            />
          )}
        </div>

        {/* Rules & Regulations (live from the property record) */}
        <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm flex flex-col">
          <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
            <BookOpen className="w-5 h-5 text-info" /> PG Rule Book
          </h3>
          {rules && rules.trim() ? (
            <p className="text-sm text-secondary whitespace-pre-wrap leading-relaxed">{rules}</p>
          ) : (
            <EmptyBlock
              title="Rules not published yet"
              hint="Your PG has not published house rules for this property."
            />
          )}
        </div>

        {/* KYC Documents */}
        <div className="md:col-span-3 bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
          <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
            <FileText className="w-5 h-5 text-primary" /> KYC &amp; Verification Documents
          </h3>

          {documents.length === 0 ? (
            <EmptyBlock
              title="No documents uploaded yet"
              hint="Documents submitted during onboarding appear here automatically."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className="border border-border rounded-[var(--radius-md)] p-4 flex flex-col justify-between hover:border-primary transition-colors"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="w-10 h-10 bg-primary-subtle text-primary rounded-[var(--radius-md)] flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="bg-success-bg text-success text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> On File
                      </span>
                    </div>
                    <div className="font-bold text-primary text-sm mb-1">
                      {DOC_TYPE_LABELS[doc.type] ?? doc.type}
                    </div>
                    <div className="text-xs text-secondary truncate" title={doc.fileName}>
                      {doc.fileName}
                    </div>
                    <div className="text-xs text-secondary mb-4">
                      {formatFileSize(doc.fileSize)} • Uploaded {formatDate(doc.uploadedAt)}
                    </div>
                  </div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 text-xs font-bold text-primary bg-input rounded hover:bg-border transition-colors text-center block"
                  >
                    View Document
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
