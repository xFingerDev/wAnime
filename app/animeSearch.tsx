import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import renderAlternativeItem from "../components/renderAlternativeItem";
import { t } from "i18next";
import { AnimeLang } from "../constants/AnimeLang";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetTitleOfAnime } from "../utils/GetTitleOfAnime";
import { AnimeModel } from "../types/AnimeModel";

export default function Page() {
  const { moePosibles } = useLocalSearchParams();
  const results: AnimeModel[] = JSON.parse(moePosibles as string);
  const [animeLang, setAnimeLang] = useState<AnimeLang>(AnimeLang.romaji);

  useEffect(() => {
    AsyncStorage.getItem("animeLang").then(
      (ad) => ad && setAnimeLang(ad as AnimeLang)
    );
  }, [animeLang]);

  const sortedResults = [...results].sort(
    (a, b) => b.similarity - a.similarity
  );
  const mainResult = sortedResults[0];
  const alternativeResults = sortedResults.slice(1);

  const renderMainResult = (moe: AnimeModel) => (
    <View className="mb-6">
      <Image
        source={{ uri: moe.aniListModel?.coverImage.extraLarge ?? moe.image }}
        className="w-48 h-72 rounded-md mb-3 self-center"
        resizeMode="cover"
      />
      <Text className="font-bold text-xl mb-2 text-white text-center">
        {GetTitleOfAnime(animeLang, moe)}
      </Text>
      <Text className="text-base text-gray-600 font-semibold text-center">
        {t("anime.episode")} {moe.episode} / {moe.aniListModel?.episodes} •{" "}
        {(moe.similarity * 100).toFixed(0)}% {t("anime.similarity")}
      </Text>
      <View className="flex-row mt-3 items-center justify-center">
        {moe.aniListModel?.externalLinks
          ?.filter((link) => link.type === "STREAMING")
          .map((service, index) => (
            <TouchableOpacity
              key={index}
              className="mx-2"
              onPress={() => Linking.openURL(service.url)}
            >
              <Image
                source={{ uri: service.icon }}
                className="w-8 h-8"
                style={{ tintColor: service.color }}
              />
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-black p-4">
      {renderMainResult(mainResult)}
      <View className="mb-8 mt-4 flex-row">
        <View className="bg-gray-400 h-0.5 flex-1 self-center" />
        <Text className="text-gray-400 self-center px-5 text-2xl">
          {t("anime.posible_matches")}
        </Text>
        <View className="bg-gray-400 h-0.5 flex-1 self-center" />
      </View>
      <FlatList
        data={alternativeResults}
        renderItem={({ item }) => renderAlternativeItem({ item, animeLang })}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}
