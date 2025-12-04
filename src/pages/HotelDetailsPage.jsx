/* eslint-disable react-hooks/purity */
// src/pages/HotelDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Définition des classes de couleur pour le thème vert/sauge
const PRIMARY_COLOR_CLASS = 'success'; // Vert foncé (boutons principaux)
const ACCENT_COLOR_CLASS = 'info';    // Sauge/Vert clair (accents)

// ---------------------------------------------------------------------
// COMPOSANT RÉUTILISÉ: Gestion de la sélection de fichier image Base64
// ---------------------------------------------------------------------

/**
 * Composant pour lire un fichier image et le convertir en Base64.
 * C'est le même composant que dans HotelListPage.
 * @param {function(string | null): void} onImageEncoded - Callback avec l'URL Base64 ou null.
 * @param {string} [currentImage] - Affiche un aperçu de l'image actuelle (Base64).
 */
function ImageFileUploader({ onImageEncoded, currentImage }) {
    const [preview, setPreview] = useState(currentImage);

    useEffect(() => {
        setPreview(currentImage);
    }, [currentImage]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Met à jour l'état du formulaire parent et l'aperçu local
                onImageEncoded(reader.result);
                setPreview(reader.result);
            };
            reader.onerror = () => {
                console.error("Erreur lors de la lecture du fichier.");
                onImageEncoded(null);
                setPreview(null);
            };
            reader.readAsDataURL(file);
        } else {
            onImageEncoded(currentImage); // Conserver l'ancienne image si le champ est vidé
            setPreview(currentImage);
        }
    };

    return (
        <div>
            {preview && (
                <div className="mb-2 text-center">
                    <img 
                        src={preview} 
                        alt="Aperçu" 
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: '150px', objectFit: 'cover' }}
                    />
                </div>
            )}
            <input 
                type="file" 
                className="form-control" 
                accept="image/*" 
                onChange={handleFileChange} 
            />
        </div>
    );
}

// ---------------------------------------------------------------------
// PAGE DE DÉTAILS ET MODIFICATION
// ---------------------------------------------------------------------

/**
 * Page de détails et de modification d'un hôtel.
 */
