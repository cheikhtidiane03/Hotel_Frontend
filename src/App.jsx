// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout'; 
import HotelListPage from './pages/HotelListPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import { hotels as initialHotels } from './data/hotels';

// Styles globaux
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
        return savedUsers ? JSON.parse(savedUsers) : [];
    } catch (e) {
        console.error("Erreur de lecture du localStorage des utilisateurs:", e);
        return [];
    }
};
const loadCurrentUser = () => {
    const savedUser = localStorage.getItem('currentUser');
    try {
        return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
        console.error("Erreur de lecture du currentUser:", e);
        return null;
    }
};

// 🛡️ COMPOSANT DE ROUTE PROTÉGÉE 
const ProtectedRoute = ({ element, currentUser }) => {
    return currentUser ? element : <Navigate to="/login" replace />;
};

// ----------------------------------------------------

export default function App() {
    
    // États
    const [hotels, setHotels] = useState(loadInitialData);
    const [notification, setNotification] = useState(null); 
    const [users, setUsers] = useState(loadUsers);
    const [currentUser, setCurrentUser] = useState(loadCurrentUser); 

    // Synchronisation de l'état avec le localStorage
    useEffect(() => {
        localStorage.setItem('hotelsList', JSON.stringify(hotels));
    }, [hotels]);
    useEffect(() => {
        localStorage.setItem('usersList', JSON.stringify(users));
    }, [users]);
    useEffect(() => {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }, [currentUser]);

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 5000);
    };

    // --- Fonctions de gestion de l'état des Hôtels ---
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
    };
    
    const deleteHotel = (id) => {
        setHotels(prevHotels => prevHotels.filter(hotel => hotel.id !== id));
    };
    
    // --- Fonctions d'Authentification ---
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
            {/* ✅ CORRECTION CSS DU CONTENEUR RACINE */}
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
            <Routes>
                
                {/* 🔒 Routes Publiques */}
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />
                
                {/* ⭐ ROUTE PRINCIPALE (/) - Redirige selon l'état de connexion */}
                <Route path="/" element={
                    currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
                } />
                
                {/* 🛡️ Routes Protégées */}
                
                {/* Dashboard */}
                <Route path="/dashboard" element={
                    <ProtectedRoute currentUser={currentUser} element={
                        <Layout title="Dashboard" onLogout={handleLogout}>
                            <DashboardPage hotels={hotels} />
                        </Layout>
                    } />
                } />
                
                {/* Liste des hôtels */}
                <Route path="/hotels" element={
                    <ProtectedRoute currentUser={currentUser} element={
                        <Layout title="Liste des Hôtels" onLogout={handleLogout}>
                            <HotelListPage 
                                hotels={hotels} 
                                onAddHotel={addHotel} 
                                notification={notification}
                                clearNotification={() => setNotification(null)}
                            />
                        </Layout>
                    } />
                } />
                
                {/* Détails/Modification */}
                <Route path="/hotels/:id" element={
                    <ProtectedRoute currentUser={currentUser} element={
                        <HotelDetailsPage 
                            hotels={hotels} 
                            onUpdate={updateHotel}
                            onDelete={deleteHotel}
                            onSuccess={showNotification}
                        />
                    } />
                } />
                
                {/* Redirection si l'utilisateur est déjà connecté */}
                {currentUser && <Route path="/login" element={<Navigate to="/dashboard" replace />} />}
                {currentUser && <Route path="/register" element={<Navigate to="/dashboard" replace />} />}
                
                {/* Route de secours pour les URL non reconnues */}
                <Route path="*" element={
                    currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
                } />
            </Routes>
        </Router>
    );
}