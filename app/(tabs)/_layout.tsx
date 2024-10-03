import React from "react";
import { router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { t } from "i18next";
import { Text } from "react-native";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

const screenOptions: BottomTabNavigationOptions = {
  tabBarStyle: { backgroundColor: "#000", borderTopWidth: 0 },
  tabBarActiveTintColor: "#ffffff",
  tabBarInactiveTintColor: "#ffffff",
  headerStyle: { backgroundColor: "black" },
  headerTintColor: "white",
  headerShown: false,

  headerTitle(props) {
    return (
      <Text className="text-white text-2xl font-bold">{t(props.children)}</Text>
    );
  },
};

const TabScreenSelector = (dto: {
  pathName: string;
  title: string;
  icon: string;
}) => (
  <Tabs.Screen
    key={dto.pathName}
    name={dto.pathName}
    options={{
      title: t(`home.${dto.title}`),
      tabBarIcon: ({ color, size, focused }) => (
        <Ionicons
          name={(focused ? `${dto.icon}` : `${dto.icon}-outline`) as any}
          size={size}
          color={color}
        />
      ),
    }}
  />
);

export default function NavBar() {
  return (
    <Tabs screenOptions={screenOptions}>
      {TabScreenSelector({
        pathName: "index",
        title: "home",
        icon: "home",
      })}
      {TabScreenSelector({
        pathName: "history",
        title: "history",
        icon: "time",
      })}
      {TabScreenSelector({
        pathName: "settings",
        title: "settings",
        icon: "settings",
      })}
    </Tabs>
  );
}
