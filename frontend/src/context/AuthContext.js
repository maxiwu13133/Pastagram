import { createContext, useReducer, useEffect } from 'react';
import { isExpired } from 'react-jwt';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload, loadFinish: true };
    case 'LOGOUT':
      return { user: null, loadFinish: true };
    default:
      return state;
  };
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loadFinish: false,
  });

  // Check if user has logged in recently
  useEffect(() => {

    // slight load in time to make app feel like it's doing something
    setTimeout(() => {
      
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && !isExpired(user.token)) {
      dispatch({ type: 'LOGIN', payload: user });
    } else {
      dispatch({ type: 'LOGOUT', payload: null });
    }
    }, 200);

  }, []);

  console.log('AuthContext: ', state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  );
};
