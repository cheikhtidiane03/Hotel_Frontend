// src/pages/DashboardPage.jsx

import React from 'react';

// Fonction de calcul des statistiques (inchangée)
const calculateStats = (hotels) => {
    // ... (Logique de calcul) ...
    const totalHotels = hotels.length;
    const totalRevenue = hotels.reduce((sum, hotel) => sum + (hotel.price || 0), 0);
    const averagePrice = totalHotels > 0 ? totalRevenue / totalHotels : 0;
    const cities = new Set(hotels.map(hotel => hotel.city).filter(c => c));
    const totalCities = cities.size;

    const prices = hotels.map(hotel => hotel.price).filter(p => p);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    return { totalHotels, averagePrice, totalCities, minPrice, maxPrice };
};

// Composant pour afficher une seule carte de statistique (inchangé)
const StatCard = ({ title, value, icon, bgColor = 'bg-primary' }) => (
    <div className="col-md-6 col-lg-3 mb-4">
        <div className={`card text-white ${bgColor} shadow-sm h-100 border-0`}> {/* Ajout de border-0 */}
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <div className="h6 text-uppercase fw-bold">{title}</div>
                        <div className="h3 mb-0">{value}</div>
                    </div>
                    <div className="display-4">{icon}</div>
                </div>
            </div>
        </div>
    </div>
);

export default function DashboardPage({ hotels }) {
    const stats = calculateStats(hotels);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(value);
    };

    return (
        <div className="container-fluid p-0"> 
            
            <div className="row">
                <StatCard title="Total des Hôtels" value={stats.totalHotels} icon="🏨" bgColor="bg-danger" />
                <StatCard title="Villes Couvertes" value={stats.totalCities} icon="🏙️" bgColor="bg-success" />
                <StatCard title="Prix Moyen par Nuit" value={formatCurrency(stats.averagePrice)} icon="💸" bgColor="bg-info" />
                <StatCard title="Hôtel le plus Cher" value={formatCurrency(stats.maxPrice)} icon="👑" bgColor="bg-dark" />
            </div>
            
            <div className="row mt-4">
                <div className="col-lg-6">
                    <div className="card shadow-sm p-4 h-100">
                        <h4 className="fw-semibold text-dark border-bottom pb-2">Résumé des Tarifs</h4>
                        <p>Le prix le plus bas trouvé est de : <span className="text-success fw-bold">{formatCurrency(stats.minPrice)}</span>.</p>
                        <p>Le prix le plus élevé trouvé est de : <span className="text-danger fw-bold">{formatCurrency(stats.maxPrice)}</span>.</p>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card shadow-sm p-4 h-100 bg-light">
                        <h4 className="fw-semibold text-dark border-bottom pb-2">Actions Rapides</h4>
                        <p>Total des hôtels dans la base de données : **{stats.totalHotels}**.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}