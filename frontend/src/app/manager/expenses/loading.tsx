import { Loader2 } from 'lucide-react';
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-6 animate-in fade-in motion-safe:duration-300">
      <Loader2 className="w-8 h-8 text-primary motion-safe:animate-spin mb-4" />
      <div className="text-secondary text-sm font-medium">Loading module...</div>
    </div>
  );
}