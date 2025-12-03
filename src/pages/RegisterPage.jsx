import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// ------------------------------------------------------------------
// Composant : Aperçu de l'image (Gère le Fichier et l'URL)
// ------------------------------------------------------------------

const PhotoPreview = ({ url, onFileChange, onUrlChange }) => {
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(url);
    
    useEffect(() => {
        setPreviewUrl(url);
    }, [url]);

    // Ouvre l'explorateur de fichiers lorsque la zone est cliquée
    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    
    // Gère la sélection du fichier
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const tempUrl = URL.createObjectURL(file);
            setPreviewUrl(tempUrl); 
            onFileChange(file, tempUrl); 
        }
    };
    
    // URL d'image de substitution
    const placeholderUrl = "https://via.placeholder.com/100/ced4da/6c757d?text=👤"; 
    
    // Détermine l'URL à afficher
    const imgSrc = (previewUrl && (previewUrl.startsWith('http') || previewUrl.startsWith('blob:'))) ? previewUrl : placeholderUrl;

    const containerStyle = {
        position: 'relative',
        width: '100px', 
        height: '100px', 
        margin: '0 auto', 
        borderRadius: '50%',
        overflow: 'hidden',
        border: `3px dashed ${previewUrl ? '#dc3545' : '#ced4da'}`, 
        backgroundColor: '#e9ecef',
        marginBottom: '20px',
        cursor: 'pointer', 
        transition: 'border 0.2s',
    };

    return (
        <div className="d-flex flex-column align-items-center">
            <div style={containerStyle} onClick={handleImageClick}>
                <img 
                    src={imgSrc} 
                    alt="Photo de profil" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = placeholderUrl; }}
                />
                
                {/* INPUT TYPE="FILE" INVISIBLE : Ouvre l'explorateur de fichiers */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*"
                    style={{ display: 'none' }} 
                />
            </div>
            
            {/* Champ pour COLER une URL (visuel) */}
            <div className="mb-3 w-100" style={{ maxWidth: '300px' }}>
                <input 
                    type="url" 
                    name="photoUrl" 
                    placeholder="Coller l'URL de l'image ici"
                    value={url} 
                    onChange={onUrlChange} 
                    className="form-control form-control-sm text-center"
                />
            </div>
        </div>
    );
};

// ------------------------------------------------------------------
// Page Register
// ------------------------------------------------------------------

export default function RegisterPage({ onRegister }) {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', photoUrl: '', photoFile: null 
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        // Gère les changements sur tous les inputs sauf le fichier
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (file, tempUrl) => {
        // Gère les changements pour l'input de fichier
        if (file) {
            setFormData(prev => ({ 
                ...prev, 
                photoFile: file, 
                photoUrl: tempUrl // Stocke l'URL temporaire pour l'aperçu
            }));
        } else {
             // Ceci est appelé par le composant enfant si l'URL est entrée manuellement
            setFormData(prev => ({ 
                ...prev, 
                photoFile: null, 
                photoUrl: tempUrl || '' 
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        if (!formData.email || !formData.password || !formData.firstName) {
            setError("Veuillez remplir les champs obligatoires (Prénom, Email, Mot de passe).");
            return;
        }

        const result = onRegister(formData);

        if (result.success) {
            // ✅ Redirige vers la page de CONNEXION après inscription
            navigate('/login'); 
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="bg-white rounded shadow-lg p-5" style={{ width: '100%', maxWidth: '450px' }}>
                <h2 className="h4 text-center text-dark fw-bold mb-4 border-bottom pb-2">Créer un Compte</h2>
                <form onSubmit={handleSubmit}>
                    
                    {error && <div className="alert alert-danger small">{error}</div>}
                    
                    <PhotoPreview 
                        url={formData.photoUrl} 
                        // Note: handlePhotoChange gère le fichier et l'URL visible
                        onFileChange={(file, tempUrl) => handlePhotoChange(file, tempUrl)}
                        onUrlChange={handleChange}
                    />

                    {/* Nom et Prénom */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <input type="text" name="firstName" placeholder="Prénom" value={formData.firstName} onChange={handleChange} className="form-control" required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <input type="text" name="lastName" placeholder="Nom" value={formData.lastName} onChange={handleChange} className="form-control" />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <input type="email" name="email" placeholder="Adresse Email" value={formData.email} onChange={handleChange} className="form-control" required />
                    </div>

                    {/* Mot de passe */}
                    <div className="mb-3">
                        <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} className="form-control" required />
                    </div>
                    
                    <button type="submit" className="btn btn-danger w-100 fw-bold mt-2">S'inscrire</button>
                </form>

                <p className="text-center small mt-3">
                    Déjà un compte ? <Link to="/login" className="text-danger fw-medium">Se connecter</Link>
                </p>
            </div>
        </div>
    );
}