import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
  ScrollView,
  SafeAreaView,
  Switch,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import i18n, { getLanguage } from "../../i18n";
import { Ionicons } from "@expo/vector-icons";
import { t } from "i18next";
import { API } from "../../utils/api/API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnimeLang } from "../../constants/AnimeLang";
import { useIsFocused } from "@react-navigation/native";
import { MoeApiInfo } from "../../types/MoeApiInfo";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<MoeApiInfo | null>(null);
  const [showAds, setShowAds] = useState<boolean>(true);
  const [animeLang, setAnimeLang] = useState<AnimeLang>(AnimeLang.romaji);
  const togleAds = async () => {
    setShowAds(!showAds);
    await AsyncStorage.setItem("showAds", `${!showAds}`);
  };

  useFocusEffect(() => {
    (async () => {
      await API.getApiInfo().then((data) => data && setUser(data));
    })();
  });

  useEffect(() => {
    AsyncStorage.getItem("showAds").then(
      (ad) => ad && setShowAds(ad === "true")
    );
  }, [showAds]);

  useEffect(() => {
    AsyncStorage.getItem("animeLang").then(
      (ad) => ad && setAnimeLang(ad as AnimeLang)
    );
  }, [animeLang]);

  const renderAccountInfo = () => (
    <View className="mt-6 px-4 ">
      <Text className="text-2xl md:text-3xl font-bold mt-4 mb-4 text-center text-white">
        {t("home.settings")}
      </Text>
      <View className=" rounded-lg p-6 shadow-lg border border-gray-400">
        <View className="flex-row items-center mb-3">
          <Ionicons name="person-circle-outline" size={24} color="#64B5F6" />
          <Text className="text-white text-lg ml-2">
            {t("account.accountId")}:
          </Text>
          <Text className="text-gray-400 text-lg ml-2">{user?.id}</Text>
        </View>
        <View className="flex-row items-center mb-3">
          <Ionicons name="star-outline" size={24} color="#FFD54F" />
          <Text className="text-white text-lg ml-2">
            {t("account.accountType")}:
          </Text>
          <Text className="text-gray-400 text-lg ml-2">
            {t("account.accountType_Guest")}
          </Text>
        </View>
        <View className="flex-row items-center mb-3">
          <Ionicons name="search-circle-outline" size={24} color="#81C784" />
          <Text className="text-white text-lg ml-2">
            {t("account.search_Quota")}:
          </Text>
          <Text className="text-gray-400 text-lg ml-2">
            {user?.quotaUsed} / {user?.quota}
          </Text>
        </View>
        <View className="flex-row items-center mb-3">
          <Ionicons name="trending-up-outline" size={24} color="#FF8A65" />
          <Text className="text-white text-lg ml-2">
            {t("account.priority")}:{" "}
          </Text>
          <Text className="text-gray-400 text-lg ml-2">
            {" "}
            {t(`account.priority_category.${(user?.priority ?? 0).toString()}`)}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="git-network-outline" size={24} color="#BA68C8" />
          <Text className="text-white text-lg ml-2">
            {t("account.concurrency_limit")}:
          </Text>
          <Text className="text-gray-400 text-lg ml-2">
            {user?.concurrency}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderCreditInfo = () => (
    <View className="flex-row items-center justify-center mb-7">
      <TouchableOpacity
        onPress={() => Linking.openURL("https://trace.moe/about")}
      >
        <Text className="text-white">Powered By: trace.moe</Text>
      </TouchableOpacity>
    </View>
  );

  //#region "Language Settings"
  const renderLanguageSettings = () => (
    <TouchableOpacity
      className="flex-row items-center justify-between px-4 pt-3 rounded-lg mx-4 mb-4 mt-4"
      onPress={() => {
        router.push("/language");
      }}
    >
      <View className="flex-row items-center">
        <Ionicons name="language" size={24} color="white" />
        <Text className="text-white text-lg ml-2">{t("language")}</Text>
      </View>
      <View className="flex-row items-center">
        <Text className="text-gray-400 mr-2">
          {t(`languages.${i18n.resolvedLanguage ?? i18n.language}`)}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="gray" />
      </View>
    </TouchableOpacity>
  );
  //#endregion "Language Settings"

  //#region "Anime Language Settings"
  const renderAnimeLanguageSettings = () => (
    <TouchableOpacity
      className="flex-row items-center justify-between px-4 rounded-lg mx-4 mb-4 "
      onPress={() => {
        router.push({ pathname: "/language", params: { animeLang: "true" } });
      }}
    >
      <View className="flex-row items-center">
        <Ionicons name="leaf-outline" size={24} color="white" />
        <Text className="text-white text-lg ml-2">
          {t("settings.anime_lang")}
        </Text>
      </View>
      <View className="flex-row items-center">
        <Text className="text-gray-400 mr-2">
          {t(`languages.${animeLang}`, animeLang)}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="gray" />
      </View>
    </TouchableOpacity>
  );
  //#endregion "Anime Language Settings"

  //#region "Ads Settings"
  const renderAdsSettings = () => (
    <View className="flex-row items-center justify-between px-4 rounded-lg mx-4 mb-4 ">
      <View className="flex-row items-center">
        <Ionicons name="pulse" size={24} color="white" />
        <Text className="text-white text-lg ml-2">{t("settings.show_ad")}</Text>
      </View>
      <View className="flex-row items-center">
        <Switch
          value={showAds}
          onValueChange={togleAds}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor="#f4f3f4"
        />
      </View>
    </View>
  );
  //#endregion "Ads Settings"

  return (
    <SafeAreaView className="flex-1 bg-black">
      {renderAccountInfo()}
      {renderLanguageSettings()}
      {renderAnimeLanguageSettings()}
      {renderAdsSettings()}

      <View style={{ flex: 1 }} />
      {renderCreditInfo()}
    </SafeAreaView>
  );
}