export default function HotelDetailsPage({ hotels, onUpdate, onDelete }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const hotelId = parseInt(id);

    // Trouver l'hôtel
    const initialHotel = hotels.find(h => h.id === hotelId);
    
    // États pour le formulaire
    const [hotelData, setHotelData] = useState(initialHotel || {});
    const [isEditing, setIsEditing] = useState(false);
    const [notFound, setNotFound] = useState(!initialHotel);

    // Met à jour l'état si les props 'hotels' changent (après update/delete)
    useEffect(() => {
        const currentHotel = hotels.find(h => h.id === hotelId);
        if (!currentHotel && !notFound) {
             // Redirige si l'hôtel est supprimé ailleurs
             navigate('/hotels');
             return;
        }
        setHotelData(currentHotel || {});
        setNotFound(!currentHotel);
    }, [hotels, hotelId, navigate, notFound]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHotelData(prev => ({ ...prev, [name]: value }));
    };

    // Nouvelle fonction pour gérer le changement d'image Base64
    const handleImageChange = (base64String) => {
        setHotelData(prev => ({ ...prev, imageUrl: base64String }));
    };


    const handleSave = (e) => {
        e.preventDefault();
        
        const updatedHotel = {
            ...hotelData,
            // Conversion des champs numériques
            rooms_count: parseInt(hotelData.rooms_count) || 0,
            rating: parseFloat(hotelData.rating) || 0,
            id: hotelId 
        };

        onUpdate(updatedHotel); // Appelle la fonction de App.jsx
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'hôtel "${hotelData.name}" ? Cette action est irréversible.`)) {
            onDelete(hotelId); // Appelle la fonction de App.jsx
            // Redirection gérée par l'useEffect
        }
    };

    // Rendu en cas d'hôtel non trouvé
    if (notFound) {
        return (
            <div className="alert alert-danger text-center shadow-lg my-5 p-5">
                <h4 className="alert-heading fw-bold">Hôtel Non Trouvé 💔</h4>
                <p>L'identifiant d'hôtel `{id}` ne correspond à aucun enregistrement.</p>
                <Link to="/hotels" className={`btn btn-${PRIMARY_COLOR_CLASS} mt-3`}>
                    <i className="fas fa-arrow-left me-2"></i> Retour à la liste
                </Link>
            </div>
        );
    }
    
    // Rendu normal
    const imageSource = hotelData.imageUrl || `https://via.placeholder.com/600x400/66C5CC/FFFFFF?text=Aucune+Image`;
    
    return (
        <div className="container p-0">
            {/* EN-TÊTE DE PAGE STYLISÉ */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <h2 className="fw-bolder text-dark">
                    <i className={`fas fa-info-circle me-3 text-${ACCENT_COLOR_CLASS}`}></i> 
                    Détails de l'Hôtel : <span className={`text-${PRIMARY_COLOR_CLASS}`}>{hotelData.name}</span>
                </h2>
                <div>
                    {!isEditing ? (
                        <button className={`btn btn-outline-${PRIMARY_COLOR_CLASS} me-2`} onClick={() => setIsEditing(true)}>
                            <i className="fas fa-edit me-2"></i> Modifier
                        </button>
                    ) : (
                        <button className={`btn btn-${PRIMARY_COLOR_CLASS} me-2`} onClick={handleSave}>
                            <i className="fas fa-save me-2"></i> Sauvegarder
                        </button>
                    )}
                    <button className="btn btn-outline-danger" onClick={handleDelete} disabled={isEditing}>
                        <i className="fas fa-trash me-2"></i> Supprimer
                    </button>
                </div>
            </div>

            {/* CONTENU DE LA CARTE */}
            <div className="card shadow-lg border-0">
                <div className="card-body p-5">
                    <form onSubmit={handleSave}>
                        <div className="row g-4">
                            
                            {/* Colonne de l'Image (Affichage/Modification) */}
                            <div className="col-lg-5">
                                <div className="p-3 border rounded h-100 bg-light">
                                    <h4 className="text-muted border-bottom pb-2 mb-3"><i className="fas fa-image me-2"></i> Photo</h4>
                                    
                                    {isEditing ? (
                                        <div className="mb-4">
                                            <label className="form-label fw-bold">Changer la Photo</label>
                                            <ImageFileUploader 
                                                onImageEncoded={handleImageChange} 
                                                currentImage={hotelData.imageUrl}
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <img 
                                                src={imageSource} 
                                                alt={`Photo de ${hotelData.name}`} 
                                                className="img-fluid rounded shadow-sm border"
                                                style={{ maxHeight: '400px', objectFit: 'cover' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Colonne des Détails du Formulaire */}
                            <div className="col-lg-7">
                                <h4 className="text-muted border-bottom pb-2 mb-4"><i className="fas fa-file-alt me-2"></i> Informations Clés</h4>
                                
                                <div className="row">
                                    {/* Nom, Ville, Pays */}
                                    <div className="col-md-6 mb-4">
                                        <label className="form-label fw-bold">Nom</label>
                                        <input type="text" className="form-control" name="name" value={hotelData.name || ''} onChange={handleChange} disabled={!isEditing} required />
                                    </div>
                                    <div className="col-md-3 mb-4">
                                        <label className="form-label fw-bold">Ville</label>
                                        <input type="text" className="form-control" name="city" value={hotelData.city || ''} onChange={handleChange} disabled={!isEditing} required />
                                    </div>
                                    <div className="col-md-3 mb-4">
                                        <label className="form-label fw-bold">Pays</label>
                                        <input type="text" className="form-control" name="country" value={hotelData.country || ''} onChange={handleChange} disabled={!isEditing} required />
                                    </div>
                                </div>

                                <div className="row">
                                    {/* Chambres, Note, Création */}
                                    <div className="col-md-4 mb-4">
                                        <label className="form-label fw-bold">Chambres (Total)</label>
                                        <input type="number" className="form-control" name="rooms_count" min="0" value={hotelData.rooms_count || 0} onChange={handleChange} disabled={!isEditing} required />
                                    </div>
                                    <div className="col-md-4 mb-4">
                                        <label className="form-label fw-bold">Note (1.0 - 5.0)</label>
                                        <input type="number" className="form-control" name="rating" step="0.1" min="0.0" max="5.0" value={hotelData.rating || 0} onChange={handleChange} disabled={!isEditing} required />
                                    </div>
                                    <div className="col-md-4 mb-4">
                                        <label className="form-label fw-bold">Créé le</label>
                                        <input type="text" className="form-control text-muted" value={new Date(hotelData.created_at || Date.now()).toLocaleDateString('fr-FR')} disabled />
                                    </div>
                                </div>
                                
                                {/* Description */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold">Description</label>
                                    <textarea className="form-control" name="description" rows="4" value={hotelData.description || ''} onChange={handleChange} disabled={!isEditing}></textarea>
                                </div>
                                
                                {/* Boutons de contrôle du mode édition (si dans le formulaire) */}
                                {isEditing && (
                                    <div className="mt-4 pt-3 border-top d-flex justify-content-end">
                                        <button type="submit" className={`btn btn-${PRIMARY_COLOR_CLASS} me-2`}>
                                            <i className="fas fa-save me-2"></i> Enregistrer les Modifications
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary" 
                                            onClick={() => { setIsEditing(false); setHotelData(initialHotel); }}>
                                            Annuler
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    </form>
                </div>
            </div>
            
            {/* Pied de page pour le retour */}
            <div className="text-center mt-4">
                 <Link to="/hotels" className="btn btn-outline-dark btn-sm">
                    <i className="fas fa-arrow-left me-2"></i> Retour à la Liste
                </Link>
            </div>
        </div>
    );
}