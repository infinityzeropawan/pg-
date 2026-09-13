import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-page text-primary flex-col p-4">
      <div className="bg-card border border-border rounded-xl p-8 max-w-md w-full text-center shadow-2xl">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-secondary mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-primary text-black font-medium py-2 px-6 rounded-md hover:bg-primary-hover motion-safe:transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
