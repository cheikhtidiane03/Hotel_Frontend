// src/components/Layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Assurez-vous que ce fichier gère currentUser et onLogout
import Sidebar from '../ui/Sidebar';

// ✅ AJOUT DE 'currentUser' aux props
const Layout = ({ onLogout, currentUser }) => { 
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Si Sidebar utilise des infos utilisateur, passez-les ici aussi */}
            <Sidebar /> 
            <div style={{ flex: 1 }}>
                {/* ✅ PASSAGE DES PROPS NÉCESSAIRES AU HEADER */}
                <Header 
                    onLogout={onLogout} 
                    currentUser={currentUser} 
                />
                <main style={{ padding: '20px' }}>
                    <Outlet /> {/* C'est ici que les pages s'affichent */}
                </main>
            </div>
        </div>
    );
};

export default Layout;