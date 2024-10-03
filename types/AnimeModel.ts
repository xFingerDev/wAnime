import { AnimeModelGQL } from "../utils/gql/models/anime";

export type MoeAnimeModel = {
  anilist: number;
  filename: string;
  episode: number;
  from: number;
  to: number;
  similarity: number;
  video: string;
  image: string;
};

export type AnimeModel = MoeAnimeModel & {
  aniListModel: AnimeModelGQL | null;
};
