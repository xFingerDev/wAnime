import { AnimeLang } from "../constants/AnimeLang";
import { AnimeModel } from "../types/AnimeModel";

export function GetTitleOfAnime(lang: AnimeLang, moe: AnimeModel) {
  switch (lang) {
    case AnimeLang.en:
      return (
        moe.aniListModel?.title.english ??
        moe.aniListModel?.title.romaji ??
        moe.aniListModel?.title.native ??
        moe.filename
      );
    case AnimeLang.romaji:
      return (
        moe.aniListModel?.title.romaji ??
        moe.aniListModel?.title.english ??
        moe.aniListModel?.title.native ??
        moe.filename
      );
    case AnimeLang.native:
      return (
        moe.aniListModel?.title.native ??
        moe.aniListModel?.title.romaji ??
        moe.aniListModel?.title.english ??
        moe.filename
      );
    default:
      return (
        moe.aniListModel?.title.english ??
        moe.aniListModel?.title.romaji ??
        moe.filename
      );
  }
}
