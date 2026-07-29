import { Skeleton } from "@/components/ui/skeleton";

type BlogPostsDisplaySkeletonProps = {
  count?: number;
};

export default function BlogPostsDisplaySkeleton({ count = 6 }: BlogPostsDisplaySkeletonProps) {
  return (
    <div
      className="no-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto scroll-smooth px-6 pb-2 lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0 lg:pb-0"
      data-reveal
    >
      {Array.from({ length: count }, (_, index) => (
        <article
          key={`blog-post-skeleton-${index}`}
          className="w-[85%] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(155deg,rgba(16,22,42,0.92),rgba(10,15,28,0.95))] p-6 shadow-[0_24px_70px_-42px_rgba(0,0,0,0.75)] sm:w-[60%] sm:p-7 lg:w-auto lg:shrink"
        >
          <Skeleton className="h-56 w-full rounded-2xl" />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Skeleton className="h-7 w-28 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="mt-4 space-y-3">
            <Skeleton className="h-8 w-[85%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[96%]" />
            <Skeleton className="h-4 w-[78%]" />
          </div>

          <div className="mt-6">
            <Skeleton className="h-10 w-36 rounded-full" />
          </div>
        </article>
      ))}
    </div>
  );
}
