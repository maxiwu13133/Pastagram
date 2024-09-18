import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// context
import { AuthContextProvider } from './context/AuthContext';
import { SearchContextProvider } from './context/SearchContext';
import { PfpContextProvider } from './context/PfpContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <PfpContextProvider>
        <SearchContextProvider>
          <App />
        </SearchContextProvider>
      </PfpContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
