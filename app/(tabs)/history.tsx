import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TypeMoe } from "../../api/traceMoeApi";
import { t } from "i18next";
import renderAlternativeItem from "../../components/renderAlternativeItem";
import { AnimeLang } from "../../constants/animeLang";

export default function Page() {
  const [historyType, seHistoryType] = useState<TypeMoe[][]>([]);
  const router = useRouter();

  const [animeLang, setAnimeLang] = useState<AnimeLang>(AnimeLang.romaji);

  useEffect(() => {
    AsyncStorage.getItem("animeLang").then((ad) => {
      if (!ad) return;
      setAnimeLang(ad as AnimeLang);
    });
  }, [animeLang]);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const resultHistory = await AsyncStorage.getItem("resultSearch");
        if (resultHistory) {
          seHistoryType(JSON.parse(resultHistory) as TypeMoe[][]);
        }
      } catch {}
    };

    getHistory();
  }, []);

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
