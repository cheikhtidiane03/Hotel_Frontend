import React, { useState } from 'react'; // ❌ Suppression de l'import de useEffect

// Composant de champ réutilisable (inchangé)
const InputField = ({ label, name, value, onChange, type = 'text', highlight = false, placeholder = '' }) => (
  <div className="mb-3">
    <label htmlFor={name} className="form-label small fw-medium text-dark">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`form-control ${highlight ? 'border-primary border-2' : ''}`} 
    />
  </div>
);

// ✅ Le composant accepte initialData en prop
export default function CreateHotelForm({ onSave, onClose, initialData }) { 
  
  // ✅ CORRECTION MAJEURE: Fonction d'initialisation pour useState
  // Cette fonction ne s'exécute qu'UNE SEULE FOIS lors du montage du composant.
  const getInitialState = () => ({
    // Utilise les données initiales si elles existent, sinon utilise des valeurs par défaut
    name: initialData?.name || '',
    city: initialData?.city || '', 
    address: initialData?.address || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    // Assure que le prix est une chaîne pour l'input (important en mode édition)
    price: initialData?.price?.toString() || '', 
    currency: initialData?.currency || 'XOF',
    imageUrl: initialData?.imageUrl || '',
    description: initialData?.description || '', 
  });
  
  // 🚀 Initialisation de l'état avec la fonction ci-dessus
  const [formData, setFormData] = useState(getInitialState); 

  // ❌ SUPPRESSION du useEffect problématique. La gestion de l'état est maintenant propre.

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.imageUrl || !formData.price) {
        alert("Veuillez remplir les champs obligatoires (Nom, Prix, URL de l'image).");
        return;
    }
    
    // Si nous sommes en mode édition, nous gardons l'ID original
    const newHotel = {
      id: initialData?.id || Date.now(), 
      ...formData,
      price: parseFloat(formData.price),
    };
    
    onSave(newHotel); 
  };

  return (
    <form onSubmit={handleSubmit}>
         <div className="row">
        
            {/* Ligne 1 : Nom et Ville */}
            <div className="col-md-6"><InputField label="Nom de l'hôtel" name="name" value={formData.name} onChange={handleChange} /></div>
            <div className="col-md-6"><InputField label="Ville" name="city" value={formData.city} onChange={handleChange} highlight={true} /></div>

            {/* Ligne 2 : Email et Téléphone */}
            <div className="col-md-6"><InputField label="E-mail" name="email" type="email" value={formData.email} onChange={handleChange} /></div>
            <div className="col-md-6"><InputField label="Numéro de téléphone" name="phone" type="tel" value={formData.phone} onChange={handleChange} /></div>

            {/* Ligne 3 : Prix & Description */}
            <div className="col-md-6"><InputField label="Prix par nuit" name="price" type="number" value={formData.price} onChange={handleChange} /></div>
            <div className="col-md-6"><InputField label="Brève description" name="description" value={formData.description} onChange={handleChange} /></div>

            {/* Ligne 4 : URL de l'Image */}
            <div className="col-12"><InputField label="URL de l'Image de l'hôtel" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Ex: https://example.com/photo.jpg" type="url" /></div>
            
            {/* Devise */}
            <div className="col-md-6 mb-3">
                <label className="form-label small fw-medium text-dark">Devise</label>
                <select name="currency" value={formData.currency} onChange={handleChange} className="form-select">
                    <option value="XOF">F XOF</option>
                    <option value="USD">USD</option>
                </select>
            </div>
            
        </div>

        {/* Bouton Enregistrer */}
        <div className="d-flex justify-content-end mt-4">
            <button
                type="button"
                className="btn btn-outline-secondary me-2 fw-medium"
                onClick={onClose}
            >
                {initialData ? 'Annuler l\'édition' : 'Annuler'}
            </button>
            <button
                type="submit"
                className="btn btn-danger shadow-sm fw-medium"
            >
                {initialData ? 'Sauvegarder les modifications' : 'Enregistrer l\'hôtel'}
            </button>
        </div>
    </form>
  );
}