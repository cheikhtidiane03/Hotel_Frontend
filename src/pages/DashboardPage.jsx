import React from 'react';
import { Link } from 'react-router-dom';

const PRIMARY_COLOR_CLASS = 'success'; // Vert foncé 
const ACCENT_COLOR_CLASS = 'info';    // Sauge/Vert clair 

// --- Fonction Utilitaires de Style ---

/**
 * Détermine la couleur du badge de notation.
 */
const getRatingColor = (rating) => {
    const r = parseFloat(rating);
    if (r >= 4.5) return 'success'; // Excellent
    if (r >= 3.5) return 'warning'; // Bon
    if (r >= 2.5) return 'secondary'; // Moyen
    return 'danger'; // Faible
};

/**
 * Composant réutilisable pour les cartes de statistiques du tableau de bord. (Inchangé)
 */
const StatCard = ({ title, value, icon, colorClass, borderClass }) => (
    <div className="col-md-4 mb-4">
        <div className={`card shadow-sm border-start border-${borderClass} border-5 h-100`}>
            <div className="card-body">
                <div className="row no-gutters align-items-center">
                    <div className="col me-2">
                        <div className={`text-xs fw-bold text-${colorClass} text-uppercase mb-1`}>
                            {title}
                        </div>
                        <div className="h5 mb-0 fw-bold text-gray-800">{value}</div>
                    </div>
                    <div className="col-auto">
                        <i className={`${icon} fa-2x text-gray-300 opacity-50`}></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


export default function DashboardPage({ hotels }) {
    const totalHotels = hotels.length;
    const totalRooms = hotels.reduce((sum, hotel) => sum + (hotel.rooms_count || 0), 0);
    const avgRating = totalHotels > 0 
        ? (hotels.reduce((sum, hotel) => sum + (hotel.rating || 0), 0) / totalHotels).toFixed(1)
        : 'N/A';

    const recentHotels = hotels.slice(0, 5); 

    return (
        <div>
            <h1 className="h3 mb-4 text-gray-800 border-bottom pb-2">
                <i className={`fas fa-chart-line me-2 text-${PRIMARY_COLOR_CLASS}`}></i> Tableau de Bord
            </h1>

            {/* --- Ligne des Statistiques --- */}
            <div className="row">
                <StatCard
                    title="Hôtels Actifs"
                    value={totalHotels}
                    icon="fas fa-list"
                    colorClass={PRIMARY_COLOR_CLASS}
                    borderClass={ACCENT_COLOR_CLASS}
                />
                
                <StatCard
                    title="Nombre Total de Chambres"
                    value={totalRooms.toLocaleString()}
                    icon="fas fa-bed"
                    colorClass={PRIMARY_COLOR_CLASS}
                    borderClass={PRIMARY_COLOR_CLASS}
                />
                
                <StatCard
                    title="Note Moyenne"
                    value={`${avgRating} / 5.0`}
                    icon="fas fa-star"
                    colorClass={PRIMARY_COLOR_CLASS}
                    borderClass={ACCENT_COLOR_CLASS}
                />
            </div>

            {/* --- Section Hôtels Récents (Ligne Entière Cliclable) --- */}
            <div className="card shadow-lg mt-4"> 
                <div className={`card-header bg-white fw-bold text-${PRIMARY_COLOR_CLASS} border-bottom border-${ACCENT_COLOR_CLASS}`}>
                    <i className="fas fa-bullhorn me-2"></i> Les 5 Derniers Ajouts
                </div>
                <div className="card-body p-0">
                    {recentHotels.length > 0 ? (
                        <ul className="list-group list-group-flush">
                            {recentHotels.map((hotel, index) => {
                                const ratingColor = getRatingColor(hotel.rating);
                                
                                return (
                                    // ✅ CHANGEMENT CLÉ : Utiliser Link comme élément principal
                                    <Link 
                                        key={hotel.id} 
                                        to={`/hotels/${hotel.id}`} 
                                        // Utiliser les classes Bootstrap pour rendre le lien de liste actif et cliquable
                                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 text-decoration-none text-dark"
                                        style={{ transition: 'background-color 0.1s' }}
                                    >
                                        <div className="d-flex align-items-center">
                                            {/* Icône et index stylisé */}
                                            <span className={`badge bg-${ACCENT_COLOR_CLASS} me-3 p-2 rounded-circle fw-bold`} style={{ width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                #{index + 1}
                                            </span>
                                            
                                            <div>
                                                {/* Nom de l'hôtel (maintenant un simple span) */}
                                                <span className={`text-${PRIMARY_COLOR_CLASS} fw-bold d-block`}>
                                                    {hotel.name}
                                                </span>
                                                {/* Détails secondaires avec icônes */}
                                                <small className="text-muted d-block mt-1">
                                                    <i className="fas fa-map-marker-alt me-1 text-danger"></i> {hotel.city} | 
                                                    <i className="fas fa-door-open ms-2 me-1 text-primary"></i> {hotel.rooms_count} chambres
                                                </small>
                                            </div>
                                        </div>
                                        
                                        {/* Badge de notation coloré */}
                                        <span className={`badge bg-${ratingColor} fw-bold p-2`}>
                                            {hotel.rating} <i className="fas fa-star ms-1"></i>
                                        </span>
                                    </Link>
                                );
                            })}
                        </ul >
                    ) : (
                        <p className="p-3 text-muted">Aucun hôtel n'a été ajouté pour le moment.</p>
                    )}
                </div>
                <div className={`card-footer bg-light text-center border-top border-${ACCENT_COLOR_CLASS}`}>
                    <Link to="/hotels" className={`text-${PRIMARY_COLOR_CLASS} fw-medium text-decoration-none`}>
                        Voir tous les hôtels <i className="fas fa-arrow-right ms-2"></i>
                    </Link>
                </div>
            </div>
            
        </div>
    );
}