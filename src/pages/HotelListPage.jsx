// src/pages/HotelListPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
    const handleCloseModal = () => setShowModal(false);
    const sortedHotels = [...hotels].sort((a, b) => (new Date(b.created_at || b.id)) - (new Date(a.created_at || a.id)));

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

    return (
        <div className="container-fluid p-4">
            
            {/* EN-TÊTE DE PAGE */}
            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
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
            
            {/* 📸 GRILLE DE CARTES DES HÔTELS */}
            <div className="mb-4">
                <h3 className="h5 mb-3 text-muted">Aperçu des hotels ({hotels.length})</h3>
                
                {hotels.length === 0 ? (
                    <div className={`alert alert-${ACCENT_COLOR_CLASS} text-center shadow-sm text-dark`}>
                        <i className="fas fa-info-circle me-2"></i>
                        Aucun hôtel n'a été enregistré. Cliquez sur "Créer un Nouvel Hôtel" pour commencer.
                    </div>
                ) : (
                    <div className="row">
                        {sortedHotels.map(hotel => (
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
                title="Enregistrer un Nouvel Établissement Hôtelier" 
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