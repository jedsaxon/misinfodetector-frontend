import type { JSX, ReactElement } from "react";
import { Skeleton } from "./skeleton";

export default function PostSkeleton({ count }: { count: number }) {
  const skeletons = new Array<JSX.Element>(count);

  for (let i = 0; i < count; i++) skeletons[i] = <SinglePostSkeleton key={i} />;

  return <>{skeletons}</>;
}

function SinglePostSkeleton() {
  return (
    <div className="border-b border-border">
      <div className="px-3 sm:px-4 py-3">
        <div className="flex gap-3">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="rounded-xl mb-3 overflow-hidden">
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="flex items-center gap-6">
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
