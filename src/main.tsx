import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import '../styles.css';
import { AuthProvider } from './auth/AuthProvider';
import { ViewProvider } from '../contexts/ViewContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ViewProvider>
        <App />
      </ViewProvider>
    </AuthProvider>
  </React.StrictMode>
);
