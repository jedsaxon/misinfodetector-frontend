import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DetailedApiError } from "@/services/api-utils";
import {
  fetchPosts,
  fetchSinglePost,
  uploadPost,
  PostResponse,
  Post,
} from "@/services/posts-service";

export function usePosts(pageNumber: number, resultAmount: number = 10) {
  return useQuery<PostResponse, DetailedApiError>({
    queryKey: ["posts", pageNumber, resultAmount],
    queryFn: async () => {
      const result = await fetchPosts(pageNumber, resultAmount);
      if (result instanceof DetailedApiError) {
        throw result;
      }
      return result;
    },
    staleTime: 0,
    refetchOnMount: true,
  });
}

export function usePost(id: string | undefined) {
  return useQuery<Post, DetailedApiError>({
    queryKey: ["post", id],
    queryFn: async () => {
      if (!id) {
        throw new DetailedApiError("Invalid post ID");
      }
      const result = await fetchSinglePost(id);
      if (result instanceof DetailedApiError) {
        throw result;
      }
      return result;
    },
    enabled: !!id,
  });
}

export function useUploadPost() {
  const queryClient = useQueryClient();

  return useMutation<
    Post,
    DetailedApiError,
    { message: string; username: string }
  >({
    mutationFn: async ({ message, username }) => {
      const result = await uploadPost(message, username);
      if (result instanceof DetailedApiError) {
        throw result;
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate all posts queries to trigger automatic refetch
      // Since queries have staleTime: 0, they will immediately refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

// Legacy hook for backward compatibility - wraps usePosts
export function useFetchPosts(pageNumber: number) {
  const { data: posts, error: apiError, isLoading } = usePosts(pageNumber, 50);

  return {
    posts: isLoading ? undefined : posts,
    apiError: apiError instanceof DetailedApiError ? apiError : undefined,
  };
}
