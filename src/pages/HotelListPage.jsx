// src/pages/HotelListPage.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';

// La couleur "verte/sauge" sera représentée ici par 'success' (boutons) et 'info' (fonds/accents)
const PRIMARY_COLOR_CLASS = 'success'; 
const ACCENT_COLOR_CLASS = 'info'; 

// ---------------------------------------------------------------------
// COMPOSANTS DE PRÉSENTATION
// ---------------------------------------------------------------------

/**
 * 🏨 Composant de carte d'hôtel pour l'affichage en grille.
 */
function HotelCard({ hotel, getRatingInfo }) {
    const { badgeClass, ratingText } = getRatingInfo(hotel.rating);
    
    // Utilise l'image Base64 si elle est disponible, sinon une couleur unie
    const imageSource = hotel.imageUrl || `https://via.placeholder.com/400x250/66C5CC/FFFFFF?text=${encodeURIComponent(hotel.name?.substring(0, 1) || 'H')}`;

    return (
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-4">
            <div className="card h-100 shadow border-0 hover-shadow-lg">
                
                {/* Image de l'hôtel */}
                <img 
                    src={imageSource} 
                    className="card-img-top" 
                    alt={`Photo de ${hotel.name}`} 
                    style={{ height: '180px', objectFit: 'cover' }}
                />

                <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-truncate">{hotel.name || 'Hôtel sans nom'}</h5>
                    
                    <p className="card-text text-muted small mb-2">
                        <i className={`fas fa-map-marker-alt me-1 text-${ACCENT_COLOR_CLASS}`}></i> 
                        {hotel.city || 'Ville inconnue'}, {hotel.country || 'Pays inconnu'}
                    </p>
                    <p className="card-text d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-semibold text-muted">
                            Chambres: <span className="text-dark fw-normal">{hotel.rooms_count || 0}</span>
                        </span>
                        
                        {/* Affichage de la Note */}
                        <span className={`badge bg-${badgeClass} py-2 px-3 fw-bold`}>
                            <i className="fas fa-star me-1"></i> {ratingText}
                        </span>
                    </p>

                    <div className="mt-auto">
                        <Link to={`/hotels/${hotel.id}`} className={`btn btn-sm btn-outline-${PRIMARY_COLOR_CLASS} w-100 mt-2`}>
                            Voir les détails <i className="fas fa-arrow-right ms-1"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * 🔍 Composant de Barre de Recherche
 */
function SearchBar({ onSearch, value = '' }) {
    const [searchTerm, setSearchTerm] = useState(value);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const handleClear = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <form onSubmit={handleSubmit} className="w-100">
            <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                    <Search size={18} className="text-muted" />
                </span>
                <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Rechercher un hôtel par nom, ville, pays..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button
                        type="button"
                        className="btn btn-outline-secondary border-start-0"
                        onClick={handleClear}
                    >
                        <X size={16} />
                    </button>
                )}
                <button 
                    type="submit" 
                    className={`btn btn-${PRIMARY_COLOR_CLASS}`}
                >
                    Rechercher
                </button>
            </div>
        </form>
    );
}

/**
 * ⚙️ Composant de Filtres
 */
