import {
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { t } from "i18next";
import renderAlternativeItem from "../../components/renderAlternativeItem";
import { AnimeModel } from "../../types/AnimeModel";
import { useIsFocused } from "@react-navigation/native";
import { AnimeLang } from "../../constants/AnimeLang";
import { TestIds, useInterstitialAd } from "react-native-google-mobile-ads";

export default function Page() {
  const [historyType, seHistoryType] = useState<AnimeModel[][]>([]);
  const router = useRouter();
  const { isLoaded, isClosed, load, show } = useInterstitialAd(
    "ca-app-pub-4713105116292090/2202373575",
    {
      requestNonPersonalizedAdsOnly: false,
    }
  );

  useEffect(() => {
    load();
  }, [load]);

  const [pageToLoad, setPageToLoad] = useState<string | null>(null);

  useEffect(() => {
    if (isClosed && pageToLoad) {
      Linking.openURL(pageToLoad);
    }
  }, [isClosed, pageToLoad]);

  const [showAds, setShowAds] = useState<boolean>(true);

  useEffect(() => {
    AsyncStorage.getItem("showAds").then(
      (ad) => ad && setShowAds(ad === "true")
    );
  }, [showAds]);
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
        <Text className="text-2xl md:text-3xl font-bold mt-4 mb-4 text-center text-white">
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
              prsss: async (value) => {
                if (!showAds || !isLoaded) {
                  return await Linking.openURL(value);
                }
                setPageToLoad(value);
                show();
              },
            })}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
