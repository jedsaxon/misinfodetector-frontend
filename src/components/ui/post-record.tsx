import type { Post } from "@/services/posts-service";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { HeartIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function PostRecord({
  post,
  detailsClick,
}: {
  post: Post;
  detailsClick: (p: Post) => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const dateString = new Date(post.date).toLocaleDateString("en-AU", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const initials = post.username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Calculate accuracy from confidence to percentage
  const accuracy =
    post.confidence !== null
      ? Math.round(post.confidence * 100)
      : post.potentialMisinformation
      ? 50
      : 100;
  const accuracyColor =
    accuracy >= 70
      ? "text-green-500"
      : accuracy >= 40
      ? "text-yellow-500"
      : "text-red-500";

  return (
    <div
      className={cn(
        "border-b border-border transition-all duration-300 relative",
        !post.potentialMisinformation && "hover:bg-muted/50"
      )}
      data-post-id={post.id}
    >
      <div className="px-3 sm:px-4 py-3">
        <div className="flex gap-3">
          <Avatar className="size-10 shrink-0">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.username}`}
            />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <span className="font-semibold text-sm sm:text-[15px] hover:underline">
                {post.username}
              </span>
              <span className="text-muted-foreground text-xs sm:text-sm">
                {dateString}
              </span>
            </div>
            <div
              className={cn(
                "relative rounded-xl mb-3 transition-all duration-200 overflow-hidden",
                post.potentialMisinformation &&
                  "border border-destructive/10 bg-destructive/2 shadow-sm"
              )}
            >
              {post.potentialMisinformation && (
                <div className="px-3 sm:px-4 py-1 bg-destructive/5 border-b border-destructive/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 backdrop-blur-sm">
                  <span className="text-xs text-foreground/90 font-medium">
                    Flagged as potential misinformation
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-md bg-white border-solid border-1",
                      accuracyColor
                    )}
                  >
                    {accuracy}% accuracy
                  </span>
                </div>
              )}
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words p-3 sm:p-4">
                {post.message}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2 h-8 px-2 hover:bg-red-500/10",
                  isLiked && "text-red-500 hover:text-red-500"
                )}
                onClick={() => setIsLiked(!isLiked)}
              >
                <HeartIcon
                  className={cn(
                    "size-4 transition-colors",
                    isLiked && "fill-current"
                  )}
                />
                <span className="text-sm">Like</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
