import { z } from "zod/v4";
import { DetailedApiError, safeFetch } from "./api-utils";
import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";

export class Post {
  public constructor(
    public readonly id: string,
    public readonly message: string,
    public readonly username: string,
    public readonly date: Date,
  ) {}
}

const postSchema = z.object({
  id: z.string(),
  message: z.string(),
  username: z.string(),
  date: z.string(),
});

const postApiResponseSchema = z.object({
  posts: z.array(postSchema),
});

export async function fetchPosts(
  pageFrom: number,
  returnAmount: number,
): Promise<Post[] | DetailedApiError> {
  const response = await safeFetch(`http://localhost:3000/api/posts`);
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
    return parsedResponse.data.posts.map(
      (p) => new Post(p.id, p.message, p.username, new Date(p.date)),
    );
  }
}

export function randomPost() {
  const id = randomUUID().toString();
  const message = faker.lorem.sentences({ min: 1, max: 3 });
  const username = faker.person.fullName();
  const date = faker.date.recent({ days: 30, refDate: new Date() });
  return new Post(id, message, username, date);
}

export function randomPosts(count: number) {
  const posts = new Array<Post>(count);
  for (let i = 0; i < count; i++) {
    posts[i] = randomPost();
  }
  return posts;
}
