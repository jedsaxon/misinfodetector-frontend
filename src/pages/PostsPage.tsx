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
import { AlertCircleIcon, HeartIcon, MessagesSquare } from "lucide-react";
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
import { Link } from "react-router-dom";

export default function PostsPage() {
  const [pageNumber, setPageNumber] = useState(0);
  const { posts: postResponse, apiError } = useFetchPosts(pageNumber);

  const postComponents = postResponse ? (
    postResponse.posts.map((p) => <PostView post={p} key={p.id} />)
  ) : (
    <PostSkeleton />
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
        {postComponents}
      </div>
      <div className="mb-5">
        <PostPager
          currentPage={pageNumber}
          totalPages={postResponse?.pageCount ?? 0}
          onPageChange={(e) => console.log(e)}
        />
      </div>
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

function PostSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton style={{ width: "512px", height: "calc(1.5rem * 1)" }} />
      <Skeleton style={{ width: "512px", height: "calc(1.5rem * 4)" }} />
    </div>
  );
}

function PostView({ post }: { post: Post }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.username}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{post.message}</p>
      </CardContent>
      <CardFooter>
        <ButtonGroup>
          <Button variant="outline">
            <HeartIcon />
          </Button>
          <Button variant="outline">Details</Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}

function PostPager({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}) {
  const page = Math.max(1, Math.min(currentPage, totalPages));
  const startPage = Math.max(1, page - 3);
  const endPage = Math.min(totalPages, page + 3);

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
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
          />
        </PaginationItem>

        {/* First page + ellipsis */}
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

        {/* Page numbers */}
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

        {/* Last page + ellipsis */}
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

        {/* Next */}
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
