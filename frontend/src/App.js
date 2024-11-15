import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import './App.css';


// Pages and components
import Loading from './pages/Loading';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Terms from './pages/Terms';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Explore from './pages/Explore';


// context
import HomeLoadContextLayout from './context/HomeLoadContextLayout';
import { HomeLoadContextProvider } from './context/HomeLoadContext';


function App() {
  const { user, loadFinish } =  useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        { !loadFinish && <Loading /> }
        {
          loadFinish && 
          <>
            { user && <Navbar /> }
            <div className="pages">
              <Routes>
                <Route element={ <HomeLoadContextLayout /> }>
                  <Route 
                    path=""
                    element={ user ? 
                    <HomeLoadContextProvider>
                      <Home />
                    </HomeLoadContextProvider>  : 
                    <Navigate to="/login/" /> }
                  />
                </Route>
                <Route 
                  path="/login/"
                  element={ user ? <Navigate to="/" /> : <Login /> }
                />
                <Route
                  path="/signup/"
                  element={ user ? <Navigate to="/" /> : <Signup /> }
                />
                <Route
                  path="/terms/"
                  element={ <Terms /> }
                />
                <Route
                  path="/:username/"
                  element={ user ? <Profile /> : <Navigate to="/login/" /> }
                />
                <Route
                  path="/account/edit/"
                  element={ user ? <EditProfile /> : <Navigate to="/login/" /> }
                />
                <Route
                  path="/explore/"
                  element={ user ? <Explore /> : <Navigate to="/login/" /> }
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
