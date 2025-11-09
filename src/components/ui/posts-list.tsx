import type { Post } from "@/services/posts-service";
import PostRecord from "./post-record";
import EmptyPostList from "./empty-post-list";

export default function PostList({
  posts,
  researchBtnClick,
  detailsClick,
}: {
  posts: Post[];
  researchBtnClick: () => void;
  detailsClick: (p: Post) => void;
}) {
  const components =
    posts.length > 0 ? (
      [...posts].reverse().map((p) => (
        <PostRecord
          post={p}
          key={p.id}
          detailsClick={detailsClick}
        />
      ))
    ) : (
      <EmptyPostList />
    );

  return <>{components}</>;
}
