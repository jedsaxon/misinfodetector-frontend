import { serve } from "bun";
import index from "./index.html";
import { randomPosts } from "./services/comment-service";

const posts = randomPosts(5000);

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
        const selectedPosts = posts.slice(skip, to);
        const responseJson = JSON.stringify({
          posts: selectedPosts,
        });

        return new Response(responseJson);
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
