import type { Post } from "@/services/posts-service";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { ButtonGroup } from "./button-group";
import { Button } from "./button";
import { Dot, HeartIcon, ShieldAlert } from "lucide-react";

export default function PostRecord({
  post,
  misinfoClick,
  detailsClick,
}: {
  post: Post;
  misinfoClick: (p: Post) => void;
  detailsClick: (p: Post) => void;
}) {
  const dateString = post.date.toLocaleString();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {post.username}
          <Dot className="text-gray-600" />
          <span className="text-gray-500 font-normal">{dateString}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{post.message}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap">
        <ButtonGroup>
          <Button variant="outline">
            <HeartIcon />
          </Button>
          <Button variant="outline" onClick={() => detailsClick(post)}>
            Details
          </Button>
        </ButtonGroup>
        {post.misinfo_state && (
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
