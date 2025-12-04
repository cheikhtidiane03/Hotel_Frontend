import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Définition des classes de couleur
const PRIMARY_COLOR_CLASS = 'success'; // Vert foncé (bouton principal)
const ACCENT_COLOR_CLASS = 'info';    // Sauge/Vert clair (accents/liens)

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError("Veuillez saisir votre email et mot de passe.");
            return;
        }

        const result = onLogin(email, password);

        if (result.success) {
            // Redirige vers la page d'accueil (Dashboard) après connexion
            navigate('/'); 
        } else {
            setError(result.message);
        }
    };

    return (
        // ✅ Centrage horizontal et vertical (min-vh-100 est correct)
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light"> 
            {/* Carte de Connexion */}
            <div className="bg-white rounded shadow-lg p-5" style={{ width: '100%', maxWidth: '380px' }}>
                
                <h2 className={`h4 text-center fw-bold mb-4 border-bottom pb-2 text-${PRIMARY_COLOR_CLASS}`}>
                    <i className="fas fa-lock me-2 text-${ACCENT_COLOR_CLASS}"></i> Connexion
                </h2>
                
                <form onSubmit={handleSubmit}>
                    
                    {error && <div className="alert alert-danger small">{error}</div>}
                    
                    <div className="mb-3">
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email" 
                            className="form-control" 
                            required 
                        />
                    </div>

                    <div className="mb-3">
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Mot de passe" 
                            className="form-control" 
                            required 
                        />
                    </div>

                    <div className="d-flex justify-content-end mb-3">
                        {/* Utilisation de la couleur ACCENT_COLOR_CLASS pour le lien */}
                        <Link to="/login/forgot" className={`small text-${ACCENT_COLOR_CLASS} fw-medium`}>Mot de passe oublié ?</Link>
                    </div>

                    {/* Utilisation de la couleur PRIMARY_COLOR_CLASS pour le bouton */}
                    <button type="submit" className={`btn btn-${PRIMARY_COLOR_CLASS} w-100 fw-bold`}>
                        <i className="fas fa-sign-in-alt me-2"></i> Se connecter
                    </button>
                </form>

                <p className="text-center small mt-3">
                    Pas encore de compte ? 
                    {/* Utilisation de la couleur PRIMARY_COLOR_CLASS pour le lien */}
                    <Link to="/register" className={`text-${PRIMARY_COLOR_CLASS} fw-medium`}>Créer un compte</Link>
                </p>
            </div>
        </div>
    );
}