import type { Post } from "@/services/posts-service";
import PostRecord from "./post-record";
import { useState } from "react";
import EmptyPostList from "./empty-post-list";
import { MisinformationPanel } from "./misinformation-panel";

export default function PostList({
  posts,
  researchBtnClick,
  detailsClick,
  onMisinfoClick,
  onPanelClose,
  activePostId,
}: {
  posts: Post[];
  researchBtnClick: () => void;
  detailsClick: (p: Post) => void;
  onMisinfoClick?: (post: Post, element: HTMLElement | null) => void;
  onPanelClose?: () => void;
  activePostId?: string | null;
}) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleMisinfoClick = (post: Post, element: HTMLElement | null) => {
    setSelectedPost(post);
    setIsPanelOpen(true);
    onMisinfoClick?.(post, element);
  };

  const isPanelActive = activePostId !== null && activePostId !== undefined;

  const components =
    posts.length > 0 ? (
      posts.map((p) => (
        <PostRecord
          post={p}
          key={p.id}
          misinfoClick={handleMisinfoClick}
          detailsClick={detailsClick}
          isPanelActive={activePostId === p.id}
          isDimmed={isPanelActive && activePostId !== p.id}
        />
      ))
    ) : (
      <EmptyPostList />
    );

  return (
    <>
      {components}
      <MisinformationPanel
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false);
          setSelectedPost(null);
          onPanelClose?.();
        }}
        post={selectedPost}
      />
    </>
  );
}
