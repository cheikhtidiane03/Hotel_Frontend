// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import HotelListPage from './pages/HotelListPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout/Layout'; // Contient l'Outlet

import 'bootstrap/dist/css/bootstrap.min.css';

// ⚠️ Note: Ce fichier doit exister. Je le mets ici en simulation:
const initialHotels = [
    { id: 1, name: "Le Grand Hôtel", city: "Paris", rating: 4.5, rooms_count: 120, description: "Un hôtel de luxe au cœur de la capitale." },
    { id: 2, name: "Auberge Verte", city: "Lyon", rating: 3.8, rooms_count: 50, description: "Charmante auberge près du parc." }
];

// Styles globaux (mis en ligne pour ne pas créer de fichier supplémentaire)
const globalStyles = {
    fontFamily: 'Arial, sans-serif'
};

// ⚠️ Fonctions utilitaires d'Authentification (Simulation) ⚠️
const hashPassword = (password) => btoa(password);

// --- Fonctions de chargement pour la persistance ---
const loadInitialData = () => {
    const savedHotels = localStorage.getItem('hotelsList');
    try {
        return savedHotels ? JSON.parse(savedHotels) : initialHotels;
    } catch (e) {
        console.error("Erreur de lecture du localStorage des hôtels:", e);
        return initialHotels;
    }
};

const loadUsers = () => {
    const savedUsers = localStorage.getItem('usersList');
    try {
        // Initialiser avec un utilisateur par défaut
        const defaultUser = [{ 
            id: 999, 
            firstName: "Demo", 
            lastName: "User", 
            email: "test@demo.com", 
            password: hashPassword("123456"), 
            photoUrl: null 
        }];
        const loadedUsers = savedUsers ? JSON.parse(savedUsers) : [];
        
        return loadedUsers.length === 0 ? defaultUser : loadedUsers; 
    } catch (e) {
        console.error("Erreur de lecture du localStorage des utilisateurs:", e);
        return [];
    }
};

// ❌ MODIFICATION CLÉ : Force le currentUser à null au chargement initial.
const loadCurrentUser = () => {
    // Si nous voulons forcer le login à chaque démarrage, nous ignorons le localStorage ici.
    return null; 
};

// 🛡️ COMPOSANT DE ROUTE PROTÉGÉE
const ProtectedRoute = ({ children, currentUser }) => {
    // Si l'utilisateur n'est pas connecté, rediriger vers /login
    return currentUser ? children : <Navigate to="/login" replace />;
};

// ----------------------------------------------------

export default function App() {

    // États
    const [hotels, setHotels] = useState(loadInitialData);
    const [notification, setNotification] = useState(null);
    const [users, setUsers] = useState(loadUsers);
    // ✅ UTILISE LA FONCTION MODIFIÉE : currentUser commence à null
    const [currentUser, setCurrentUser] = useState(loadCurrentUser); 

    // Synchronisation de l'état avec le localStorage
    useEffect(() => {
        localStorage.setItem('hotelsList', JSON.stringify(hotels));
    }, [hotels]);
    useEffect(() => {
        localStorage.setItem('usersList', JSON.stringify(users));
    }, [users]);
    
    // NOTE: On conserve cet useEffect pour que la connexion puisse persister
    // dans le localStorage APRÈS un login réussi (handleLogin)
    useEffect(() => {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }, [currentUser]);

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 5000);
    };

    // --- Fonctions de gestion de l'état des Hôtels (inchangées) ---
    const addHotel = (newHotel) => {
        setHotels(prevHotels => [newHotel, ...prevHotels]);
        showNotification("Hôtel créé avec succès ! 🎉");
    };

    const updateHotel = (updatedHotel) => {
        setHotels(prevHotels =>
            prevHotels.map(hotel =>
                hotel.id === updatedHotel.id ? updatedHotel : hotel
            )
        );
        showNotification(`Hôtel ${updatedHotel.name} mis à jour avec succès !`);
    };

    const deleteHotel = (id) => {
        const hotelName = hotels.find(h => h.id === id)?.name || id;
        setHotels(prevHotels => prevHotels.filter(hotel => hotel.id !== id));
        showNotification(`Hôtel ${hotelName} supprimé !`);
    };

    // --- Fonctions d'Authentification (inchangées) ---
    const handleRegister = (userData) => {
        const emailExists = users.some(u => u.email === userData.email);
        if (emailExists) {
            return { success: false, message: "Un compte existe déjà avec cet email." };
        }

        const newUser = {
            id: Date.now(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: hashPassword(userData.password),
            photoUrl: userData.photoUrl || null 
        };

        setUsers(prevUsers => [...prevUsers, newUser]);

        return { success: true, message: "Inscription réussie." };
    };

    const handleLogin = (email, password) => {
        const user = users.find(u => u.email === email);
        if (!user || user.password !== hashPassword(password)) {
            return { success: false, message: "Email ou mot de passe incorrect." };
        }

        setCurrentUser(user);
        return { success: true, message: "Connexion réussie." };
    };

    const handleLogout = () => {
        setCurrentUser(null);
        showNotification("Vous avez été déconnecté.");
    };

    // ---------------------------------------------

    return (
        <Router>
            <style>{`
                html, body, #root {
                    height: 100%;
                    width: 100%;
                    margin: 0;
                    padding: 0;
                }
                body {
                    font-family: ${globalStyles.fontFamily};
                    background-color: #f4f4f4;
                }
            `}</style>

            {/* Notification globale */}
            {notification && (
                <div 
                    className="alert alert-success alert-dismissible fade show"
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        zIndex: 1000,
                        width: '300px'
                    }} 
                    role="alert"
                >
                    {notification}
                    <button type="button" className="btn-close" onClick={() => setNotification(null)}></button>
                </div>
            )}

            <Routes>
                {/* ⭐ ROUTE PRINCIPALE (/) - Redirige vers LOGIN car currentUser est initialement null */}
                <Route path="/" element={
                    currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
                } />

                {/* 🔒 Routes Publiques */}
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />
                
                <Route path="/404" element={<h1 className="text-center mt-5">404 - Page Non Trouvée</h1>} />

                {/* 🛡️ Routes Protégées - Le Layout est le parent, l'Outlet affichera ses enfants */}
                <Route element={
                    <ProtectedRoute currentUser={currentUser}>
                        {/* J'ajoute le currentUser dans le Layout pour l'affichage des infos utilisateur */}
                        <Layout onLogout={handleLogout} currentUser={currentUser} />
                    </ProtectedRoute>
                }>
                    {/* Routes Protégées Ici */}
                    <Route path="/dashboard" element={<DashboardPage hotels={hotels} />} />
                    <Route path="/hotels" element={
                        <HotelListPage
                            hotels={hotels}
                            onAddHotel={addHotel}
                            notification={notification}
                            clearNotification={() => setNotification(null)}
                        />
                    } />
                    <Route path="/hotels/:id" element={
                        <HotelDetailsPage
                            hotels={hotels}
                            onUpdate={updateHotel}
                            onDelete={deleteHotel}
                            onSuccess={showNotification}
                        />
                    } />
                </Route>

                {/* Route de secours pour les URLs non trouvées */}
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </Router>
    );
}