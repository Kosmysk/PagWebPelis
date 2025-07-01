import React, { useState, useEffect } from 'react';
import MovieSearch from './MovieSearch';
import MovieGrid from './MovieGrid';
import LoadingSpinner from './LoadingSpinner';
import { tmdbService } from '../services/tmdb.js';

const MovieSearchApp = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);

  // Cargar películas populares al inicio
  useEffect(() => {
    loadPopularMovies();
  }, []);

  const loadPopularMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tmdbService.getPopularMovies();
      setMovies(data.results);
      setTotalPages(data.total_pages);
      setSearchQuery('');
    } catch (err) {
      setError('Error al cargar películas populares');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    
    try {
      const data = await tmdbService.searchMovies(query);
      setMovies(data.results);
      setTotalPages(data.total_pages);
      setSearchQuery(query);
    } catch (err) {
      setError('Error al buscar películas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    loadPopularMovies();
  };

  const loadMoreMovies = async () => {
    if (currentPage >= totalPages) return;
    
    setLoading(true);
    const nextPage = currentPage + 1;
    
    try {
      const data = searchQuery 
        ? await tmdbService.searchMovies(searchQuery, nextPage)
        : await tmdbService.getPopularMovies(nextPage);
      
      setMovies(prev => [...prev, ...data.results]);
      setCurrentPage(nextPage);
    } catch (err) {
      setError('Error al cargar más películas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (searchQuery) {
      return `Resultados para "${searchQuery}"`;
    }
    return 'Películas Populares';
  };

  return (
    <div className="space-y-8">
      <MovieSearch onSearch={handleSearch} onClear={handleClear} />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
          {error}
        </div>
      )}
      
      {loading && movies.length === 0 ? (
        <LoadingSpinner message="Buscando películas..." />
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