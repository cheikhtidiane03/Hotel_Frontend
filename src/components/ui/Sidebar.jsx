import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Composant de barre latérale pour la navigation du dashboard.
 * Contient le bloc utilisateur et le bouton de déconnexion.
 */
export default function Sidebar({ onLogout, currentUser }) {
    const location = useLocation();
    
    // Structure des liens de navigation
    const navItems = [
        { path: '/', label: 'Tableau de Bord', icon: 'fa-tachometer-alt' },
        { path: '/hotels', label: 'Gestion des Hôtels', icon: 'fa-hotel' },
        // Ajoutez d'autres liens ici si nécessaire
    ];

    const isLinkActive = (path) => location.pathname === path;

    return (
        // La barre latérale est fixée à une largeur de 250px et utilise bg-dark
        <div className="d-flex flex-column bg-dark text-white p-3" style={{ width: '250px', flexShrink: 0 }}>
            
            {/* Logo/Titre principal du Dashboard */}
            <Link className="d-flex align-items-center mb-4 text-white text-decoration-none border-bottom pb-3" to="/">
                <i className="fas fa-bed me-2 fs-5"></i>
                <span className="fs-5 fw-bold">HOTEL</span>
            </Link>

            {/* Liens de Navigation */}
            <ul className="nav nav-pills flex-column mb-auto">
                {navItems.map(item => (
                    <li key={item.path} className="nav-item mb-2">
                        <Link 
                            to={item.path} 
                            className={`nav-link text-white ${isLinkActive(item.path) ? 'bg-danger fw-bold' : 'bg-transparent'}`}
                        >
                            <i className={`fas ${item.icon} me-2`}></i>
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Bloc Utilisateur et Déconnexion */}
            <div className="mt-auto border-top pt-3">
                {currentUser && (
                    <div className="d-flex align-items-center mb-3">
                        {/* Photo de Profil */}
                        <img 
                            src={currentUser.photoUrl || "https://via.placeholder.com/40/ced4da/6c757d?text=U"} 
                            alt="Profil" 
                            onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/40/ced4da/6c757d?text=U"}}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #dc3545' }}
                            className="me-3"
                        />
                        <div>
                            <span className="d-block small fw-bold text-light">{currentUser.firstName || 'Utilisateur'}</span>
                            <span className="d-block small text-muted text-truncate" style={{ maxWidth: '150px' }}>{currentUser.email}</span>
                        </div>
                    </div>
                )}

                {/* Bouton de Déconnexion - Appelle la prop onLogout */}
                <button 
                    onClick={onLogout} 
                    className="btn btn-outline-danger w-100 fw-bold btn-sm"
                    title="Se déconnecter de la session actuelle"
                >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Déconnexion
                </button>
            </div>
        </div>
    );
}