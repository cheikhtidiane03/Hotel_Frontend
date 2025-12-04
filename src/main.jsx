// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
// Import de Font Awesome requis pour les icônes (via CDN dans index.html ou NPM)
// import '@fortawesome/fontawesome-free/css/all.min.css'; // Si installé via npm

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)