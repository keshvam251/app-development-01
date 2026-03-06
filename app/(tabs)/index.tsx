import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import MovieCard from "@/components/Moviecard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import useFetch from "@/services/useFetch";

// Import types from your interfaces

const Index = () => {
  const router = useRouter();

  // Remove type parameters if useFetch doesn't support them
  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  // Deduplicate trending movies with proper typing
  const uniqueTrendingMovies = useMemo(() => {
    if (!trendingMovies) return [];

    // Type assertion to let TypeScript know the shape
    const movies = trendingMovies as TrendingMovie[];

    // Use Map to remove duplicates by movie_id
    const uniqueMap = new Map<number, TrendingMovie>();

    movies.forEach((movie: TrendingMovie) => {
      if (!uniqueMap.has(movie.movie_id)) {
        uniqueMap.set(movie.movie_id, movie);
      }
    });

    return Array.from(uniqueMap.values());
  }, [trendingMovies]);

  // Loading state
  if (moviesLoading || trendingLoading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#AB8BFF" />
      </View>
    );
  }

  // Error state
  if (moviesError || trendingError) {
    return (
      <View className="flex-1 bg-primary justify-center items-center px-5">
        <Text className="text-white text-lg text-center mb-4">
          Oops! Something went wrong
        </Text>
        <Text className="text-gray-400 text-center">
          {moviesError?.message || trendingError?.message}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        <View className="flex-1 mt-5">
          {/* Search Bar */}
          <SearchBar
            onPress={() => router.push("/search")}
            placeholder="Search for a movie"
          />

          {/* Trending Movies Section - Only show if there are unique movies */}
          {uniqueTrendingMovies.length > 0 && (
            <View className="mt-10">
              <Text className="text-lg text-white font-bold mb-3">
                Trending Movies
              </Text>

              <FlatList
                horizontal
                data={uniqueTrendingMovies}
                showsHorizontalScrollIndicator={false}
                className="mb-4"
                contentContainerStyle={{ gap: 16 }}
                renderItem={({ item, index }) => (
                  <TrendingCard movie={item} index={index} />
                )}
                keyExtractor={(item) => `trending-${item.movie_id}`}
              />
            </View>
          )}

          {/* Latest Movies Section */}
          {movies && (movies as Movie[]).length > 0 && (
            <View className="mt-5">
              <Text className="text-lg text-white font-bold mb-3">
                Latest Movies
              </Text>

              <FlatList
                data={movies as Movie[]}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => `movie-${item.id}`}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
                className="mt-2"
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Empty State - if no movies at all */}
          {(!movies || (movies as Movie[]).length === 0) &&
            uniqueTrendingMovies.length === 0 && (
              <View className="flex-1 justify-center items-center mt-20">
                <Text className="text-gray-400 text-center">
                  No movies available at the moment.
                </Text>
              </View>
            )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
