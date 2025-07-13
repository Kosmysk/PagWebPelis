import React from 'react';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies, title }) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="bg-gray-900 bg-opacity-20 backdrop-blur-sm rounded-lg border border-gray-700 border-opacity-30 p-8">
        <div className="text-center py-12">
          <div className="text-gray-200 text-lg">
            No se encontraron películas
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 bg-opacity-20 backdrop-blur-sm rounded-lg border border-gray-700 border-opacity-30 p-6">
      <div className="w-full">
        {title && (
          <h2 className="text-2xl font-bold text-white mb-6 text-center drop-shadow-lg">
            {title}
          </h2>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieGrid;