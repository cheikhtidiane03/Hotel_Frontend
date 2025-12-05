// src/components/ui/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Définition de la constante de couleur (importée du contexte de l'application)
const PRIMARY_COLOR_CLASS = 'success'; 

/**
 * Composant de barre latérale pour la navigation du dashboard.
 * Contient le bloc utilisateur et le bouton de déconnexion.
 */
export default function Sidebar({ onLogout, currentUser }) {
    const location = useLocation();
    
    // Structure des liens de navigation
    const navItems = [
        // Remplacement de '/' par '/dashboard' pour correspondre aux routes protégées
        { path: '/dashboard', label: 'Tableau de Bord', icon: 'fa-tachometer-alt' },
        { path: '/hotels', label: 'Gestion des Hôtels', icon: 'fa-hotel' },
        // Ajout d'une entrée pour la page de détails des hôtels si l'URL correspond à /hotels/:id
    ];

    // Vérifie si l'URL actuelle commence par le chemin (pour gérer les détails /hotels/123)
    const isLinkActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === path || location.pathname === '/'; // Dashboard/racine actif
        }
        return location.pathname.startsWith(path) && path !== '/';
    };

    return (
        // La barre latérale est fixée à une largeur de 250px et utilise bg-dark
        <div className="d-flex flex-column bg-dark text-white p-3" style={{ width: '250px', flexShrink: 0, minHeight: '100vh' }}>
            
            {/* Logo/Titre principal du Dashboard */}
            <Link className="d-flex align-items-center mb-4 text-white text-decoration-none border-bottom pb-3" to="/dashboard">
                <i className="fas fa-bed me-2 fs-5"></i>
                <span className="fs-5 fw-bold">HOTEL</span>
            </Link>

            {/* Liens de Navigation */}
            <ul className="nav nav-pills flex-column mb-auto">
                {navItems.map(item => (
                    <li key={item.path} className="nav-item mb-2">
                        <Link 
                            to={item.path} 
                            // Utilise la couleur primaire (vert) pour l'élément actif
                            className={`nav-link text-white ${isLinkActive(item.path) ? `bg-${PRIMARY_COLOR_CLASS} fw-bold` : 'bg-transparent text-opacity-75'}`}
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
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', border: `2px solid var(--bs-${PRIMARY_COLOR_CLASS})` }}
                            className="me-3"
                        />
                        <div>
                            <span className="d-block small fw-bold text-light">{currentUser.firstName || 'Utilisateur'}</span>
                            <span className="d-block small text-muted text-truncate" style={{ maxWidth: '150px' }}>{currentUser.email}</span>
                        </div>
                    </div>
                )}

                {/* ✅ CHANGEMENT CLÉ : Bouton de Déconnexion en vert */}
                <button 
                    onClick={onLogout} 
                    className={`btn btn-outline-${PRIMARY_COLOR_CLASS} w-100 fw-bold btn-sm`}
                    title="Se déconnecter de la session actuelle"
                >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Déconnexion
                </button>
            </div>
        </div>
    );
}