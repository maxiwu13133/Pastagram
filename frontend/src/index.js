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
import { FollowingContextProvider } from './context/FollowingContext';
import { NavbarContextProvider } from './context/NavbarContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <PfpContextProvider>
        <NavbarContextProvider>
          <DeletedContextProvider>
            <SearchContextProvider>
              <FollowingContextProvider>
                <HomeLoadContextProvider>
                  <App />
                </HomeLoadContextProvider>
              </FollowingContextProvider>
            </SearchContextProvider>
          </DeletedContextProvider>
        </NavbarContextProvider>
      </PfpContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
