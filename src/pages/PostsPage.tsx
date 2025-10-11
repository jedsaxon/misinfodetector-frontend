import Header from "@/components/ui/header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import VerticalSeparator from "@/components/ui/verticalseparator";
import { useFetchPosts } from "@/hooks/use-posts";
import { MessagesSquare } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PostList from "@/components/ui/posts-list";
import PostSkeleton from "@/components/ui/post-skeleton";
import ApiErrorAlert from "@/components/ui/api-error-alert";
import PostPager from "@/components/ui/post-pager";
import type { Post } from "@/services/posts-service";

export default function PostsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("pageNumber") || "1");

  const { posts: postResponse, apiError } = useFetchPosts(currentPage);

  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 0, left: 0 });
    setSearchParams({ pageNumber: newPage.toString() });
  };

  const postClicked = (post: Post) => {
    navigate(`/posts/${post.id}`)
  };

  const postContent = postResponse ? (
    <PostList
      posts={postResponse.posts}
      researchBtnClick={() => navigate("/research")}
      detailsBtnClick={postClicked}
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
      <div
        className="flex flex-col gap-5 m-auto mb-5"
        style={{ maxWidth: "512px" }}
      >
        {apiError && <ApiErrorAlert error={apiError} />}
        {postContent}
      </div>
      <div className="mb-5">
        <PostPager
          currentPage={currentPage}
          totalPages={postResponse?.pageCount ?? 0}
          maxNextButtons={3}
          maxPreviousButtons={1}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
