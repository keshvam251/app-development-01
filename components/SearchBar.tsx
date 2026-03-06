import { icons } from "@/constants/icons";
import React from "react";
import { Image, Pressable, TextInput, View } from "react-native";

interface Props {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
}

const SearchBar = ({ placeholder, value, onChangeText, onPress }: Props) => {
  return (
    <View
      className="
        flex-row items-center
        bg-dark-200
        rounded-full
        px-4
        h-12
        w-[90%]
      "
    >
      {/* Search Icon */}
      <Pressable onPress={onPress}>
        <Image
          source={icons.search}
          className="w-5 h-5 mr-2"
          tintColor="#9CA4AB"
        />
      </Pressable>

      {/* Text Input */}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#9CA4AB"
        className="flex-1 text-white"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default SearchBar;
