// src/components/ui/Header.jsx

import React from 'react';

export default function Header({ title }) {
    return (
        <header className="bg-white shadow-sm p-4 d-flex justify-content-between align-items-center">
            <h1 className="h4 fw-bold text-dark">{title}</h1>
            
            <div className="d-flex align-items-center">
                {/* 🔍 Barre de Recherche (Simplifiée) */}
                <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    className="form-control form-control-sm rounded-pill me-3" 
                    style={{ width: '200px' }} 
                />
                
                {/* 🔔 Icônes et Utilisateur */}
                <span className="text-secondary h5 me-3">🔔</span>
                <div className="d-flex align-items-center">
                    <div className="text-end me-2">
                        <div className="small fw-medium">Cheikh Tidiane Ba</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>Administrateur</div>
                    </div>
                    {/* 👤 Avatar simple */}
                    <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', fontSize: '1rem' }}>CB</div>
                </div>
            </div>
        </header>
    );
}