import React, { useState, useEffect } from 'react';

const PRIMARY_COLOR_CLASS = 'success';

export default function ProfilePage({ currentUser, onUpdateUser }) {
    
    // État local pour gérer les champs du formulaire
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        photoUrl: '',
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Initialiser le formulaire avec les données actuelles de l'utilisateur
    useEffect(() => {
        if (currentUser) {
            setFormData({
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                email: currentUser.email || '',
                photoUrl: currentUser.photoUrl || 'https://via.placeholder.com/150/ced4da/6c757d?text=U',
            });
        }
    }, [currentUser]);

    if (!currentUser) {
        return <div className="alert alert-danger">Utilisateur non connecté.</div>;
    }
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        // 1. Validation simple
        if (!formData.firstName || !formData.email) {
            setMessage({ type: 'danger', text: 'Le prénom et l\'email sont obligatoires.' });
            setIsLoading(false);
            return;
        }

        // 2. Préparation des données à envoyer
        const updates = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email, 
            photoUrl: formData.photoUrl,
        };

        try {
            // 3. Appel de la fonction de mise à jour fournie par App.jsx
            await onUpdateUser(updates); 
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
        } catch (error) {
            setMessage({ type: 'danger', text: "Erreur lors de la mise à jour. Veuillez réessayer." });
            console.error("Erreur de mise à jour du profil:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="h3 mb-4 text-gray-800 border-bottom pb-2">
                <i className={`fas fa-user-circle me-2 text-${PRIMARY_COLOR_CLASS}`}></i> Mon Profil
            </h1>

            {message && (
                <div className={`alert alert-${message.type} fade show`} role="alert">
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card shadow-sm p-4">
                <h4 className="fw-bold mb-4">Mettre à Jour les Informations</h4>
                
                {/* Section Photo de Profil */}
                <div className="text-center mb-4">
                    <img 
                        src={formData.photoUrl} 
                        alt="Photo de Profil" 
                        className="rounded-circle mb-3 border border-3" 
                        style={{ width: '150px', height: '150px', objectFit: 'cover', borderColor: `var(--bs-${PRIMARY_COLOR_CLASS})` }}
                        onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/150/ced4da/6c757d?text=U'}}
                    />
                    <div className="input-group mb-3">
                        <span className="input-group-text"><i className="fas fa-link"></i></span>
                        <input 
                            type="text" 
                            name="photoUrl"
                            className="form-control form-control-sm" 
                            placeholder="URL de la photo (Optionnel)"
                            value={formData.photoUrl}
                            onChange={handleChange}
                        />
                    </div>
                </div>


                <div className="row">
                    {/* Champ Prénom */}
                    <div className="col-md-6 mb-3">
                        <label htmlFor="firstName" className="form-label fw-medium">Prénom</label>
                        <input 
                            type="text" 
                            id="firstName"
                            name="firstName"
                            className="form-control" 
                            value={formData.firstName} 
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    {/* Champ Nom */}
                    <div className="col-md-6 mb-3">
                        <label htmlFor="lastName" className="form-label fw-medium">Nom</label>
                        <input 
                            type="text" 
                            id="lastName"
                            name="lastName"
                            className="form-control" 
                            value={formData.lastName} 
                            onChange={handleChange}
                        />
                    </div>
                    
                    {/* Champ Email */}
                    <div className="col-md-12 mb-4">
                        <label htmlFor="email" className="form-label fw-medium">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            name="email"
                            className="form-control" 
                            value={formData.email} 
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                
                {/* Bouton de Soumission */}
                <button type="submit" className={`btn btn-${PRIMARY_COLOR_CLASS} w-100 mt-3`} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Mise à jour...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-save me-2"></i> Enregistrer les Changements
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}