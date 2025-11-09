import { z } from "zod/v4";
import { DetailedApiError, safeFetch } from "./api-utils";

export interface TopicActivity {
  db_id: number;
  date: string;
  text: string;
  topic_id: number;
  topic_name: string;
}

const topicActivitySchema = z.object({
  db_id: z.number(),
  date: z.string(),
  text: z.string(),
  topic_id: z.number(),
  topic_name: z.string(),
});

const topicActivitiesResponseSchema = z.array(topicActivitySchema);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchTopicActivities(): Promise<
  TopicActivity[] | DetailedApiError
> {
  const response = await safeFetch(`${API_URL}/api/data/topic-activities`);

  if (response instanceof DetailedApiError) {
    return response;
  }

  const responseJson = await response.json();
  const parsedResponse = await topicActivitiesResponseSchema.safeParseAsync(
    responseJson
  );

  if (parsedResponse.error) {
    console.error("zod error: ", parsedResponse.error);
    console.error("Response data: ", responseJson);
    return new DetailedApiError(
      "Unknown error occurred",
      `Data was malformed - cannot display topic activities: ${parsedResponse.error.message}`
    );
  }

  return parsedResponse.data;
}
