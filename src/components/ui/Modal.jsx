import React from 'react';

// NOTE: Pour une utilisation complète de Bootstrap Modal avec son comportement JS, 
// l'installation de 'react-bootstrap' est recommandée.
// Ici, nous simulons l'apparence avec les classes CSS de Bootstrap.

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    // Overlay fixe (backdrop)
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      {/* Dialogue centré et grand (modal-dialog-centered, modal-lg) */}
      <div className="modal-dialog modal-dialog-centered" role="document"> 
        <div className="modal-content">
          {/* Header de la modale */}
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close" // Bouton de fermeture standard de Bootstrap
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          
          {/* Contenu de la modale */}
          <div className="modal-body">
            {children}
          </div>
          
          {/* Le footer est géré par le formulaire lui-même */}
        </div>
      </div>
    </div>
  );
}