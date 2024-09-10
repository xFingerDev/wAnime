import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { t } from "i18next";
import { MoeApi, TypeMoe } from "../../api/traceMoeApi";
const IMAGENAME = require("../../assets/icon-4.png");
export default function IndexPage() {
  const [image, setImage] = useState<string | null>(null);
  const [moePosibles, setMoePosibles] = useState<TypeMoe[] | null>(null);
  const [loadingApi, setLoadingApi] = useState<boolean>(false);

  useFocusEffect(() => {
    if (moePosibles) {
      setImage(null);
      setMoePosibles(null);
      setLoadingApi(false);
    }
  });

  const router = useRouter();

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

  const renderMenu = () => (
    <View>
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

      <TouchableOpacity
        className={`px-8 py-4 w-72 item-center justify-center   rounded-lg  shadow-lg flex-row items-center border 
     border-white`}
        disabled={loadingApi}
        onPress={async () => {
          if (image) {
            try {
              setLoadingApi(true);
              setMoePosibles(null);
              const ss = await MoeApi.Get(image);
              setMoePosibles(ss);
            } catch {
              setMoePosibles(null);
              setLoadingApi(false);
            }
          } else {
            pickImage();
          }
        }}
      >
        {loadingApi ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Ionicons name="search-outline" size={24} color="white" />
        )}
        <Text
          className={`font-bold text-lg ml-2 ${
            !image || loadingApi ? "text-white" : "text-white"
          }`}
        >
          {!image
            ? t("pageMenu.selectImage")
            : loadingApi
            ? ""
            : t("pageMenu.search")}
        </Text>
      </TouchableOpacity>
      <StatusBar style="light" />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-0 mt-6">
        <Image
          className=" self-center"
          source={IMAGENAME}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
      </View>
      <View className="flex-1 mt-12">
        <View className="justify-center items-center ">{renderMenu()}</View>
      </View>
    </SafeAreaView>
  );
}
