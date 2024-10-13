import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { t } from "i18next";
import { API } from "../../utils/api/API";
import { AnimeModel } from "../../types/AnimeModel";
const APP_ICON = require("../../assets/icon-4.png");

export default function IndexPage() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [moePosibles, setMoePosibles] = useState<AnimeModel[] | null>(null);
  const [loadingApi, setLoadingApi] = useState<boolean>(false);

  useFocusEffect(() => {
    if (moePosibles) {
      setImage(null);
      setMoePosibles(null);
      setLoadingApi(false);
    }
  });

  useEffect(() => {
    if (moePosibles) {
      router.push({
        pathname: "/animeSearch",
        params: { moePosibles: JSON.stringify(moePosibles) },
      });
    }
  }, [moePosibles]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
      exif: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const renderButtonImage = () => (
    <TouchableOpacity onPress={pickImage}>
      {image ? (
        <View className="w-72 h-72 rounded-3xl overflow-hidden shadow-2xl mb-8">
          <Image
            className="w-full h-full"
            source={{ uri: image }}
            resizeMode="cover"
          />
        </View>
      ) : (
        <View className="w-72 h-72 rounded-3xl  items-center justify-center mb-8 border border-white">
          <Ionicons name="image-outline" size={64} color="#ffffff" />
          <Text className="text-lg text-gray-400 mt-4">
            {t("pageMenu.selectImage")}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderButtonSelector = () => (
    <TouchableOpacity
      className={`
        px-8 py-4 w-72 
        item-center justify-center 
        rounded-lg shadow-lg flex-row 
        items-center border border-white
        `}
      disabled={loadingApi}
      onPress={async () => {
        if (!image) {
          return pickImage();
        }

        setLoadingApi(true);
        await API.getAnimes(image)
          .then((animes) => setMoePosibles(animes))
          .catch(() => {
            setMoePosibles(null);
            setLoadingApi(false);
            ToastAndroid.show(t("pageMenu.error.api"), ToastAndroid.SHORT);
          });
      }}
    >
      <View className="flex-row items-center">
        {loadingApi ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <>
            <Ionicons name="search-outline" size={24} color="white" />
            <Text className={`font-bold text-lg ml-2 text-white`}>
              {t(!image ? "pageMenu.selectImage" : "pageMenu.search")}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderMenu = () => (
    <View className="flex-1 justify-center items-center">
      {renderButtonImage()}
      {renderButtonSelector()}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/*<View className="mt-6">
        <Image
          className="self-center h-44"
          source={APP_ICON}
          resizeMode="contain"
        />
      </View>*/}
      {renderMenu()}
    </SafeAreaView>
  );
}
