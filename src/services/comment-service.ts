import { z } from "zod/v4";
import { DetailedApiError, safeFetch } from "./api-utils";

export class Comment {
  public constructor(
    public readonly id: string,
    public readonly message: string,
    public readonly username: string,
    public readonly date: Date,
  ) {}
}

const commentSchema = z.object({
  id: z.string(),
  message: z.string(),
  username: z.string(),
  date: z.date(),
});

const commentApiResponseSchema = z.object({
  comments: z.array(commentSchema),
});

export async function fetchComments(
  pageFrom: number,
  returnAmount: number,
): Promise<Comment[] | DetailedApiError> {
  const response = await safeFetch(
    `http://localhost:3000/comments?from=${pageFrom}&amount=${returnAmount}`,
  );
  if (response instanceof DetailedApiError) {
    return response as DetailedApiError;
  }

  const responseJson = await response.json();
  const parsedResponse =
    await commentApiResponseSchema.safeParseAsync(responseJson);

  if (parsedResponse.error) {
    return new DetailedApiError(
      "Unknown error occurred",
      "Data was malformed - cannot display comments",
    );
  } else {
    return parsedResponse.data.comments;
  }
}
