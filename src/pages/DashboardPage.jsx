import React from 'react';

/**
 * Page principale d'aperçu affichant des statistiques.
 */
export default function DashboardPage({ hotels }) {
    const totalHotels = hotels.length;
    const totalRooms = hotels.reduce((sum, hotel) => sum + (hotel.rooms_count || 0), 0);
    const avgRating = totalHotels > 0 
        ? (hotels.reduce((sum, hotel) => sum + (hotel.rating || 0), 0) / totalHotels).toFixed(1)
        : 'N/A';

    return (
        <div>
            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm border-start border-danger border-5 h-100">
                        <div className="card-body">
                            <h5 className="card-title text-uppercase text-danger mb-0">Hôtels Actifs</h5>
                            <div className="h2 mb-0 fw-bold text-gray-800 mt-2">{totalHotels}</div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm border-start border-success border-5 h-100">
                        <div className="card-body">
                            <h5 className="card-title text-uppercase text-success mb-0">Nombre Total de Chambres</h5>
                            <div className="h2 mb-0 fw-bold text-gray-800 mt-2">{totalRooms.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm border-start border-warning border-5 h-100">
                        <div className="card-body">
                            <h5 className="card-title text-uppercase text-warning mb-0">Note Moyenne</h5>
                            <div className="h2 mb-0 fw-bold text-gray-800 mt-2">{avgRating} / 5.0</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm mt-4">
                <div className="card-header bg-white fw-bold">Récents</div>
                <div className="card-body">
                    <p>Ici, vous pourriez ajouter des graphiques ou une liste des dernières activités.</p>
                </div>
            </div>
        </div>
    );
}