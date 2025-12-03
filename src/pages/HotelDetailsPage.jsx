import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * Page affichant les détails d'un hôtel et permettant sa modification/suppression.
 */
export default function HotelDetailsPage({ hotels, onUpdate, onDelete, onSuccess }) {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Trouver l'hôtel correspondant
    const hotel = hotels.find(h => h.id === parseInt(id));

    // Initialiser les données de formulaire avec les données de l'hôtel trouvé
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        country: '',
        rooms_count: 0,
        rating: 0,
        description: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);

    useEffect(() => {
        if (hotel) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                name: hotel.name,
                city: hotel.city,
                country: hotel.country,
                rooms_count: hotel.rooms_count || 0,
                rating: hotel.rating || 0,
                description: hotel.description || '',
            });
        }
    }, [hotel]);

    if (!hotel) {
        return <div className="alert alert-warning">Hôtel non trouvé. <Link to="/hotels">Retour à la liste.</Link></div>;
    }

    const handleChange = (e) => {
        let { name, value, type } = e.target;
        
        if (type === 'number') {
            value = parseFloat(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        
        const updatedHotel = {
            ...hotel,
            ...formData,
            // S'assurer que les nombres sont stockés comme des nombres
            rooms_count: parseInt(formData.rooms_count),
            rating: parseFloat(formData.rating),
            updated_at: new Date().toISOString(),
        };

        onUpdate(updatedHotel);
        onSuccess(`L'hôtel ${updatedHotel.name} a été mis à jour.`);
        setIsEditing(false);
    };

    const handleDelete = () => {
        onDelete(hotel.id);
        onSuccess(`L'hôtel ${hotel.name} a été supprimé.`);
        navigate('/hotels'); // Redirige vers la liste après suppression
    };

    return (
        <div className="container-fluid">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                    <li className="breadcrumb-item"><Link to="/hotels">Gestion des Hôtels</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{hotel.name}</li>
                </ol>
            </nav>

            <div className="card shadow-lg">
                <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 fw-bold">{hotel.name}</h4>
                    <div>
                        <button 
                            className={`btn btn-sm me-2 fw-bold ${isEditing ? 'btn-light text-danger' : 'btn-outline-light'}`}
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <i className={`fas me-1 ${isEditing ? 'fa-times' : 'fa-edit'}`}></i> {isEditing ? 'Annuler' : 'Modifier'}
                        </button>
                        
                        <button 
                            className="btn btn-sm btn-outline-light fw-bold"
                            onClick={() => setDeleteConfirmation(true)}
                            disabled={isEditing}
                        >
                            <i className="fas fa-trash me-1"></i> Supprimer
                        </button>
                    </div>
                </div>
                
                <div className="card-body">
                    <form onSubmit={handleUpdate}>
                        
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Nom</label>
                                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">ID (Lecture seule)</label>
                                <input type="text" className="form-control" value={hotel.id} disabled />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Ville</label>
                                <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} disabled={!isEditing} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Pays</label>
                                <input type="text" className="form-control" name="country" value={formData.country} onChange={handleChange} disabled={!isEditing} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Chambres</label>
                                <input type="number" className="form-control" name="rooms_count" min="1" value={formData.rooms_count} onChange={handleChange} disabled={!isEditing} required />
                            </div>
                        </div>
                        
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Note (1.0 - 5.0)</label>
                                <input type="number" className="form-control" name="rating" step="0.1" min="1.0" max="5.0" value={formData.rating} onChange={handleChange} disabled={!isEditing} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Créé le</label>
                                <input type="text" className="form-control" value={new Date(hotel.created_at || hotel.id).toLocaleDateString()} disabled />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Mis à jour le</label>
                                <input type="text" className="form-control" value={hotel.updated_at ? new Date(hotel.updated_at).toLocaleDateString() : 'Jamais'} disabled />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold">Description</label>
                            <textarea className="form-control" name="description" rows="3" value={formData.description} onChange={handleChange} disabled={!isEditing}></textarea>
                        </div>
                        
                        {isEditing && (
                            <button type="submit" className="btn btn-danger fw-bold">
                                Enregistrer les Modifications
                            </button>
                        )}
                    </form>
                </div>
            </div>
            
            {/* Modal de Confirmation de Suppression */}
            {deleteConfirmation && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">Confirmation de Suppression</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setDeleteConfirmation(false)}></button>
                            </div>
                            <div className="modal-body">
                                Êtes-vous sûr de vouloir supprimer l'hôtel <strong>{hotel.name}</strong> ? Cette action est irréversible.
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setDeleteConfirmation(false)}>Annuler</button>
                                <button type="button" className="btn btn-danger fw-bold" onClick={handleDelete}>Supprimer Définitivement</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}