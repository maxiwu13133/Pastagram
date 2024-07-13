import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

// Pages and components
import Loading from './pages/Loading';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Terms from './pages/Terms';

function App() {
  const { user, loadFinish } =  useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        { !loadFinish && <Loading /> }
        {
          loadFinish && 
          <>
            {user && <Navbar />}
            <div className="pages">
              <Routes>
                <Route 
                  path="/"
                  element={ user ? <Home /> : <Navigate to="/login" /> }
                />
                <Route 
                  path="/login"
                  element={ user ? <Navigate to="/" /> : <Login /> }
                />
                <Route
                  path="/signup"
                  element={ user ? <Navigate to="/" /> : <Signup /> }
                />
                <Route
                  path="/terms"
                  element={ <Terms /> }
                />
              </Routes>
            </div> 
          </>
        }
        
      </BrowserRouter>
    </div>
  );
};

export default App;
