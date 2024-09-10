import axios, { formToJSON } from "axios";
import FormData from "form-data";
import * as FileSystem from "expo-file-system";
import { queryAnimeByIds } from "./gql/models/anime.schema";
import { AnimeModelGQL, PaginationAnimeModelGQL } from "./gql/models/anime";
import { clientGraphQL } from "./gql";
import AsyncStorage from "@react-native-async-storage/async-storage";
export type TypeMoe = {
  anilist: number;
  filename: string;
  episode: number;
  from: number;
  to: number;
  similarity: number;
  video: string;
  image: string;
  aniListModel: AnimeModelGQL | null;
};
export class MoeApi {
  static async Get(uri: string): Promise<TypeMoe[]> {
    const formData = new FormData();
    const fileUri = await FileSystem.getContentUriAsync(uri);
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    formData.append("image", {
      uri: fileUri,
      type: "image/jpeg",
      name: fileInfo.uri.split("/").pop() || "image.jpg",
    });

    const data = await axios({
      url: "https://api.trace.moe/search",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });

    if (data.status !== 200) {
      return [];
    }

    const request = await clientGraphQL<PaginationAnimeModelGQL>(
      queryAnimeByIds,
      { ids: (<TypeMoe[]>data.data.result).map(({ anilist }) => anilist) }
    );

    let proccessedIds = new Set<string>();
    let result: TypeMoe[] = [];
    (<TypeMoe[]>data.data.result).forEach((data) => {
      if (!proccessedIds.has(data.anilist.toString())) {
        result.push({
          ...data,
          aniListModel:
            request.Page.media?.find(
              (t) => t.id.toString() === data.anilist.toString()
            ) ?? null,
        });
        proccessedIds.add(data.anilist.toString());
      }
    });

    try {
      const existingResults = await AsyncStorage.getItem("resultSearch");
      let searchHistory = existingResults ? JSON.parse(existingResults) : [];
      searchHistory = [result, ...searchHistory].slice(0, 10); // Mantener solo los últimos 10 resultados
      await AsyncStorage.setItem("resultSearch", JSON.stringify(searchHistory));
    } catch (error) {}

    return result;
  }

  static async GetMe(): Promise<{
    id: string;
    priority: number;
    concurrency: number;
    quotaUsed: number;
    quota: number;
  } | null> {
    const data = await axios.get("https://api.trace.moe/me");
    if (data.status !== 200) {
      return null;
    }
    return data.data;
  }
}
