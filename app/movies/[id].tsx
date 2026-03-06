// app/movie/[id].tsx
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { images } from "@/constants/images";
import {
  fetchMovieCredits,
  fetchMovieDetails,
  fetchSimilarMovies,
} from "@/services/api";
import useFetch from "@/services/useFetch";

const MovieInfo = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<"about" | "cast" | "similar">(
    "about",
  );

  // Fetch movie details
  const {
    data: movie,
    loading: movieLoading,
    error: movieError,
  } = useFetch(() => fetchMovieDetails(Number(id)));

  // Fetch movie credits
  const { data: credits, loading: creditsLoading } = useFetch(() =>
    fetchMovieCredits(Number(id)),
  );

  // Fetch similar movies
  const { data: similarMovies, loading: similarLoading } = useFetch(() =>
    fetchSimilarMovies(Number(id)),
  );

  // Format runtime
  const formatRuntime = (minutes: number) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Get director from crew
  const getDirector = () => {
    if (!credits?.crew) return "N/A";
    const director = credits.crew.find(
      (person: any) => person.job === "Director",
    );
    return director?.name || "N/A";
  };

  // Loading state
  if (movieLoading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#AB8BFF" />
        <Text className="text-white mt-4">Loading movie details...</Text>
      </View>
    );
  }

  // Error state
  if (movieError || !movie) {
    return (
      <View className="flex-1 bg-primary justify-center items-center px-5">
        <Ionicons name="alert-circle-outline" size={60} color="#AB8BFF" />
        <Text className="text-white text-lg text-center mt-4 mb-2">
          Failed to load movie details
        </Text>
        <Text className="text-gray-400 text-center">
          {movieError?.message || "Movie not found"}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-accent px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Backdrop Image */}
        <View className="relative h-[300px] w-full">
          <Image
            source={
              movie.backdrop_path
                ? {
                    uri: `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`,
                  }
                : images.bg
            }
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* Gradient Overlay */}
          <LinearGradient
            colors={["transparent", "rgba(18, 18, 18, 0.8)", "#121212"]}
            className="absolute bottom-0 left-0 right-0 h-32"
          />

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-12 left-4 w-10 h-10 bg-black/50 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Movie Poster and Title */}
        <View className="px-5 -mt-20 flex-row items-end">
          <Image
            source={
              movie.poster_path
                ? { uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }
                : images.bg
            }
            className="w-28 h-40 rounded-xl border-2 border-white"
            resizeMode="cover"
          />

          <View className="flex-1 ml-4">
            <Text className="text-white text-2xl font-bold" numberOfLines={2}>
              {movie.title}
            </Text>

            <View className="flex-row items-center mt-2">
              <FontAwesome name="star" size={16} color="#FFD700" />
              <Text className="text-white ml-1">
                {movie.vote_average?.toFixed(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Movie Info */}
        <View className="px-5 mt-4">
          <View className="flex-row flex-wrap gap-2">
            {movie.release_date && (
              <View className="bg-gray-800 px-3 py-1 rounded-full">
                <Text className="text-gray-300">
                  {new Date(movie.release_date).getFullYear()}
                </Text>
              </View>
            )}

            {movie.runtime > 0 && (
              <View className="bg-gray-800 px-3 py-1 rounded-full">
                <Text className="text-gray-300">
                  {formatRuntime(movie.runtime)}
                </Text>
              </View>
            )}
          </View>

          {/* Overview */}
          <Text className="text-white text-lg font-semibold mt-4 mb-2">
            Overview
          </Text>
          <Text className="text-gray-300 leading-6">
            {movie.overview || "No overview available."}
          </Text>

          {/* Director */}
          <View className="mt-4 flex-row">
            <Text className="text-gray-400 w-24">Director</Text>
            <Text className="text-white flex-1">{getDirector()}</Text>
          </View>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <View className="mt-4">
              <Text className="text-gray-400 mb-2">Genres</Text>
              <View className="flex-row flex-wrap gap-2">
                {movie.genres.map(
                  (genre: {
                    id: Key | null | undefined;
                    name:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<any>
                        >
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactPortal
                          | ReactElement<
                              unknown,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                  }) => (
                    <View
                      key={genre.id}
                      className="bg-accent/20 px-3 py-1 rounded-full"
                    >
                      <Text className="text-accent">{genre.name}</Text>
                    </View>
                  ),
                )}
              </View>
            </View>
          )}

          {/* Cast Section */}
          {credits?.cast && credits.cast.length > 0 && (
            <View className="mt-6">
              <Text className="text-white text-lg font-semibold mb-3">
                Cast
              </Text>
              <FlatList
                horizontal
                data={credits.cast.slice(0, 10)}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View className="mr-4 items-center w-20">
                    <Image
                      source={
                        item.profile_path
                          ? {
                              uri: `https://image.tmdb.org/t/p/w185${item.profile_path}`,
                            }
                          : images.bg
                      }
                      className="w-16 h-16 rounded-full bg-gray-700"
                    />
                    <Text
                      className="text-white text-xs text-center mt-2"
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>
                    <Text
                      className="text-gray-400 text-xs text-center"
                      numberOfLines={1}
                    >
                      {item.character}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}

          {/* Similar Movies */}
          {similarMovies && similarMovies.length > 0 && (
            <View className="mt-6 mb-10">
              <Text className="text-white text-lg font-semibold mb-3">
                Similar Movies
              </Text>
              <FlatList
                horizontal
                data={similarMovies?.slice(0, 10) || []}
                keyExtractor={(item) => item.id?.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => router.push(`/movies/${item.id}`)}
                    className="mr-4 w-24"
                  >
                    <Image
                      source={
                        item.poster_path
                          ? {
                              uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
                            }
                          : images.bg
                      }
                      className="w-24 h-36 rounded-lg"
                      resizeMode="cover"
                    />
                    <Text className="text-white text-xs mt-1" numberOfLines={2}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default MovieInfo;
