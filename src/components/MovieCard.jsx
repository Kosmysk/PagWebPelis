import React, { useEffect } from 'react';
import { Star, Calendar } from 'lucide-react';
import { tmdbService } from '../services/tmdb.js';

import { navigate } from 'astro/virtual-modules/transitions-router.js';

const MovieCard = ({ movie }) => {
  const imageUrl = tmdbService.getImageUrl(movie.poster_path);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? parseFloat(movie.vote_average).toFixed(1) : 'N/A';

  const irPelicula = (url) => {
    navigate(url)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer" onClick={() => {
      irPelicula(`/movie/${movie.id}`)
    }}>
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={movie.title}
          className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450/e5e7eb/6b7280?text=Sin+Imagen';
          }}
        />
        <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold">{rating}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 leading-tight">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-3 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{releaseYear}</span>
        </div>
        
        <p className="text-gray-700 text-sm line-clamp-3 mb-4 leading-relaxed">
          {movie.overview || 'Sin descripción disponible.'}
        </p>
        
{/*         <a
          href={`/movie/${movie.id}`}
          className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Ver Detalles
        </a> */}
      </div>
    </div>
  );
};

export default MovieCard;