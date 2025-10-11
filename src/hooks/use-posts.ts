import { DetailedApiError } from "@/services/api-utils";
import { fetchPosts, type Post } from "@/services/comment-service";
import { useEffect, useState } from "react";

export function useFetchPosts(pageNumber: number) {
  const [posts, setPosts] = useState<Post[] | undefined>(undefined);
  const [apiError, setApiError] = useState<DetailedApiError | undefined>(undefined);

  useEffect(() => {
    const handlePostFetch = async () => {
      setPosts(undefined);
      setApiError(undefined);

      const response = await fetchPosts(pageNumber, 10);

      if (response instanceof DetailedApiError) {
        setApiError(response);
      } else {
        setPosts(response);
      }
    };

    handlePostFetch();
  }, []);

  return { posts, apiError };
}
