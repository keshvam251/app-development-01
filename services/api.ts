export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  }
};

// Your existing fetchMovies function
export const fetchMovies = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: TMDB_CONFIG.headers
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
};

// NEW: Fetch movie details by ID
export const fetchMovieDetails = async (movieId: number) => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}`,
      {
        method: 'GET',
        headers: TMDB_CONFIG.headers
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

// NEW: Fetch movie credits (cast and crew)
export const fetchMovieCredits = async (movieId: number) => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/credits`,
      {
        method: 'GET',
        headers: TMDB_CONFIG.headers
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie credits: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    throw error;
  }
};

// NEW: Fetch similar movies
export const fetchSimilarMovies = async (movieId: number) => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/similar`,
      {
        method: 'GET',
        headers: TMDB_CONFIG.headers
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch similar movies: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    throw error;
  }
};

// NEW: Fetch trending movies
export const fetchTrendingMovies = async () => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/trending/movie/day`,
      {
        method: 'GET',
        headers: TMDB_CONFIG.headers
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch trending movies: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

// NEW: Fetch now playing movies
export const fetchNowPlaying = async () => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/now_playing`,
      {
        method: 'GET',
        headers: TMDB_CONFIG.headers
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch now playing movies: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    throw error;
  }
};