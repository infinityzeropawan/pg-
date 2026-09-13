export default function StudentLoading() {
  return (
    <div className="p-6 w-full h-full space-y-6">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-1/4 bg-skeleton-base rounded-[var(--radius-md)] motion-safe:animate-pulse"></div>
        <div className="h-4 w-1/3 bg-skeleton-base rounded-[var(--radius-md)] motion-safe:animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-40 bg-skeleton-base rounded-[var(--radius-lg)] motion-safe:animate-pulse"></div>
        <div className="h-40 bg-skeleton-base rounded-[var(--radius-lg)] motion-safe:animate-pulse"></div>
        <div className="h-40 bg-skeleton-base rounded-[var(--radius-lg)] motion-safe:animate-pulse"></div>
      </div>
      <div className="h-64 w-full bg-skeleton-base rounded-[var(--radius-lg)] motion-safe:animate-pulse"></div>
    </div>
  );
}
