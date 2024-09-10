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
import { TypeMoe } from "../api/traceMoeApi";
import renderAlternativeItem from "../components/renderAlternativeItem";
import { t } from "i18next";
import { AnimeLang } from "../constants/animeLang";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetTitleOfAnime } from "../constants/GetTitleOfAnime";

export default function Page() {
  const { moePosibles } = useLocalSearchParams();
  const results: TypeMoe[] = JSON.parse(moePosibles as string);
  const [animeLang, setAnimeLang] = useState<AnimeLang>(AnimeLang.romaji);

  useEffect(() => {
    AsyncStorage.getItem("animeLang").then((ad) => {
      if (!ad) return;
      setAnimeLang(ad as AnimeLang);
    });
  }, [animeLang]);

  const sortedResults = [...results].sort(
    (a, b) => b.similarity - a.similarity
  );
  const mainResult = sortedResults[0];
  const alternativeResults = sortedResults.slice(1);

  const renderMainResult = (moe: TypeMoe) => (
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
      <View className="mb-8 mt-4" style={{ flexDirection: "row" }}>
        <View
          className="bg-gray-400"
          style={{
            height: 2,
            flex: 1,
            alignSelf: "center",
          }}
        />
        <Text
          className="text-gray-400"
          style={{
            alignSelf: "center",
            paddingHorizontal: 5,
            fontSize: 24,
          }}
        >
          {t("anime.posible_matches")}
        </Text>
        <View
          className="bg-gray-400"
          style={{
            height: 2,
            flex: 1,
            alignSelf: "center",
          }}
        />
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
