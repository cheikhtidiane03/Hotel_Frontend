import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateHotelForm from '../components/hotels/CreateHotelForm';

// Styles (inchangés)
const pageStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f4f4' };
const contentStyle = { width: '100%', maxWidth: '700px', padding: '40px' };
const headerStyle = { marginBottom: '20px', color: '#6c757d' };
const subHeaderStyle = { display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: '600', marginBottom: '20px', cursor: 'pointer' };


// ✅ La page reçoit onSave et onSuccess
export default function CreateHotelPage({ onSave, onSuccess }) { 
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/hotels'); 
  };

  // ✅ Nouvelle fonction : gère la sauvegarde, la notification, puis la navigation
  const handleSaveAndNavigate = (newHotel) => {
    onSave(newHotel); // 1. Ajoute l'hôtel à la liste dans App.jsx
    onSuccess();      // 2. Déclenche le message de succès dans App.jsx
    navigate('/hotels'); // 3. Redirige vers la liste : ÉVITE LA PAGE BLANCHE
  }

  return (
    <div style={pageStyle}>
      <div style={contentStyle} className="bg-white rounded shadow-lg"> {/* Ajout de style pour le conteneur */}
        <div style={headerStyle}>
          Créer un nouveau hôtel
        </div>
        <div style={subHeaderStyle} onClick={handleBack}>
          <span style={{ marginRight: '10px' }}>←</span>
          CRÉER UN NOUVEAU HÔTEL
        </div>
        
        {/* ✅ onSave appelle la fonction complète qui navigue */}
        <CreateHotelForm 
            onSave={handleSaveAndNavigate} 
            onClose={handleBack} 
        />
      </div>
    </div>
  );
}