// src/components/hotels/HotelCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; 

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate(); 

  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: hotel.currency || 'XOF',
  }).format(hotel.price);

  const handleViewDetails = () => {
      navigate(`/hotels/${hotel.id}`);
  };

  return (
    <div className="card shadow-sm h-100">
      <img 
        src={hotel.imageUrl} 
        alt={hotel.name} 
        className="card-img-top" 
        style={{ height: '150px', objectFit: 'cover' }} 
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-dark">{hotel.name}</h5>
        <p className="card-subtitle mb-2 text-muted">{hotel.city}</p>
        <p className="text-danger fw-bold">{formattedPrice}</p>
        <p className="card-text flex-grow-1 text-sm">{hotel.description ? hotel.description.substring(0, 50) + '...' : 'Pas de description.'}</p>
        
        <button 
          className="btn btn-sm btn-outline-danger mt-3"
          onClick={handleViewDetails} 
        >
          Voir Détails
        </button>
      </div>
    </div>
  );
};

export default HotelCard;