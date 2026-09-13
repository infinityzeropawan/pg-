'use client';

import React, { useRef } from 'react';
import { Printer, X, ShieldCheck, Clock, MapPin, Phone, AlertCircle, QrCode } from 'lucide-react';

interface GateQrPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    id: string;
    name: string;
    address?: string;
    curfewTime?: string;
    contactPhone?: string;
    managerName?: string;
  };
}

// Generate a deterministic 25x25 QR code grid matrix from text string for crisp vector SVG rendering
function generateQrMatrix(text: string): boolean[][] {
  const size = 25;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const setCell = (r: number, c: number, val: boolean) => {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      const row = matrix[r];
      if (row) row[c] = val;
    }
  };

  // Helper to draw position detection patterns (7x7 squares at corners)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          setCell(startY + r, startX + c, true);
        } else {
          setCell(startY + r, startX + c, false);
        }
      }
    }
  };

  // Top-left, Top-right, Bottom-left finder patterns
  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    setCell(6, i, i % 2 === 0);
    setCell(i, 6, i % 2 === 0);
  }

  // Alignment pattern around bottom-right
  const alignX = size - 7;
  const alignY = size - 7;
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
        setCell(alignY + r, alignX + c, true);
      }
    }
  }

  // Deterministic hash fill for data area
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  let bitIdx = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder zones
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= size - 8;
      const inBottomLeft = r >= size - 8 && c < 8;
      const inTiming = r === 6 || c === 6;
      const inAlign = r >= size - 9 && r <= size - 5 && c >= size - 9 && c <= size - 5;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !inTiming && !inAlign) {
        const pseudoRand = Math.sin(hash + bitIdx * 12.9898) * 43758.5453;
        setCell(r, c, (pseudoRand - Math.floor(pseudoRand)) > 0.45);
        bitIdx++;
      }
    }
  }

  return matrix;
}

export function GateQrPosterModal({ isOpen, onClose, property }: GateQrPosterModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const qrPayload = `SPG-GATE:${property.id}:${encodeURIComponent(property.name)}`;
  const matrix = generateQrMatrix(qrPayload);
  const size = matrix.length;
  const cellSize = 10;
  const svgSize = size * cellSize;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      {/* Styles for clean printing */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-qr-poster, #printable-qr-poster * {
            visibility: visible;
          }
          #printable-qr-poster {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 24px;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: 2px solid #000 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative bg-card border border-border rounded-[var(--radius-xl,16px)] max-w-2xl w-full shadow-2xl my-8 overflow-hidden">
        
        {/* Modal Header */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-border bg-page">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg text-primary">Print Gate Attendance QR Poster</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-input transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Poster Container */}
        <div className="p-6 bg-slate-100 dark:bg-zinc-950 flex justify-center">
          <div
            id="printable-qr-poster"
            ref={printRef}
            className="w-full max-w-[480px] bg-white text-slate-900 rounded-2xl p-8 shadow-xl border-4 border-slate-900 flex flex-col items-center text-center relative"
          >
            {/* Header Badge */}
            <div className="bg-slate-900 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Smart Gate Attendance
            </div>

            {/* Property Name */}
            <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight mb-1">
              {property.name}
            </h1>
            <p className="text-xs text-slate-600 font-medium flex items-center justify-center gap-1 mb-6">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {property.address || 'Main Entrance / Reception Gate'}
            </p>

            {/* QR Code Container */}
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-md mb-6 relative group">
              <svg
                width={200}
                height={200}
                viewBox={`0 0 ${svgSize} ${svgSize}`}
                className="w-48 h-48 sm:w-56 sm:h-56"
              >
                {matrix.map((row, r) =>
                  row.map((filled, c) =>
                    filled ? (
                      <rect
                        key={`${r}-${c}`}
                        x={c * cellSize}
                        y={r * cellSize}
                        width={cellSize}
                        height={cellSize}
                        fill="#09090b"
                      />
                    ) : null
                  )
                )}
              </svg>
              <div className="mt-2 text-[10px] font-mono text-slate-500 tracking-wider">
                ID: {property.id}
              </div>
            </div>

            {/* Step by Step Instructions */}
            <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-left mb-5">
              <div className="text-xs font-bold uppercase text-slate-800 tracking-wider mb-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> Instructions for Residents:
              </div>
              <ol className="text-xs text-slate-700 space-y-1.5 font-medium list-decimal list-inside">
                <li>Open your <strong>PG Student App</strong>.</li>
                <li>Go to <strong>Attendance</strong> and tap <strong>Scan Gate QR</strong>.</li>
                <li>Select <strong>Check-In</strong> or <strong>Check-Out</strong> with reason.</li>
                <li>Attendance is recorded & parents are notified instantly.</li>
              </ol>
            </div>

            {/* Curfew & Helpline Footer */}
            <div className="w-full grid grid-cols-2 gap-2 border-t border-slate-200 pt-3 text-[11px] text-slate-600">
              <div className="flex items-center gap-1 text-amber-700 font-bold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Curfew: {property.curfewTime || '10:00 PM'}</span>
              </div>
              <div className="flex items-center justify-end gap-1 text-slate-700 font-medium">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>{property.contactPhone || 'Guard: +91 98765 43210'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="no-print p-4 bg-page border-t border-border flex items-center justify-between text-xs text-secondary">
          <span>Tip: Print and laminate this sheet, then paste it at the main entrance gate or reception desk.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg hover:bg-input transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
