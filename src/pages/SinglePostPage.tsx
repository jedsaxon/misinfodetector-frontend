import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/ui/header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import VerticalSeparator from "@/components/ui/verticalseparator";
import { usePost } from "@/hooks/use-posts";
import { Post } from "@/services/posts-service";
import { HeartIcon, MessageSquare, ShieldAlert } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import ApiErrorAlert from "@/components/ui/api-error-alert";
import { cn } from "@/lib/utils";

export default function SinglePostPage() {
  const { id } = useParams() ?? "";
  const { data: post, error: apiError, isLoading } = usePost(id);
  const [isLiked, setIsLiked] = useState(false);

  if (isLoading) {
    return (
      <>
        <Header>
          <SidebarTrigger />
          <VerticalSeparator />
          <MessageSquare className="mx-1" color="#3584e4" />
          User Post
        </Header>
        <section
          className="flex flex-col m-auto my-6 gap-3 flex-wrap"
          style={{ maxWidth: "512px" }}
        >
          <span>Loading...</span>
        </section>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header>
          <SidebarTrigger />
          <VerticalSeparator />
          <MessageSquare className="mx-1" color="#3584e4" />
          User Post
        </Header>
        <section
          className="flex flex-col m-auto my-6 gap-3 flex-wrap"
          style={{ maxWidth: "512px" }}
        >
          {apiError && <ApiErrorAlert error={apiError} />}
        </section>
      </>
    );
  }

  return (
    <>
      <Header>
        <SidebarTrigger />
        <VerticalSeparator />
        <MessageSquare className="mx-1" color="#3584e4" />
        User Post
      </Header>
      <section
        className="flex flex-col m-auto my-6 gap-4 flex-wrap"
        style={{ maxWidth: "600px" }}
      >
        {apiError && <ApiErrorAlert error={apiError} />}
        <Card className="border-0 border-b rounded-none">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.username}`}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {post.username
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="flex items-baseline gap-2 text-base font-semibold mb-1">
                  <span className="truncate">{post.username}</span>
                  <span className="text-muted-foreground text-sm font-normal">
                    {new Date(post.date).toLocaleDateString("en-AU", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {post.potentialMisinformation && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive/80 gap-1 h-auto p-0 text-xs font-normal"
                      onClick={() => {
                        // Scroll to the warning section
                        document
                          .getElementById("misinfo-warning")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <ShieldAlert className="size-3" />
                      Misinformation • Learn more
                    </Button>
                  )}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words mb-3">
              {post.message}
            </p>
            {post.potentialMisinformation && (
              <div id="misinfo-warning" className="mt-4">
                <PostMisinfoWarningExpanded />
              </div>
            )}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t">
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
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 h-8 px-2 hover:bg-blue-500/10 hover:text-blue-500"
              >
                <MessageSquare className="size-4" />
                <span className="text-sm">Details</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}

export function PostMisinfoWarningExpanded() {
  return (
    <Alert
      variant="destructive"
      className="border-destructive/50 bg-destructive/10"
    >
      <ShieldAlert className="size-4" />
      <AlertTitle className="text-sm font-semibold">
        Potential Misinformation Detected
      </AlertTitle>
      <AlertDescription className="text-sm mt-2">
        <ul className="list-inside list-disc space-y-1">
          <li>
            This post contains similar patterns found in other misleading posts
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}
