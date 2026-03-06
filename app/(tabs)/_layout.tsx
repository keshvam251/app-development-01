import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Tabs } from "expo-router";
import React from "react";
import { Image, ImageBackground, Text, View } from "react-native";

const Tabicon = ({ focused, icon, title }: any) => {
  if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        resizeMode="stretch"
        className="flex-row items-center justify-center
      px-4 py-2
      min-w-[110px] h-14
      rounded-full overflow-hidden
      gap-2"
      >
        <Image
          source={icon}
          tintColor="#151312"
          resizeMode="contain"
          className="w-5 h-5"
        />

        <Text className="text-[13px] font-semibold text-[#151312]">
          {title}
        </Text>
      </ImageBackground>
    );
  }

  return (
    <View className="size-full justify-center items-center mt-4 rounded-full">
      <Image
        source={icon}
        tintColor="#A8B5DB"
        resizeMode="contain"
        className="size-5"
      />
    </View>
  );
};

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#0f0f0f",
          height: 65,
          position: "absolute",
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Tabicon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Tabicon focused={focused} icon={icons.search} title="Search" />
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved ",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Tabicon focused={focused} icon={icons.save} title="Saved" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profiles",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Tabicon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
       <Tabs.Screen
        name="MovieInfo"
        options={{
          title: "[id]",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Tabicon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
