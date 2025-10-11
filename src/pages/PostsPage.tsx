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
import { DetailedApiError } from "@/services/api-utils";
import { fetchPosts, Post } from "@/services/comment-service";
import { AlertCircleIcon, HeartIcon, MessagesSquare } from "lucide-react";
import { useEffect, useState } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[] | undefined>(undefined);
  const [apiError, setApiError] = useState<DetailedApiError | undefined>(
    undefined,
  );

  useEffect(() => {
    const handlePostFetch = async () => {
      setPosts(undefined);
      setApiError(undefined);

      const response = await fetchPosts(0, 10);

      if (response instanceof DetailedApiError) {
        setApiError(response);
      } else {
        setPosts(response);
      }
    };

    handlePostFetch();
  }, []);

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
          <Button variant="outline"><HeartIcon /></Button>
          <Button variant="outline">Details</Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
