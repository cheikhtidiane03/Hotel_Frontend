import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// 1. Importer le CSS de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// 2. Si vous utilisez les fonctions JavaScript de Bootstrap (ex: Dropdowns, Tooltips)
//    (Souvent non requis si vous utilisez des librairies comme react-bootstrap)
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

// 3. Importer votre CSS global APRES Bootstrap (si vous en avez)
import './index.css'; 


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)