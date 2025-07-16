import axios from 'axios';

const API_KEY = import.meta.env.PUBLIC_TMDB_API_KEY;
const BASE_URL = import.meta.env.PUBLIC_TMDB_BASE_URL;

// Configurar axios con la API key
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'es-ES', // Español
  },
});

export const tmdbService = {
  // Buscar películas
  searchMovies: async (query, page = 1) => {
    try {
      const response = await tmdbApi.get('/search/movie', {
        params: {
          query,
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Obtener películas populares
  getPopularMovies: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/popular', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  // Obtener detalles de una película
  getMovieDetails: async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}`, {
        params: {
          append_to_response: 'credits,videos,similar',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  // Obtener géneros
  getGenres: async () => {
    try {
      const response = await tmdbApi.get('/genre/movie/list');
      return response.data.genres;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  },

  // Construir URL de imagen
  getImageUrl: (path, size = 'w500') => {
    if (!path) return '/placeholder-movie.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },

  // Obtener películas por género
  getMoviesByGenre: async (genreId, page = 1) => {
    try {
      const response = await tmdbApi.get('/discover/movie', {
        params: {
          with_genres: genreId,
          page,
          sort_by: 'popularity.desc',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      throw error;
    }
  },
};
export async function getMovieReviews(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/reviews?language=en-US&page=1`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MDY0MjM5MmRhMzYwMmUzNzAyODY3MjZkYzU3NmJkMCIsIm5iZiI6MTc1MTM0Mzg3NS44NzksInN1YiI6IjY4NjM2MzAzZjg1ODdhM2JlNGU2NDg3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xTrmxLm8jmyR4fxSJMKd9y0yxao-5hXU8CDm-Wvoez8'
    }
  };
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching movie reviews:', error);
    return [];
  }
}