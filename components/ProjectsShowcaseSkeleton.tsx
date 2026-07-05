import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsShowcaseSkeleton() {
  return (
    <article className="rounded-3xl border border-white/10 bg-[linear-gradient(155deg,rgba(16,22,42,0.9),rgba(12,18,33,0.95))] p-6 sm:p-8">
      <Skeleton className="h-9 w-56" />

      <div className="mt-5">
        <Skeleton className="h-4 w-24" />
        <div className="mt-3 flex flex-wrap gap-2.5">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>

      <Skeleton className="mt-6 h-56 w-full rounded-2xl" />

      <div className="mt-6 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[92%]" />
        <Skeleton className="h-4 w-[78%]" />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/22 p-4 sm:p-5">
        <Skeleton className="h-4 w-44" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      </div>

      <Skeleton className="mt-6 h-12 w-48 rounded-xl" />
    </article>
  );
}
