import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { supabase } from './src/lib/supabaseClient';

if (import.meta.env.DEV) {
  supabase.auth.getSession().then(({ data, error }) => {
    console.log('SUPABASE SESSION:', { data, error });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
