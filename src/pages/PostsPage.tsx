import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/ui/header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import VerticalSeparator from "@/components/ui/verticalseparator";
import { useFetchPosts } from "@/hooks/use-posts";
import { DetailedApiError } from "@/services/api-utils";
import { AlertCircleIcon, HeartIcon, MessagesSquare } from "lucide-react";
import { useState } from "react";

export default function PostsPage() {
  const [pageNumber, setPageNumber] = useState(0);
  const { posts, apiError } = useFetchPosts(pageNumber);

  const postComponents = posts ? (
    posts.map((p) => <Post post={p} key={p.id} />)
  ) : (
    <PostSkeleton />
  );

  return (
    <>
      <Header className="mb-3">
        <SidebarTrigger />
        <VerticalSeparator />
        <MessagesSquare className="mx-1" color="#3584e4" />
        Posts
      </Header>
      <div className="flex flex-col gap-5 m-auto" style={{ maxWidth: "512px" }}>
        {apiError && <ApiError error={apiError} />}
        {postComponents}
      </div>
    </>
  );
}

function ApiError({ error }: { error: DetailedApiError }) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{error.title}</AlertTitle>
      {error && <AlertDescription>{error.description}</AlertDescription>}
    </Alert>
  );
}

function PostSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton style={{ width: "512px", height: "calc(1.5rem * 1)" }} />
      <Skeleton style={{ width: "512px", height: "calc(1.5rem * 4)" }} />
    </div>
  );
}

function Post({ post }: { post: Post }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.username}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{post.message}</p>
      </CardContent>
      <CardFooter>
        <ButtonGroup>
          <Button variant="outline">
            <HeartIcon />
          </Button>
          <Button variant="outline">Details</Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
