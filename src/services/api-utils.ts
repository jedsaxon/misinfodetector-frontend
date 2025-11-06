import { z } from "zod/v4";

export class DetailedApiError {
  public readonly title: string;
  public readonly description?: string;

  public constructor(title: string, description?: string) {
    this.title = title;
    this.description = description;
  }
}

export class ApiResponse<T> {
  public readonly data: T;
  public readonly message?: string;

  public constructor(data: T, message?: string) {
    this.data = data;
    this.message = message;
  }
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
  options?: RequestInit
): Promise<Response | DetailedApiError> {
  let response: Response;
  try {
    response = await fetch(endpoint, options);
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
  response: Response
): Promise<DetailedApiError> {
  let responseJson: unknown;
  try {
    responseJson = await response.json();
  } catch {
    responseJson = {};
  }
  const errorParsed = await detailedApiErrorSchema.safeParseAsync(responseJson);

  if (errorParsed.error) {
    return new DetailedApiError(defaultApiErrorTitle, response.statusText);
  } else {
    return new DetailedApiError(
      errorParsed.data.title,
      errorParsed.data.description
    );
  }
}
