import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

// Pages and components
import Loading from './pages/Loading';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } =  useAuthContext();

  return (
    <div className="App">
      {/* { isLoading && <Loading /> } */}
      <BrowserRouter>
        {user && <Navbar />}
          <div className="pages">
            <Routes>
              <Route 
                path="/"
                element={ user ? () => <Home /> : <Login /> }
              />
            </Routes>
          </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
