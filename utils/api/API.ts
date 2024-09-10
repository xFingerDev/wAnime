import axios, { formToJSON } from "axios";
import FormData from "form-data";
import * as FileSystem from "expo-file-system";
import { queryAnimeByIds } from "../gql/models/anime.schema";
import { AnimeModelGQL, PaginationAnimeModelGQL } from "../gql/models/anime";
import { clientGraphQL } from "../gql";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnimeModel, MoeAnimeModel } from "../../types/AnimeModel";
import { MoeApiInfo } from "../../types/MoeApiInfo";
import { StorageManager } from "../storage/StorageManager";

export class API {
  static async getMoe(uri: string): Promise<MoeAnimeModel[]> {
    const formData = new FormData();
    const fileUri = await FileSystem.getContentUriAsync(uri);
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    formData.append("image", {
      uri: fileUri,
      type: "image/jpeg",
      name: fileInfo.uri.split("/").pop() || "image.jpg",
    });

    const request = await axios<{ result: MoeAnimeModel[] }>({
      url: "https://api.trace.moe/search",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });

    if (request.status !== 200) {
      return [];
    }

    return request.data.result;
  }

  static async getAnimes(uri: string): Promise<AnimeModel[]> {
    const moeAnimes = await this.getMoe(uri);
    const requestGraph = await clientGraphQL<PaginationAnimeModelGQL>(
      queryAnimeByIds,
      { ids: moeAnimes.map(({ anilist }) => anilist) }
    );

    let proccessedIds = new Set<string>();
    let result: AnimeModel[] = [];
    moeAnimes.forEach((data) => {
      if (!proccessedIds.has(data.anilist.toString())) {
        result.push({
          ...data,
          aniListModel:
            requestGraph.Page.media?.find(
              (t) => t.id.toString() === data.anilist.toString()
            ) ?? null,
        });
        proccessedIds.add(data.anilist.toString());
      }
    });

    await StorageManager.saveHistory(result);

    return result;
  }

  static async getApiInfo(): Promise<MoeApiInfo | null> {
    const data = await axios.get<MoeApiInfo>("https://api.trace.moe/me");
    if (data.status !== 200) {
      return null;
    }

    return data.data;
  }
}
