import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnimeModel } from "../../types/AnimeModel";

export class StorageManager {
  static async saveHistory(anime: AnimeModel[]) {
    const existingResults = await AsyncStorage.getItem("resultSearch");
    let searchHistory = existingResults ? JSON.parse(existingResults) : [];
    await AsyncStorage.setItem(
      "resultSearch",
      JSON.stringify([anime, ...searchHistory].slice(0, 10))
    ).catch((err) => console.log(err));
  }
}
