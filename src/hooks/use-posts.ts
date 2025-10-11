import { DetailedApiError } from "@/services/api-utils";
import { fetchPosts, PostResponse } from "@/services/comment-service";
import { useEffect, useState } from "react";

export function useFetchPosts(pageNumber: number) {
  const [posts, setPosts] = useState<PostResponse | undefined>(undefined);
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
  }, [pageNumber]);

  return { posts, apiError };
}
