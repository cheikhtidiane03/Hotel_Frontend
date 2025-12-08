// src/pages/HotelListPage.jsx

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';

// La couleur "verte/sauge" sera représentée ici par 'success' (boutons) et 'info' (fonds/accents)
const PRIMARY_COLOR_CLASS = 'success'; 
const ACCENT_COLOR_CLASS = 'info'; 

// ---------------------------------------------------------------------
// NOUVEAU: Composant pour gérer la sélection de fichier image
// ---------------------------------------------------------------------

/**
 * Composant pour lire un fichier image et le convertir en Base64.
 * @param {function(string | null): void} onImageEncoded - Callback avec l'URL Base64 ou null.
 */
function ImageFileUploader({ onImageEncoded }) {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Le résultat est la chaîne Base64 de l'image
                onImageEncoded(reader.result);
            };
            reader.onerror = () => {
                console.error("Erreur lors de la lecture du fichier.");
                onImageEncoded(null);
            };
            reader.readAsDataURL(file);
        } else {
            onImageEncoded(null);
        }
    };

    return (
        <input 
            type="file" 
            className="form-control" 
            accept="image/*" 
            onChange={handleFileChange} 
        />
    );
}

// ---------------------------------------------------------------------
// COMPOSANTS DE PRÉSENTATION
// ---------------------------------------------------------------------

/**
 * 🏨 Composant de carte d'hôtel pour l'affichage en grille.
 */
