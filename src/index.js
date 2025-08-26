/**
 * React Application Entry Point
 * 
 * Created by: @cryptowampum
 * Developed with: Claude AI
 * 
 * Entry point for the sSPORK USDC rewards distribution dApp.
 * Renders the main App component with Unicorn.eth integration.
 * 
 * @license MIT
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

// Get the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the main App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Add performance measuring
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (process.env.NODE_ENV === 'development') {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  }).catch(() => {
    // web-vitals not available in development
  });
}