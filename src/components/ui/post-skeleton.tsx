import type { JSX, ReactElement } from "react";
import { Skeleton } from "./skeleton";

export default function PostSkeleton({ count }: { count: number }) {
  const skeletons = new Array<JSX.Element>(count);

  for (let i = 0; i < count; i++) skeletons[i] = <SinglePostSkeleton key={i} />;

  return <>{skeletons}</>;
}

function SinglePostSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton style={{ width: "512px", height: "calc(1.5rem * 1)" }} />
    </div>
  );
}
