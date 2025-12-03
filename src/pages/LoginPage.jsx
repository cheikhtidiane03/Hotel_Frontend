import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
        // ✅ Centrage horizontal et vertical (min-vh-100 nécessite le CSS global dans App.jsx)
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light"> 
            <div className="bg-white rounded shadow-lg p-5" style={{ width: '100%', maxWidth: '380px' }}>
                <h2 className="h4 text-center text-dark fw-bold mb-4 border-bottom pb-2">Connexion</h2>
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
                        <Link to="/login/forgot" className="small text-danger">Mot de passe oublié ?</Link>
                    </div>

                    <button type="submit" className="btn btn-danger w-100 fw-bold">Se connecter</button>
                </form>

                <p className="text-center small mt-3">
                    Pas encore de compte ? <Link to="/register" className="text-danger fw-medium">Créer un compte</Link>
                </p>
            </div>
        </div>
    );
}