import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Composant de formulaire pour ajouter un nouvel hôtel.
 */
function AddHotelForm({ onAddHotel, clearNotification }) {
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [roomsCount, setRoomsCount] = useState(1);
    const [rating, setRating] = useState(3.0);
    const [description, setDescription] = useState('');

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
            rating: parseFloat(rating),
            description,
            created_at: new Date().toISOString(),
        };

        onAddHotel(newHotel);
        
        // Reset form
        setName('');
        setCity('');
        setCountry('');
        setRoomsCount(1);
        setRating(3.0);
        setDescription('');
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-danger text-white fw-bold">Ajouter un Nouvel Hôtel</div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Nom de l'Hôtel</label>
                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Ville</label>
                            <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Pays</label>
                            <input type="text" className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} required />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label">Chambres (Total)</label>
                            <input type="number" className="form-control" min="1" value={roomsCount} onChange={(e) => setRoomsCount(e.target.value)} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Note (1.0 - 5.0)</label>
                            <input type="number" className="form-control" step="0.1" min="1.0" max="5.0" value={rating} onChange={(e) => setRating(e.target.value)} required />
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" rows="2" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>

                    <button type="submit" className="btn btn-danger fw-bold">
                        <i className="fas fa-plus me-2"></i> Créer l'Hôtel
                    </button>
                </form>
            </div>
        </div>
    );
}

/**
 * Page de liste des hôtels avec formulaire d'ajout.
 */
export default function HotelListPage({ hotels, onAddHotel, notification, clearNotification }) {
    
    // Pour une meilleure expérience, trier par ID ou date de création (le plus récent en premier)
    const sortedHotels = [...hotels].sort((a, b) => (new Date(b.created_at || b.id)) - (new Date(a.created_at || a.id)));

    return (
        <div className="container-fluid">
            
            {notification && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {notification}
                    <button type="button" className="btn-close" onClick={clearNotification}></button>
                </div>
            )}

            <AddHotelForm onAddHotel={onAddHotel} clearNotification={clearNotification} />

            <div className="card shadow-sm">
                <div className="card-header bg-white fw-bold">Liste des Hôtels ({hotels.length})</div>
                <div className="card-body p-0">
                    
                    {hotels.length === 0 ? (
                        <p className="p-4 text-center text-muted">Aucun hôtel n'a été enregistré.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Nom</th>
                                        <th scope="col">Ville / Pays</th>
                                        <th scope="col">Chambres</th>
                                        <th scope="col">Note</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedHotels.map(hotel => (
                                        <tr key={hotel.id}>
                                            <th scope="row" className="text-muted small">{hotel.id}</th>
                                            <td className="fw-bold">{hotel.name}</td>
                                            <td>{hotel.city}, {hotel.country}</td>
                                            <td>{hotel.rooms_count}</td>
                                            <td>
                                                <span className={`badge bg-${hotel.rating >= 4.0 ? 'success' : hotel.rating >= 3.0 ? 'warning' : 'danger'}`}>
                                                    <i className="fas fa-star me-1"></i> {hotel.rating.toFixed(1)}
                                                </span>
                                            </td>
                                            <td>
                                                <Link to={`/hotels/${hotel.id}`} className="btn btn-sm btn-outline-info">
                                                    Détails <i className="fas fa-arrow-right ms-1"></i>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}