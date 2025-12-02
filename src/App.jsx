import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout'; 
import HotelListPage from './pages/HotelListPage'; // Cette page gérera la modale
import HotelDetailsPage from './pages/HotelDetailsPage';
import DashboardPage from './pages/DashboardPage';
import { hotels as initialHotels } from './data/hotels';

// Styles globaux
const globalStyles = {
    margin: 0, padding: 0, boxSizing: 'border-box', fontFamily: 'Arial, sans-serif'
};

// Fonctions de persistance (loadInitialData, useEffect) restent inchangées

const loadInitialData = () => { /* ... (votre logique de localStorage) ... */ return initialHotels; };

export default function App() {
    const [hotels, setHotels] = useState(loadInitialData);
    const [notification, setNotification] = useState(null); 

    useEffect(() => {
        localStorage.setItem('hotelsList', JSON.stringify(hotels));
    }, [hotels]);

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 5000);
    };

    // --- Fonctions de gestion de l'état ---
    // ✅ MODIFICATION : La fonction addHotel appelle showNotification directement
    const addHotel = (newHotel) => {
        setHotels(prevHotels => [newHotel, ...prevHotels]);
        showNotification("Hôtel créé avec succès ! 🎉"); // Affiche la notification ici
    };
    const updateHotel = (updatedHotel) => { /* ... (inchangée) ... */ setHotels(prevHotels => prevHotels.map(hotel => hotel.id === updatedHotel.id ? updatedHotel : hotel)); };
    const deleteHotel = (id) => { /* ... (inchangée) ... */ setHotels(prevHotels => prevHotels.filter(hotel => hotel.id !== id)); };
    // ------------------------------------

    return (
        <Router>
            <style>{`
                body { ${Object.entries(globalStyles).map(([key, value]) => `${key}: ${value};`).join(' ')} }
            `}</style>
            <Routes>
                
                {/* Dashboard (Page par défaut) */}
                <Route path="/" element={
                    <Layout title="Dashboard">
                        <DashboardPage hotels={hotels} />
                    </Layout>
                } />
                
                {/* Liste des hôtels - Passe la fonction addHotel */}
                <Route path="/hotels" element={
                    <Layout title="Liste des Hôtels">
                        <HotelListPage 
                            hotels={hotels} 
                            onAddHotel={addHotel} // ✅ NOUVELLE PROP
                            notification={notification}
                            clearNotification={() => setNotification(null)}
                        />
                    </Layout>
                } />
                
                {/* ❌ SUPPRESSION de la Route /hotels/new */}
                
                {/* Détails/Modification */}
                <Route path="/hotels/:id" element={
                    <HotelDetailsPage 
                        hotels={hotels} 
                        onUpdate={updateHotel}
                        onDelete={deleteHotel}
                        onSuccess={showNotification}
                    />
                } />
            </Routes>
        </Router>
    );
}