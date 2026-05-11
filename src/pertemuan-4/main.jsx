import React from 'react';
import ReactDOM from 'react-dom/client';
import CarShowcase from './CarShowcase';
import Admin from './admin';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CarShowcase />
    <Admin/>
  </React.StrictMode>
);