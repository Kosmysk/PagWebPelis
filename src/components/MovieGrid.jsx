import React from 'react';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies, title }) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">
          No se encontraron películas
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {title}
        </h2>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;