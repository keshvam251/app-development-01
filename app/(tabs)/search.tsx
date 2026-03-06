import Moviecard from "@/components/Moviecard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: movies,
    loading: movieLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: debouncedQuery }), [debouncedQuery]);

  useEffect(() => {
    if (debouncedQuery && movies?.length > 0) {
      updateSearchCount(debouncedQuery, movies[0]);
    }
  }, [debouncedQuery, movies]);

  return (
    <View className="flex-1 bg-primary">
      {/* Background */}
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={movies || []}
        renderItem={({ item }) => <Moviecard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        className="px-5"
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 120 }}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        ListHeaderComponent={
          <>
            {/* Logo */}
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            {/* Search Bar */}
            <View className="my-5 flex-row items-center justify-center gap-2">
              <SearchBar
                placeholder="Search the movies..."
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />

              {/* Clear Button */}
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  className="bg-red-500 px-3 py-2 rounded-full"
                >
                  <Text className="text-white text-xs">Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Loading */}
            {movieLoading && (
              <ActivityIndicator
                size="large"
                color="#6366f1"
                className="my-3"
              />
            )}

            {/* Error */}
            {moviesError && (
              <Text className="text-red-500 text-center">
                Something went wrong...
              </Text>
            )}

            {/* Results */}
            {!movieLoading &&
              !moviesError &&
              debouncedQuery.trim() &&
              movies?.length > 0 && (
                <Text className="text-white font-bold text-lg mb-2">
                  Search Results for{" "}
                  <Text className="text-purple-400">{debouncedQuery}</Text>
                </Text>
              )}

            {/* No Results */}
            {!movieLoading && debouncedQuery && movies?.length === 0 && (
              <Text className="text-gray-400 text-center">No movies found</Text>
            )}
          </>
        }
      />
    </View>
  );
};

export default Search;
