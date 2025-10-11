import { serve } from "bun";
import index from "./index.html";
import { Post, randomPosts } from "./services/posts-service";
import { z } from "zod/v4";
import { randomUUID } from "crypto";

const postsDatabase = randomPosts(50);

const newPostSchema = z.object({
  message: z.string(),
  username: z.string(),
});

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/posts": {
      async GET(req) {
        const params = new URL(req.url);

        const pageNumberParam = params.searchParams.get("pageNumber");
        const resultAmountParam = params.searchParams.get("resultAmount");

        if (!pageNumberParam || !resultAmountParam) {
          const responseJson = JSON.stringify({
            title: "malformed request",
            description:
              "you must provide both the pageNumber and resultAmount parameter",
          });
          return new Response(responseJson, { status: 400 });
        }
        const pageNumber = parseInt(pageNumberParam);
        const resultAmount = parseInt(resultAmountParam);

        const skip = pageNumber * resultAmount;
        const to = skip + resultAmount;

        const pages = Math.ceil(postsDatabase.length / resultAmount);
        const selectedPosts = postsDatabase.slice(skip, to);

        const responseJson = JSON.stringify({
          posts: selectedPosts,
          pages: pages - 1,
        });

        return new Response(responseJson);
      },

      async PUT(req) {
        let reqJson: unknown;
        try {
          reqJson = await req.json();
        } catch (e) {
          console.log("malformed request: ", e);
          return new Response(`malformed request: ${e}`, { status: 400 });
        }
        const postResponse = await newPostSchema.safeParseAsync(reqJson);
        if (postResponse.error) {
          const msg = postResponse.error.message;
          console.log("malformed request: ", msg);
          return new Response(`malformed request: ${msg}`, { status: 400 });
        }

        const submissionDate = new Date();
        const id = randomUUID().toString();
        const p = new Post(
          id,
          postResponse.data.message,
          postResponse.data.username,
          submissionDate,
          false,
        );
        postsDatabase.push(p);

        return new Response(JSON.stringify(p), { status: 201, headers: { Location: "http://localhost:3000/api/posts" } });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    "/api/*": Response.json({ message: "Not found" }, { status: 404 }),
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
