'use client';
import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center animate-in fade-in motion-safe:duration-300">
      <div className="w-16 h-16 bg-danger-bg,rgba(239,68,68,0.1) text-danger,#EF4444 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-primary mb-2">Something went wrong!</h2>
      <p className="text-secondary mb-6 max-w-md">
        We encountered an ManagerError loading this module. Please try again or contact support if the issue persists.
      </p>
      <button 
        onClick={() => reset()}
        className="px-6 py-2 bg-primary text-white rounded font-bold hover:bg-primary-hover motion-safe:transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}