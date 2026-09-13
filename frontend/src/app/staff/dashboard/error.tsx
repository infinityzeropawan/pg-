'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <div className="p-8 text-danger"><h2>Something went wrong!</h2><button onClick={() => reset()} className="mt-4 bg-primary px-4 py-2 rounded">Try again</button></div>;
}
