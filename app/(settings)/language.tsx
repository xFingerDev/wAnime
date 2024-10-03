import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import i18n, { getLanguage, getLanguages, setLanguage } from "../../i18n";
import CountryFlag from "react-native-country-flag-icon";
import { AnimeLang } from "../../constants/AnimeLang";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Page() {
  const router = useRouter();
  const { animeLang } = useLocalSearchParams();
  const [userLang, setUserLang] = useState<string>();

  useEffect(() => {
    if (animeLang === "true") {
      AsyncStorage.getItem("animeLang").then((lang) => {
        setUserLang(lang ?? AnimeLang.romaji);
      });
      return;
    }

    setUserLang(i18n.resolvedLanguage ?? i18n.language);
  }, [userLang]);

  const saveLanguage = async (lang: string) => {
    if (animeLang === "true") {
      return await AsyncStorage.setItem("animeLang", lang);
    }
    await setLanguage(lang);
  };

  const renderLanguage = ({ item: lang }: { item: string }) => (
    <TouchableOpacity
      key={lang}
      className="flex-row items-center justify-between px-4 py-3"
      onPress={async () => {
        await saveLanguage(lang);
        router.push("/settings");
      }}
    >
      <View className="flex-row items-center">
        <View className="mr-3">
          {!animeLang || lang === AnimeLang.en ? (
            <CountryFlag isoCode={lang.split("-")[1]} size={25} />
          ) : (
            <CountryFlag isoCode="JP" size={25} />
          )}
        </View>
        <Text className="text-white text-lg ml-2">
          {animeLang !== "true" || lang === AnimeLang.en
            ? getLanguage(lang)
            : lang}
        </Text>
      </View>
      {lang === userLang && (
        <Ionicons name="checkmark-sharp" size={20} color="gray" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="bg-black flex-1">
      <FlatList
        className="mt-4"
        data={animeLang === "true" ? Object.values(AnimeLang) : getLanguages()}
        renderItem={renderLanguage}
        scrollEnabled={true}
      />
    </SafeAreaView>
  );
}
