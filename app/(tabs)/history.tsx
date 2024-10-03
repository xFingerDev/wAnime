import { Text, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { t } from "i18next";
import renderAlternativeItem from "../../components/renderAlternativeItem";
import { AnimeModel } from "../../types/AnimeModel";
import { useIsFocused } from "@react-navigation/native";
import { AnimeLang } from "../../constants/AnimeLang";

export default function Page() {
  const [historyType, seHistoryType] = useState<AnimeModel[][]>([]);
  const router = useRouter();

  const [animeLang, setAnimeLang] = useState<AnimeLang>(AnimeLang.romaji);

  useEffect(() => {
    AsyncStorage.getItem("animeLang").then(
      (ad) => ad && setAnimeLang(ad as AnimeLang)
    );
  }, [animeLang]);

  useFocusEffect(() => {
    (async () => {
      await AsyncStorage.getItem("resultSearch")
        .then((data) => data && seHistoryType(JSON.parse(data)))
        .catch((err) => {
          seHistoryType([]);
        });
    })();
  });

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 mt-6 px-4">
        <Text className="text-3xl font-bold mt-4 mb-4 text-center text-white">
          {t(`home.history`)}
        </Text>
        {historyType.map((history, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              router.push({
                pathname: "/animeSearch",
                params: { moePosibles: JSON.stringify(history) },
              });
            }}
          >
            {renderAlternativeItem({
              item: history.sort((a, b) => b.similarity - a.similarity)[0],
              animeLang,
            })}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
