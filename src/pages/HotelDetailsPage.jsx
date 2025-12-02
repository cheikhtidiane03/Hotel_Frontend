import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import CreateHotelForm from '../components/hotels/CreateHotelForm';

// ✅ CORRECTION DU STYLE : Ajout de alignItems: 'center'
const pageStyle = { 
    display: 'flex', 
    justifyContent: 'center', // Centre horizontalement
    alignItems: 'center',     // ✅ Centre verticalement
    minHeight: '100vh', 
    backgroundColor: '#f4f4f4',
    padding: '40px 0' 
};

// La classe 'container' de Bootstrap s'occupera d'aligner le bloc de contenu au milieu
const contentStyle = { 
    width: '100%', 
    maxWidth: '1200px', // Garde une largeur maximale pour ne pas étirer l'information
};

export default function HotelDetailsPage({ hotels, onUpdate, onDelete, onSuccess }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const hotelId = parseInt(id);
    
    const initialHotel = hotels.find(h => h.id === hotelId);
    
    const [isEditing, setIsEditing] = useState(false);
    const [currentHotel, setCurrentHotel] = useState(initialHotel);

    // Redirection si l'hôtel n'est pas trouvé
    useEffect(() => {
        if (!initialHotel) {
            navigate('/hotels');
            onSuccess("Hôtel non trouvé.");
        }
    }, [initialHotel, navigate, onSuccess]);

    if (!currentHotel) {
        return <div style={pageStyle}>Chargement...</div>;
    }

    const handleUpdate = (updatedData) => {
        const updatedHotel = { ...currentHotel, ...updatedData };
        onUpdate(updatedHotel);
        setCurrentHotel(updatedHotel);
        setIsEditing(false);
        onSuccess(`Hôtel "${updatedHotel.name}" mis à jour avec succès !`);
    };

    const handleDelete = () => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'hôtel "${currentHotel.name}" ?`)) {
            onDelete(currentHotel.id);
            navigate('/hotels');
            onSuccess(`Hôtel "${currentHotel.name}" a été supprimé !`);
        }
    };

    const formattedPrice = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currentHotel.currency || 'XOF',
    }).format(currentHotel.price);


    return (
        <div style={pageStyle}>
            {/* L'utilisation de className="container" ou "container-fluid" et de style={contentStyle}
                permet de garantir que le contenu est bien centré dans le flex parent. */}
            <div style={contentStyle} className="container"> 
                
                <div className="bg-white rounded shadow-lg p-5">
                    <h1 className="h2 fw-bold text-dark mb-4 border-bottom pb-2">
                        {isEditing ? 'Modification de' : 'Détails de'} : {currentHotel.name}
                    </h1>

                    {/* Boutons d'Action */}
                    <div className="d-flex justify-content-end mb-4">
                        {!isEditing && (
                            <button className="btn btn-warning me-3" onClick={() => setIsEditing(true)}>
                                Modifier
                            </button>
                        )}
                        <button className="btn btn-danger" onClick={handleDelete}>
                            Supprimer
                        </button>
                        <button className="btn btn-secondary ms-3" onClick={() => navigate('/hotels')}>
                            ← Retour à la liste
                        </button>
                    </div>
                    
                    {isEditing ? (
                        // --- MODE ÉDITION ---
                        <CreateHotelForm 
                            onSave={handleUpdate}
                            onClose={() => setIsEditing(false)} 
                            initialData={currentHotel} 
                        />
                    ) : (
                        // --- MODE AFFICHAGE ---
                        <div className="row">
                            <div className="col-md-7 mb-4">
                                <img 
                                    src={currentHotel.imageUrl} 
                                    alt={currentHotel.name} 
                                    className="img-fluid rounded shadow-sm" 
                                    style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
                                />
                                <h4 className="mt-4 border-bottom pb-2">Description:</h4>
                                <p>{currentHotel.description || "Aucune description détaillée n'est disponible pour cet hôtel."}</p>
                            </div>
                            <div className="col-md-5">
                                <div className="card shadow-sm p-4 bg-light">
                                    <h4 className="border-bottom pb-2 mb-3">Informations Clés</h4>
                                    <p><strong>Ville:</strong> {currentHotel.city}</p>
                                    <p><strong>Adresse:</strong> {currentHotel.address || 'Non spécifiée'}</p>
                                    <p><strong>Prix par nuit:</strong> <span className="text-danger fw-bold fs-5">{formattedPrice}</span></p>
                                    <hr />
                                    <p><strong>Email:</strong> {currentHotel.email || 'Non spécifié'}</p>
                                    <p><strong>Téléphone:</strong> {currentHotel.phone || 'Non spécifié'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}