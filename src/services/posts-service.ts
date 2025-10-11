import { z } from "zod/v4";
import { DetailedApiError, safeFetch } from "./api-utils";
import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";

export class PostResponse {
  public constructor(
    public readonly posts: Post[],
    public readonly pageCount: number,
  ) {}
}

export class Post {
  public constructor(
    public readonly id: string,
    public readonly message: string,
    public readonly username: string,
    public readonly date: Date,
    public readonly potentialMisinformation?: boolean,
  ) {}
}

const postSchema = z.object({
  id: z.string(),
  message: z.string(),
  username: z.string(),
  date: z.string(),
  potentialMisinformation: z.boolean(),
});

const postApiResponseSchema = z.object({
  posts: z.array(postSchema),
  pages: z.number(),
});

export async function uploadPost(
  message: string,
  username: string,
): Promise<DetailedApiError | Post> {
  const response = await safeFetch("http://localhost:3000/api/posts", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, username }),
  });

  if (response instanceof DetailedApiError) return response;

  const responseJson = await response.json();
  const parsedResponse = await postSchema.safeParseAsync(responseJson);

  if (parsedResponse.error) {
    return new DetailedApiError(
      "Post was uploaded, but could not provide details",
      "There was an issue with the response payload, after recieving confirmation that it uploaded.",
    );
  } else {
    return new Post(
      parsedResponse.data.id,
      parsedResponse.data.message,
      parsedResponse.data.username,
      new Date(parsedResponse.data.date),
      parsedResponse.data.potentialMisinformation,
    );
  }
}

export async function fetchPosts(
  pageNumber: number,
  resultAmount: number,
): Promise<PostResponse | DetailedApiError> {
  const response = await safeFetch(
    `http://localhost:3000/api/posts?pageNumber=${pageNumber}&resultAmount=${resultAmount}`,
  );
  if (response instanceof DetailedApiError) {
    return response as DetailedApiError;
  }

  const responseJson = await response.json();
  const parsedResponse =
    await postApiResponseSchema.safeParseAsync(responseJson);

  if (parsedResponse.error) {
    console.error("zod error: ", parsedResponse.error);
    return new DetailedApiError(
      "Unknown error occurred",
      "Data was malformed - cannot display posts",
    );
  } else {
    const posts = parsedResponse.data.posts.map(
      (p) =>
        new Post(
          p.id,
          p.message,
          p.username,
          new Date(p.date),
          p.potentialMisinformation,
        ),
    );
    return new PostResponse(posts, parsedResponse.data.pages);
  }
}

export function randomPost() {
  const id = randomUUID().toString();
  const message = faker.lorem.sentences({ min: 1, max: 3 });
  const username = faker.person.fullName();
  const date = faker.date.recent({ days: 30, refDate: new Date() });
  const misinformation = Boolean(faker.number.int({ min: 0, max: 1 }));
  return new Post(id, message, username, date, misinformation);
}

export function randomPosts(count: number) {
  const posts = new Array<Post>(count);
  for (let i = 0; i < count; i++) {
    posts[i] = randomPost();
  }
  return posts;
}
