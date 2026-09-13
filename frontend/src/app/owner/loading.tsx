"use client";

// RESPONSIBILITY: Renders the global OwnerLoading skeleton for the Owner module.

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function OwnerLoading() {
  return (
    <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-10 w-10 motion-safe:animate-spin text-primary" />
        <p className="text-sm font-medium text-secondary">
          Loading owner dashboard...
        </p>
      </div>
    </div>
  );
}
