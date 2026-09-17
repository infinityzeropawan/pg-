'use client';

// RESPONSIBILITY: Printable gate QR poster for a property.
//
// The QR encodes `<origin>/student/attendance?gate=<signed-token>`, so scanning it
// with any phone camera opens the student app with the property token attached. The
// backend verifies the signature *and* that the resident actually lives in that
// property before recording any attendance.
//
// BUG HISTORY: this component used to draw `generateQrMatrix()` — a deterministic
// sine/hash noise grid with no QR version, no format information and no error
// correction. The payload was never encoded, so no scanner could ever read the
// printed poster; the curfew and phone number were hardcoded fallbacks too.

import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Clock,
  Loader2,
  MapPin,
  Phone,
  Printer,
  QrCode,
  RefreshCw,
  ShieldCheck,
  X,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

import { buildGateScanUrl, gateQrApi, type GateQrInfo } from '@/components/qr/gateQr';

interface GateQrPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
}

export function GateQrPosterModal({ isOpen, onClose, propertyId }: GateQrPosterModalProps) {
  const [info, setInfo] = useState<GateQrInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!propertyId) {
      setError('Select a property before printing a gate QR poster.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setInfo(await gateQrApi.fetch(propertyId));
    } catch (e) {
      setInfo(null);
      setError(e instanceof Error ? e.message : 'Could not generate the gate QR poster.');
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    if (isOpen) void load();
  }, [isOpen, load]);

  if (!isOpen) return null;

  const scanUrl = info ? buildGateScanUrl(info) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-card border border-border rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-auto">

        {/* Modal Top Bar */}
        <div className="no-print flex items-center justify-between px-5 py-3.5 border-b border-border bg-page">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-primary">Gate Attendance QR Poster</h3>
              <p className="text-[10px] text-secondary">
                Print, laminate and paste it at the entrance — residents scan it to mark attendance.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-secondary hover:text-primary rounded-lg hover:bg-input transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading && (
          <div className="p-10 flex flex-col items-center gap-3 text-secondary">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-xs font-semibold">Generating a signed poster…</p>
          </div>
        )}

        {!loading && error && (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-primary">{error}</p>
            <button
              onClick={() => void load()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try again
            </button>
          </div>
        )}

        {!loading && !error && info && (
          <div className="p-5 bg-white">
            <div
              id="gate-qr-print-sheet"
              className="bg-white text-slate-900 border-2 border-slate-900 rounded-2xl p-6 text-center"
            >
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5" />
                Gate Attendance
              </div>

              <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight mt-2 mb-1">
                {info.propertyName}
              </h1>
              <p className="text-xs text-slate-600 font-medium flex items-center justify-center gap-1 mb-6">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {info.address || 'Main Entrance / Reception Gate'}
              </p>

              <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 inline-block">
                <QRCodeSVG
                  value={scanUrl}
                  size={200}
                  level="M"
                  marginSize={4}
                  bgColor="#ffffff"
                  fgColor="#09090b"
                  title={`Gate attendance QR code for ${info.propertyName}`}
                />
              </div>
              <div className="mt-3 text-[10px] font-mono text-slate-500 tracking-wider break-all">
                Property ID: {info.propertyId}
              </div>
              {/* Step by step instructions */}
              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-left mt-6">
                <div className="text-xs font-bold uppercase text-slate-800 tracking-wider mb-2 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" /> How to mark attendance:
                </div>
                <ol className="text-xs text-slate-700 space-y-1.5 font-medium list-decimal list-inside">
                  <li>
                    Open the <strong>phone camera</strong> and scan this QR, <em>or</em> open the PG Student app →{' '}
                    <strong>Attendance</strong> → <strong>Scan Gate QR</strong>.
                  </li>
                  <li>
                    Choose <strong>Check-In</strong> (entering PG) or <strong>Check-Out</strong> with a reason.
                  </li>
                  <li>Tap confirm — attendance is recorded and your parents are notified instantly.</li>
                </ol>
                <p className="text-[10px] text-slate-500 mt-2">
                  The code is verified against this property, so a poster from another PG will not work.
                </p>
              </div>

              {/* Curfew & helpline footer — real property values */}
              <div className="w-full grid grid-cols-2 gap-2 border-t border-slate-200 pt-3 mt-5 text-[11px] text-slate-600">
                <div className="flex items-center gap-1 text-amber-700 font-bold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Curfew: {info.curfewTime || '22:00'}</span>
                </div>
                <div className="flex items-center justify-end gap-1 text-slate-700 font-medium">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>{info.contactPhone || 'Reception'}</span>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="no-print bg-page border-t border-border -mx-5 -mb-5 mt-5 p-4 flex items-center justify-between gap-3">
              <span className="text-xs text-secondary">
                Tip: print at A4, laminate it, and paste it at the main gate or reception desk.
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-border rounded-lg text-xs font-bold hover:bg-input transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
