import { gql } from "graphql-request";

export interface AnimeModelGQL {
  id: string;
  isAdult: boolean;
  episodes: number | null;
  title: {
    romaji: string;
    english: string | null;
    native: string | null;
  };
  coverImage: {
    extraLarge: string;
  };
  externalLinks: {
    url: string;
    type: string;
    icon: string;
    color: string;
  }[];
}

export interface PaginationAnimeModelGQL {
  Page: {
    media: AnimeModelGQL[];
  };
}
