// src/components/Layout/Layout.jsx

import React from 'react';
import Sidebar from '../ui/Sidebar'; 
import Header from './Header';   

const Layout = ({ children, title }) => {
  return (
    <div className="d-flex min-vh-100 bg-light"> 
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <Header title={title} /> 
        <main className="flex-grow-1 p-4 p-md-5">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;