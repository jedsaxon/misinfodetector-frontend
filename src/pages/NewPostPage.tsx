import Header from "@/components/ui/header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import VerticalSeparator from "@/components/ui/verticalseparator";
import { Send } from "lucide-react";
import { z } from "zod/v4";
import { useNavigate } from "react-router-dom";
import { useUploadPost } from "@/hooks/use-posts";
import type { pageFormSchema } from "@/components/ui/new-post-form";
import NewPostForm from "@/components/ui/new-post-form";
import { ApiErrorDialogue } from "@/components/ui/api-error-dialogue";

export default function NewPostPage() {
  const navigate = useNavigate();
  const uploadPostMutation = useUploadPost();

  const handleFormCancel = () => {
    navigate("/");
  };

  const handleFormSubmit = async (data: z.infer<typeof pageFormSchema>) => {
    try {
      await uploadPostMutation.mutateAsync({
        message: data.message,
        username: data.username,
      });
      navigate("/");
    } catch (error) {}
  };

  return (
    <>
      <Header>
        <SidebarTrigger />
        <VerticalSeparator />
        <Send className="mx-1" color="#c061cb" /> New Post
      </Header>
      <div className="w-fit mx-auto my-3">
        <NewPostForm
          onFormSubmit={handleFormSubmit}
          onFormCancel={handleFormCancel}
        />
      </div>
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
