// src/components/react/TrailerModal.jsx
import React, { useState, useEffect } from 'react';

// Asegúrate de reemplazar 'TU_API_TOKEN_DE_AUTORIZACION' con tu token real
// que se encuentra en el header 'Authorization: Bearer ...' de tu curl.
const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MDY0MjM5MmRhMzYwMmUzNzAyODY3MjZkYzU3NmJkMCIsIm5iZiI6MTc1MTM0Mzg3NS44NzksInN1YiI6IjY4NjM2MzAzZjg1ODdhM2JlNGU2NDg3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xTrmxLm8jmyR4fxSJMKd9y0yxao-5hXU8CDm-Wvoez8';

const fetchTrailer = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TMDB_API_KEY}`,
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al cargar los videos');
    }

    const data = await response.json();
    
    // Buscar un video con el tipo 'Trailer' y el sitio 'YouTube'
    const trailer = data.results.find(video => 
      video.site === 'YouTube' && video.type === 'Trailer'
    );
    
    return trailer ? trailer.key : null;

  } catch (error) {
    console.error("Error fetching trailer:", error);
    return null;
  }
};

const TrailerModal = ({ movieId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = async () => {
    setIsOpen(true);
    if (!trailerKey) {
      setIsLoading(true);
      const key = await fetchTrailer(movieId);
      setTrailerKey(key);
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // El botón para abrir el modal
  return (
    <div>
      <button 
        onClick={openModal} 
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Ver Tráiler
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal} // Cierra el modal al hacer clic fuera del contenido
        >
          {/* Modal Content */}
          <div 
            className="bg-black rounded-lg shadow-xl w-full max-w-4xl relative"
            onClick={(e) => e.stopPropagation()} // Previene que el clic dentro del modal lo cierre
          >
            
            {/* Close Button */}
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 text-white text-3xl font-bold z-10 hover:text-gray-300"
              aria-label="Cerrar"
            >
              &times;
            </button>

            {/* Video Player */}
            <div className="relative pt-[56.25%] overflow-hidden rounded-lg"> {/* 16:9 Aspect Ratio (56.25%) */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-xl">
                  Cargando tráiler...
                </div>
              )}

              {!isLoading && trailerKey ? (
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                !isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
                    Tráiler no disponible.
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrailerModal;