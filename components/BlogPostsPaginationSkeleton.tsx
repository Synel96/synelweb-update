import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostsPaginationSkeleton() {
  return (
    <div className="mt-10 flex items-center justify-center gap-2" data-reveal>
      <Skeleton className="h-10 w-24 rounded-md" />
      <Skeleton className="h-10 w-10 rounded-md" />
      <Skeleton className="h-10 w-10 rounded-md" />
      <Skeleton className="h-10 w-10 rounded-md" />
      <Skeleton className="h-10 w-24 rounded-md" />
    </div>
  );
}