function HotelCard({ hotel, getRatingInfo }) {
    const { badgeClass, ratingText } = getRatingInfo(hotel.rating);
    
    // Utilise l'image Base64 si elle est disponible, sinon une couleur unie
    const imageSource = hotel.imageUrl || `https://via.placeholder.com/400x250/66C5CC/FFFFFF?text=${hotel.name.substring(0, 1)}`;

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
                    <h5 className="card-title fw-bold text-truncate">{hotel.name}</h5>
                    
                    <p className="card-text text-muted small mb-2">
                        <i className={`fas fa-map-marker-alt me-1 text-${ACCENT_COLOR_CLASS}`}></i> 
                        {hotel.city}, {hotel.country}
                    </p>
                    <p className="card-text d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-semibold text-muted">
                            Chambres: <span className="text-dark fw-normal">{hotel.rooms_count}</span>
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
        // Extraire les villes uniques des hôtels
        return Array.from(new Set(filters.allHotels.map(h => h.city))).sort();
    }, [filters.allHotels]);

    const countries = useMemo(() => {
        // Extraire les pays uniques des hôtels
        return Array.from(new Set(filters.allHotels.map(h => h.country))).sort();
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
                {(filters.selectedCities.length > 0 || filters.selectedCountries.length > 0 || filters.minRating > 0) && (
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
                            {cities.map(city => (
                                <button
                                    key={city}
                                    type="button"
                                    onClick={() => {
                                        const newCities = filters.selectedCities.includes(city)
                                            ? filters.selectedCities.filter(c => c !== city)
                                            : [...filters.selectedCities, city];
                                        onFilterChange({ ...filters, selectedCities: newCities });
                                    }}
                                    className={`btn btn-sm ${filters.selectedCities.includes(city)
                                        ? `btn-${PRIMARY_COLOR_CLASS}`
                                        : 'btn-outline-secondary'
                                    }`}
                                >
                                    {city}
                                    {filters.selectedCities.includes(city) && (
                                        <X size={12} className="ms-1" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filtre par Pays */}
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Pays</label>
                        <div className="d-flex flex-wrap gap-2">
                            {countries.map(country => (
                                <button
                                    key={country}
                                    type="button"
                                    onClick={() => {
                                        const newCountries = filters.selectedCountries.includes(country)
                                            ? filters.selectedCountries.filter(c => c !== country)
                                            : [...filters.selectedCountries, country];
                                        onFilterChange({ ...filters, selectedCountries: newCountries });
                                    }}
                                    className={`btn btn-sm ${filters.selectedCountries.includes(country)
                                        ? `btn-${PRIMARY_COLOR_CLASS}`
                                        : 'btn-outline-secondary'
                                    }`}
                                >
                                    {country}
                                    {filters.selectedCountries.includes(country) && (
                                        <X size={12} className="ms-1" />
                                    )}
                                </button>
                            ))}
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
                            value={filters.sortBy}
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
                        <h3 className={`text-${PRIMARY_COLOR_CLASS} fw-bold`}>{total}</h3>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                        <h6 className="text-muted mb-2">Hôtels Filtrés</h6>
                        <h3 className="text-info fw-bold">{filtered}</h3>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                        <h6 className="text-muted mb-2">Note Moyenne</h6>
                        <h3 className="text-warning fw-bold">{averageRating} ⭐</h3>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                        <h6 className="text-muted mb-2">Chambres Total</h6>
                        <h3 className="text-success fw-bold">{totalRooms}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * 🏨 Composant Modal générique simple pour Bootstrap.
 */
function SimpleModal({ title, show, onClose, children }) {
    if (!show) return null;

    const modalClassName = `modal fade ${show ? 'show d-block' : ''}`;

    return (
        <div className={modalClassName} tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className={`modal-header bg-${ACCENT_COLOR_CLASS} text-white`}> {/* Couleur d'accentuation */}
                        <h5 className="modal-title fw-bold">{title}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Fermer"></button>
                    </div>
                    <div className="modal-body p-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * 📝 Composant de formulaire pour ajouter un nouvel hôtel (Intégré dans le Modal).
 */
function AddHotelForm({ onAddHotel, clearNotification, onCloseModal }) {
    // États du formulaire
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [roomsCount, setRoomsCount] = useState(1);
    const [rating, setRating] = useState(3.0);
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState(null); // Changé en null initialement

    const handleSubmit = (e) => {
        e.preventDefault();
        clearNotification();

        if (!name || !city || !country) {
            alert('Veuillez remplir au moins le nom, la ville et le pays.');
            return;
        }

        const newHotel = {
            id: Date.now(),
            name,
            city,
            country,
            rooms_count: parseInt(roomsCount),
            rating: parseFloat(rating) || 0.0, 
            description,
            imageUrl, // C'est ici que l'image Base64 sera stockée
            created_at: new Date().toISOString(),
        };

        onAddHotel(newHotel);
        onCloseModal(); 
        
        // Réinitialisation du formulaire
        setName('');
        setCity('');
        setCountry('');
        setRoomsCount(1);
        setRating(3.0);
        setDescription('');
        setImageUrl(null);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-3">
                <div className="col-md-6">
                    <label className="form-label fw-semibold">Nom de l'Hôtel</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="col-md-3">
                    <label className="form-label fw-semibold">Ville</label>
                    <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div className="col-md-3">
                    <label className="form-label fw-semibold">Pays</label>
                    <input type="text" className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} required />
                </div>
            </div>

            <div className="row g-3 mb-3">
                <div className="col-md-6">
                    <label className="form-label fw-semibold">Photo de l'Hôtel (Fichier)</label>
                    <ImageFileUploader onImageEncoded={setImageUrl} /> {/* NOUVEAU COMPOSANT */}
                </div>
                <div className="col-md-3">
                    <label className="form-label fw-semibold">Chambres (Total)</label>
                    <input type="number" className="form-control" min="1" value={roomsCount} onChange={(e) => setRoomsCount(e.target.value)} required />
                </div>
                <div className="col-md-3">
                    <label className="form-label fw-semibold">Note (1.0 - 5.0)</label>
                    <input type="number" className="form-control" step="0.1" min="1.0" max="5.0" value={rating} onChange={(e) => setRating(e.target.value)} required />
                </div>
            </div>
            
            <div className="mb-4">
                <label className="form-label fw-semibold">Description</label>
                <textarea className="form-control" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>

            <hr />

            <div className="d-flex justify-content-end gap-2 pt-2">
                <button type="button" className="btn btn-outline-secondary" onClick={onCloseModal}>
                    <i className="fas fa-times me-2"></i> Annuler
                </button>
                <button type="submit" className={`btn btn-${PRIMARY_COLOR_CLASS} fw-bold`}> 
                    <i className="fas fa-save me-2"></i> Enregistrer l'Hôtel
                </button>
            </div>
        </form>
    );
}

// ---------------------------------------------------------------------
// PAGE PRINCIPALE
// ---------------------------------------------------------------------

/**
 * Page de liste des hôtels avec bouton pour ouvrir le modal d'ajout.
 */
export default function HotelListPage({ hotels, onAddHotel, notification, clearNotification }) {
    
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

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    // Fonction pour obtenir la note et le style (légèrement ajustée pour le vert)
    const getRatingInfo = (rating) => {
        const safeRating = rating ?? 0; 
        const ratingText = typeof safeRating === 'number' && safeRating > 0 ? safeRating.toFixed(1) : 'N/A';
        
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
        let result = [...hotels];

        // Recherche textuelle
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(hotel =>
                hotel.name.toLowerCase().includes(term) ||
                hotel.city.toLowerCase().includes(term) ||
                hotel.country.toLowerCase().includes(term) ||
                (hotel.description && hotel.description.toLowerCase().includes(term))
            );
        }

        // Filtre par villes
        if (filters.selectedCities.length > 0) {
            result = result.filter(hotel => 
                filters.selectedCities.includes(hotel.city)
            );
        }

        // Filtre par pays
        if (filters.selectedCountries.length > 0) {
            result = result.filter(hotel => 
                filters.selectedCountries.includes(hotel.country)
            );
        }

        // Filtre par note minimale
        if (filters.minRating > 0) {
            result = result.filter(hotel => 
                hotel.rating >= filters.minRating
            );
        }

        // Trier les résultats
        switch (filters.sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.created_at || b.id) - new Date(a.created_at || a.id));
                break;
            case 'name_asc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name_desc':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'rating_desc':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'rooms_desc':
                result.sort((a, b) => b.rooms_count - a.rooms_count);
                break;
        }

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
    const stats = {
        total: hotels.length,
        filtered: filteredHotels.length,
        averageRating: hotels.length > 0 
            ? (hotels.reduce((sum, hotel) => sum + hotel.rating, 0) / hotels.length).toFixed(1)
            : '0.0',
        totalRooms: hotels.reduce((sum, hotel) => sum + hotel.rooms_count, 0)
    };

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
                            {(filters.selectedCities.length > 0 || filters.selectedCountries.length > 0 || filters.minRating > 0) && (
                                <span className="badge bg-danger ms-2">
                                    {filters.selectedCities.length + filters.selectedCountries.length + (filters.minRating > 0 ? 1 : 0)}
                                </span>
                            )}
                        </button>
                        {(searchTerm || filters.selectedCities.length > 0 || filters.selectedCountries.length > 0 || filters.minRating > 0) && (
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
                        {searchTerm || filters.selectedCities.length > 0 || filters.selectedCountries.length > 0 || filters.minRating > 0
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
                            }[filters.sortBy]}
                        </small>
                    )}
                </div>
                
                {filteredHotels.length === 0 ? (
                    <div className={`alert alert-${ACCENT_COLOR_CLASS} text-center shadow-sm text-dark`}>
                        <i className="fas fa-search me-2"></i>
                        {searchTerm || filters.selectedCities.length > 0 || filters.selectedCountries.length > 0 || filters.minRating > 0
                            ? "Aucun hôtel ne correspond à vos critères de recherche."
                            : "Aucun hôtel n'a été enregistré. Cliquez sur 'Créer un Nouvel Hôtel' pour commencer."
                        }
                    </div>
                ) : (
                    <div className="row">
                        {filteredHotels.map(hotel => (
                            <HotelCard 
                                key={hotel.id} 
                                hotel={hotel} 
                                getRatingInfo={getRatingInfo} 
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* 🖼️ Modal de Création d'Hôtel */}
            <SimpleModal 
                title="Enregistrer un Nouvel Hôtel" 
                show={showModal} 
                onClose={handleCloseModal}
            >
                <AddHotelForm 
                    onAddHotel={onAddHotel} 
                    clearNotification={clearNotification} 
                    onCloseModal={handleCloseModal}
                />
            </SimpleModal>

        </div>
    );
}