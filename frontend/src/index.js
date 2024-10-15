import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// context
import { AuthContextProvider } from './context/AuthContext';
import { SearchContextProvider } from './context/SearchContext';
import { PfpContextProvider } from './context/PfpContext';
import { HomeLoadContextProvider } from './context/HomeLoadContext';
import { DeletedContextProvider } from './context/DeletedContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <PfpContextProvider>
        <DeletedContextProvider>
          <SearchContextProvider>
            <HomeLoadContextProvider>
              <App />
            </HomeLoadContextProvider>
          </SearchContextProvider>
        </DeletedContextProvider>
      </PfpContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
