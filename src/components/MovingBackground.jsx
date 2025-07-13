import React, { useState, useEffect } from 'react';
import { tmdbService } from '../services/tmdb.js';

const MovingBackground = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        // Obtener películas de diferentes fuentes para más variedad
        const popularPage1 = await tmdbService.getPopularMovies(1);
        const popularPage2 = await tmdbService.getPopularMovies(2);
        const popularPage3 = await tmdbService.getPopularMovies(3);
        
        // Obtener películas de diferentes géneros para más variedad
        const actionMovies = await tmdbService.getMoviesByGenre(28, 1); // Acción
        const dramaMovies = await tmdbService.getMoviesByGenre(18, 1); // Drama
        const comedyMovies = await tmdbService.getMoviesByGenre(35, 1); // Comedia
        const sciFiMovies = await tmdbService.getMoviesByGenre(878, 1); // Ciencia ficción
        
        const allMovies = [
          ...popularPage1.results,
          ...popularPage2.results,
          ...popularPage3.results,
          ...actionMovies.results,
          ...dramaMovies.results,
          ...comedyMovies.results,
          ...sciFiMovies.results
        ];
        
        // Filtramos películas con poster válido, eliminamos duplicados y mezclamos
        const validMovies = allMovies
          .filter(movie => movie.poster_path)
          .filter((movie, index, self) => 
            index === self.findIndex(m => m.id === movie.id)
          )
          .sort(() => Math.random() - 0.5);
        
        setMovies(validMovies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching popular movies:', error);
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  if (loading || movies.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-black -z-10">
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
    );
  }

  // Crear múltiples filas de películas
  const createMovieRows = () => {
    const rows = [];
    const moviesPerRow = 6; // Reducido para dar más espacio
    
    for (let i = 0; i < 5; i++) { // Reducido a 5 filas
      const startIndex = (i * moviesPerRow) % movies.length;
      const rowMovies = [];
      
      for (let j = 0; j < moviesPerRow * 2; j++) {
        const movieIndex = (startIndex + j) % movies.length;
        rowMovies.push(movies[movieIndex]);
      }
      
      rows.push(
        <div
          key={i}
          className={`flex animate-scroll-${i % 2 === 0 ? 'left' : 'right'} absolute`}
          style={{
            top: `${i * 20}%`, // Aumentado de 16% a 20% para más espacio vertical
            width: '200%',
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${70 + i * 15}s` // Animación más lenta para mejor visualización
          }}
        >
          {rowMovies.map((movie, index) => (
            <div
              key={`${movie.id}-${index}`}
              className="flex-shrink-0 w-36 h-54 mx-4 relative overflow-hidden rounded-lg shadow-lg opacity-60 hover:opacity-80 transition-opacity duration-300"
            >
              <img
                src={tmdbService.getImageUrl(movie.poster_path, 'w342')}
                alt={movie.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          ))}
        </div>
      );
    }
    
    return rows;
  };

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* Fondo base */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-black"></div>
      
      {/* Contenedor de películas en movimiento */}
      <div className="absolute inset-0">
        {createMovieRows()}
      </div>
      
      {/* Overlay oscuro para mejorar la legibilidad */}
      <div className="absolute inset-0 bg-black opacity-70"></div>
      
      {/* Gradiente adicional para el contenido */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80"></div>
    </div>
  );
};

export default MovingBackground;