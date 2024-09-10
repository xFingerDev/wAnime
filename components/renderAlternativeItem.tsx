import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { t } from "i18next";
import { GetTitleOfAnime } from "../utils/GetTitleOfAnime";
import { AnimeModel } from "../types/AnimeModel";
import { AnimeLang } from "../constants/AnimeLang";
import { AdHookReturns } from "react-native-google-mobile-ads";

const renderAlternativeItem = ({
  item: moe,
  animeLang,
  prsss,
}: {
  item: AnimeModel;
  animeLang: AnimeLang;
  prsss: (value: string) => void;
}) => (
  <View className="mb-4  rounded-lg border border-gray-400 p-3 flex-row ">
    <Image
      source={{ uri: moe.aniListModel?.coverImage.extraLarge ?? moe.image }}
      className="w-24 h-36 rounded-md mr-3 "
      resizeMode="cover"
    />
    <View className="flex-1 justify-between">
      <View>
        <Text className="font-medium text-base mb-1 text-white">
          {GetTitleOfAnime(animeLang, moe)}
        </Text>
        <Text className="text-sm text-gray-600">
          {t("anime.episode")} {moe.episode} / {moe.aniListModel?.episodes} •{" "}
          {(moe.similarity * 100).toFixed(0)}% {t("anime.similarity")}
        </Text>
      </View>

      <View className="flex-row mt-2 items-center">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {moe.aniListModel?.externalLinks
            ?.filter((link) => link.type === "STREAMING")
            .map((service, index) => (
              <TouchableOpacity
                key={index}
                className="mr-2"
                onPress={() => prsss(service.url)}
              >
                <Image
                  source={{ uri: service.icon }}
                  className="w-6 h-6"
                  style={{ tintColor: service.color }}
                />
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </View>
  </View>
);

export default renderAlternativeItem;
