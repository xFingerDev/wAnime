import { gql } from "graphql-request";

export const queryAnimeByIds = gql`
  query ($ids: [Int]) {
    Page(page: 1, perPage: 50) {
      media(id_in: $ids) {
        id
        isAdult
        title {
          romaji
          english
          native
        }
        episodes
        externalLinks {
          type
          url
          icon
          color
        }
        coverImage {
          extraLarge
        }
      }
    }
  }
`;
