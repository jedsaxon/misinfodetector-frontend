import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FunnelX } from "lucide-react";

export default function EmptyPostList() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FunnelX />
        </EmptyMedia>
        <EmptyTitle>No Posts Yet</EmptyTitle>
        <EmptyDescription>No posts were found at this page.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
