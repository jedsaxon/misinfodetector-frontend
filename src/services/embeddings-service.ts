import { z } from "zod/v4";
import { DetailedApiError, safeFetch } from "./api-utils";

export interface TNSEEmbedding {
  id: number;
  label: number;
  pred_label: number;
  correct: "True" | "False";
  tnse_x: number;
  tnse_y: number;
}

const tnseEmbeddingSchema = z.object({
  id: z.number(),
  label: z.number(),
  pred_label: z.number(),
  correct: z.enum(["True", "False"]),
  tnse_x: z.number(),
  tnse_y: z.number(),
});

const tnseEmbeddingsResponseSchema = z.array(tnseEmbeddingSchema);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchTNSEEmbeddings(): Promise<
  TNSEEmbedding[] | DetailedApiError
> {
  const response = await safeFetch(`${API_URL}/api/data/tnse-embeddings`);

  if (response instanceof DetailedApiError) {
    return response;
  }

  const responseJson = await response.json();
  const parsedResponse = await tnseEmbeddingsResponseSchema.safeParseAsync(
    responseJson
  );

  if (parsedResponse.error) {
    console.error("zod error: ", parsedResponse.error);
    console.error("Response data: ", responseJson);
    return new DetailedApiError(
      "Unknown error occurred",
      `Data was malformed - cannot display embeddings: ${parsedResponse.error.message}`
    );
  }

  return parsedResponse.data;
}
