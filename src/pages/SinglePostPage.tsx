import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import VerticalSeparator from "@/components/ui/verticalseparator";
import { DetailedApiError, safeFetch } from "@/services/api-utils";
import { Post, singlePostApiResponseSchema } from "@/services/posts-service";
import { Dot, HeartIcon, MessageSquare, ShieldAlert, } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

async function sleep(msec: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

export default function SinglePostPage() {
  const { id } = useParams() ?? "";
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [apiError, setApiError] = useState<DetailedApiError | undefined>(
    undefined,
  );

  useEffect(() => {
    const postFetchHandler = async () => {
      await sleep(400);
      setPost(undefined);
      const response = await safeFetch(`http://localhost:5000/api/posts/${id}`);

      if (response instanceof DetailedApiError) {
        setApiError(response);
        return;
      }

      const responseJson = await response.json();
      const parsedResponse =
        await singlePostApiResponseSchema.safeParseAsync(responseJson);

      if (parsedResponse.error) {
        setApiError(
          new DetailedApiError(
            "This post was found, but could not be processed",
          ),
        );
        return;
      } else {
        const p = parsedResponse.data.post;
        const newPost = new Post(
          p.id,
          p.message,
          p.username,
          new Date(p.date),
          Boolean(p.misinfo_state),
        );
        setApiError(undefined);
        setPost(newPost);
      }
    };

    postFetchHandler();
  }, [id]);

  const header = post ? <PostHeader post={post} /> : <span>Loading...</span>;
  const content = post ? <PostContent post={post} /> : <span>Loading...</span>;

  return (
    <>
      <Header>
        <SidebarTrigger />
        <VerticalSeparator />
        <MessageSquare className="mx-1" color="#3584e4" />
        User Post
      </Header>
      <section
        className="flex flex-col m-auto my-6 gap-3 flex-wrap"
        style={{ maxWidth: "512px" }}
      >
        <h2 className="text-xl">{header}</h2>
        {post?.misinfo_state && <PostMisinfoWarningExpanded />}
        {content}
      </section>
    </>
  );
}

export function PostMisinfoWarningExpanded() {
  return (
    <Alert variant="destructive">
      <ShieldAlert />
      <AlertTitle>This post could contain misinformation</AlertTitle>
      <AlertDescription>
        <ul className="list-inside list-disc text-sm">
          <li>This post contains similar patterns found in other misleading posts</li>
          <li>Our algorithm might be wrong</li>
          <li>Please fact-check any information</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}

export function PostContent({ post }: { post: Post }) {
  return (
    <>
      <p>{post.message}</p>
      <div>
        <Button variant="outline">
          <HeartIcon />
        </Button>
      </div>
    </>
  );
}

export function PostHeader({ post }: { post: Post }) {
  const dateString = post.date.toLocaleString();
  return (
    <span className="flex items-center">
      {post.username}
      <Dot className="text-gray-600" />
      <span className="text-gray-500 font-normal">{dateString}</span>
    </span>
  );
}
