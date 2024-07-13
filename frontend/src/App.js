import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

// Pages and components
import Loading from './pages/Loading';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';

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
                  element={ user ? <Home /> : <Login /> }
                />
                <Route
                  path="/signup"
                  element={ <Signup /> }
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
