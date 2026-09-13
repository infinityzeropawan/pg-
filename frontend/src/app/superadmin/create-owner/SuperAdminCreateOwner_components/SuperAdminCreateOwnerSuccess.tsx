// RESPONSIBILITY: Renders the SuperAdminCreateOwnerSuccess component.
import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

import type { SuperAdminCreateOwnerSuccessProps } from '@/app/superadmin/create-owner/SuperAdminCreateOwner_types/SuperAdminCreateOwner.types';

export const SuperAdminCreateOwnerSuccess: React.FC<SuperAdminCreateOwnerSuccessProps> = ({ credentials }) => {
  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="bg-success-bg border border-success p-8 rounded-[var(--radius-lg,12px)] text-center shadow-lg">
        <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-primary mb-2">Owner Created Successfully</h2>
        <p className="text-secondary mb-6">The owner account and subscription have been provisioned.</p>
        
        <div className="bg-card border border p-4 rounded-md text-left mb-6">
          <div className="text-xs text-secondary uppercase font-bold tracking-wider mb-2">Secure Credentials</div>
          <div className="font-mono text-primary">Email: {credentials.email}</div>
          <div className="font-mono text-primary">Password: {credentials.password}</div>
        </div>
        
        <Link 
          href="/superadmin/owners" 
          className="inline-block bg-primary text-white font-medium px-6 py-3 rounded-md hover:bg-primary-hover motion-safe:transition-colors"
        >
          Go to Owners Directory
        </Link>
      </div>
    </div>
  );
};
