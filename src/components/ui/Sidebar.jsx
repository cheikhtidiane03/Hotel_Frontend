// src/components/ui/Sidebar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
    { name: "Dashboard", path: "/", icon: "📊" },
    { name: "Hôtels", path: "/hotels", icon: "🏨" },
    { name: "Créer Hôtel", path: "/hotels/new", icon: "➕" },
    // Ajoutez d'autres éléments ici
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <div className="d-flex flex-column bg-dark text-white p-3" style={{ width: '240px', minHeight: '100vh', flexShrink: 0 }}>
            <h2 className="h5 fw-bold text-danger mb-4 border-bottom pb-2">Hotel Manager</h2>
            
            <nav className="flex-grow-1">
                <ul className="nav nav-pills flex-column mb-auto">
                    {navItems.map((item) => (
                        <li key={item.name} className="nav-item mb-2">
                            <Link 
                                to={item.path} 
                                className={`nav-link text-white d-flex align-items-center ${location.pathname === item.path ? 'active bg-danger' : ''}`}
                            >
                                <span className="me-2">{item.icon}</span>
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="mt-auto pt-3 border-top">
                <Link to="#" className="text-white text-decoration-none d-flex align-items-center small">
                    <span className="me-2">🚪</span> Déconnexion
                </Link>
            </div>
        </div>
    );
}