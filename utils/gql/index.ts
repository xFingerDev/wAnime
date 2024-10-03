import { GraphQLClient } from "graphql-request";

const graphQL = new GraphQLClient("https://graphql.anilist.co");

const MAX_RETRY = 3;

export async function clientGraphQL<T>(
  query: string,
  variables: Record<string, any>
): Promise<T> {
  let retryCount = 0;

  while (retryCount < MAX_RETRY) {
    try {
      return await graphQL.request<T>(query, variables);
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        if (retryCount < MAX_RETRY) {
          const retryAfter = parseInt(
            error.response.headers.get("retry-after")
          );

          const waitTime = (retryAfter || 5) * 1000;
          retryCount++;

          await new Promise((resolve) => setTimeout(resolve, waitTime));

          continue;
        } else {
          throw new Error("Se ha superado el límite máximo de intentos.");
        }
      } else {
        throw error;
      }
    }
  }
  throw new Error("Se ha superado el límite máximo de intentos.");
}
