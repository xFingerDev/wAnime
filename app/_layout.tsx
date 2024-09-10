import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Button,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Link, Stack } from "expo-router";
import "../i18n";
import { NativeWindStyleSheet } from "nativewind";
import { t } from "i18next";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import * as SystemUI from "expo-system-ui";

NativeWindStyleSheet.setOutput({
  default: "native",
});
SystemUI.setBackgroundColorAsync("black");

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerBackTitle: t("buttons.back"),
        headerStyle: { backgroundColor: "black" },
        headerTintColor: "white",
        contentStyle: { backgroundColor: "black" },

        headerTitle(props) {
          return (
            <Text className="text-white text-2xl font-bold">
              {t(props.children)}
            </Text>
          );
        },
      }}
    >
      <Stack.Screen
        name="animeSearch"
        options={{ headerShown: true, title: "search_menu" }}
      />
      <Stack.Screen
        name="(settings)/language"
        options={{ headerShown: true, title: "language_menu" }}
      />
    </Stack>
  );
}
