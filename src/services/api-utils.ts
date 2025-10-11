import { z } from "zod/v4";

export class DetailedApiError {
  public constructor(
    public readonly title: string,
    public readonly description?: string,
  ) {}
}

const defaultApiErrorTitle = "Unable to fetch comments";

const detailedApiErrorSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

/**
 * Will execute `fetch`, and returns a `DetailedApiError` if the response is either
 * not HTTP200, or an error was caught while `fetch` was being executed.
 */
export async function safeFetch(
  endpoint: string,
): Promise<Response | DetailedApiError> {
  let response: Response;
  try {
    response = await fetch(endpoint);
  } catch (e) {
    return fetchErrorToDetailedError(e);
  }

  if (!response.ok) return await responseToError(response);
  else return response;
}

export function fetchErrorToDetailedError(e: unknown) {
  if (e instanceof Error) {
    return new DetailedApiError(defaultApiErrorTitle, e.message);
  } else {
    return new DetailedApiError(defaultApiErrorTitle, "unknown");
  }
}

export async function responseToError(
  response: Response,
): Promise<DetailedApiError> {
  const responseJson = await response.json();
  const errorParsed = await detailedApiErrorSchema.safeParseAsync(responseJson);

  if (errorParsed.error) {
    return new DetailedApiError(defaultApiErrorTitle, response.statusText);
  } else {
    return new DetailedApiError(
      errorParsed.data.title,
      errorParsed.data.description,
    );
  }
}
