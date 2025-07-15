// src/components/MovieSearchApp.jsx
import React, { useState, useEffect } from 'react';
import MovieSearch from './MovieSearch';
import MovieGrid from './MovieGrid';
import LoadingSpinner from './LoadingSpinner';
import { tmdbService } from '../services/tmdb.js';

const MovieSearchApp = () => {
  const {
    getGenres,
    getMoviesByGenre,
    searchMovies,
    getPopularMovies,
  } = tmdbService;

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);

  // Cargar géneros y películas populares al inicio
  useEffect(() => {
    const init = async () => {
      try {
        const list = await getGenres();
        setGenres(list);
      } catch (err) {
        console.error('Error fetching genres', err);
      }
      loadFilteredMovies('', '', 1);
    };
    init();
  }, []);

  // Función genérica para filtrar/search/discover
  const loadFilteredMovies = async (query, genreId, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (genreId) {
        data = await getMoviesByGenre(genreId, page);
      } else if (query) {
        data = await searchMovies(query, page);
      } else {
        data = await getPopularMovies(page);
      }
      setMovies(data.results);
      setTotalPages(data.total_pages);
      setSearchQuery(query);
      setCurrentPage(page);
      setSelectedGenre(genreId);
    } catch (err) {
      setError('Error al filtrar películas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    loadFilteredMovies(query.trim(), selectedGenre, 1);
  };

  const handleClear = () => {
    loadFilteredMovies('', '', 1);
  };

  const loadMoreMovies = () => {
    if (currentPage >= totalPages) return;
    loadFilteredMovies(searchQuery, selectedGenre, currentPage + 1);
  };

  const getTitle = () => {
    if (searchQuery) {
      return `Resultados para "${searchQuery}"`;
    }
    if (selectedGenre) {
      const genreName = genres.find(g => g.id === Number(selectedGenre))?.name;
      return `Género: ${genreName}`;
    }
    return 'Películas Populares';
  };

  return (
    <div className="space-y-8">
      <MovieSearch
        onSearch={handleSearch}
        onClear={handleClear}
        genres={genres}
        selectedGenre={selectedGenre}
        onGenreChange={id => loadFilteredMovies(searchQuery, id, 1)}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
          {error}
        </div>
      )}

      {loading && movies.length === 0 ? (
        <LoadingSpinner message="Cargando películas..." />
      ) : (
        <>
          <MovieGrid movies={movies} title={getTitle()} />

          {currentPage < totalPages && (
            <div className="text-center">
              <button
                onClick={loadMoreMovies}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Cargando...
                  </>
                ) : (
                  'Cargar Más Películas'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MovieSearchApp;
