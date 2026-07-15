import { Skeleton } from "@/components/ui/skeleton";

export function ServiceCardSkeleton() {
  return (
    <article className="flex flex-col self-start rounded-3xl border border-white/10 bg-[linear-gradient(155deg,rgba(16,22,42,0.9),rgba(12,18,33,0.95))] p-6 shadow-[0_22px_54px_-32px_var(--accent-glow)] sm:p-8">
      <Skeleton className="h-10 w-56" />

      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[95%]" />
        <Skeleton className="h-4 w-[82%]" />
        <Skeleton className="h-4 w-[88%]" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Skeleton className="h-7 w-20 rounded-full" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-7 w-32" />
      </div>

      <div className="mt-6 space-y-3">
        <Skeleton className="aspect-16/10 w-full rounded-2xl" />
        <div className="flex items-center justify-center gap-1.5">
          <Skeleton className="h-1.5 w-5 rounded-full" />
          <Skeleton className="h-1.5 w-2 rounded-full" />
          <Skeleton className="h-1.5 w-2 rounded-full" />
        </div>
      </div>

      <div className="mt-auto pt-6">
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </article>
  );
}