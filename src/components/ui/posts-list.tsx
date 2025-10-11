import type { Post } from "@/services/posts-service";
import PostRecord from "./post-record"
import { useState } from "react";
import MisinformationDialogue from "./misinfo-dialogue";

export default function PostList({
  posts,
  researchBtnClick,
}: {
  posts: Post[];
  researchBtnClick: () => void;
}) {
  const [misinfoModalOpen, setMisinfoModalOpen] = useState<boolean>(false);

  const postComponents = posts.map((p) => (
    <PostRecord
      post={p}
      key={p.id}
      misinfoClick={() => setMisinfoModalOpen(true)}
    />
  ));

  return (
    <>
      {postComponents}
      <MisinformationDialogue
        isOpen={misinfoModalOpen}
        setOpen={setMisinfoModalOpen}
        researchBtnClick={researchBtnClick}
      />
    </>
  );
}
