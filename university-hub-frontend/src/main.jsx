import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { GalleryProvider } from './context/GalleryContext';
import Toast from './components/Toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppProvider>
        <GalleryProvider>
          <App />
          <Toast />
        </GalleryProvider>
      </AppProvider>
    </ThemeProvider>
  </React.StrictMode>
);