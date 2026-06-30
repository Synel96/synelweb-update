import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-[linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0.16),rgba(255,255,255,0.08))] bg-size-[200%_100%]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };