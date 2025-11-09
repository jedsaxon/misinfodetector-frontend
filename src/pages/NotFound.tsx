import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CircleAlert } from "lucide-react";

export default function NotFound() {
  return (
    <Empty className="flex-1 justify-center align-middle">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleAlert />
        </EmptyMedia>
        <EmptyTitle>This page totally has data.</EmptyTitle>
        <EmptyDescription>
          Our AI detected that the text "this page totally has data" is in fact
          misinformation.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
