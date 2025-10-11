import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Header from "@/components/ui/header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import VerticalSeparator from "@/components/ui/verticalseparator";
import { DetailedApiError } from "@/services/api-utils";
import { fetchPosts, Post } from "@/services/comment-service";
import { AlertCircleIcon, MessagesSquare } from "lucide-react";
import { useEffect, useState } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[] | undefined>(undefined);
  const [apiError, setApiError] = useState<DetailedApiError | undefined>(
    undefined,
  );

  console.log(posts);

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

  return (
    <>
      <Header className="mb-3">
        <SidebarTrigger />
        <VerticalSeparator />
        <MessagesSquare className="mx-1" color="#3584e4" />
        Posts
      </Header>
      <div className="flex flex-col gap-2 m-auto" style={{ maxWidth: "512px" }}>
        {apiError && <ApiError error={apiError} />}
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
