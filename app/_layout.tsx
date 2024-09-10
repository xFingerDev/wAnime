import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { Stack } from "expo-router";
import "../i18n";
import { NativeWindStyleSheet } from "nativewind";
import { t } from "i18next";

import * as SystemUI from "expo-system-ui";
import { loadGdprAdsConsent } from "../constants/gdprAdsConsent";

NativeWindStyleSheet.setOutput({
  default: "native",
});
SystemUI.setBackgroundColorAsync("black");

export default function Layout() {
  useEffect(() => {
    loadGdprAdsConsent()
      .then(() => {
        console.log("loadGdprAdsConsent completed");
      })
      .catch((err) => {
        console.log("loadGdprAdsConsent err: ", err);
      });
  }, []);

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
