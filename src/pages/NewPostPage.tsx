import Header from "@/components/ui/header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import VerticalSeparator from "@/components/ui/verticalseparator";
import { Send } from "lucide-react";
import z from "zod/v4";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DetailedApiError } from "@/services/api-utils";
import { uploadPost } from "@/services/posts-service";
import type { pageFormSchema } from "@/components/ui/new-post-form";
import NewPostForm from "@/components/ui/new-post-form";
import { ApiErrorDialogue } from "@/components/ui/api-error-dialogue";

export default function NewPostPage() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<DetailedApiError | undefined>(
    undefined,
  );

  const handleFormCancel = () => {
    navigate("/");
  };

  const handleFormSubmit = async (data: z.infer<typeof pageFormSchema>) => {
    const response = await uploadPost(data.message, data.username);
    if (response instanceof DetailedApiError) {
      setApiError(response);
    } else {
      navigate("/");
    }
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
        title={apiError?.title ?? ""}
        message={apiError?.description ?? ""}
        isOpen={apiError != undefined}
        setOpen={(o) => {
          if (o == true) return; // this modal can only be opened with an error
          setApiError(undefined);
        }}
        closeBtnClick={() => setApiError(undefined)}
      />
    </>
  );
}
