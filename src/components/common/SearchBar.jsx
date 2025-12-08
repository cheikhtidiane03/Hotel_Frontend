import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ 
  onSearch, 
  onClear, 
  placeholder = "Rechercher...", 
  value: externalValue = '',
  autoSearch = false,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState(externalValue || '');
  const [isFocused, setIsFocused] = useState(false);

  // Synchroniser avec la valeur externe si fournie
  useEffect(() => {
    if (externalValue !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchTerm(externalValue);
    }
  }, [externalValue]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (autoSearch && onSearch) {
      onSearch(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onClear) {
      onClear();
    }
    if (autoSearch && onSearch) {
      onSearch('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative w-full ${className}`}
    >
      <div className={`relative flex items-center transition-all duration-200 ${
        isFocused ? 'ring-2 ring-red-500 ring-opacity-50' : ''
      }`}>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 text-sm"
          aria-label="Rechercher"
        />
        
        <div className="absolute left-3 flex items-center">
          <Search 
            size={18} 
            className={`transition-colors duration-150 ${
              isFocused ? 'text-red-500' : 'text-gray-400'
            }`}
          />
        </div>

        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-gray-400 hover:text-red-500 transition duration-150"
            aria-label="Effacer la recherche"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {!autoSearch && (
        <button 
          type="submit" 
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-150 text-sm w-full md:w-auto"
        >
          Rechercher
        </button>
      )}
    </form>
  );
};

export default SearchBar;