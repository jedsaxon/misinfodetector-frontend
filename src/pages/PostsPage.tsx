import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Post } from "../services/comment-service";
import Header from "@/components/ui/header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import VerticalSeparator from "@/components/ui/verticalseparator";
import { useFetchPosts } from "@/hooks/use-posts";
import { DetailedApiError } from "@/services/api-utils";
import {
  AlertCircleIcon,
  HeartIcon,
  MessagesSquare,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PostsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("pageNumber") || "1");

  const { posts: postResponse, apiError } = useFetchPosts(currentPage);

  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 0, left: 0 });
    setSearchParams({ pageNumber: newPage.toString() });
  };

  const postContent = postResponse ? (
    <PostList
      posts={postResponse.posts}
      researchBtnClick={() => navigate("/research")}
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
        {apiError && <ApiError error={apiError} />}
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

export function PostList({
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

function ApiError({ error }: { error: DetailedApiError }) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{error.title}</AlertTitle>
      {error && <AlertDescription>{error.description}</AlertDescription>}
    </Alert>
  );
}

function PostSkeleton({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton style={{ width: "512px", height: "calc(1.5rem * 1)" }} />
      <Skeleton style={{ width: "512px", height: "calc(1.5rem * 4)" }} />
    </div>
  );
}

function PostRecord({
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

function MisinformationDialogue({
  isOpen,
  setOpen,
  researchBtnClick,
}: {
  isOpen: boolean;
  setOpen: (state: boolean) => void;
  researchBtnClick: () => void;
}) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogTrigger />

      <AlertDialogContent>
        <AlertDialogTitle className="flex gap-x-2 items-center">
          <ShieldAlert /> <span>This Post May Contains Misinformation</span>
        </AlertDialogTitle>
        <AlertDialogDescription>
          Our systems detected that this post could contain misinformation. If
          this topic is important to you, please do further research and confirm
          that the claims made in this post are valid.
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={researchBtnClick}>
            How It Works
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClose}>
            Understood
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function PostPager({
  currentPage,
  totalPages,
  maxPreviousButtons = 3,
  maxNextButtons = 3,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  maxPreviousButtons: number;
  maxNextButtons: number;
  onPageChange: (newPage: number) => void;
}) {
  const page = Math.max(1, Math.min(currentPage, totalPages));
  const startPage = Math.max(1, page - maxPreviousButtons);
  const endPage = Math.min(totalPages, page + maxNextButtons);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (newPage: number) => {
    if (newPage !== page && newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
          />
        </PaginationItem>

        {startPage > 1 && (
          <>
            <PaginationItem>
              <PaginationLink
                isActive={page === 1}
                onClick={() => handlePageChange(1)}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {startPage > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {pageNumbers.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              isActive={p === page}
              onClick={() => handlePageChange(p)}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                isActive={page === totalPages}
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            aria-disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
