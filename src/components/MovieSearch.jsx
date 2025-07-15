// src/components/MovieSearch.jsx
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const MovieSearch = ({
  onSearch,
  onClear,
  genres,
  selectedGenre,
  onGenreChange,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onGenreChange('');
    onClear();
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          {/* Filtro de Género */}
          <select
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
            className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-200 w-full sm:w-auto"
          >
            <option value="">Todos los géneros</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          {/* Input de búsqueda */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar películas..."
              className="w-full px-4 py-3 pl-12 pr-12 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Botón de búsqueda */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5" />
          Buscar Películas
        </button>
      </form>
    </div>
  );
};

export default MovieSearch;