function FiltersPanel({ filters, onFilterChange, onClearFilters }) {
    const cities = useMemo(() => {
        // Extraire les villes uniques des hôtels de manière sécurisée
        if (!filters.allHotels || !Array.isArray(filters.allHotels)) return [];
        const uniqueCities = new Set();
        filters.allHotels.forEach(hotel => {
            if (hotel && hotel.city) uniqueCities.add(hotel.city);
        });
        return Array.from(uniqueCities).sort();
    }, [filters.allHotels]);

    const countries = useMemo(() => {
        // Extraire les pays uniques des hôtels de manière sécurisée
        if (!filters.allHotels || !Array.isArray(filters.allHotels)) return [];
        const uniqueCountries = new Set();
        filters.allHotels.forEach(hotel => {
            if (hotel && hotel.country) uniqueCountries.add(hotel.country);
        });
        return Array.from(uniqueCountries).sort();
    }, [filters.allHotels]);

    const ratingOptions = [
        { value: 0, label: 'Toutes notes' },
        { value: 4.5, label: '4.5+ ⭐' },
        { value: 4.0, label: '4.0+ ⭐' },
        { value: 3.5, label: '3.5+ ⭐' },
        { value: 3.0, label: '3.0+ ⭐' },
    ];

    const sortOptions = [
        { value: 'newest', label: 'Plus récent' },
        { value: 'name_asc', label: 'Nom (A-Z)' },
        { value: 'name_desc', label: 'Nom (Z-A)' },
        { value: 'rating_desc', label: 'Note décroissante' },
        { value: 'rooms_desc', label: 'Chambres décroissantes' },
    ];

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                    <Filter size={18} className="me-2" />
                    Filtres et Tri
                </h6>
                {(filters.selectedCities?.length > 0 || filters.selectedCountries?.length > 0 || filters.minRating > 0) && (
                    <button
                        onClick={onClearFilters}
                        className="btn btn-sm btn-outline-danger"
                    >
                        Réinitialiser
                    </button>
                )}
            </div>
            <div className="card-body">
                <div className="row g-3">
                    {/* Filtre par Ville */}
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Ville</label>
                        <div className="d-flex flex-wrap gap-2">
                            {cities.length > 0 ? cities.map(city => (
                                <button
                                    key={city}
                                    type="button"
                                    onClick={() => {
                                        const newCities = filters.selectedCities?.includes(city)
                                            ? filters.selectedCities.filter(c => c !== city)
                                            : [...(filters.selectedCities || []), city];
                                        onFilterChange({ ...filters, selectedCities: newCities });
                                    }}
                                    className={`btn btn-sm ${filters.selectedCities?.includes(city)
                                        ? `btn-${PRIMARY_COLOR_CLASS}`
                                        : 'btn-outline-secondary'
                                    }`}
                                >
                                    {city}
                                    {filters.selectedCities?.includes(city) && (
                                        <X size={12} className="ms-1" />
                                    )}
                                </button>
                            )) : (
                                <small className="text-muted">Aucune ville disponible</small>
                            )}
                        </div>
                    </div>

                    {/* Filtre par Pays */}
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Pays</label>
                        <div className="d-flex flex-wrap gap-2">
                            {countries.length > 0 ? countries.map(country => (
                                <button
                                    key={country}
                                    type="button"
                                    onClick={() => {
                                        const newCountries = filters.selectedCountries?.includes(country)
                                            ? filters.selectedCountries.filter(c => c !== country)
                                            : [...(filters.selectedCountries || []), country];
                                        onFilterChange({ ...filters, selectedCountries: newCountries });
                                    }}
                                    className={`btn btn-sm ${filters.selectedCountries?.includes(country)
                                        ? `btn-${PRIMARY_COLOR_CLASS}`
                                        : 'btn-outline-secondary'
                                    }`}
                                >
                                    {country}
                                    {filters.selectedCountries?.includes(country) && (
                                        <X size={12} className="ms-1" />
                                    )}
                                </button>
                            )) : (
                                <small className="text-muted">Aucun pays disponible</small>
                            )}
                        </div>
                    </div>

                    {/* Filtre par Note */}
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Note minimale</label>
                        <div className="d-flex flex-wrap gap-2">
                            {ratingOptions.map(option => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => onFilterChange({ ...filters, minRating: option.value })}
                                    className={`btn btn-sm ${filters.minRating === option.value
                                        ? `btn-${PRIMARY_COLOR_CLASS}`
                                        : 'btn-outline-secondary'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tri */}
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Trier par</label>
                        <select
                            className="form-select"
                            value={filters.sortBy || 'newest'}
                            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * 📊 Composant de Statistiques
 */
function StatsDisplay({ total, filtered, averageRating, totalRooms }) {
    return (
        <div className="row mb-4">
            <div className="col-md-3 col-6 mb-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                        <h6 className="text-muted mb-2">Total Hôtels</h6>
                        <h3 className={`text-${PRIMARY_COLOR_CLASS} fw-bold`}>{total || 0}</h3>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                        <h6 className="text-muted mb-2">Hôtels Filtrés</h6>
                        <h3 className="text-info fw-bold">{filtered || 0}</h3>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                        <h6 className="text-muted mb-2">Note Moyenne</h6>
                        <h3 className="text-warning fw-bold">{averageRating || '0.0'} ⭐</h3>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                        <h6 className="text-muted mb-2">Chambres Total</h6>
                        <h3 className="text-success fw-bold">{totalRooms || 0}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------
// PAGE PRINCIPALE
// ---------------------------------------------------------------------

/**
 * Page de liste des hôtels avec bouton pour ouvrir le modal d'ajout.
 */
export default function HotelListPage({ hotels = [], notification, clearNotification }) {
    
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        selectedCities: [],
        selectedCountries: [],
        minRating: 0,
        sortBy: 'newest',
        allHotels: hotels
    });

    // Mettre à jour allHotels quand hotels change
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFilters(prev => ({
            ...prev,
            allHotels: hotels
        }));
    }, [hotels]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    // Fonction pour obtenir la note et le style (légèrement ajustée pour le vert)
    const getRatingInfo = (rating) => {
        const safeRating = parseFloat(rating) || 0; 
        const ratingText = safeRating > 0 ? safeRating.toFixed(1) : 'N/A';
        
        let badgeClass = 'secondary';
        if (safeRating >= 4.5) {
            badgeClass = PRIMARY_COLOR_CLASS; // Vert foncé
        } else if (safeRating >= 3.5) {
            badgeClass = ACCENT_COLOR_CLASS; // Vert clair / Sauge
        } else if (safeRating >= 2.0) {
            badgeClass = 'warning';
        } else if (safeRating > 0) {
            badgeClass = 'danger';
        }

        return { badgeClass, ratingText };
    };

    // Filtrer et trier les hôtels
    const filteredHotels = useMemo(() => {
        // S'assurer que hotels est un tableau
        if (!hotels || !Array.isArray(hotels)) return [];
        
        let result = [...hotels];

        // Recherche textuelle
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(hotel => {
                if (!hotel) return false;
                return (
                    (hotel.name && hotel.name.toLowerCase().includes(term)) ||
                    (hotel.city && hotel.city.toLowerCase().includes(term)) ||
                    (hotel.country && hotel.country.toLowerCase().includes(term)) ||
                    (hotel.description && hotel.description.toLowerCase().includes(term))
                );
            });
        }

        // Filtre par villes
        if (filters.selectedCities?.length > 0) {
            result = result.filter(hotel => 
                hotel && filters.selectedCities.includes(hotel.city)
            );
        }

        // Filtre par pays
        if (filters.selectedCountries?.length > 0) {
            result = result.filter(hotel => 
                hotel && filters.selectedCountries.includes(hotel.country)
            );
        }

        // Filtre par note minimale
        if (filters.minRating > 0) {
            result = result.filter(hotel => 
                hotel && parseFloat(hotel.rating) >= filters.minRating
            );
        }

        // Trier les résultats
        const sortResults = () => {
            switch (filters.sortBy) {
                case 'newest':
                    result.sort((a, b) => {
                        const dateA = a.created_at ? new Date(a.created_at) : new Date(a.id || 0);
                        const dateB = b.created_at ? new Date(b.created_at) : new Date(b.id || 0);
                        return dateB - dateA;
                    });
                    break;
                case 'name_asc':
                    result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                    break;
                case 'name_desc':
                    result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
                    break;
                case 'rating_desc':
                    result.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
                    break;
                case 'rooms_desc':
                    result.sort((a, b) => (parseInt(b.rooms_count) || 0) - (parseInt(a.rooms_count) || 0));
                    break;
                default:
                    // Par défaut, tri par plus récent
                    result.sort((a, b) => {
                        const dateA = a.created_at ? new Date(a.created_at) : new Date(a.id || 0);
                        const dateB = b.created_at ? new Date(b.created_at) : new Date(b.id || 0);
                        return dateB - dateA;
                    });
            }
        };

        sortResults();
        return result;
    }, [hotels, searchTerm, filters]);

    const handleClearFilters = () => {
        setFilters({
            selectedCities: [],
            selectedCountries: [],
            minRating: 0,
            sortBy: 'newest',
            allHotels: hotels
        });
        setSearchTerm('');
    };

    const handleCloseModal = () => setShowModal(false);

    // Calcul des statistiques
    const stats = useMemo(() => {
        if (!hotels || !Array.isArray(hotels)) {
            return {
                total: 0,
                filtered: 0,
                averageRating: '0.0',
                totalRooms: 0
            };
        }

        const total = hotels.length;
        const filtered = filteredHotels.length;
        
        // Calcul de la note moyenne
        let averageRating = '0.0';
        if (total > 0) {
            const sum = hotels.reduce((sum, hotel) => {
                return sum + (parseFloat(hotel.rating) || 0);
            }, 0);
            averageRating = (sum / total).toFixed(1);
        }
        
        // Calcul du total des chambres
        const totalRooms = hotels.reduce((sum, hotel) => {
            return sum + (parseInt(hotel.rooms_count) || 0);
        }, 0);

        return { total, filtered, averageRating, totalRooms };
    }, [hotels, filteredHotels]);

    // Vérification de la structure des données
    if (!hotels) {
        return (
            <div className="container-fluid p-4">
                <div className="alert alert-danger">
                    Erreur: Les données des hôtels ne sont pas disponibles
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4">
            
            {/* EN-TÊTE DE PAGE */}
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <h2 className="fw-bolder text-dark">
                    <i className={`fas fa-hotel me-3 text-${ACCENT_COLOR_CLASS}`}></i> 
                    Catalogue des Hôtels
                </h2>
                <button 
                    className={`btn btn-${PRIMARY_COLOR_CLASS} fw-bold shadow-lg text-uppercase`}
                    onClick={() => setShowModal(true)}
                >
                    <i className="fas fa-plus me-2"></i> Créer un Nouvel Hôtel
                </button>
            </div>

            {/* 🔔 Notification d'ajout/succès */}
            {notification && (
                <div className={`alert alert-${PRIMARY_COLOR_CLASS} alert-dismissible fade show shadow-sm mb-4`} role="alert">
                    <i className="fas fa-check-circle me-2"></i>
                    {notification}
                    <button type="button" className="btn-close" onClick={clearNotification}></button>
                </div>
            )}

            {/* 🔍 BARRE DE RECHERCHE */}
            <div className="mb-4">
                <div className="row align-items-center">
                    <div className="col-md-8 mb-3 mb-md-0">
                        <SearchBar onSearch={handleSearch} value={searchTerm} />
                    </div>
                    <div className="col-md-4 d-flex justify-content-end">
                        <button
                            className={`btn ${showFilters ? `btn-${PRIMARY_COLOR_CLASS}` : 'btn-outline-secondary'} me-2`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={18} className="me-2" />
                            Filtres
                            {(filters.selectedCities?.length > 0 || filters.selectedCountries?.length > 0 || filters.minRating > 0) && (
                                <span className="badge bg-danger ms-2">
                                    {(filters.selectedCities?.length || 0) + 
                                     (filters.selectedCountries?.length || 0) + 
                                     (filters.minRating > 0 ? 1 : 0)}
                                </span>
                            )}
                        </button>
                        {(searchTerm || filters.selectedCities?.length > 0 || filters.selectedCountries?.length > 0 || filters.minRating > 0) && (
                            <button
                                className="btn btn-outline-danger"
                                onClick={handleClearFilters}
                            >
                                <X size={18} className="me-2" />
                                Effacer tout
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ⚙️ PANEL DE FILTRES */}
            {showFilters && (
                <FiltersPanel
                    filters={filters}
                    onFilterChange={setFilters}
                    onClearFilters={handleClearFilters}
                />
            )}

            {/* 📊 STATISTIQUES */}
            <StatsDisplay {...stats} />

            {/* 📸 GRILLE DE CARTES DES HÔTELS */}
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="h5 mb-0 text-muted">
                        {searchTerm || filters.selectedCities?.length > 0 || filters.selectedCountries?.length > 0 || filters.minRating > 0
                            ? `Hôtels trouvés (${filteredHotels.length}/${hotels.length})`
                            : `Aperçu des hotels (${hotels.length})`
                        }
                    </h3>
                    {filteredHotels.length > 0 && (
                        <small className="text-muted">
                            Tri: {{
                                'newest': 'Plus récent',
                                'name_asc': 'Nom A-Z',
                                'name_desc': 'Nom Z-A',
                                'rating_desc': 'Note décroissante',
                                'rooms_desc': 'Chambres décroissantes'
                            }[filters.sortBy] || 'Plus récent'}
                        </small>
                    )}
                </div>
                
                {filteredHotels.length === 0 ? (
                    <div className={`alert alert-${ACCENT_COLOR_CLASS} text-center shadow-sm text-dark`}>
                        <i className="fas fa-search me-2"></i>
                        {searchTerm || filters.selectedCities?.length > 0 || filters.selectedCountries?.length > 0 || filters.minRating > 0
                            ? "Aucun hôtel ne correspond à vos critères de recherche."
                            : "Aucun hôtel n'a été enregistré. Cliquez sur 'Créer un Nouvel Hôtel' pour commencer."
                        }
                    </div>
                ) : (
                    <div className="row">
                        {filteredHotels.map(hotel => (
                            hotel && <HotelCard 
                                key={hotel.id} 
                                hotel={hotel} 
                                getRatingInfo={getRatingInfo} 
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* 🖼️ Modal de Création d'Hôtel - Conservé de la version originale */}
            <div className={`modal fade ${showModal ? 'show d-block' : ''}`} 
                 style={{ backgroundColor: showModal ? 'rgba(0, 0, 0, 0.7)' : 'transparent' }}>
                {showModal && (
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className={`modal-header bg-${ACCENT_COLOR_CLASS} text-white`}>
                                <h5 className="modal-title fw-bold">Enregistrer un Nouvel Hôtel</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body p-4">
                                {/* Formulaire original */}
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Nom de l'Hôtel</label>
                                        <input type="text" className="form-control" required />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold">Ville</label>
                                        <input type="text" className="form-control" required />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold">Pays</label>
                                        <input type="text" className="form-control" required />
                                    </div>
                                </div>
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Photo de l'Hôtel (Fichier)</label>
                                        <input type="file" className="form-control" accept="image/*" />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold">Chambres (Total)</label>
                                        <input type="number" className="form-control" min="1" required />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold">Note (1.0 - 5.0)</label>
                                        <input type="number" className="form-control" step="0.1" min="1.0" max="5.0" required />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Description</label>
                                    <textarea className="form-control" rows="3"></textarea>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-end gap-2 pt-2">
                                    <button type="button" className="btn btn-outline-secondary" onClick={handleCloseModal}>
                                        <i className="fas fa-times me-2"></i> Annuler
                                    </button>
                                    <button type="button" className={`btn btn-${PRIMARY_COLOR_CLASS} fw-bold`}>
                                        <i className="fas fa-save me-2"></i> Enregistrer l'Hôtel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}