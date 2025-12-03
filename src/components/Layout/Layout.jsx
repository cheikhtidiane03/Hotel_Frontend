// src/components/Layout/Layout.jsx (Partiel - à fusionner)

import React from 'react';
import Sidebar from '../ui/Sidebar'; 
import Header from './Header';   

// ✅ La prop onLogout est ajoutée ici
const Layout = ({ children, title, onLogout }) => {
  return (
    <div className="d-flex min-vh-100 bg-light"> 
      {/* Passe onLogout à la Sidebar */}
      <Sidebar onLogout={onLogout} /> 
      <div className="flex-grow-1 d-flex flex-column">
        <Header title={title} /> 
        <main className="flex-grow-1 p-4 p-md-5">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;