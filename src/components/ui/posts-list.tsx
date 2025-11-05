import type { Post } from "@/services/posts-service";
import PostRecord from "./post-record";
import { useState, type ReactNode } from "react";
import MisinformationDialogue from "./misinfo-dialogue";
import EmptyPostList from "./empty-post-list";

export default function PostList({
  posts,
  researchBtnClick,
  detailsBtnClick,
}: {
  posts: Post[];
  researchBtnClick: () => void;
  detailsBtnClick: (post: Post) => void;
}) {
  const [misinfoModalOpen, setMisinfoModalOpen] = useState<boolean>(false);

  const components =
    posts.length > 0 ? (
      posts.map((p) => (
        <PostRecord
          post={p}
          key={p.id}
          misinfoClick={() => setMisinfoModalOpen(true)}
          detailsClick={detailsBtnClick}
        />
      ))
    ) : (
      <EmptyPostList />
    );

  return (
    <>
      {components}
      <MisinformationDialogue
        isOpen={misinfoModalOpen}
        setOpen={setMisinfoModalOpen}
        researchBtnClick={researchBtnClick}
      />
    </>
  );
}
