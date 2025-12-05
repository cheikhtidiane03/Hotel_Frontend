// src/pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SearchPage() {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    date: 'all',
    status: 'all'
  });

  // Extraire le terme de recherche de l'URL
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('q') || '';

  // Simuler la recherche
  useEffect(() => {
    if (searchTerm) {
      // Ici, vous feriez un appel API réel
      const mockResults = [
        { id: 1, title: 'Document 1', category: 'documents' },
        { id: 2, title: 'Utilisateur 1', category: 'users' },
        // ... autres résultats
      ];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchResults(mockResults.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
  }, [searchTerm]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mt-4">
      <h2>Résultats de recherche pour : "{searchTerm}"</h2>
      
      {/* Filtres */}
      <div className="row mb-4">
        <div className="col-md-4">
          <select 
            className="form-select" 
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="all">Toutes les catégories</option>
            <option value="documents">Documents</option>
            <option value="users">Utilisateurs</option>
            <option value="tasks">Tâches</option>
          </select>
        </div>
        <div className="col-md-4">
          <select 
            className="form-select" 
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          >
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
        </div>
      </div>

      {/* Résultats */}
      <div className="list-group">
        {searchResults.map(item => (
          <a href="#" className="list-group-item list-group-item-action" key={item.id}>
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
}