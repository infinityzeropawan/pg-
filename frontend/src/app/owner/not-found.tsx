// RESPONSIBILITY: Renders the OwnerNot-found component. Receives data via props/hooks.

import Link from 'next/link';
import { Building } from 'lucide-react';

export default function OwnerNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-[rgba(99,102,241,0.1)] rounded-full flex items-center justify-center mb-6 border border-primary">
        <Building className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-primary mb-2">404 - Page Not Found</h1>
      <p className="text-secondary mb-8 max-w-md">
        The page you are looking for does not exist in your PG Owner portal.
      </p>
      <Link 
        href="/owner/dashboard" 
        className="bg-primary text-white px-6 py-2.5 rounded-md font-medium hover:bg-primary-hover motion-safe:transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
