// src/components/ui/Header.jsx (Corrigé)

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PRIMARY_COLOR_CLASS = 'success'; 

export default function Header({ title, currentUser, onLogout, onSearch }) {
    
    const [searchTerm, setSearchTerm] = useState('');

    // --- Variables dynamiques de l'utilisateur ---
    const userFirstName = currentUser?.firstName || "Invité";
    const userLastName = currentUser?.lastName || "";
    const userName = `${userFirstName} ${userLastName}`.trim();
    const userPhoto = currentUser?.photoUrl || "https://via.placeholder.com/35/ced4da/6c757d?text=👤";
    const userRole = "Administrateur"; 

    // --- Fonction de Recherche/Filtrage (inchangée) ---
    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        
        if (onSearch) {
            onSearch(value);
        }
    };
    
    return (
        <header className="bg-white shadow-sm p-4 d-flex justify-content-between align-items-center border-bottom border-light">
            {title ? (
                <h1 className="h4 fw-bold text-dark">{title}</h1>
            ) : (
                <Link className={`navbar-brand fw-bold text-${PRIMARY_COLOR_CLASS}`} to="/dashboard">
                    <i className="fas fa-hotel me-2"></i> GESTION HÔTELIÈRE
                </Link>
            )}
            
            <div className="d-flex align-items-center">
                
                {/* 🔍 Barre de Recherche (inchangée) */}
                <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    className="form-control form-control-sm rounded-pill me-3" 
                    style={{ width: '200px' }} 
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                
                {/* 🔔 Icône de Notification (inchangée) */}
                <button className="btn btn-sm text-secondary me-3" title="Notifications">
                    <i className="fas fa-bell"></i>
                </button>
                
                {/* 👤 Informations Utilisateur (MAIN CLICLABLE) */}
                <Link 
                    to="/profile" 
                    className="d-flex align-items-center text-decoration-none text-dark me-3"
                    style={{ cursor: 'pointer' }} // Ajout d'un curseur pour indiquer l'interactivité
                >
                    <div className="text-end me-2">
                        <div className="small fw-medium">{userName}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{userRole}</div>
                    </div>
                    {/* 🖼️ Avatar dynamique */}
                    <img 
                        src={userPhoto} 
                        alt="Profil" 
                        className="rounded-circle" 
                        style={{ width: '35px', height: '35px', objectFit: 'cover' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = userPhoto; }}
                    />
                </Link>
                
                {/* 🚪 Bouton de Déconnexion (inchangé) */}
                {onLogout && (
                    <button className={`btn btn-outline-${PRIMARY_COLOR_CLASS} fw-bold ms-3 btn-sm`} onClick={onLogout}>
                        <i className="fas fa-sign-out-alt me-1"></i> Déconnexion
                    </button>
                )}
            </div>
        </header>
    );
}