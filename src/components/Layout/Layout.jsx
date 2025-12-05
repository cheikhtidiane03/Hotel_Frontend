// src/components/Layout/Layout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../ui/Header'; // J'utilise ../ui/Header basé sur votre dernier snippet
import Sidebar from '../ui/Sidebar'; // <-- L'endroit où la correction doit s'appliquer

// Note : J'ai ajouté 'onSearch' ici comme dans la discussion précédente, même si elle n'est pas utilisée dans cette correction spécifique.
const Layout = ({ onLogout, currentUser, onSearch }) => { 
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            
            {/* ✅ CORRECTION ICI : Passage de onLogout et currentUser au Sidebar */}
            <Sidebar 
                onLogout={onLogout}
                currentUser={currentUser}
            /> 
            
            <div style={{ flex: 1 }}>
                <Header 
                    onLogout={onLogout} 
                    currentUser={currentUser} 
                    onSearch={onSearch} 
                    title="Dashboard Hôtelier"
                />
                <main style={{ padding: '20px' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;