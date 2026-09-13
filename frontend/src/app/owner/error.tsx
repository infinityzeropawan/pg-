"use client";

// RESPONSIBILITY: Renders the global OwnerError boundary for the Owner module.

import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function OwnerError({
  OwnerError,
  reset,
}: {
  OwnerError: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-full min-h-[60vh] w-full flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-danger-bg text-danger shadow-lg shadow-danger-bg/20">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-primary">
        Something went wrong
      </h2>
      <p className="mb-8 max-w-md text-secondary">
        An unexpected OwnerError occurred while loading the owner interface. Our engineers have been notified.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-1 hover:shadow-lg motion-safe:active:scale-95"
      >
        <RefreshCcw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
