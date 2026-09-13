'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in motion-safe:duration-200">
      <div className="bg-card border border rounded-[var(--radius-lg,12px)] w-full max-w-md shadow-2xl animate-in zoom-in-95 motion-safe:duration-200 overflow-hidden">
        <div className="p-6">
          <div className="flex gap-4">
            <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${isDestructive ? 'bg-danger-bg text-danger' : 'bg-[rgba(99,102,241,0.1)] text-primary'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
              <p className="text-secondary text-sm leading-relaxed">{message}</p>
            </div>
          </div>
        </div>
        <div className="bg-page border-t border px-6 py-4 flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 border border bg-card text-secondary hover:text-primary font-medium rounded-[var(--radius-md,8px)] motion-safe:transition-colors focus:outline-none focus:ring-2 focus:ring-border"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`px-4 py-2 font-medium rounded-[var(--radius-md,8px)] text-white shadow-sm motion-safe:transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-page)] ${
              isDestructive 
                ? 'bg-danger hover:bg-red-600 focus:ring-danger' 
                : 'bg-primary hover:bg-primary-hover focus:ring-primary'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
