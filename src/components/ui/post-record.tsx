import type { Post } from "@/services/posts-service";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { ButtonGroup } from "./button-group";
import { Button } from "./button";
import { HeartIcon, ShieldAlert } from "lucide-react";

export default function PostRecord({
  post,
  misinfoClick,
}: {
  post: Post;
  misinfoClick: (p: Post) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.username}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{post.message}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap">
        <ButtonGroup>
          <Button variant="outline">
            <HeartIcon />
          </Button>
          <Button variant="outline">Comments</Button>
        </ButtonGroup>
        {post.potentialMisinformation && (
          <Button
            variant="link"
            className="text-red-500 underline"
            onClick={() => misinfoClick(post)}
          >
            <ShieldAlert /> This post could contain misinformation
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

