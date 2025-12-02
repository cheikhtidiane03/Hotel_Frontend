import React, { useState } from 'react';
import HotelCard from '../components/hotels/HotelCard';
import Modal from '../components/ui/Modal'; // Assurez-vous d'importer la Modale
import CreateHotelForm from '../components/hotels/CreateHotelForm'; // ✅ Import du formulaire

// Le composant reçoit les props du parent, y compris onAddHotel
export default function HotelListPage({ hotels, onAddHotel, notification, clearNotification }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Fonction appelée par le formulaire après la soumission
    const handleSaveNewHotel = (newHotel) => { 
        onAddHotel(newHotel); // Ajoute l'hôtel et déclenche la notification via App.jsx
        setIsModalOpen(false); // Ferme la modale
    };

    return (
        // ✅ CORRECTION DE STYLE : Utilisation de 'container-fluid p-0' pour prendre toute la largeur
        <div className="container-fluid p-0"> 
            
            {/* 🔔 Message de succès géré par App.jsx */}
            {notification && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {notification}
                    <button type="button" className="btn-close" onClick={clearNotification} aria-label="Close"></button>
                </div>
            )}

            {/* Barre d'action et compteur */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h5 text-secondary">
                    Hôtels enregistrés <span className="fw-normal text-muted">({hotels.length})</span>
                </h2>
                {/* Bouton qui ouvre la modale */}
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-danger shadow-sm fw-medium"
                >
                    + Créer un nouvel hôtel
                </button>
            </div>
            
            {/* Grille des hôtels */}
            <div className="row g-4">
                {hotels.map(hotel => (
                    <div key={hotel.id} className="col-12 col-sm-6 col-md-4 col-lg-3"> 
                        <HotelCard hotel={hotel} />
                    </div>
                ))}
            </div>
            
            {/* MODAL pour la création d'hôtel */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Créer un nouveau hôtel"
            >
                <CreateHotelForm 
                    onSave={handleSaveNewHotel} // Fonction de sauvegarde locale
                    onClose={() => setIsModalOpen(false)} // Permet au formulaire d'annuler
                />
            </Modal>
        </div>
    );
}