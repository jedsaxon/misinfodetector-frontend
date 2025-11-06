import { z } from "zod/v4";
import { DetailedApiError, safeFetch } from "./api-utils";
import { faker } from "@faker-js/faker";

// Browser-compatible UUID generator
function randomUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class PostResponse {
  public readonly posts: Post[];
  public readonly pageCount: number;

  public constructor(posts: Post[], pageCount: number) {
    this.posts = posts;
    this.pageCount = pageCount;
  }
}

export class Post {
  public readonly id: string;
  public readonly message: string;
  public readonly username: string;
  public readonly date: Date;
  public readonly potentialMisinformation: boolean;

  public constructor(
    id: string,
    message: string,
    username: string,
    date: Date,
    potentialMisinformation: boolean = false
  ) {
    this.id = id;
    this.message = message;
    this.username = username;
    this.date = date;
    this.potentialMisinformation = potentialMisinformation;
  }
}

const postSchema = z.object({
  id: z.string(),
  message: z.string(),
  username: z.string(),
  date: z.string(),
  misinfo_state: z.number().optional(),
});

export const postApiResponseSchema = z.object({
  posts: z.array(postSchema),
  pages: z.number(),
});

export const uploadPostApiResponseSchema = z.object({
  message: z.string(),
  post: postSchema,
});

export const singlePostApiResponseSchema = z.object({
  message: z.string(),
  post: postSchema,
});

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function uploadPost(
  message: string,
  username: string
): Promise<DetailedApiError | Post> {
  const response = await safeFetch(`${API_URL}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, username }),
  });

  if (response instanceof DetailedApiError) return response;

  const responseJson = await response.json();
  const parsedResponse = await uploadPostApiResponseSchema.safeParseAsync(
    responseJson
  );

  if (parsedResponse.error) {
    console.error(parsedResponse.error);
    return new DetailedApiError(
      "Post was uploaded, but could not provide details",
      "There was an issue with the response payload, after recieving confirmation that it uploaded."
    );
  } else {
    return new Post(
      parsedResponse.data.post.id,
      parsedResponse.data.post.message,
      parsedResponse.data.post.username,
      new Date(parsedResponse.data.post.date),
      (parsedResponse.data.post.misinfo_state ?? 0) === 1
    );
  }
}

export async function fetchPosts(
  pageNumber: number,
  resultAmount: number
): Promise<PostResponse | DetailedApiError> {
  const response = await safeFetch(
    `${API_URL}/api/posts?pageNumber=${pageNumber}&resultAmount=${resultAmount}`
  );
  if (response instanceof DetailedApiError) {
    return response as DetailedApiError;
  }

  const responseJson = await response.json();
  const parsedResponse = await postApiResponseSchema.safeParseAsync(
    responseJson
  );

  if (parsedResponse.error) {
    console.error("zod error: ", parsedResponse.error);
    console.error("Response data: ", responseJson);
    return new DetailedApiError(
      "Unknown error occurred",
      `Data was malformed - cannot display posts: ${parsedResponse.error.message}`
    );
  } else {
    const posts = parsedResponse.data.posts.map(
      (p) =>
        new Post(
          p.id,
          p.message,
          p.username,
          new Date(p.date),
          (p.misinfo_state ?? 0) === 1
        )
    );
    return new PostResponse(posts, parsedResponse.data.pages);
  }
}

export async function fetchSinglePost(
  id: string
): Promise<Post | DetailedApiError> {
  const response = await safeFetch(`${API_URL}/api/posts/${id}`);

  if (response instanceof DetailedApiError) {
    return response as DetailedApiError;
  }

  const responseJson = await response.json();
  const parsedResponse = await singlePostApiResponseSchema.safeParseAsync(
    responseJson
  );

  if (parsedResponse.error) {
    console.error("zod error: ", parsedResponse.error);
    console.error("Response data: ", responseJson);
    return new DetailedApiError(
      "This post was found, but could not be processed",
      `Data was malformed: ${parsedResponse.error.message}`
    );
  } else {
    const p = parsedResponse.data.post;
    return new Post(
      p.id,
      p.message,
      p.username,
      new Date(p.date),
      (p.misinfo_state ?? 0) === 1
    );
  }
}

export function randomPost() {
  const id = randomUUID().toString();
  const message = faker.lorem.sentences({ min: 1, max: 3 });
  const username = faker.person.fullName();
  const date = faker.date.recent({
    days: 30,
    refDate: new Date(new Date().toUTCString()),
  });
  const misinformation = faker.number.int({ min: 0, max: 1 }) === 1;
  return new Post(id, message, username, date, misinformation);
}

export function randomPosts(count: number) {
  const posts = new Array<Post>(count);
  for (let i = 0; i < count; i++) {
    posts[i] = randomPost();
  }
  return posts;
}
