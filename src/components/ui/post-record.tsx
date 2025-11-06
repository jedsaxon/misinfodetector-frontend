import type { Post } from "@/services/posts-service";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  HeartIcon,
  ShieldAlert,
  AlertCircle,
} from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

export default function PostRecord({
  post,
  misinfoClick,
  detailsClick,
  isPanelActive,
  isDimmed,
}: {
  post: Post;
  misinfoClick: (p: Post, element: HTMLElement | null) => void;
  detailsClick: (p: Post) => void;
  isPanelActive?: boolean;
  isDimmed?: boolean;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const postRef = useRef<HTMLDivElement>(null);
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

  return (
    <div 
      ref={postRef}
      className={cn(
        "border-b border-border transition-all duration-300 relative",
        !isPanelActive && !post.potentialMisinformation && "hover:bg-muted/50",
        isPanelActive && "bg-background border-l-4 border-l-destructive border-r-2 border-r-destructive/40 shadow-2xl z-[31] ring-2 ring-destructive/20 rounded-xl",
        isDimmed && "opacity-40 pointer-events-none"
      )}
      data-post-id={post.id}
    >
      <div className="px-3 sm:px-4 py-3">
        <div className="flex gap-3">
          <Avatar className="size-10 shrink-0">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.username}`} />
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
            <div className={cn(
              "relative rounded-xl mb-3 transition-all duration-200 overflow-hidden",
              post.potentialMisinformation && "border border-destructive/10 bg-destructive/2 shadow-sm"
            )}>
              {post.potentialMisinformation && (
                <div className="px-3 sm:px-4 py-1 bg-destructive/5 border-b border-destructive/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 backdrop-blur-sm">
                  <span className="text-xs text-foreground/90 font-medium">
                    Flagged as potential misinformation
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      misinfoClick(post, postRef.current);
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-background hover:bg-destructive/5 border border-destructive/10 hover:border-destructive/20 text-foreground/80 hover:text-destructive/80 text-xs font-medium transition-all duration-200 group shadow-sm hover:shadow-md hover:scale-105 active:scale-95 w-full sm:w-auto justify-center sm:justify-start"
                    aria-label="View misinformation analysis"
                    title="This post has been flagged as potential misinformation"
                  >
                    <span>Click for analysis</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
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
