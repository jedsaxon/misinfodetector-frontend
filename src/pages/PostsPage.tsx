import Header from "@/components/ui/header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import VerticalSeparator from "@/components/ui/verticalseparator";
import { useFetchPosts, useUploadPost } from "@/hooks/use-posts";
import { MessagesSquare } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PostList from "@/components/ui/posts-list";
import PostSkeleton from "@/components/ui/post-skeleton";
import ApiErrorAlert from "@/components/ui/api-error-alert";
import PostPager from "@/components/ui/post-pager";
import type { Post } from "@/services/posts-service";
import { useState } from "react";
import { z } from "zod/v4";
import type { pageFormSchema } from "@/components/ui/new-post-form";
import NewPostForm from "@/components/ui/new-post-form";
import { ApiErrorDialogue } from "@/components/ui/api-error-dialogue";

export default function PostsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("pageNumber") || "1");
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  const { posts: postResponse, apiError } = useFetchPosts(currentPage);
  const uploadPostMutation = useUploadPost();

  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 0, left: 0 });
    setSearchParams({ pageNumber: newPage.toString() });
  };

  const postClicked = (post: Post) => {
    navigate(`/posts/${post.id}`);
  };

  const handleMisinfoClick = (post: Post) => {
    setActivePostId(post.id);
  };

  const handlePanelClose = () => {
    setActivePostId(null);
  };

  const handleFormSubmit = async (data: z.infer<typeof pageFormSchema>) => {
    try {
      await uploadPostMutation.mutateAsync({
        message: data.message,
        username: data.username,
      });
      setIsFormExpanded(false);

      if (currentPage !== 1) {
        setSearchParams({ pageNumber: "1" });
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {}
  };

  const handleFormCancel = () => {
    setIsFormExpanded(false);
  };

  const postNav =
    postResponse && postResponse.posts.length > 0 ? (
      <PostPager
        currentPage={currentPage}
        totalPages={postResponse.pageCount}
        maxNextButtons={3}
        maxPreviousButtons={1}
        onPageChange={handlePageChange}
      />
    ) : undefined;

  const postContent = postResponse ? (
    <PostList
      posts={postResponse.posts}
      researchBtnClick={() => navigate("/research")}
      detailsClick={postClicked}
      onMisinfoClick={handleMisinfoClick}
      onPanelClose={handlePanelClose}
      activePostId={activePostId}
    />
  ) : (
    <PostSkeleton count={10} />
  );

  return (
    <>
      <Header className="mb-3">
        <SidebarTrigger />
        <VerticalSeparator />
        <MessagesSquare className="mx-1" color="#3584e4" />
        Posts
      </Header>
      <div className="flex relative min-h-0">
        <div className="flex-1 flex justify-center">
          <div className="flex flex-col mb-5 max-w-[900px] w-full px-2 sm:px-0">
            {apiError && <ApiErrorAlert error={apiError} />}

            {/* New Post Form */}
            <div className="mb-4">
              {isFormExpanded ? (
                <NewPostForm
                  onFormSubmit={handleFormSubmit}
                  onFormCancel={handleFormCancel}
                />
              ) : (
                <button
                  onClick={() => setIsFormExpanded(true)}
                  className="w-full p-4 rounded-xl border border-border bg-background hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessagesSquare className="size-5" />
                    <span className="font-medium">Create a new post...</span>
                  </div>
                </button>
              )}
            </div>

            {postContent}
          </div>
        </div>
      </div>
      {postNav && postNav}
      <ApiErrorDialogue
        title={uploadPostMutation.error?.title ?? ""}
        message={uploadPostMutation.error?.description ?? ""}
        isOpen={uploadPostMutation.isError}
        setOpen={(o) => {
          if (o == true) return;
          uploadPostMutation.reset();
        }}
        closeBtnClick={() => uploadPostMutation.reset()}
      />
    </>
  );
}
