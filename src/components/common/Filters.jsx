import React from 'react';
import { Filter } from 'lucide-react';

const Filters = ({ 
  onFilterChange, 
  filters,
  className = "" 
}) => {
  const cities = ["Dakar", "Thiès", "Saint-Louis", "Kaolack", "Ziguinchor"];
  const ratings = [5, 4, 3, 2, 1];

  const handleCityChange = (city) => {
    const newCities = filters.cities.includes(city)
      ? filters.cities.filter(c => c !== city)
      : [...filters.cities, city];
    onFilterChange({ ...filters, cities: newCities });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({ ...filters, minRating: rating });
  };

  const handleSortChange = (sortBy) => {
    onFilterChange({ ...filters, sortBy });
  };

  const clearFilters = () => {
    onFilterChange({
      cities: [],
      minRating: 0,
      sortBy: 'name'
    });
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filtres</h3>
        </div>
        {(filters.cities.length > 0 || filters.minRating > 0) && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-500 hover:text-red-600 transition duration-150"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Filtre par ville */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Villes</h4>
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => handleCityChange(city)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-150 ${
                filters.cities.includes(city)
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Filtre par note minimale */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Note minimale</h4>
        <div className="flex flex-wrap gap-2">
          {ratings.map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-150 ${
                filters.minRating === rating
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {rating} ⭐
            </button>
          ))}
          <button
            onClick={() => handleRatingChange(0)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-150 ${
              filters.minRating === 0
                ? 'bg-red-50 text-red-600 border-red-200'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            Toutes
          </button>
        </div>
      </div>

      {/* Tri */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Trier par</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'name', label: 'Nom (A-Z)' },
            { value: 'rating', label: 'Note (décroissant)' },
            { value: 'rooms', label: 'Chambres (décroissant)' },
            { value: 'city', label: 'Ville' }
          ].map((sortOption) => (
            <button
              key={sortOption.value}
              onClick={() => handleSortChange(sortOption.value)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-150 ${
                filters.sortBy === sortOption.value
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {sortOption.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;